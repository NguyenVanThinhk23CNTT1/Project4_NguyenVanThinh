import React from 'react';
import { Link } from 'react-router-dom';

export default function NnhClientHeader({ selectedCategory = '', onSelectCategory }) {
  // Danh sách các tab danh mục hiển thị trên thanh điều hướng
  const categories = [
    { id: '', name: 'Trang chủ' },
    { id: 'Điện thoại', name: 'Điện thoại' },
    { id: 'Laptop', name: 'Laptop' },
    { id: 'Tai nghe', name: 'Tai nghe' },
    { id: 'Đồng hồ', name: 'Đồng hồ' },
    { id: 'Phụ kiện', name: 'Phụ kiện' },
    { id: 'Thiết bị thông minh', name: 'Thiết bị thông minh' },
    { id: 'Khuyến mãi', name: 'Khuyến mãi' },
  ];

  return (
    <header className="w-full bg-white font-['Inter'] select-none border-b border-purple-100/50 sticky top-0 z-50 shadow-sm">
      {/* THANH THÔNG BÁO TRÊN CÙNG (TOP BAR) */}
      <div className="w-full bg-[#fdfcff] border-b border-purple-50 py-2 px-4 md:px-12 flex justify-between items-center text-xs text-purple-950/70 font-medium">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-sm">local_shipping</span>
          <span>Miễn phí giao hàng cho đơn từ 500k</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-sm">verified_user</span>
          <span>Bảo hành chính hãng 12 tháng</span>
        </div>
      </div>

      {/* KHU VỰC HEADER CHÍNH (LOGO, TÌM KIẾM, TÀI KHOẢN, GIỎ HÀNG) */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4 md:gap-8">
        {/* LOGO THƯƠNG HIỆU */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer" onClick={() => onSelectCategory?.('')}>
          <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform shadow-inner">
            <span className="material-symbols-outlined text-xl">devices</span>
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-purple-950 font-['Space_Grotesk']">
            Tech<span className="text-purple-600">Zone</span>
          </span>
        </Link>

        {/* THANH TÌM KIẾM TRUNG TÂM */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative flex items-center w-full h-11 bg-purple-50/60 hover:bg-purple-50 border border-purple-100/80 rounded-full px-4 transition-all focus-within:bg-white focus-within:border-purple-400 focus-within:shadow-md">
            <input
              type="text"
              placeholder="Bạn cần tìm sản phẩm gì?"
              className="w-full bg-transparent border-none outline-none text-sm text-purple-950 placeholder-purple-400/80 pr-12"
            />
            <button className="absolute right-1.5 w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-700 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </div>
        </div>

        {/* CÁC NÚT TÁC VỤ (ĐĂNG NHẬP / GIỎ HÀNG) */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="flex items-center gap-2 text-purple-950 hover:text-purple-600 transition-colors group">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 group-hover:bg-purple-100 transition-colors">
              <span className="material-symbols-outlined text-lg">person</span>
            </div>
            <span className="text-sm font-semibold hidden md:block">Đăng nhập</span>
          </Link>

          <div className="flex items-center gap-2 text-purple-950 hover:text-purple-600 transition-colors cursor-pointer group relative">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 group-hover:bg-purple-100 transition-colors relative">
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              {/* HUY HIỆU SỐ LƯỢNG SẢN PHẨM TRONG GIỎ HÀNG */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                2
              </span>
            </div>
            <span className="text-sm font-semibold hidden md:block">Giỏ hàng</span>
          </div>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG DANH MUC (NAVIGATION TABS) */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-none border-t border-purple-50/50 pt-1">
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.name}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(cat.id);
                }
              }}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${
                isActive
                  ? 'text-purple-700 font-bold'
                  : 'text-purple-950/70 hover:text-purple-950'
              }`}
            >
              {cat.name}
              {/* ĐƯỜNG GẠCH CHÂN ĐÁNH DẤU TAB ĐANG HOẠT ĐỘNG */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full layout-id-tab-indicator" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
