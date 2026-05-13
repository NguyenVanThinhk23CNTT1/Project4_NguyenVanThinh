import React from 'react';

export default function NnhClientBanners({ banners = [], selectedCategory = '', setSelectedCategory }) {
  // Hàm hỗ trợ chuẩn hóa URL ảnh từ Backend
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  // Lọc banner theo danh mục được chọn
  // Nếu đang chọn danh mục: lấy banner có TenDanhMuc tương ứng
  // Nếu ở trang chủ (không chọn danh mục): lấy banner dùng chung (MaDanhMuc là null hoặc rỗng)
  const currentBanners = banners.filter((b) => {
    if (selectedCategory) {
      return b.TenDanhMuc?.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    return !b.MaDanhMuc; // Banner toàn cục mặc định
  });

  // Nếu trong DB có banner phù hợp với danh mục hiện tại, sử dụng dữ liệu động
  if (currentBanners.length > 0) {
    const mainBanner = currentBanners[0];
    const subBanner1 = currentBanners[1] || null;
    const subBanner2 = currentBanners[2] || null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BANNER CHÍNH BÊN TRÁI từ CSDL */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4c1d95] p-8 md:p-12 flex flex-col justify-between shadow-xl min-h-[380px] group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          
          <div className="relative z-10 max-w-sm space-y-4">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/10">
              {selectedCategory ? `Danh mục: ${selectedCategory}` : 'Siêu phẩm nổi bật'}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk'] line-clamp-2">
              {mainBanner.TieuDe || (selectedCategory ? `Ưu đãi ${selectedCategory}` : 'Khuyến mãi đặc biệt')}
            </h1>
            <p className="text-white/90 text-base md:text-lg font-medium line-clamp-2">
              {mainBanner.MoTa || 'Trải nghiệm đỉnh cao công nghệ với mức giá vô cùng hấp dẫn.'}
            </p>
            
            {mainBanner.LinkRedirect && (
              <div className="pt-2">
                <a 
                  href={mainBanner.LinkRedirect.startsWith('http') ? mainBanner.LinkRedirect : `#`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-300 text-xs hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Xem chi tiết chương trình</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => {
                  if (mainBanner.TenDanhMuc && setSelectedCategory) {
                    setSelectedCategory(mainBanner.TenDanhMuc);
                  }
                }}
                className="px-8 py-3 rounded-full bg-white text-purple-700 font-bold hover:bg-purple-50 hover:scale-105 transition-all shadow-md text-sm"
              >
                Khám phá ngay
              </button>
            </div>
          </div>

          {/* HÌNH ẢNH BANNER ĐỘNG TỪ CSDL NẰM Ở GÓC PHẢI BANNER */}
          <div className="absolute right-[-20px] bottom-0 w-[55%] h-full max-w-[340px] hidden sm:block transition-transform duration-700 group-hover:scale-105">
            <img
              src={getImageUrl(mainBanner.UrlAnh)}
              alt={mainBanner.TieuDe || 'Banner'}
              className="w-full h-full object-contain object-right-bottom drop-shadow-2xl p-4"
            />
          </div>
        </div>

        {/* CÁC BANNER PHỤ XẾP DỌC BÊN PHẢI (Nếu có) */}
        {(subBanner1 || subBanner2) ? (
          <div className="flex flex-col gap-6 justify-between">
            {subBanner1 && (
              <div className="flex-1 relative overflow-hidden rounded-2xl bg-[#f3e8ff] p-6 flex items-center justify-between group cursor-pointer border border-purple-100 hover:shadow-md transition-all">
                <div className="space-y-3 relative z-10 max-w-[150px]">
                  <h3 className="font-bold text-purple-950 text-base md:text-lg leading-tight font-['Space_Grotesk'] line-clamp-2">
                    {subBanner1.TieuDe || 'Ưu đãi cực hot'}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-purple-600 text-white font-bold text-xs rounded-md line-clamp-1">
                    {subBanner1.MoTa || 'Giá siêu ưu đãi'}
                  </span>
                  <div>
                    <button
                      onClick={() => {
                        if (subBanner1.TenDanhMuc && setSelectedCategory) {
                          setSelectedCategory(subBanner1.TenDanhMuc);
                        }
                      }}
                      className="mt-2 px-4 py-1.5 rounded-full bg-purple-700 text-white font-semibold text-xs hover:bg-purple-800 transition-colors"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>

                <div className="absolute right-2 bottom-2 w-28 h-28 group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={getImageUrl(subBanner1.UrlAnh)}
                    alt={subBanner1.TieuDe || 'Promotion'}
                    className="w-full h-full object-cover rounded-full drop-shadow-md border-2 border-white"
                  />
                </div>
              </div>
            )}

            {subBanner2 ? (
              <div className="flex-1 relative overflow-hidden rounded-2xl bg-[#e0e7ff] p-6 flex items-center justify-between group cursor-pointer border border-indigo-100 hover:shadow-md transition-all">
                <div className="space-y-3 relative z-10 max-w-[150px]">
                  <h3 className="font-bold text-indigo-950 text-base md:text-lg leading-tight font-['Space_Grotesk'] line-clamp-2">
                    {subBanner2.TieuDe || 'Sản phẩm mới'}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-indigo-600 text-white font-bold text-xs rounded-md line-clamp-1">
                    {subBanner2.MoTa || 'Khám phá ngay'}
                  </span>
                  <div>
                    <button
                      onClick={() => {
                        if (subBanner2.TenDanhMuc && setSelectedCategory) {
                          setSelectedCategory(subBanner2.TenDanhMuc);
                        }
                      }}
                      className="mt-2 px-4 py-1.5 rounded-full bg-indigo-700 text-white font-semibold text-xs hover:bg-indigo-800 transition-colors"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>

                <div className="absolute right-2 bottom-2 w-28 h-28 group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={getImageUrl(subBanner2.UrlAnh)}
                    alt={subBanner2.TieuDe || 'Promotion'}
                    className="w-full h-full object-cover rounded-full drop-shadow-md border-2 border-white"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-dashed border-purple-200 flex flex-col items-center justify-center p-4 text-center">
                <span className="material-symbols-outlined text-purple-400 text-3xl mb-1">loyalty</span>
                <p className="text-xs text-purple-900 font-medium">Nhiều ưu đãi hấp dẫn khác đang chờ đón bạn</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 justify-between">
            {/* Fallback layout cột phụ nếu DB chỉ có 1 banner */}
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
                    onClick={() => setSelectedCategory?.('Tai nghe')}
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
                    onClick={() => setSelectedCategory?.('Đồng hồ')}
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
        )}
      </div>
    );
  }

  // Fallback mặc định hoàn hảo: Hiển thị form gốc theo thiết kế cao cấp khi danh mục chưa có banner riêng trong DB
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* BANNER CHÍNH BÊN TRÁI (SẢN PHẨM HOT) */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4c1d95] p-8 md:p-12 flex flex-col justify-between shadow-xl min-h-[380px] group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        
        <div className="relative z-10 max-w-sm space-y-4">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/10">
            {selectedCategory ? `Danh mục: ${selectedCategory}` : 'Siêu phẩm ra mắt'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk']">
            {selectedCategory ? `Ưu đãi ${selectedCategory}` : 'iPhone 15 Pro Max'}
          </h1>
          <p className="text-white/90 text-base md:text-lg font-medium">
            {selectedCategory ? 'Khám phá trọn bộ sưu tập cao cấp với giá ưu đãi.' : 'Titan. Mạnh mẽ. Đột phá.'}
          </p>
          {!selectedCategory && (
            <div className="pt-2">
              <p className="text-white/80 text-xs">Giá ưu đãi từ</p>
              <p className="text-white text-2xl font-bold font-['Space_Grotesk']">28.990.000đ</p>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => setSelectedCategory?.(selectedCategory || 'Điện thoại')}
              className="px-8 py-3 rounded-full bg-white text-purple-700 font-bold hover:bg-purple-50 hover:scale-105 transition-all shadow-md text-sm"
            >
              Mua ngay
            </button>
          </div>
        </div>

        {/* HÌNH ẢNH SẢN PHẨM NỔI BẬT NẰM Ở GÓC PHẢI BANNER */}
        <div className="absolute right-[-40px] bottom-[-20px] w-[55%] h-full max-w-[340px] hidden sm:block transition-transform duration-700 group-hover:scale-105">
          <img
            src={
              selectedCategory === 'Laptop'
                ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'
                : selectedCategory === 'Tai nghe'
                ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
                : selectedCategory === 'Đồng hồ'
                ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop'
            }
            alt="Hero product"
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
                onClick={() => setSelectedCategory?.('Tai nghe')}
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
                onClick={() => setSelectedCategory?.('Đồng hồ')}
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
  );
}
