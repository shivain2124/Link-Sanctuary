import {
  FolderClosed,
  FolderOpen,
  FolderPlus,
  FilePlus2,
  ChevronRight,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { type FolderType, type LinkType } from "../../types/types";
import {
  getChildFolders,
  getRootFolders,
  deleteFolder,
} from "../../services/folder-service";
import { AddLinkModal } from "../link/add-link-form";
import { AddFolderModal } from "../folder/add-folder-modal";
import { useFolder } from "../../context/folder-context";
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
  const [loaded, setLoaded] = useState(isLoaded);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const { activeFolderId, setActiveFolderId, setIsGlobalSearch } = useFolder();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && !loaded) {
      setLoading(true);
      try {
        const res = await getChildFolders(_id);
        setLocalChildren(res.data || []);
        setLoaded(true);
      } catch (error) {
        toast.error("Failed to load subfolders");
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsGlobalSearch(false);
    setActiveFolderId(_id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this folder and all contents?")) {
      try {
        await deleteFolder(_id);
        toast.success("Folder deleted");
        window.location.reload();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <li className="select-none">
      <div
        className={`flex items-center gap-1 p-2 rounded-lg cursor-pointer transition-colors ${
          activeFolderId === _id
            ? "bg-primary/10 text-primary"
            : "hover:bg-base-300"
        }`}
        onClick={handleSelect}
      >
        <div
          onClick={handleToggle}
          className="p-1 hover:bg-base-content/10 rounded"
        >
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
          <FolderClosed className="h-4 w-4" />
        )}

        <span className="flex-1 truncate text-sm font-medium">{name}</span>

        <div className="flex  group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFolderModal(true);
            }}
            className="btn btn-ghost btn-xs btn-square"
          >
            <FolderPlus className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="btn btn-ghost btn-xs btn-square"
          >
            <FilePlus2 className="h-3 w-3" />
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-ghost btn-xs btn-square text-error/60"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isOpen && localChildren.length > 0 && (
        <ul className="pl-4 mt-1 border-l border-base-300 ml-4">
          {localChildren.map((child) => (
            <FolderItem key={child._id} {...child} />
          ))}
        </ul>
      )}

      <AddLinkModal
        folderId={_id}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {}}
      />
      <AddFolderModal
        parentId={_id}
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSuccess={(newF) => setLocalChildren([...localChildren, newF])}
      />
    </li>
  );
};

export const FolderTree = () => {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRootModal, setShowRootModal] = useState(false);

  useEffect(() => {
    getRootFolders().then((res) => {
      setFolders(res.data || []);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="p-4 text-center">
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
        {folders.map((folder) => (
          <FolderItem key={folder._id} {...folder} />
        ))}
      </ul>
      <AddFolderModal
        isOpen={showRootModal}
        onClose={() => setShowRootModal(false)}
        onSuccess={(f) => setFolders([...folders, f])}
      />
    </div>
  );
};
