import { createContext, useContext, useState, type ReactNode } from "react";
import { type LinkType } from "../types/types";

interface FolderContextType {
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
  activeFolderLinks: LinkType[];
  setActiveFolderLinks: (links: LinkType[]) => void;
  isGlobalSearch: boolean;
  setIsGlobalSearch: (val: boolean) => void;
  favorites: LinkType[];
  setFavorites: (links: LinkType[]) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeFolderLinks, setActiveFolderLinks] = useState<LinkType[]>([]);
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [favorites, setFavorites] = useState<LinkType[]>([]);

  return (
    <FolderContext.Provider
      value={{
        activeFolderId,
        setActiveFolderId,
        activeFolderLinks,
        setActiveFolderLinks,
        isGlobalSearch,
        setIsGlobalSearch,
        favorites,
        setFavorites,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => {
  const context = useContext(FolderContext);
  if (!context) throw new Error("useFolder must be used within FolderProvider");
  return context;
};
