import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chathaven-zvsp.onrender.com',
  withCredentials: true, 
});

export default instance;