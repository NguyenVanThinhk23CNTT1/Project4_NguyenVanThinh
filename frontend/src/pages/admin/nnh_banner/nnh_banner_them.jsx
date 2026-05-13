import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bannerApi, danhmucApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhBannerThem() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    MaDanhMuc: '',
    TieuDe: '',
    MoTa: '',
    UrlAnh: '',
    LinkRedirect: '',
    TrangThai: 1
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await danhmucApi.getAll();
        setCategories(res.data.data.items || []);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        MaDanhMuc: formData.MaDanhMuc ? parseInt(formData.MaDanhMuc) : null
      };
      await bannerApi.create(payload);
      alert("Thêm banner mới thành công!");
      navigate('/admin/banner');
    } catch (err) {
      const errMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert("Lỗi khi thêm banner: " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-2xl ${isDark ? 'bg-slate-900/70 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <h3 className={`font-['Space_Grotesk'] text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-3`}>
            <span className="material-symbols-outlined text-blue-500 text-3xl">add_photo_alternate</span>
            Thêm Banner Mới
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Định cấu hình hình ảnh và liên kết danh mục động cho banner.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Danh mục liên kết</label>
              <select 
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                value={formData.MaDanhMuc}
                onChange={e => setFormData({...formData, MaDanhMuc: e.target.value})}
              >
                <option value="">-- Mặc định (Hiển thị cho tất cả danh mục) --</option>
                {categories.map(dm => (
                  <option key={dm.MaDanhMuc} value={dm.MaDanhMuc}>
                    {dm.TenDanhMuc}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500">Nếu để mặc định, banner sẽ xuất hiện khi người dùng xem toàn bộ sản phẩm.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Đường dẫn hình ảnh (URL)</label>
              <input 
                required
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                placeholder="https://example.com/banner.jpg"
                value={formData.UrlAnh}
                onChange={e => setFormData({...formData, UrlAnh: e.target.value})}
              />
            </div>

            {formData.UrlAnh && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Xem trước hình ảnh</label>
                <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <img src={formData.UrlAnh} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiêu đề Banner</label>
              <input 
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                placeholder="Khuyến mãi cực sốc mùa hè..."
                value={formData.TieuDe}
                onChange={e => setFormData({...formData, TieuDe: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả ngắn</label>
              <textarea 
                rows="2"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all resize-none`}
                placeholder="Nhập thông điệp kèm theo..."
                value={formData.MoTa}
                onChange={e => setFormData({...formData, MoTa: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Link chuyển hướng khi click (Tùy chọn)</label>
              <input 
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                placeholder="https://example.com/promotion"
                value={formData.LinkRedirect}
                onChange={e => setFormData({...formData, LinkRedirect: e.target.value})}
              />
            </div>

            <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-50'}`}>
               <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Kích hoạt ngay</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Cho phép hiển thị banner trên hệ thống</p>
               </div>
               <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, TrangThai: prev.TrangThai === 1 ? 0 : 1 }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.TrangThai === 1 ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.TrangThai === 1 ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin/banner')} 
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Lưu Banner
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
