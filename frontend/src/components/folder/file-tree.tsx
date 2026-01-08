import {
  ExternalLink,
  FolderClosed,
  FolderOpen,
  FolderPlus,
  FilePlus2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { type FolderType, type LinkType } from "../../types/types";
import { getChildFolders, getRootFolders } from "../../services/folder-service";
import { getLinkService } from "../../services/link-service";
import { AddLinkModal } from "../link/add-link-form";
import { AddFolderModal } from "../folder/add-folder-modal";
import { Trash2 } from "lucide-react";
import { deleteFolder } from "../../services/folder-service";
import toast from "react-hot-toast";

export interface FolderNode extends FolderType {
  children?: FolderNode[];
  links?: LinkType[];
  isLoaded?: boolean;
}

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
  const [showModal, setShowModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleAddSubfolder = (newFolder: FolderNode) => {
    setLocalChildren((prev) => [...prev, newFolder]);
    setIsOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${name}" and all its contents?`
      )
    ) {
      try {
        await deleteFolder(_id);
        toast.success("Folder deleted");
        window.location.reload();
      } catch (err) {
        toast.error("Failed to delete folder");
      }
    }
  };

  return (
    <li className="list-none">
      <div className="group flex items-center justify-between p-1.5 hover:bg-base-300 rounded-lg cursor-pointer transition-colors">
        <div
          className="flex items-center gap-2 flex-1 min-w-0"
          onClick={handleToggle}
        >
          <div className="w-4 h-4 text-base-content/60">
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {isOpen ? (
            <FolderOpen className="h-4 w-4 text-primary" />
          ) : (
            <FolderClosed className="h-4 w-4 text-primary" />
          )}

          <span className="truncate text-sm font-medium">{name}</span>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="btn btn-ghost btn-xs btn-square hover:text-success"
            title="Add link"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFolderModal(true);
            }}
            className="btn btn-ghost btn-xs btn-square hover:text-info"
            title="Add subfolder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleDelete}
            className="btn btn-ghost btn-xs btn-square hover:text-error"
            title="Delete folder"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="ml-4 mt-1 border-l border-base-300 pl-2 space-y-1">
          {localChildren.map((child) => (
            <FolderItem key={child._id} {...child} />
          ))}

          {localLinks.map((link) => (
            <li key={link._id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-1.5 hover:bg-base-300 rounded-lg text-sm text-base-content/70 hover:text-base-content transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 opacity-40 shrink-0" />
                <span className="truncate">{link.title}</span>
              </a>
            </li>
          ))}

          {!loading &&
            localChildren.length === 0 &&
            localLinks.length === 0 && (
              <li className="py-1 pl-6 text-xs text-base-content/40 italic">
                Empty
              </li>
            )}
        </ul>
      )}

      <AddLinkModal
        folderId={_id}
        isOpen={showModal}
        onSuccess={(newLink) => setLocalLinks((prev) => [...prev, newLink])}
        onClose={() => setShowModal(false)}
      />

      <AddFolderModal
        parentId={_id}
        isOpen={showFolderModal}
        onSuccess={handleAddSubfolder}
        onClose={() => setShowFolderModal(false)}
      />
    </li>
  );
};

export const FolderTree = () => {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRootModal, setShowRootModal] = useState(false);

  const fetchRootFolders = async () => {
    const rootFolders = await getRootFolders();
    setFolders(rootFolders.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRootFolders();
  }, []);

  if (loading)
    return (
      <div className="p-4 flex justify-center">
        <span className="loading loading-dots"></span>
      </div>
    );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-bold uppercase opacity-50">Folders</span>
        <button
          onClick={() => setShowRootModal(true)}
          className="btn btn-ghost btn-xs btn-square"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>

      <ul className="menu menu-sm p-0">
        {folders.length > 0 ? (
          folders.map((folder) => <FolderItem key={folder._id} {...folder} />)
        ) : (
          <div className="text-xs p-4 text-center opacity-40">
            No folders found
          </div>
        )}
      </ul>

      <AddFolderModal
        isOpen={showRootModal}
        onSuccess={(newF) => setFolders((prev) => [...prev, newF])}
        onClose={() => setShowRootModal(false)}
      />
    </div>
  );
};
