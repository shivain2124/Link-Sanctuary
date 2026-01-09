import { useState, useEffect } from "react";
import { X, Plus, Save } from "lucide-react";
import {
  createLinkService,
  updateLinkService,
} from "../../services/link-service";
import type { LinkType } from "../../types/types";
import toast from "react-hot-toast";

interface AddLinkModalProps {
  folderId: string;
  isOpen: boolean;
  onSuccess: (link: LinkType) => void;
  onClose: () => void;
  initialData?: LinkType | null;
}

export const AddLinkModal = ({
  folderId,
  isOpen,
  onSuccess,
  onClose,
  initialData,
}: AddLinkModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url,
        description: initialData.description || "",
        tags: initialData.tags?.join(", ") || "",
      });
    } else {
      // Clear form if adding new
      setFormData({ title: "", url: "", description: "", tags: "" });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      return toast.error("Title and URL are required");
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      let result;
      if (initialData) {
        // EDIT MODE
        result = await updateLinkService(initialData._id, {
          title: formData.title.trim(),
          url: formData.url.trim(),
          description: formData.description.trim(),
          tags: tagsArray,
        });
        toast.success("Link updated! ✓");
      } else {
        // ADD MODE
        result = await createLinkService(
          formData.title.trim(),
          formData.url.trim(),
          formData.description.trim(),
          folderId,
          tagsArray
        );
        toast.success("Link added! ✓");
      }

      const updatedLink = result?.link || result?.data || result;
      onSuccess(updatedLink);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Link" : "Add New Link"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text block mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="label-text block mb-1">URL *</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label-text block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label-text block mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              placeholder="coding, react, news"
              value={formData.tags}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {initialData ? (
                <Save className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {loading ? "Saving..." : initialData ? "Update Link" : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
