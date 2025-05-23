export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  universityId?: string;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  students: string[];
  category: string;
  progress: number;
  startDate: string;
  endDate: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
  projectId: string;
  dueDate: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Dashboard {
  projectCount: number;
  studentCount: number;
  taskCount: number;
  finishedProjectCount: number;
}
