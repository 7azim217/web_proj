import { create } from 'zustand';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  start_date: string;
  end_date: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  projectId: string;
  dueDate: string;
}

interface DashboardStats {
  projectCount: number;
  studentCount: number;
  taskCount: number;
  finishedCount: number;
}

interface DataStore {
  // Projects
  projects: Project[];
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Tasks
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;

  // Dashboard
  dashboard: DashboardStats;
  fetchDashboardData: () => Promise<void>;

  // File Submission
  submitFile: (type: 'task' | 'project', itemId: string, file: File) => Promise<void>;
}

const API_BASE = 'http://localhost:5000/api';

const useDataStore = create<DataStore>((set, get) => ({
  // Initial States
  projects: [],
  tasks: [],
  dashboard: {
    projectCount: 0,
    studentCount: 0,
    taskCount: 0,
    finishedCount: 0,
  },

  // 📁 PROJECTS
  fetchProjects: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    set({ projects: Array.isArray(data) ? data : [] });
  },

  createProject: async (data) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    get().fetchProjects();
  },

  updateProject: async (id, data) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    get().fetchProjects();
  },

  deleteProject: async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    get().fetchProjects();
  },

  // 📋 TASKS
  fetchTasks: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    set({ tasks: Array.isArray(data) ? data : [] });
  },

  createTask: async (data) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    get().fetchTasks();
  },

updateTask: async (id, data) => {
  const token = localStorage.getItem('token');
  await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  get().fetchTasks();
}
,

  deleteTask: async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    get().fetchTasks();
  },

  updateTaskStatus: async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    get().fetchTasks();
  },

  // 📊 DASHBOARD
  fetchDashboardData: async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ dashboard: data });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  },

  // 📤 FILE SUBMISSION
  submitFile: async (type, itemId, file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch(`${API_BASE}/files/submit/${type}/${itemId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      alert('File submitted successfully!');
    } catch (error) {
      console.error('File submission error:', error);
      alert('File submission failed.');
    }
  },
}));

export default useDataStore;
