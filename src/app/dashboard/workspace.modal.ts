import { Document } from '../documents/document.service';

export interface Workspace {
  id: string;
  name: string;
  document: Document[];
  workspaceUser: string[];
}
