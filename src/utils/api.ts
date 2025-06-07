import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:4001/api/v1',
  // คุณสามารถตั้งค่า headers หรือ config อื่นๆ ได้ที่นี่
});

export default api;