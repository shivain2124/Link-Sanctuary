export interface FolderType {
  _id: string;
  name: string;
  parentId?: string | null;
  userId: string;
}
export interface LinkType {
  _id: string;
  title: string;
  url: string;
  description: string;
  folderId: string;
  userId: string;
  isFavourite: boolean;
  tags: string[];
}
