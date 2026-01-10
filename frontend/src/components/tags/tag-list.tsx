import { useEffect, useState } from "react";
import {
  getUserTagService,
  searchService,
  getFavouriteService,
} from "../../services/link-service";
import { Tag, Hash, Star } from "lucide-react";
import { useFolder } from "../../context/folder-context";

export const TagSidebar = () => {
  const [tags, setTags] = useState<string[]>([]);
  const { setActiveFolderLinks, setIsGlobalSearch, setActiveFolderId } =
    useFolder();

  useEffect(() => {
    getUserTagService()
      .then((res) => setTags(res.data || []))
      .catch(console.error);
  }, []);

  const handleShowFavorites = async () => {
    setIsGlobalSearch(true);
    setActiveFolderId(null);
    try {
      // Use the specific favorites service
      const results = await getFavouriteService();
      setActiveFolderLinks(results.data || []);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  const handleTagClick = async (tag: string) => {
    setIsGlobalSearch(true);
    setActiveFolderId(null);
    const results = await searchService({ tags: tag });
    setActiveFolderLinks(results.data || []);
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="px-2">
        <button
          onClick={handleShowFavorites}
          className="btn btn-ghost btn-sm w-full justify-start gap-2 text-warning hover:bg-warning/10"
        >
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium text-base-content">Favorites</span>
        </button>
      </div>

      <div>
        <div className="px-4 mb-2 flex items-center gap-2 opacity-50 uppercase text-xs font-bold">
          <Tag className="h-3 w-3" />
          <span>Tags</span>
        </div>
        <div className="space-y-1 px-2 overflow-y-auto max-h-64 custom-scrollbar text-sm">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="btn btn-ghost btn-sm w-full justify-start font-normal gap-2"
            >
              <Hash className="h-3 w-3 opacity-40" />
              <span className="truncate">{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
