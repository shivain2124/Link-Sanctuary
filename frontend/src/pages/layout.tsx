import { FolderTree } from "../components/folder/file-tree";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <aside className="w-72 shrink-0 border-r border-base-300 bg-base-200 overflow-y-auto">
        <div className="p-2">
          <FolderTree />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
