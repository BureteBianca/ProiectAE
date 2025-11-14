// client/src/api/user.routes.js
import { axiosNoAuth } from "../axios/axiosNoAuth";
import axios from "axios"; 

// Înregistrare user (există deja)
export const registerUser = async (userData) => {
  try {
    const response = await axiosNoAuth.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return error.response?.data;
  }
};

// Preluare date user
export const fetchUser = async (userId, token) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data; 
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Actualizare date user (de exemplu nume)
export const updateUser = async (userId, token, updateData) => {
  try {
    const { data } = await axios.put(`http://localhost:5000/users/${userId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data; 
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
