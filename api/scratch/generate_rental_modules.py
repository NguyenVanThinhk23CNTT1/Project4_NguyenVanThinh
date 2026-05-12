import os

# Đường dẫn cơ bản
base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app')
modules_dir = os.path.join(base_dir, 'modules')
routes_dir = os.path.join(base_dir, 'routes', 'admin')

# Thông tin các module
modules = {
    'tta_sanpham_thue': {
        'schema': 'sanpham_thue',
        'table': 'sanpham_thue',
        'id_col': 'G5_Id',
        'fields': ['G5_Id', 'G5_MaSanPham', 'G5_GiaThueNgay', 'G5_GiaThueGio', 'G5_SoLuongChoThue', 'G5_TienCoc']
    },
    'tta_donhang_thue': {
        'schema': 'donhang_thue',
        'table': 'donhang_thue',
        'id_col': 'G5_MaDonThue',
        'fields': ['G5_MaDonThue', 'G5_MaNguoiDung', 'G5_MaNhanVien', 'G5_NgayBatDau', 'G5_NgayKetThuc', 'G5_TongTien', 'G5_TrangThai', 'G5_TienCoc', 'G5_TrangThaiThanhToan', 'G5_NgayTraThucTe', 'G5_IsDeleted']
    },
    'tta_chitiet_donhang_thue': {
        'schema': 'chitiet_donhang_thue',
        'table': 'chitiet_donhang_thue',
        'id_col': 'G5_Id',
        'fields': ['G5_Id', 'G5_MaDonThue', 'G5_MaSanPham', 'G5_SoLuong', 'G5_GiaThue']
    },
    'tta_lich_su_thue': {
        'schema': 'lich_su_thue',
        'table': 'lich_su_thue',
        'id_col': 'G5_Id',
        'fields': ['G5_Id', 'G5_MaSanPham', 'G5_MaDonThue', 'G5_TrangThai', 'G5_ThoiDiem']
    }
}

for mod_name, info in modules.items():
    # Tạo thư mục module
    mod_path = os.path.join(modules_dir, mod_name)
    os.makedirs(mod_path, exist_ok=True)
    
    with open(os.path.join(mod_path, '__init__.py'), 'w', encoding='utf-8') as f:
        f.write('')
        
    # Tạo repo
    repo_code = f"""from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import {info['schema']}

def get_all(params=None):
    stmt = select({info['schema']})
    
    if params and params.get('q'):
        # Thay đổi logic search tùy theo bảng
        pass
        
    if 'G5_IsDeleted' in [c.name for c in {info['schema']}.columns]:
        stmt = stmt.where({info['schema']}.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by({info['schema']}.c.{info['id_col']}.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [dict(row._mapping) for row in result]
        return {{"items": items, "total": len(items)}}

def get_by_id(id):
    stmt = select({info['schema']}).where({info['schema']}.c.{info['id_col']} == id)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        return dict(row._mapping)

def create(data):
    stmt = insert({info['schema']}).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_item(id, data):
    stmt = update({info['schema']}).where({info['schema']}.c.{info['id_col']} == id).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_item(id):
    if 'G5_IsDeleted' in [c.name for c in {info['schema']}.columns]:
        stmt = update({info['schema']}).where({info['schema']}.c.{info['id_col']} == id).values(G5_IsDeleted=1)
    else:
        stmt = delete({info['schema']}).where({info['schema']}.c.{info['id_col']} == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
"""
    with open(os.path.join(mod_path, f"{mod_name}_repo.py"), 'w', encoding='utf-8') as f:
        f.write(repo_code)
        
    # Tạo service
    service_code = f"""from app.modules.{mod_name} import {mod_name}_repo as repo

def get_all(params=None):
    return repo.get_all(params)

def get_by_id(id):
    return repo.get_by_id(id)

def create(data):
    return repo.create(data)

def update(id, data):
    return repo.update_item(id, data)

def delete(id):
    return repo.delete_item(id)
"""
    with open(os.path.join(mod_path, f"{mod_name}_service.py"), 'w', encoding='utf-8') as f:
        f.write(service_code)
        
    # Tạo route
    route_code = f"""from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.modules.{mod_name} import {mod_name}_service as service
from app.utils.helpers import response_success, response_error

{mod_name}_admin_bp = Blueprint("{mod_name}_admin", __name__)

def is_admin():
    claims = get_jwt()
    return claims.get("vai_tro") == "admin"

@{mod_name}_admin_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    if not is_admin(): return response_error("Không có quyền truy cập.", 403)
    params = request.args.to_dict()
    data = service.get_all(params)
    return response_success(data=data)

@{mod_name}_admin_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    if not is_admin(): return response_error("Không có quyền truy cập.", 403)
    data = service.get_by_id(id)
    if not data: return response_error("Không tồn tại.", 404)
    return response_success(data=data)

@{mod_name}_admin_bp.route("", methods=["POST"])
@jwt_required()
def create():
    if not is_admin(): return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.create(data)
    return response_success(message="Thêm thành công.")

@{mod_name}_admin_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    if not is_admin(): return response_error("Không có quyền truy cập.", 403)
    data = request.get_json()
    service.update(id, data)
    return response_success(message="Cập nhật thành công.")

@{mod_name}_admin_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    if not is_admin(): return response_error("Không có quyền truy cập.", 403)
    service.delete(id)
    return response_success(message="Xóa thành công.")
"""
    with open(os.path.join(routes_dir, f"{mod_name}_route.py"), 'w', encoding='utf-8') as f:
        f.write(route_code)

print("Đã tạo thành công các thư mục, file repo, service, và routes.")
