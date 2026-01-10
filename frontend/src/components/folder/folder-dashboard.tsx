import { useEffect, useState, useMemo } from "react";
import { useFolder } from "../../context/folder-context";
import {
  getLinkService,
  deleteLinkService,
  toggleFavouriteTagService,
} from "../../services/link-service";
import {
  ExternalLink,
  Globe,
  Trash2,
  Search,
  X,
  ArrowLeft,
  Star,
  Pencil,
} from "lucide-react";
import { type LinkType } from "../../types/types";
import toast from "react-hot-toast";
import { AddLinkModal } from "../link/add-link-form";

export const FolderDashboard = () => {
  const {
    activeFolderId,
    activeFolderLinks,
    setActiveFolderLinks,
    isGlobalSearch,
    setIsGlobalSearch,
  } = useFolder();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (activeFolderId && !isGlobalSearch) {
      setLoading(true);
      getLinkService(activeFolderId)
        .then((data) => setActiveFolderLinks(data || []))
        .finally(() => setLoading(false));
    }
  }, [activeFolderId, isGlobalSearch, setActiveFolderLinks]);

  const filteredLinks = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return activeFolderLinks.filter(
      (link) =>
        link.title.toLowerCase().includes(searchLower) ||
        link.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }, [activeFolderLinks, searchQuery]);

  const handleToggleFavorite = async (
    linkId: string,
    isCurrentlyFav: boolean
  ) => {
    try {
      await toggleFavouriteTagService(linkId);

      if (isGlobalSearch && isCurrentlyFav) {
        setActiveFolderLinks(activeFolderLinks.filter((l) => l._id !== linkId));
      } else {
        setActiveFolderLinks(
          activeFolderLinks.map((l) =>
            l._id === linkId ? { ...l, isFavourite: !isCurrentlyFav } : l
          )
        );
      }
      toast.success(
        isCurrentlyFav ? "Removed from favorites" : "Added to favorites"
      );
    } catch (e) {
      toast.error("Failed to update favorite");
    }
  };

  if (!activeFolderId && !isGlobalSearch) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-50">
        <Globe className="h-16 w-16 mb-4 text-primary" />
        <p className="text-xl font-medium">Select a folder to view links</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isGlobalSearch && (
              <button
                onClick={() => setIsGlobalSearch(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h1 className="text-3xl font-bold tracking-tight">
              {isGlobalSearch ? "Global View" : "Folder Content"}
            </h1>
          </div>
          <p className="text-base-content/60">
            {activeFolderLinks.length} links found
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Filter results..."
            className="input input-bordered w-full pl-10 pr-10 bg-base-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-base-300 h-40 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => (
            <div
              key={link._id}
              className="card bg-base-200 shadow-sm border border-base-300"
            >
              <div className="card-body p-5">
                <div className="flex justify-between">
                  <h2 className="card-title text-md truncate">{link.title}</h2>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {link.tags?.map((tag) => (
                    <span key={tag} className="badge badge-outline badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-1 mt-4 pt-4 border-t border-base-300/50">
                  <button
                    onClick={() =>
                      handleToggleFavorite(link._id, !!link.isFavourite)
                    }
                    className={`btn btn-ghost btn-xs btn-square ${link.isFavourite ? "text-warning" : "text-base-content/30"}`}
                  >
                    <Star
                      className={`h-4 w-4 ${link.isFavourite ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setEditingLink(link);
                      setIsModalOpen(true);
                    }}
                    className="btn btn-ghost btn-xs btn-square text-info/60"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete?"))
                        deleteLinkService(link._id).then(() =>
                          setActiveFolderLinks(
                            activeFolderLinks.filter((l) => l._id !== link._id)
                          )
                        );
                    }}
                    className="btn btn-ghost btn-xs btn-square text-error/60"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddLinkModal
        folderId={activeFolderId!}
        isOpen={isModalOpen}
        initialData={editingLink}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }}
        onSuccess={(updated) => {
          if (editingLink) {
            setActiveFolderLinks(
              activeFolderLinks.map((l) =>
                l._id === updated._id ? updated : l
              )
            );
          } else {
            setActiveFolderLinks([...activeFolderLinks, updated]);
          }
        }}
      />
    </div>
  );
};
