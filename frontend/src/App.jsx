import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/TtaProtectedRoute';

// --- LAYOUTS ---
import AdminLayout from './layouts/AdminLayout'; // Đường dẫn mới
import ClientLayout from './layouts/ClientLayout'; // Layout mới

// --- PAGES: AUTH ---
import NnhLoginPage from './pages/auth/nnh_login_page';
import NnhRegisterPage from './pages/auth/nnh_register_page';
import NnhClientHome from './pages/client/NnhClientHome';

// --- PAGES: ADMIN ---
import NnhDashboard from './pages/admin/dashboard/nnh_dashboard';
import NnhDanhMucList from './pages/admin/nnh_danhmuc/nnh_danhmuc_list';
import NnhDanhMucThem from './pages/admin/nnh_danhmuc/nnh_danhmuc_them';
import NnhDanhMucSua from './pages/admin/nnh_danhmuc/nnh_danhmuc_sua';
import NnhDanhMucXoa from './pages/admin/nnh_danhmuc/nnh_danhmuc_xoa';
import NnhSanPhamList from './pages/admin/nnh_sanpham/nnh_sanpham_list';
import NnhSanPhamThem from './pages/admin/nnh_sanpham/nnh_sanpham_them';
import NnhSanPhamSua from './pages/admin/nnh_sanpham/nnh_sanpham_sua';
import NnhSanPhamXoa from './pages/admin/nnh_sanpham/nnh_sanpham_xoa';
import NnhSanPhamChiTiet from './pages/admin/nnh_sanpham/nnh_sanpham_chitiet';
import NnhUserList from './pages/admin/nnh_nguoidung/nnh_user_list';
import NnhUserThem from './pages/admin/nnh_nguoidung/nnh_user_them';
import NnhUserSua from './pages/admin/nnh_nguoidung/nnh_user_sua';
import NnhUserXoa from './pages/admin/nnh_nguoidung/nnh_user_xoa';

import NnhThuocTinhList from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_list';
import NnhThuocTinhThem from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_them';
import NnhThuocTinhSua from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_sua';
import NnhThuocTinhXoa from './pages/admin/nnh_thuoctinh/nnh_thuoctinh_xoa';
import NnhDanhMucThuocTinhList from './pages/admin/nnh_danhmuc_thuoctinh/nnh_danhmuc_thuoctinh_list';
import NnhGiaTriThuocTinhList from './pages/admin/nnh_giatrithuoctinh/nnh_giatrithuoctinh_list';
import NnhGiaTriThuocTinhForm from './pages/admin/nnh_giatrithuoctinh/nnh_giatrithuoctinh_form';

import NnhDonHangList from './pages/admin/nnh_donhang/nnh_donhang_list';
import NnhDonHangThem from './pages/admin/nnh_donhang/nnh_donhang_them';
import NnhDonHangSua from './pages/admin/nnh_donhang/nnh_donhang_sua';
import NnhDonHangXoa from './pages/admin/nnh_donhang/nnh_donhang_xoa';

import NnhChiTietDonHangList from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_list';
import NnhChiTietDonHangSua from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_sua';
import NnhChiTietDonHangXoa from './pages/admin/nnh_chitietdonhang/nnh_chitietdonhang_xoa';

import NnhDanhGiaList from './pages/admin/nnh_danhgia/nnh_danhgia_list';
import NnhVoucherList from './pages/admin/nnh_voucher/nnh_voucher_list';
import NnhVoucherThem from './pages/admin/nnh_voucher/nnh_voucher_them';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* AUTH ROUTES (Standalone) */}
          <Route path="/login" element={<NnhLoginPage />} />
          <Route path="/register" element={<NnhRegisterPage />} />

          {/* CLIENT ROUTES */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<NnhClientHome />} />
          </Route>

          {/* ADMIN ROUTES (Bảo vệ bởi ProtectedRoute) */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<NnhDashboard />} />
            
            <Route path="danh-muc"            element={<NnhDanhMucList />} />
            <Route path="danh-muc/them"       element={<NnhDanhMucThem />} />
            <Route path="danh-muc/edit/:ma"   element={<NnhDanhMucSua />} />
            <Route path="danh-muc/delete/:ma" element={<NnhDanhMucXoa />} />
            <Route path="san-pham"            element={<NnhSanPhamList />} />
            <Route path="san-pham/them"       element={<NnhSanPhamThem />} />
            <Route path="san-pham/edit/:ma"   element={<NnhSanPhamSua />} />
            <Route path="san-pham/delete/:ma" element={<NnhSanPhamXoa />} />
            <Route path="san-pham/view/:ma"   element={<NnhSanPhamChiTiet />} />
            <Route path="san-pham/thong-so/:ma" element={<NnhGiaTriThuocTinhForm />} />
            <Route path="user"                element={<NnhUserList />} />
            <Route path="user/them"           element={<NnhUserThem />} />
            <Route path="user/edit/:ma"       element={<NnhUserSua />} />
            <Route path="user/delete/:ma"     element={<NnhUserXoa />} />
            
            <Route path="thuoc-tinh"          element={<NnhThuocTinhList />} />
            <Route path="thuoc-tinh/them"     element={<NnhThuocTinhThem />} />
            <Route path="thuoc-tinh/edit/:ma" element={<NnhThuocTinhSua />} />
            <Route path="thuoc-tinh/delete/:ma" element={<NnhThuocTinhXoa />} />
            <Route path="danhmuc-thuoctinh"   element={<NnhDanhMucThuocTinhList />} />
            <Route path="giatri-thuoctinh"   element={<NnhGiaTriThuocTinhList />} />
            <Route path="giatri-thuoctinh/them" element={<NnhGiaTriThuocTinhForm />} />

            <Route path="don-hang"            element={<NnhDonHangList />} />
            <Route path="don-hang/them"       element={<NnhDonHangThem />} />
            <Route path="don-hang/edit/:ma"   element={<NnhDonHangSua />} />
            <Route path="don-hang/delete/:ma" element={<NnhDonHangXoa />} />

            <Route path="chi-tiet"            element={<NnhChiTietDonHangList />} />
            <Route path="chi-tiet/edit/:ma"   element={<NnhChiTietDonHangSua />} />
            <Route path="chi-tiet/delete/:ma" element={<NnhChiTietDonHangXoa />} />

            <Route path="danh-gia"            element={<NnhDanhGiaList />} />
            <Route path="voucher"             element={<NnhVoucherList />} />
            <Route path="voucher/them"        element={<NnhVoucherThem />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
