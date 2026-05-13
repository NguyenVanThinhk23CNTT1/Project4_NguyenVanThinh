import axios from '../tta_axios';

// API quản lý banner (Admin)
export const bannerApi = {
  // Lấy danh sách banner
  getAll: (params) => axios.get('/api/tta_banner', { params }),
  
  // Lấy chi tiết một banner
  getOne: (id) => axios.get(`/api/tta_banner/${id}`),
  
  // Tạo banner mới
  create: (data) => axios.post('/api/tta_banner', data),
  
  // Cập nhật banner
  update: (id, data) => axios.put(`/api/tta_banner/${id}`, data),
  
  // Xóa banner
  delete: (id) => axios.delete(`/api/tta_banner/${id}`),
};
