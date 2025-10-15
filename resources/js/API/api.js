import axios from "axios";

const api = axios.create({
    baseURL: '/api',
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },

    (error) => {
        Promise.reject(error)
        console.error(error)
    }
);

export const publicApi = {
    login: (email, password) => api.post('/login', {email, password}),
    signUp: (data) => api.post('/users/create', data)
}

export const privateApi = {
    getUsers: (id)=> id ? api.get(`/users/${id}`) : api.get('/users'),
    getTransactions: () => api.get('/transactions'),
    getTasks: (id)=> id ? api.get(`/tasks/${id}`) : api.get('/tasks'),
    createTask: (data)=> api.post('/tasks/', data),
    updateTask: (id, data)=> api.put(`/tasks/${id}`, data),
    deleteTask: (id)=> api.delete(`/tasks/${id}`),
    logout: ()=> api.post('/logout'),
    createTransaction: (data) => api.post('/transactions', data),
}