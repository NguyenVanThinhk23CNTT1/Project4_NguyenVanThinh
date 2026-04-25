from sqlalchemy import select
from app.db.connection import engine
from app.models.schema import user

def check_users():
    stmt = select(user)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        users = result.fetchall()
        print(f"Total users found: {len(users)}")
        for u in users:
            try:
                row_dict = dict(u._mapping)
            except AttributeError:
                row_dict = dict(u)
            print(f"Email: {row_dict['G5_Email']}, Password: {row_dict['G5_MatKhau']}, Role: {row_dict['G5_VaiTro']}")

if __name__ == "__main__":
    check_users()
