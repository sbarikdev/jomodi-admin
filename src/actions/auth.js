import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { API_URL } from '../constant';  


export const loginUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}auth/login`, userData);
        const token = res.data.access;
        localStorage.setItem('jwtToken', token);
        const decoded = jwt_decode(token);
        console.log(decoded);
        return decoded;
    } catch (err) {
        console.log(err);
        const errorDetail = err.response ? err.response.data.detail : 'An error occurred during login.';
        throw new Error(errorDetail);
    }
};

export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}auth/register`, userData);
    } catch (err) {
        console.log(err);
        const errorMessage = err.response ? err.response.data.email : 'An error occurred during registration.';
        throw new Error(errorMessage); // throw an error with the message received from the server or a default message
    }
};

export const logoutUser = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('admin');

};

export const getCurrentUser = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        const decoded = jwt_decode(token);
        return decoded;
    }
    return null;
};