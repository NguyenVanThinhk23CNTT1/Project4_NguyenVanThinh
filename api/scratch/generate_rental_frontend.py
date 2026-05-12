import os

base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'frontend', 'src')
api_dir = os.path.join(base_dir, 'api', 'admin')
pages_dir = os.path.join(base_dir, 'pages', 'admin')
app_file = os.path.join(base_dir, 'App.jsx')

modules = {
    'thue_sanpham': {
        'api_name': 'sanphamThueApi',
        'endpoint': '/api/tta_sanpham_thue',
        'comp_prefix': 'NnhThueSanPham',
        'path_prefix': 'sanpham-thue',
        'title': 'Sản Phẩm Thuê',
        'id_col': 'G5_Id',
        'cols': [
            {'key': 'G5_Id', 'label': 'ID'},
            {'key': 'G5_MaSanPham', 'label': 'Mã SP'},
            {'key': 'G5_GiaThueNgay', 'label': 'Giá Ngày'},
            {'key': 'G5_SoLuongChoThue', 'label': 'Số Lượng'},
        ]
    },
    'thue_donhang': {
        'api_name': 'donhangThueApi',
        'endpoint': '/api/tta_donhang_thue',
        'comp_prefix': 'NnhThueDonHang',
        'path_prefix': 'donhang-thue',
        'title': 'Đơn Hàng Thuê',
        'id_col': 'G5_MaDonThue',
        'cols': [
            {'key': 'G5_MaDonThue', 'label': 'Mã Đơn'},
            {'key': 'G5_MaNguoiDung', 'label': 'Người Dùng'},
            {'key': 'G5_TongTien', 'label': 'Tổng Tiền'},
            {'key': 'G5_TrangThai', 'label': 'Trạng Thái'},
        ]
    },
    'thue_chitiet': {
        'api_name': 'chitietThueApi',
        'endpoint': '/api/tta_chitiet_donhang_thue',
        'comp_prefix': 'NnhThueChiTiet',
        'path_prefix': 'chitiet-thue',
        'title': 'Chi Tiết Đơn Thuê',
        'id_col': 'G5_Id',
        'cols': [
            {'key': 'G5_Id', 'label': 'ID'},
            {'key': 'G5_MaDonThue', 'label': 'Mã Đơn'},
            {'key': 'G5_MaSanPham', 'label': 'Mã SP'},
            {'key': 'G5_SoLuong', 'label': 'Số Lượng'},
        ]
    },
    'thue_lichsu': {
        'api_name': 'lichsuThueApi',
        'endpoint': '/api/tta_lich_su_thue',
        'comp_prefix': 'NnhThueLichSu',
        'path_prefix': 'lichsu-thue',
        'title': 'Lịch Sử Thuê',
        'id_col': 'G5_Id',
        'cols': [
            {'key': 'G5_Id', 'label': 'ID'},
            {'key': 'G5_MaDonThue', 'label': 'Mã Đơn'},
            {'key': 'G5_TrangThai', 'label': 'Trạng Thái'},
            {'key': 'G5_ThoiDiem', 'label': 'Thời Điểm'},
        ]
    }
}

# 1. Generate API file
os.makedirs(api_dir, exist_ok=True)
api_content = "import axios from '../tta_axios';\n\n"
for k, v in modules.items():
    api_content += f"export const {v['api_name']} = {{\n"
    api_content += f"  getAll: (params) => axios.get('{v['endpoint']}', {{ params }}),\n"
    api_content += f"  create: (data) => axios.post('{v['endpoint']}', data),\n"
    api_content += f"  update: (id, data) => axios.put(`{v['endpoint']}/${{id}}`, data),\n"
    api_content += f"  delete: (id) => axios.delete(`{v['endpoint']}/${{id}}`),\n"
    api_content += "};\n\n"

with open(os.path.join(api_dir, 'tta_thue.api.js'), 'w', encoding='utf-8') as f:
    f.write(api_content)

# 2. Generate Components
def get_list_template(info):
    cols_th = "\n".join([f"                <th className={{`px-4 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ${{isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}}`}}>{c['label']}</th>" for c in info['cols']])
    cols_td = "\n".join([f"                <td className={{`px-4 py-3 border-b ${{isDark ? 'border-slate-700' : 'border-slate-200'}}`}}>{{item.{c['key']}}}</td>" for c in info['cols']])
    return f"""import React, {{ useState, useEffect }} from 'react';
import {{ Link }} from 'react-router-dom';
import {{ {info['api_name']} }} from '../../../api/admin/tta_thue.api';
import {{ useAdminTheme }} from '../../../hooks/useAdminTheme';

export default function {info['comp_prefix']}List() {{
  const isDark = useAdminTheme();
  const [data, setData] = useState([]);
  
  useEffect(() => {{
    loadData();
  }}, []);

  const loadData = async () => {{
    try {{
      const res = await {info['api_name']}.getAll();
      if (res.data?.success) setData(res.data.data.items || res.data.data);
    }} catch (err) {{
      console.error("Error loading data", err);
    }}
  }};

  const handleDelete = async (id) => {{
    if(window.confirm('Bạn có chắc chắn muốn xóa?')) {{
      try {{
        await {info['api_name']}.delete(id);
        loadData();
      }} catch (err) {{
        console.error("Error deleting", err);
      }}
    }}
  }};

  return (
    <div className={{`p-6 min-h-screen ${{isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}}`}}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={{`text-2xl font-bold ${{isDark ? 'text-white' : 'text-slate-900'}}`}}>{info['title']}</h1>
        <Link to="/admin/{info['path_prefix']}/them" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors">
          + Thêm Mới
        </Link>
      </div>
      <div className={{`rounded-lg shadow overflow-hidden ${{isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}}`}}>
        <table className="min-w-full">
          <thead className={{isDark ? 'bg-slate-800/50' : 'bg-gray-50'}}>
            <tr>
{cols_th}
              <th className={{`px-4 py-3 border-b text-right text-xs font-semibold uppercase tracking-wider ${{isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}}`}}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {{data.map((item) => (
              <tr key={{item.{info['id_col']}}} className={{`transition-colors ${{isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}}`}}>
{cols_td}
                <td className={{`px-4 py-3 border-b text-right ${{isDark ? 'border-slate-700' : 'border-slate-200'}}`}}>
                  <Link to={{`/admin/{info['path_prefix']}/edit/${{item.{info['id_col']}}}`}} className="text-blue-500 hover:text-blue-400 mr-4 font-medium">Sửa</Link>
                  <button onClick={{() => handleDelete(item.{info['id_col']})}} className="text-rose-500 hover:text-rose-400 font-medium">Xóa</button>
                </td>
              </tr>
            ))}}
          </tbody>
        </table>
      </div>
    </div>
  );
}}
"""

def get_form_template(info, is_edit=False):
    action = "Sửa" if is_edit else "Thêm"
    fields = "\n".join([f"""        <div className="mb-4">
          <label className={{`block text-sm font-medium mb-1 ${{isDark ? 'text-slate-300' : 'text-slate-700'}}`}}>{c['label']}</label>
          <input type="text" name="{c['key']}" value={{formData.{c['key']} || ''}} onChange={{handleChange}} className={{`w-full p-2 rounded border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${{isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}}`}} />
        </div>""" for c in info['cols'] if c['key'] != info['id_col']])
        
    return f"""import React, {{ useState, useEffect }} from 'react';
import {{ useNavigate, useParams }} from 'react-router-dom';
import {{ {info['api_name']} }} from '../../../api/admin/tta_thue.api';
import {{ useAdminTheme }} from '../../../hooks/useAdminTheme';

export default function {info['comp_prefix']}{"Sua" if is_edit else "Them"}() {{
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const {{ id }} = useParams();
  const [formData, setFormData] = useState({{}});

  useEffect(() => {{
    if ({'true' if is_edit else 'false'} && id) {{
      {info['api_name']}.getAll().then(res => {{
        if(res.data?.success) {{
          const items = res.data.data.items || res.data.data;
          const item = items.find(x => String(x.{info['id_col']}) === String(id));
          if(item) setFormData(item);
        }}
      }});
    }}
  }}, [id]);

  const handleChange = (e) => {{
    setFormData({{ ...formData, [e.target.name]: e.target.value }});
  }};

  const handleSubmit = async (e) => {{
    e.preventDefault();
    try {{
      if ({'true' if is_edit else 'false'}) {{
        await {info['api_name']}.update(id, formData);
      }} else {{
        await {info['api_name']}.create(formData);
      }}
      navigate('/admin/{info['path_prefix']}');
    }} catch (err) {{
      console.error("Error saving data", err);
      alert("Có lỗi xảy ra");
    }}
  }};

  return (
    <div className={{`p-6 min-h-screen ${{isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}}`}}>
      <div className="max-w-2xl mx-auto">
        <h1 className={{`text-2xl font-bold mb-6 ${{isDark ? 'text-white' : 'text-slate-900'}}`}}>{action} {info['title']}</h1>
        <form onSubmit={{handleSubmit}} className={{`p-6 rounded-lg shadow-xl border ${{isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}}`}}>
{fields}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={{() => navigate(-1)}} className={{`px-4 py-2 border rounded font-medium transition-colors ${{isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}}`}}>Hủy</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow transition-colors font-medium">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}}
"""

imports = []
routes = []

for mod_name, info in modules.items():
    mod_path = os.path.join(pages_dir, f"nnh_{mod_name}")
    os.makedirs(mod_path, exist_ok=True)
    
    # List
    with open(os.path.join(mod_path, f"nnh_{mod_name}_list.jsx"), 'w', encoding='utf-8') as f:
        f.write(get_list_template(info))
    
    # Them
    with open(os.path.join(mod_path, f"nnh_{mod_name}_them.jsx"), 'w', encoding='utf-8') as f:
        f.write(get_form_template(info, False))
        
    # Sua
    with open(os.path.join(mod_path, f"nnh_{mod_name}_sua.jsx"), 'w', encoding='utf-8') as f:
        f.write(get_form_template(info, True))
        
    imports.append(f"import {info['comp_prefix']}List from './pages/admin/nnh_{mod_name}/nnh_{mod_name}_list';")
    imports.append(f"import {info['comp_prefix']}Them from './pages/admin/nnh_{mod_name}/nnh_{mod_name}_them';")
    imports.append(f"import {info['comp_prefix']}Sua from './pages/admin/nnh_{mod_name}/nnh_{mod_name}_sua';")
    
    routes.append(f"            <Route path=\"{info['path_prefix']}\" element={{<{info['comp_prefix']}List />}} />")
    routes.append(f"            <Route path=\"{info['path_prefix']}/them\" element={{<{info['comp_prefix']}Them />}} />")
    routes.append(f"            <Route path=\"{info['path_prefix']}/edit/:id\" element={{<{info['comp_prefix']}Sua />}} />")

# 3. Patch App.jsx
with open(app_file, 'r', encoding='utf-8') as f:
    app_content = f.read()

if "NnhThueSanPhamList" not in app_content:
    import_block = "\\n".join(imports)
    app_content = app_content.replace("export default function App()", import_block + "\\n\\nexport default function App()")
    
    route_block = "\\n".join(routes)
    # Tìm chỗ chèn sau Route "voucher"
    app_content = app_content.replace(
        '<Route path="voucher/them"        element={<NnhVoucherThem />} />',
        '<Route path="voucher/them"        element={<NnhVoucherThem />} />\\n\\n' + route_block
    )
    
    with open(app_file, 'w', encoding='utf-8') as f:
        f.write(app_content)

print("Hoan thanh tao Frontend!")
