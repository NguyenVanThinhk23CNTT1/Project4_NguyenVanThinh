import os

base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app')
modules_dir = os.path.join(base_dir, 'modules')
init_file = os.path.join(base_dir, 'core', '__init__.py')

modules = {
    'tta_sanpham_thue': {'class_prefix': 'SanPhamThue', 'route': '/api/tta_sanpham_thue'},
    'tta_donhang_thue': {'class_prefix': 'DonHangThue', 'route': '/api/tta_donhang_thue'},
    'tta_chitiet_donhang_thue': {'class_prefix': 'ChiTietDonHangThue', 'route': '/api/tta_chitiet_donhang_thue'},
    'tta_lich_su_thue': {'class_prefix': 'LichSuThue', 'route': '/api/tta_lich_su_thue'}
}

# 1. Tạo files _resource.py
for mod_name, info in modules.items():
    mod_path = os.path.join(modules_dir, mod_name)
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

registration_block = "\n    # Thue resources\n"
for mod_name, info in modules.items():
    registration_block += f"    from app.modules.{mod_name}.{mod_name}_resource import {info['class_prefix']}ListResource, {info['class_prefix']}Resource\n"
    registration_block += f"    api.add_resource({info['class_prefix']}ListResource, '{info['route']}')\n"
    registration_block += f"    api.add_resource({info['class_prefix']}Resource, '{info['route']}/<int:id>')\n"

if "# Thue resources" not in content:
    content = content.replace("    # Dashboard resources", registration_block + "\n    # Dashboard resources")
    with open(init_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Đã thêm routes vào __init__.py")
else:
    print("Routes đã tồn tại trong __init__.py")

print("Hoàn thành!")
