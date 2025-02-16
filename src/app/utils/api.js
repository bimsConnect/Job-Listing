import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchJobs = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      params: {
        _page: page,
        _limit: limit,
        ...filters
      }
    });

    // Transform data with additional fields
    const jobsWithDetails = response.data.map(job => ({
      ...job,
      salary: '$' + (Math.floor(Math.random() * 5000) + 1000), // Random salary between 1000-6000
      category: ['IT', 'Design', 'Marketing'][Math.floor(Math.random() * 3)], // Random category
      location: ['Remote', 'On-site', 'Hybrid'][Math.floor(Math.random() * 3)], // Random location
      postedDate: new Date().toISOString().split('T')[0] // Current date
    }));

    return {
      success: true,
      data: jobsWithDetails,
      total: response.headers['x-total-count'] || jobsWithDetails.length,
      page,
      limit
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch job listings',
      status: error.response?.status || 500
    };
  }
};
