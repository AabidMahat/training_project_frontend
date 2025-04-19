import { Document } from '../documents/document.service';

export interface Workspace {
  id: string;
  name: string;
  isPrivate: boolean;
  document: Document[];
  workspaceUser: string[];
}
