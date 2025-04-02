// home.component.ts
import { Component, OnInit } from '@angular/core';

interface Activity {
  id: number;
  type: string;
  icon: string;
  title: string;
  description: string;
  time: Date;
  user: string;
}

interface Member {
  id: number;
  name: string;
  avatar: string;
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  members: Member[];
  lastUpdated: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  recentActivities: Activity[] = [];
  workspaces: Workspace[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadRecentActivities();
    this.loadWorkspaces();
  }

  loadRecentActivities(): void {
    // In a real application, this would likely come from a service
    this.recentActivities = [
      {
        id: 1,
        type: 'edit',
        icon: 'edit',
        title: 'Marketing Plan Updated',
        description:
          'Sarah Johnson made changes to the Q2 Marketing Strategy document',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        user: 'Sarah Johnson',
      },
      {
        id: 2,
        type: 'comment',
        icon: 'comment',
        title: 'New Comment',
        description: 'Alex Rodriguez commented on Product Roadmap',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        user: 'Alex Rodriguez',
      },
      {
        id: 3,
        type: 'share',
        icon: 'share',
        title: 'Document Shared',
        description: 'Michael Chang shared Budget Forecast with you',
        time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        user: 'Michael Chang',
      },
      {
        id: 4,
        type: 'create',
        icon: 'add_circle',
        title: 'New Workspace Created',
        description: 'You created the "Product Development" workspace',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        user: 'You',
      },
    ];
  }

  loadWorkspaces(): void {
    // In a real application, this would likely come from a service
    this.workspaces = [
      {
        id: 1,
        name: 'Marketing Team',
        description: 'Campaign planning and creative assets',
        color: '#4CAF50',
        icon: 'campaign',
        members: [
          { id: 1, name: 'John Doe', avatar: 'user1.jpg' },
          { id: 2, name: 'Sarah Johnson', avatar: 'user2.jpg' },
          { id: 3, name: 'Alex Rodriguez', avatar: 'user3.jpg' },
          { id: 4, name: 'Emily Chen', avatar: 'user4.jpg' },
        ],
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      },
      {
        id: 2,
        name: 'Product Development',
        description: 'Roadmap and feature planning',
        color: '#2196F3',
        icon: 'developer_board',
        members: [
          { id: 1, name: 'John Doe', avatar: 'user1.jpg' },
          { id: 5, name: 'Michael Chang', avatar: 'user5.jpg' },
          { id: 6, name: 'Lisa Wang', avatar: 'user6.jpg' },
        ],
        lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: 3,
        name: 'Client Projects',
        description: 'Client deliverables and communications',
        color: '#FF9800',
        icon: 'business',
        members: [
          { id: 1, name: 'John Doe', avatar: 'user1.jpg' },
          { id: 2, name: 'Sarah Johnson', avatar: 'user2.jpg' },
          { id: 7, name: 'David Smith', avatar: 'user7.jpg' },
          { id: 8, name: 'Jessica Brown', avatar: 'user8.jpg' },
          { id: 9, name: 'Robert Wilson', avatar: 'user9.jpg' },
        ],
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      },
      {
        id: 4,
        name: 'Design Team',
        description: 'UI/UX design projects and resources',
        color: '#9C27B0',
        icon: 'palette',
        members: [
          { id: 4, name: 'Emily Chen', avatar: 'user4.jpg' },
          { id: 6, name: 'Lisa Wang', avatar: 'user6.jpg' },
          { id: 10, name: 'James Taylor', avatar: 'user10.jpg' },
        ],
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
    ];
  }
}
