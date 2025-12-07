import { useState } from "react";
import { X, Plus } from "lucide-react";
import { createLinkService } from "../../services/link-service";
import type { LinkType } from "../../types/types";
import toast from "react-hot-toast";

interface AddLinkModalProps {
  folderId: string;
  isOpen: boolean;
  onSuccess: (link: LinkType) => void;
  onClose: () => void;
}

export const AddLinkModal = ({
  folderId,
  isOpen,
  onSuccess,
  onClose,
}: AddLinkModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    let url = formData.url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await createLinkService(
        formData.title.trim(),
        url,
        formData.description.trim(),
        folderId,
        tagsArray
      );

      const newLink = result?.link || result?.data || result;

      if (newLink && newLink._id) {
        onSuccess(newLink);
        setFormData({ title: "", url: "", description: "", tags: "" });
        onClose();
        toast.success("Link added successfully! ✓");
      } else {
        throw new Error("Failed to add link");
      }
    } catch (error: any) {
      console.error("Error adding link:", error);

      const errorMsg = error.message || "Failed to add link";

      if (
        errorMsg.includes("already taken") ||
        errorMsg.includes("Name already taken")
      ) {
        toast.error("Link with this title already exists in this folder");
      } else if (errorMsg.includes("duplicate")) {
        toast.error("This link already exists");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Add Link</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Title *</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Link title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">URL *</span>
            </label>
            <input
              type="text"
              name="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Optional description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={3}
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Tags</span>
            </label>
            <input
              type="text"
              name="tags"
              placeholder="react, coding, tutorial"
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
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              {loading ? "Adding..." : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
