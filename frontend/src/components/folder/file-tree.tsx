import {
  ExternalLink,
  FolderClosed,
  FolderOpen,
  FolderPlus,
  FilePlus2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { type FolderType, type LinkType } from "../../types/types";
import { getChildFolders, getRootFolders } from "../../services/folder-service";
import { getLinkService } from "../../services/link-service";
import { AddLinkForm } from "../link/add-link-form";

export interface FolderNode extends FolderType {
  children?: FolderNode[];
  links?: LinkType[];
  isLoaded?: boolean;
}

// Recursive FolderItem component
export const FolderItem = ({
  _id,
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
  const [showForm, setShowForm] = useState(false);

  const handleAddLink = (newLink: LinkType) => {
    setLocalLinks([...localLinks, newLink]);
    setShowForm(false);
  };

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

  const hasContent =
    localChildren.length > 0 || localLinks.length > 0 || showForm;

  return (
    <li>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 p-2 hover:bg-base-300 rounded w-full text-left group"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : isOpen ? (
          <FolderOpen className="h-4 w-4" />
        ) : (
          <FolderClosed className="h-4 w-4" />
        )}
        <span className="flex-1">{name}</span>

        <div className="hidden group-hover:flex gap-1 items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 hover:bg-blue-100 rounded"
            title="Add subfolder"
          >
            <FolderPlus className="h-3.5 w-3.5 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpen) setIsOpen(true);
              setShowForm(true);
            }}
            className="p-1 hover:bg-green-100 rounded"
            title="Add link"
          >
            <FilePlus2 className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>
      </button>

      {isOpen && hasContent && (
        <ul className="ml-4">
          {/* Add Link Form */}
          {showForm && (
            <li className="my-2">
              <AddLinkForm
                folderId={_id}
                onSuccess={handleAddLink}
                onCancel={() => setShowForm(false)}
              />
            </li>
          )}

          {/* Links */}
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

          {/* Recursive children */}
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
      setFolders(rootFolders.data || []);
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
