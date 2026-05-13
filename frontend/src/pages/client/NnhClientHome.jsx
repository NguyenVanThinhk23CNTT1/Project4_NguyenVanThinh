import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NnhClientHeader from '../components/NnhClientHeader';
import NnhClientFooter from '../components/NnhClientFooter';
import { shopApi } from '../../api/client/tta_shop.api';

export default function NnhClientHome() {
  // Trạng thái lưu trữ danh sách sản phẩm lấy từ API
  const [products, setProducts] = useState([]);
  // Trạng thái tải dữ liệu (loading)
  const [loading, setLoading] = useState(true);
  // Trạng thái danh mục đang được chọn để lọc sản phẩm
  const [selectedCategory, setSelectedCategory] = useState('');

  // Hàm gọi API lấy danh sách sản phẩm công khai khi trang được tải
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await shopApi.getProducts();
        if (res.data?.data?.items) {
          setProducts(res.data.data.items);
        } else if (res.data?.data) {
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error('Lỗi lấy sản phẩm công khai:', err);
        // Dữ liệu sản phẩm mẫu (fallback) trong trường hợp không kết nối được API
        setProducts([
          {
            G5_MaSP: 1,
            G5_TenSP: 'iPhone 15 Pro Max 256GB',
            G5_Gia: 28990000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Điện thoại',
            discount: '-10%',
          },
          {
            G5_MaSP: 2,
            G5_TenSP: 'MacBook Air M2 2023 15 inch',
            G5_Gia: 24990000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Laptop',
            discount: '-20%',
          },
          {
            G5_MaSP: 3,
            G5_TenSP: 'AirPods Pro 2 USB-C',
            G5_Gia: 5490000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Tai nghe',
            discount: '-15%',
          },
          {
            G5_MaSP: 4,
            G5_TenSP: 'Apple Watch Series 9 GPS 41mm',
            G5_Gia: 8490000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Đồng hồ',
            discount: '-20%',
          },
          {
            G5_MaSP: 5,
            G5_TenSP: 'Samsung Galaxy S24 Ultra 512GB',
            G5_Gia: 23990000,
            G5_HinhAnh: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
            G5_TenDanhMuc: 'Điện thoại',
            discount: '-10%',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm hỗ trợ chuẩn hóa đường dẫn hình ảnh sản phẩm
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  // Hàm định dạng giá tiền tệ Việt Nam Đồng (VND)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Cấu trúc danh sách danh mục hiển thị dạng biểu tượng tròn theo bản thiết kế
  const categoriesList = [
    { name: 'Điện thoại', icon: 'smartphone', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop' },
    { name: 'Laptop', icon: 'laptop_mac', img: 'https://images.unsplash.com/photo-1496181130329-d50675f07ac5?q=80&w=200&auto=format&fit=crop' },
    { name: 'Tai nghe', icon: 'headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop' },
    { name: 'Đồng hồ', icon: 'watch', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' },
    { name: 'Phụ kiện', icon: 'cable', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200&auto=format&fit=crop' },
    { name: 'Sạc dự phòng', icon: 'battery_charging_full', img: 'https://images.unsplash.com/photo-1609592424086-3b1029ba7d26?q=80&w=200&auto=format&fit=crop' },
    { name: 'Loa Bluetooth', icon: 'speaker', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200&auto=format&fit=crop' },
    { name: 'Máy tính bảng', icon: 'tablet_mac', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200&auto=format&fit=crop' },
  ];

  // Lọc sản phẩm theo danh mục đang được người dùng chọn
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.G5_TenDanhMuc?.toLowerCase().includes(selectedCategory.toLowerCase()) || p.G5_TenSP?.toLowerCase().includes(selectedCategory.toLowerCase()))
    : products;

  // Xử lý sự kiện khi người dùng bấm nút "Thêm vào giỏ hàng"
  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.G5_TenSP}" vào giỏ hàng thành công!`);
  };

  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col selection:bg-purple-100 text-slate-800">
      {/* PHẦN HEADER & THANH CHỌN DANH MỤC TÍCH HỢP ĐỒNG BỘ */}
      <NnhClientHeader selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT) */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 md:px-8 py-6 space-y-10">
        {/* KHU VỰC BANNER HERO NỔI BẬT (Chỉ hiển thị ở Trang chủ khi không chọn danh mục cụ thể) */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* BANNER CHÍNH BÊN TRÁI (SẢN PHẨM HOT) */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4c1d95] p-8 md:p-12 flex flex-col justify-between shadow-xl min-h-[380px] group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
              
              <div className="relative z-10 max-w-sm space-y-4">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/10">
                  Siêu phẩm ra mắt
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk']">
                  iPhone 15 Pro Max
                </h1>
                <p className="text-white/90 text-base md:text-lg font-medium">
                  Titan. Mạnh mẽ. Đột phá.
                </p>
                <div className="pt-2">
                  <p className="text-white/80 text-xs">Giá ưu đãi từ</p>
                  <p className="text-white text-2xl font-bold font-['Space_Grotesk']">28.990.000đ</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSelectedCategory('Điện thoại')}
                    className="px-8 py-3 rounded-full bg-white text-purple-700 font-bold hover:bg-purple-50 hover:scale-105 transition-all shadow-md text-sm"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>

              {/* HÌNH ẢNH SẢN PHẨM NỔI BẬT NẰM Ở GÓC PHẢI BANNER */}
              <div className="absolute right-[-40px] bottom-[-20px] w-[55%] h-full max-w-[340px] hidden sm:block transition-transform duration-700 group-hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop"
                  alt="iPhone 15 Pro Max"
                  className="w-full h-full object-cover object-left mask-image-gradient drop-shadow-2xl rounded-l-3xl"
                />
              </div>
            </div>

            {/* CÁC BANNER KHUYẾN MÃI XẾP DỌC BÊN PHẢI */}
            <div className="flex flex-col gap-6 justify-between">
              {/* BANNER PHỤ TRÊN (AIRPODS) */}
              <div className="flex-1 relative overflow-hidden rounded-2xl bg-[#f3e8ff] p-6 flex items-center justify-between group cursor-pointer border border-purple-100 hover:shadow-md transition-all">
                <div className="space-y-3 relative z-10 max-w-[150px]">
                  <h3 className="font-bold text-purple-950 text-lg leading-tight font-['Space_Grotesk']">
                    AirPods Pro 2
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-purple-600 text-white font-bold text-xs rounded-md">
                    Giảm 15%
                  </span>
                  <div>
                    <button
                      onClick={() => setSelectedCategory('Tai nghe')}
                      className="mt-2 px-4 py-1.5 rounded-full bg-purple-700 text-white font-semibold text-xs hover:bg-purple-800 transition-colors"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>

                <div className="absolute right-2 bottom-2 w-28 h-28 group-hover:scale-110 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=300&auto=format&fit=crop"
                    alt="AirPods Pro 2"
                    className="w-full h-full object-cover rounded-full drop-shadow-md"
                  />
                </div>
              </div>

              {/* BANNER PHỤ DƯỚI (APPLE WATCH) */}
              <div className="flex-1 relative overflow-hidden rounded-2xl bg-[#e0e7ff] p-6 flex items-center justify-between group cursor-pointer border border-indigo-100 hover:shadow-md transition-all">
                <div className="space-y-3 relative z-10 max-w-[150px]">
                  <h3 className="font-bold text-indigo-950 text-lg leading-tight font-['Space_Grotesk']">
                    Apple Watch Series 9
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-indigo-600 text-white font-bold text-xs rounded-md">
                    Giảm 10%
                  </span>
                  <div>
                    <button
                      onClick={() => setSelectedCategory('Đồng hồ')}
                      className="mt-2 px-4 py-1.5 rounded-full bg-indigo-700 text-white font-semibold text-xs hover:bg-indigo-800 transition-colors"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>

                <div className="absolute right-2 bottom-2 w-28 h-28 group-hover:scale-110 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop"
                    alt="Apple Watch Series 9"
                    className="w-full h-full object-cover rounded-full drop-shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THANH CAM KẾT CHẤT LƯỢNG (TRUST BADGES / FEATURES) */}
        <div className="bg-[#f8f5ff] border border-purple-100 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Miễn phí giao hàng</p>
              <p className="text-xs text-purple-600/80">Cho đơn từ 500k</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">security</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Thanh toán an toàn</p>
              <p className="text-xs text-purple-600/80">100% bảo mật</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">cached</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Đổi trả dễ dàng</p>
              <p className="text-xs text-purple-600/80">Trong 7 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">support_agent</span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-purple-950">Hỗ trợ 24/7</p>
              <p className="text-xs text-purple-600/80">1900 1234</p>
            </div>
          </div>
        </div>

        {/* DANH SÁCH DANH MỤC TRÒN NỔI BẬT (CIRCULAR CATEGORIES) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">Danh mục sản phẩm</h2>
            <button
              onClick={() => setSelectedCategory('')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
            >
              Xem tất cả <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 pt-2">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.name)}
                  className="flex flex-col items-center gap-2 cursor-pointer group text-center"
                >
                  {/* HÌNH ẢNH HOẶC ICON DANH MỤC BO TRÒN */}
                  <div
                    className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-purple-600 shadow-md ring-2 ring-purple-100 scale-105'
                        : 'border-transparent bg-slate-100 group-hover:bg-purple-50 group-hover:border-purple-200'
                    }`}
                  >
                    {cat.img ? (
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-purple-600 text-2xl transition-colors">
                        {cat.icon}
                      </span>
                    )}
                  </div>
                  {/* TÊN DANH MỤC */}
                  <span
                    className={`text-xs transition-colors line-clamp-1 px-1 ${
                      isSelected ? 'font-bold text-purple-700' : 'font-medium text-slate-600 group-hover:text-purple-600'
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* LƯỚI SẢN PHẨM BÁN CHẠY HOẶC SẢN PHẨM ĐƯỢC LỌC (PRODUCTS GRID) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
              {selectedCategory ? (
                <>
                  <span className="material-symbols-outlined text-purple-600">filter_alt</span>
                  Sản phẩm: <span className="text-purple-600">{selectedCategory}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-purple-600">local_fire_department</span>
                  Sản phẩm bán chạy
                </>
              )}
            </h2>
            {/* NÚT XÓA BỘ LỌC KHI ĐANG LỌC THEO DANH MỤC */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* HIỂN THỊ LƯỚI SẢN PHẨM TRÊN GIAO DIỆN */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              {/* TRƯỜNG HỢP KHÔNG TÌM THẤY SẢN PHẨM TRONG DANH MỤC */}
              <span className="material-symbols-outlined text-4xl text-slate-400">inventory_2</span>
              <p className="text-slate-500 text-sm font-medium">Không tìm thấy sản phẩm nào trong danh mục này.</p>
              <button
                onClick={() => setSelectedCategory('')}
                className="text-xs font-bold text-purple-600 underline"
              >
                Quay lại trang chủ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* DANH SÁCH THẺ SẢN PHẨM */}
              {filteredProducts.map((prod, index) => {
                // Tự động phân bổ phần trăm giảm giá mẫu cao cấp cho từng sản phẩm
                const discountPills = ['-10%', '-20%', '-15%', '-20%'];
                const badgeText = prod.discount || discountPills[index % discountPills.length];
                const discountRate = parseInt(badgeText.replace('-', '').replace('%', '')) / 100 || 0.1;
                const price = prod.G5_Gia || 15000000;
                // Tính toán giá gốc dựa trên tỷ lệ giảm giá
                const oldPrice = price / (1 - discountRate);

                return (
                  <div
                    key={prod.G5_MaSP || index}
                    className="group bg-white border border-slate-100/80 hover:border-purple-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    {/* HUY HIỆU GIẢM GIÁ (DISCOUNT PILL) */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-purple-600 text-white font-bold text-[10px] rounded tracking-wide z-10 shadow-sm">
                      {badgeText}
                    </span>

                    {/* KHU VỰC HÌNH ẢNH SẢN PHẨM CÓ HIỆU ỨNG ZOOM KHI HOVER */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 mb-3">
                      <img
                        src={getImageUrl(prod.G5_HinhAnh)}
                        alt={prod.G5_TenSP}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* THÔNG TIN CHI TIẾT SẢN PHẨM */}
                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      {/* TÊN SẢN PHẨM TỐI ĐA 2 DÒNG */}
                      <h3
                        title={prod.G5_TenSP}
                        className="font-bold text-xs md:text-sm text-slate-800 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug cursor-pointer"
                      >
                        {prod.G5_TenSP}
                      </h3>

                      {/* KHU VỰC GIÁ VÀ NÚT THÊM VÀO GIỎ HÀNG */}
                      <div className="flex items-end justify-between pt-2">
                        <div>
                          {/* GIÁ KHUYẾN MÃI (CHÍNH) */}
                          <p className="text-purple-600 font-extrabold text-sm md:text-base font-['Space_Grotesk'] leading-none">
                            {formatPrice(price)}
                          </p>
                          {/* GIÁ GỐC BỊ GẠCH NGANG */}
                          <p className="text-slate-400 line-through text-[10px] md:text-xs pt-1">
                            {formatPrice(oldPrice)}
                          </p>
                        </div>

                        {/* NÚT THÊM VÀO GIỎ HÀNG HÌNH TRÒN */}
                        <button
                          onClick={() => handleAddToCart(prod)}
                          title="Thêm vào giỏ hàng"
                          className="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 flex items-center justify-center transition-colors border border-purple-100/50"
                        >
                          <span className="material-symbols-outlined text-sm md:text-base">add_shopping_cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* PHẦN CHÂN TRANG (FOOTER) */}
      <NnhClientFooter />
    </div>
  );
}
