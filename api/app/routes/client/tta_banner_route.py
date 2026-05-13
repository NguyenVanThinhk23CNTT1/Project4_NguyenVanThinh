from flask import Blueprint, request
from app.modules.tta_banner import tta_banner_service as service
from app.utils.helpers import response_success

banner_client_bp = Blueprint("banner_client", __name__)

@banner_client_bp.route("", methods=["GET"])
def get_all():
    params = request.args.to_dict()
    data = service.get_all_banners(params)
    return response_success(data=data)
