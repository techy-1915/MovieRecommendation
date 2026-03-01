const TOKEN_KEY = 'moviebooking_token';
const USER_KEY = 'moviebooking_user';

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = () => {
  const u = localStorage.getItem(USER_KEY);
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};
export const removeUser = () => localStorage.removeItem(USER_KEY);
