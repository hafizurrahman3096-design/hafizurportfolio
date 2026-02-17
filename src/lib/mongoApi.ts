const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5001/api');

const getHeaders = () => {
    const token = sessionStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const mongoApi = {
    // Auth
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return res.json();
    },

    // Projects
    getProjects: async () => {
        const res = await fetch(`${API_URL}/projects`);
        return res.json();
    },
    addProject: async (project: any) => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(project)
        });
        return res.json();
    },
    deleteProject: async (id: string) => {
        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.json();
    },

    // Inquiries
    getInquiries: async () => {
        const res = await fetch(`${API_URL}/inquiries`, {
            headers: getHeaders()
        });
        return res.json();
    },
    addInquiry: async (inquiry: any) => {
        const res = await fetch(`${API_URL}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiry)
        });
        return res.json();
    },
    updateInquiry: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/inquiries/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteInquiry: async (id: string) => {
        const res = await fetch(`${API_URL}/inquiries/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.json();
    },

    // Profile
    getProfile: async () => {
        const res = await fetch(`${API_URL}/profile`);
        return res.json();
    },
    updateProfile: async (profile: any) => {
        const res = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(profile)
        });
        return res.json();
    }
};
