import os

app_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'frontend', 'src', 'App.jsx')

with open(app_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Thay thế chuỗi "\n" (literal backslash n) bằng ký tự xuống dòng thật '\n'
content = content.replace('\\n', '\n')

with open(app_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Đã fix lỗi \\n trong App.jsx")
