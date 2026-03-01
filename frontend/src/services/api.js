import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMovies = (params) => api.get('/api/movies', { params });
export const getMovie = (id) => api.get(`/api/movies/${id}`);
export const getTrendingMovies = () => api.get('/api/movies/trending');
export const getShows = (movieId, city) =>
  api.get(`/api/shows/${movieId}`, { params: city ? { city } : {} });
export const getSeats = (showId) => api.get(`/api/seats/${showId}`);
export const createBooking = (data) => api.post('/api/bookings', data);
export const cancelBooking = (bookingId) => api.post(`/api/bookings/${bookingId}/cancel`);
export const getUserBookings = (userId) => api.get(`/api/bookings/user/${userId}`);
export const getBooking = (bookingId) => api.get(`/api/bookings/${bookingId}`);
export const login = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/register', data);
export const getProfile = () => api.get('/api/auth/profile');
export const syncGenres = () => api.post('/api/sync/genres');
export const syncMovies = () => api.post('/api/sync/movies');

export default api;
