import { API_URL } from '../config/constants';
import axios from 'axios';

const userService = {
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axios.put(
      `${API_URL}/users/${id}`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await axios.put(
      `${API_URL}/users/${id}/role`,
      { role },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await axios.put(
      `${API_URL}/users/${id}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};

export const useUserService = () => {
  return userService;
};

export default userService; 