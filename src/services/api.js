// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchEvents = async (pageNumber = 0, pageSize = 1, sort = 'startDate,desc') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events`, {
            params: {
                page: pageNumber,
                size: pageSize,
                sort: sort
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};
