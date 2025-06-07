import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  // คุณสามารถตั้งค่า headers หรือ config อื่นๆ ได้ที่นี่
});

export default api;