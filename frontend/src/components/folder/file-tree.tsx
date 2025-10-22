import { ExternalLink, FolderClosed, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { type FolderType, type LinkType } from "../../types/types";
import { getChildFolders, getRootFolders } from "../../services/folder-service";
import { getLinkService } from "../../services/link-service";
export interface FolderNode extends FolderType {
  children?: FolderNode[];
  links?: LinkType[];
  isLoaded?: boolean;
}

// Recursive FolderItem component
export const FolderItem = ({
  _id,
  parentId,
  name,
  children = [],
  links = [],
  isLoaded = false,
}: FolderNode) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localChildren, setLocalChildren] = useState<FolderNode[]>(children);
  const [localLinks, setLocalLinks] = useState<LinkType[]>(links);
  const [loaded, setLoaded] = useState(isLoaded);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isOpen && !loaded) {
      setLoading(true);
      try {
        const [childFolders, folderLinks] = await Promise.all([
          getChildFolders(_id),
          getLinkService(_id),
        ]);

        setLocalChildren(childFolders || []);
        setLocalLinks(folderLinks || []);
        setLoaded(true);
      } catch (error) {
        console.error("Error loading folder contents:", error);
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const hasContent = localChildren.length > 0 || localLinks.length > 0;

  return (
    <li>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 p-2 hover:bg-base-300 rounded w-full text-left"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : isOpen ? (
          <FolderOpen className="h-4 w-4" />
        ) : (
          <FolderClosed className="h-4 w-4" />
        )}
        {name}
      </button>

      {isOpen && hasContent && (
        <ul className="ml-4">
          {localLinks.map((link) => (
            <li key={link._id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 hover:bg-base-300 rounded"
              >
                <ExternalLink className="h-3 w-3 opacity-50" />
                {link.title}
              </a>
            </li>
          ))}

          {/* recursive function to render children */}
          {localChildren.map((child) => (
            <FolderItem key={child._id} {...child} />
          ))}
        </ul>
      )}

      {isOpen && !loading && !hasContent && (
        <div className="ml-6 p-2 text-sm text-base-content/50">
          Empty folder
        </div>
      )}
    </li>
  );
};

export const FolderTree = () => {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRootFolders = async () => {
      const rootFolders = await getRootFolders();
      setFolders(rootFolders || []);
      setLoading(false);
    };
    fetchRootFolders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul className="menu menu-xs bg-base-200 rounded-box max-w-xs w-full p-2">
      {folders.map((folder) => (
        <FolderItem key={folder._id} {...folder} />
      ))}
    </ul>
  );
};
