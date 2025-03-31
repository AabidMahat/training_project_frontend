// dashboard.component.ts
import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  name: string;
  isActive: boolean;
  avatar: string;
}

interface Document {
  id: number;
  title: string;
  description: string;
  content: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './workspace-details.component.html',
  styleUrls: ['./workspace-details.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
  workspaceName: string = 'My Workspace';
  selectedDocument: Document | null = null;

  activeUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      isActive: true,
      avatar: 'assets/avatars/john.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      isActive: true,
      avatar: 'assets/avatars/jane.jpg',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      isActive: false,
      avatar: 'assets/avatars/bob.jpg',
    },
    {
      id: 4,
      name: 'Alice Brown',
      isActive: true,
      avatar: 'assets/avatars/alice.jpg',
    },
  ];

  documents: Document[] = [
    {
      id: 1,
      title: 'Project Overview',
      description: 'A brief overview of the current project status and goals',
      content:
        'This document contains detailed information about our project, including milestones, resources, and timelines. The project is currently on track to meet all deadlines.',
    },
    {
      id: 2,
      title: 'Meeting Notes',
      description: 'Notes from the last team meeting on March 25',
      content:
        'During our last meeting, we discussed feature prioritization and assigned tasks to team members. Action items include updating the roadmap and scheduling follow-up meetings with stakeholders.',
    },
    {
      id: 3,
      title: 'Design Guidelines',
      description: 'Brand and UI design guidelines for the project',
      content:
        'These guidelines outline our color schemes, typography, component designs, and overall visual language to maintain consistency across all platforms and touchpoints.',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  joinWorkspace(): void {
    console.log('Join workspace clicked');
    // Implement joining workspace functionality
  }

  selectDocument(document: Document): void {
    this.selectedDocument = document;
  }
}
