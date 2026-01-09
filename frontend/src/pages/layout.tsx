import { FolderPlus, Settings } from "lucide-react";
import { FolderTree } from "../components/folder/file-tree";
import { UserButton } from "@clerk/clerk-react";
import { TagSidebar } from "../components/tags/tag-list";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-base-300 bg-base-200/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <h1 className="font-bold text-lg tracking-tight">MyVault</h1>
          <button className="btn btn-circle btn-ghost btn-sm">
            <FolderPlus className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Tree Area */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <FolderTree />
          <TagSidebar />
        </div>

        {/* Sidebar Footer (User Settings) */}
        <div className="p-4 border-t border-base-300 flex items-center justify-between bg-base-200">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm font-medium">Account</span>
          </div>
          <button className="btn btn-ghost btn-sm btn-square">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-base-100">{children}</main>
    </div>
  );
}
