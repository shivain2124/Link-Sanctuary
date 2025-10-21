import { ExternalLink, FolderClosed, FolderOpen } from "lucide-react";
import { useState } from "react";
import { type FolderType, type LinkType } from "../../types/types";

export interface FolderNode extends FolderType {
  children?: FolderNode[];
  links?: LinkType[];
}

// Recursive FolderItem component
export const FolderItem = ({
  _id,
  name,
  parentId,
  children = [],
  links = [],
}: FolderNode) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasContent = children.length > 0 || links.length > 0;

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-base-300 rounded"
      >
        {isOpen ? (
          <FolderOpen className="h-4 w-4" />
        ) : (
          <FolderClosed className="h-4 w-4" />
        )}
        {name}
      </button>

      {isOpen && hasContent && (
        <ul className="ml-4">
          {links.map((link) => (
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
          {children.map((child) => (
            <FolderItem key={child._id} {...child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// Main FolderTree wrapper
interface FolderTreeProps {
  folders?: FolderNode[];
}

export const FolderTree = ({ folders = mockFolders }: FolderTreeProps) => {
  return (
    <ul className="menu menu-xs bg-base-200 rounded-box max-w-xs w-full p-2">
      {folders.map((folder) => (
        <FolderItem key={folder._id} {...folder} />
      ))}
    </ul>
  );
};

// mock data
const mockFolders: FolderNode[] = [
  {
    _id: "1",
    name: "Work",
    parentId: null,
    userId: "user1",
    children: [
      {
        _id: "2",
        name: "Projects",
        parentId: "1",
        userId: "user1",
        children: [
          {
            _id: "3",
            name: "LinkSanctuary",
            parentId: "2",
            userId: "user1",
            links: [
              {
                _id: "link1",
                title: "GitHub Repo",
                url: "https://github.com",
                description: "Main repository",
                isFavourite: true,
                tags: ["development", "git"],
                folderId: "3",
                userId: "user1",
              },
              {
                _id: "link2",
                title: "Documentation",
                url: "https://docs.github.com",
                description: "GitHub docs",
                isFavourite: false,
                tags: ["docs"],
                folderId: "3",
                userId: "user1",
              },
            ],
          },
        ],
        links: [
          {
            _id: "link3",
            title: "Project Management",
            url: "https://trello.com",
            description: "Task management",
            isFavourite: false,
            tags: ["productivity"],
            folderId: "2",
            userId: "user1",
          },
        ],
      },
    ],
    links: [
      {
        _id: "link4",
        title: "Company Website",
        url: "https://example.com",
        description: "",
        isFavourite: false,
        tags: [],
        folderId: "1",
        userId: "user1",
      },
    ],
  },
  {
    _id: "4",
    name: "Personal",
    parentId: null,
    userId: "user1",
    children: [
      {
        _id: "5",
        name: "Learning",
        parentId: "4",
        userId: "user1",
        links: [
          {
            _id: "link5",
            title: "React Docs",
            url: "https://react.dev",
            description: "Official React documentation",
            isFavourite: true,
            tags: ["react", "frontend"],
            folderId: "5",
            userId: "user1",
          },
          {
            _id: "link6",
            title: "TypeScript Handbook",
            url: "https://www.typescriptlang.org/docs/",
            description: "Learn TypeScript",
            isFavourite: false,
            tags: ["typescript", "learning"],
            folderId: "5",
            userId: "user1",
          },
        ],
      },
    ],
    links: [
      {
        _id: "link7",
        title: "YouTube",
        url: "https://youtube.com",
        description: "Video platform",
        isFavourite: false,
        tags: ["entertainment"],
        folderId: "4",
        userId: "user1",
      },
    ],
  },
  {
    _id: "6",
    name: "Empty Folder",
    parentId: null,
    userId: "user1",
    children: [],
    links: [],
  },
];
