from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from app.modules.tta_banner import tta_banner_service as service
from app.utils.helpers import response_success, response_error
from app.middleware.request_middleware import admin_required
from app.schemas.validation_schemas import BannerCreateSchema, BannerUpdateSchema, validate_schema

class BannerListResource(Resource):
    @jwt_required()
    @admin_required
    def get(self):
        params = request.args.to_dict()
        data = service.get_all_banners(params)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(BannerCreateSchema)
    def post(self):
        data = request.validated_data
        service.create_banner(data)
        return response_success(message="Thêm banner thành công.")

class BannerResource(Resource):
    @jwt_required()
    @admin_required
    def get(self, id):
        data = service.get_banner_detail(id)
        if not data:
            return response_error("Banner không tồn tại.", 404)
        return response_success(data=data)

    @jwt_required()
    @admin_required
    @validate_schema(BannerUpdateSchema)
    def put(self, id):
        data = request.validated_data
        service.update_banner(id, data)
        return response_success(message="Cập nhật banner thành công.")

    @jwt_required()
    @admin_required
    def delete(self, id):
        service.delete_banner(id)
        return response_success(message="Xóa banner thành công.")
