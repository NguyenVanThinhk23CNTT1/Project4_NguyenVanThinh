import os

base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app')
modules_dir = os.path.join(base_dir, 'modules')
init_file = os.path.join(base_dir, 'core', '__init__.py')

modules = {
    'tta_dichvu_tuvan': {'schema': 'dichvu_tuvan', 'id_col': 'G5_Id', 'class_prefix': 'DichVuTuVan', 'route': '/api/tta_dichvu_tuvan'},
    'tta_lich_tuvan': {'schema': 'lich_tuvan', 'id_col': 'G5_Id', 'class_prefix': 'LichTuVan', 'route': '/api/tta_lich_tuvan'},
    'tta_lich_tuvan_nhanvien': {'schema': 'lich_tuvan_nhanvien', 'id_col': 'G5_Id', 'class_prefix': 'LichTuVanNhanVien', 'route': '/api/tta_lich_tuvan_nhanvien'},
    'tta_sanpham_hinhanh': {'schema': 'sanpham_hinhanh', 'id_col': 'G5_Id', 'class_prefix': 'SanPhamHinhAnh', 'route': '/api/tta_sanpham_hinhanh'},
    'tta_uservoucher': {'schema': 'uservoucher', 'id_col': 'G5_Id', 'class_prefix': 'UserVoucher', 'route': '/api/tta_uservoucher'},
    'tta_giohangtam': {'schema': 'giohangtam', 'id_col': 'G5_Id', 'class_prefix': 'GioHangTam', 'route': '/api/tta_giohangtam'}
}

# 1. Tạo repo & service
for mod_name, info in modules.items():
    mod_path = os.path.join(modules_dir, mod_name)
    os.makedirs(mod_path, exist_ok=True)
    
    with open(os.path.join(mod_path, '__init__.py'), 'w', encoding='utf-8') as f:
        f.write('')
        
    repo_code = f"""from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import {info['schema']}

def get_all(params=None):
    stmt = select({info['schema']})
    
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
        
    resource_code = f"""from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.{mod_name} import {mod_name}_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required

class {info['class_prefix']}ListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        service.create(data)
        return response_success(message="Thêm thành công.")

class {info['class_prefix']}Resource(Resource):
    @jwt_required()
    @admin_required
    def get(self, id):
        data = service.get_by_id(id)
        if not data:
            return response_error("Không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    def put(self, id):
        data = request.get_json()
        service.update(id, data)
        return response_success(message="Cập nhật thành công.")

    @jwt_required()
    @admin_required
    def delete(self, id):
        service.delete(id)
        return response_success(message="Xóa thành công.")
"""
    with open(os.path.join(mod_path, f"{mod_name}_resource.py"), 'w', encoding='utf-8') as f:
        f.write(resource_code)

# 2. Patch __init__.py
with open(init_file, 'r', encoding='utf-8') as f:
    content = f.read()

registration_block = "\n    # Rest modules resources\n"
for mod_name, info in modules.items():
    registration_block += f"    from app.modules.{mod_name}.{mod_name}_resource import {info['class_prefix']}ListResource, {info['class_prefix']}Resource\n"
    registration_block += f"    api.add_resource({info['class_prefix']}ListResource, '{info['route']}')\n"
    registration_block += f"    api.add_resource({info['class_prefix']}Resource, '{info['route']}/<int:id>')\n"

if "# Rest modules resources" not in content:
    content = content.replace("    # Dashboard resources", registration_block + "\n    # Dashboard resources")
    with open(init_file, 'w', encoding='utf-8') as f:
        f.write(content)
