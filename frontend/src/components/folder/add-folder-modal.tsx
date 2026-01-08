import { useState } from "react";
import { X, FolderPlus } from "lucide-react";
import { createFolder } from "../../services/folder-service";
import toast from "react-hot-toast";

interface AddFolderModalProps {
  parentId?: string;
  isOpen: boolean;
  onSuccess: (newFolder: any) => void;
  onClose: () => void;
}

export const AddFolderModal = ({
  parentId,
  isOpen,
  onSuccess,
  onClose,
}: AddFolderModalProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Folder name is required");

    setLoading(true);
    try {
      const result = await createFolder(name.trim(), parentId);
      onSuccess(result.folder);
      setName("");
      onClose();
      toast.success("Folder created!");
    } catch (error) {
      toast.error("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-sm shadow-xl">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-primary" />
          {parentId ? "New Subfolder" : "New Root Folder"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Folder name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
