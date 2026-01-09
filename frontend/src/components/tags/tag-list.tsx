import { useEffect, useState } from "react";
import { getUserTagService, searchService } from "../../services/link-service";
import { Tag, Hash } from "lucide-react";
import { useFolder } from "../../context/folder-context";

export const TagSidebar = () => {
  const [tags, setTags] = useState<string[]>([]);
  const { setActiveFolderLinks, setIsGlobalSearch, setActiveFolderId } = useFolder();

  useEffect(() => {
    const fetchTags = async () => {
      const res = await getUserTagService();
      setTags(res.data || []); 
    };
    fetchTags();
  }, []);

  const handleTagClick = async (tag: string) => {
    setIsGlobalSearch(true);
    setActiveFolderId(null);
    const results = await searchService({ tags: tag }); 
    setActiveFolderLinks(results.data || []);
  };

  return (
    <div className="mt-6">
      <div className="px-4 mb-2 flex items-center gap-2 opacity-50 uppercase text-xs font-bold">
        <Tag className="h-3 w-3" />
        <span>Tags</span>
      </div>
      <div className="space-y-1 px-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="btn btn-ghost btn-sm w-full justify-start font-normal gap-2 hover:bg-base-300"
          >
            <Hash className="h-3 w-3 opacity-40" />
            <span className="truncate">{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
};