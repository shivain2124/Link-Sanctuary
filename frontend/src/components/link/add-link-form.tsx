import { useState, type FormEvent } from "react";
import { X, Plus } from "lucide-react";
import { createLinkService } from "../../services/link-service";
import type { LinkType } from "../../types/types";

interface AddLinkFormProps {
  folderId: string;
  onSuccess: (link: LinkType) => void;
  onCancel: () => void;
}

export const AddLinkForm = ({
  folderId,
  onSuccess,
  onCancel,
}: AddLinkFormProps) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      alert("Title and URL are required");
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await createLinkService(
        formData.title.trim(),
        formData.url.trim(),
        formData.description.trim(),
        folderId,
        tagsArray
      );

      if (result?.data) {
        onSuccess(result.data);
        setFormData({ title: "", url: "", description: "", tags: "" });
      }
    } catch (error) {
      console.error("Error adding link:", error);
      alert("Failed to add link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-base-300 rounded space-y-2 max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        name="title"
        placeholder="Title *"
        value={formData.title}
        onChange={handleChange}
        className="input input-sm input-bordered w-full"
        disabled={loading}
      />

      <input
        type="url"
        name="url"
        placeholder="https://example.com *"
        value={formData.url}
        onChange={handleChange}
        className="input input-sm input-bordered w-full"
        disabled={loading}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="textarea textarea-sm textarea-bordered w-full"
        rows={2}
        disabled={loading}
      />

      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
        className="input input-sm input-bordered w-full"
        disabled={loading}
      />

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-sm btn-ghost"
          disabled={loading}
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-sm btn-primary"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};
