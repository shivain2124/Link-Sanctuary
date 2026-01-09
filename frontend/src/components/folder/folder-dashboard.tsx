import { useEffect, useState } from "react";
import { useFolder } from "../../context/folder-context";
import { getLinkService, deleteLinkService } from "../../services/link-service";
import { ExternalLink, Globe, Tag, Trash2 } from "lucide-react";
// import { type LinkType } from "../../types/types";
import toast from "react-hot-toast";

export const FolderDashboard = () => {
  // Use links from context instead of local state
  const { activeFolderId, activeFolderLinks, setActiveFolderLinks } =
    useFolder();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeFolderId) {
      const fetchContent = async () => {
        setLoading(true);
        try {
          const data = await getLinkService(activeFolderId);
          setActiveFolderLinks(data || []);
        } catch (error) {
          console.error("Failed to fetch links:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchContent();
    }
  }, [activeFolderId, setActiveFolderLinks]);

  const handleDeleteLink = async (linkId: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLinkService(linkId);
        // Update local state by filtering out the deleted link
        setActiveFolderLinks(activeFolderLinks.filter((l) => l._id !== linkId));
        toast.success("Link removed successfully");
      } catch (error) {
        toast.error("Failed to delete link");
      }
    }
  };

  if (!activeFolderId) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-50">
        <Globe className="h-16 w-16 mb-4" />
        <p className="text-xl font-medium">
          Select a folder to view your links
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Folder Content</h1>
        <p className="text-base-content/60">
          {activeFolderLinks.length}{" "}
          {activeFolderLinks.length === 1 ? "link" : "links"} saved in this
          sanctuary
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-40 w-full rounded-xl"></div>
          ))}
        </div>
      ) : activeFolderLinks.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
          <p className="opacity-50">
            This folder is empty. Add some links from the sidebar!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeFolderLinks.map((link) => (
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

                {/* Card Footer Actions */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-base-300/50">
                  <button
                    onClick={() => handleDeleteLink(link._id)}
                    className="btn btn-ghost btn-xs btn-square text-error/60 hover:text-error hover:bg-error/10"
                    title="Delete link"
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
