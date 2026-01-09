import { useEffect, useState, useMemo } from "react";
import { useFolder } from "../../context/folder-context";
import { getLinkService, deleteLinkService } from "../../services/link-service";
import {
  ExternalLink,
  Globe,
  Tag,
  Trash2,
  Search,
  X,
  ArrowLeft,
  Star,
  Pencil,
} from "lucide-react";
import { type LinkType } from "../../types/types";
import {
  toggleFavouriteTagService,
  updateLinkService,
} from "../../services/link-service";
import toast from "react-hot-toast";
import {AddLinkModal} from "../link/add-link-form";

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

  // Fetch links when folder changes
  useEffect(() => {
    if (activeFolderId && !isGlobalSearch) {
      const fetchContent = async () => {
        setLoading(true);
        try {
          const data = await getLinkService(activeFolderId);
          setActiveFolderLinks(data || []);
          setSearchQuery("");
        } catch (error) {
          console.error("Failed to fetch links:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchContent();
    }
  }, [activeFolderId, isGlobalSearch, setActiveFolderLinks]);

  // Local filtering for the current view
  const filteredLinks = useMemo(() => {
    return activeFolderLinks.filter((link) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesTitle = link.title.toLowerCase().includes(searchLower);
      const matchesTags = link.tags?.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );
      return matchesTitle || matchesTags;
    });
  }, [activeFolderLinks, searchQuery]);

  const handleDeleteLink = async (linkId: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLinkService(linkId);
        setActiveFolderLinks(activeFolderLinks.filter((l) => l._id !== linkId));
        toast.success("Link removed");
      } catch (error) {
        toast.error("Failed to delete link");
      }
    }
  };

  const handleToggleFavorite = async (
    linkId: string,
    isCurrentlyFav: boolean
  ) => {
    try {
      await toggleFavouriteTagService(linkId);
      // Update local UI state
      setActiveFolderLinks(
        activeFolderLinks.map((link) =>
          link._id === linkId ? { ...link, isFavourite: !isCurrentlyFav } : link
        )
      );
      toast.success(
        isCurrentlyFav ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const handleEditClick = (link: LinkType) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleUpdateSuccess = (updatedLink: LinkType) => {
    setActiveFolderLinks(
      activeFolderLinks.map((l) =>
        l._id === updatedLink._id ? updatedLink : l
      )
    );
  };

  // 1. Welcome State
  if (!activeFolderId && !isGlobalSearch) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-50">
        <Globe className="h-16 w-16 mb-4 text-primary" />
        <p className="text-xl font-medium text-center px-4">
          Select a folder or use Global Search to find your links
        </p>
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
              {isGlobalSearch ? "Search Results" : "Folder Content"}
            </h1>
          </div>
          <p className="text-base-content/60">
            {isGlobalSearch
              ? `Found ${activeFolderLinks.length} links across all folders`
              : `${activeFolderLinks.length} links in this sanctuary`}
          </p>
        </div>

        {/* Local Search (Filters current results) */}
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-base-content/40" />
          </div>
          <input
            type="text"
            placeholder="Filter these results..."
            className="input input-bordered w-full pl-10 pr-10 bg-base-200 focus:bg-base-100 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-base-content/40 hover:text-base-content"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 w-full rounded-xl"></div>
          ))}
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
          <p className="opacity-50">
            {searchQuery ? "No matches found." : "No links to show here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => (
            <div
              key={link._id}
              className="card bg-base-200 shadow-sm hover:shadow-md transition-all border border-base-300 hover:border-primary/30"
            >
              <div className="card-body p-5">
                <div className="flex justify-between items-start">
                  <h2
                    className="card-title text-md truncate pr-4"
                    title={link.title}
                  >
                    {link.title}
                  </h2>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs btn-square hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <p className="text-xs text-base-content/70 line-clamp-2 mt-2 h-8">
                  {link.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-1 mt-4">
                  {link.tags?.map((tag) => (
                    <div
                      key={tag}
                      className="badge badge-outline badge-sm gap-1 opacity-70 py-2"
                    >
                      <Tag className="w-2 h-2" /> {tag}
                    </div>
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
                      handleEditClick(link);
                    }}
                    className="btn btn-ghost btn-xs btn-square text-info/60 hover:text-info"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <AddLinkModal
                    folderId={activeFolderId!}
                    isOpen={isModalOpen}
                    initialData={editingLink} // Pass the link if editing, null if adding
                    onClose={() => {
                      setIsModalOpen(false);
                      setEditingLink(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                  />

                  <button
                    onClick={() => handleDeleteLink(link._id)}
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
    </div>
  );
};
