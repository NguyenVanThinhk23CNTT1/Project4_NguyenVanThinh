import os

pages_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'frontend', 'src', 'pages', 'admin')

for root, dirs, files in os.walk(pages_dir):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if '\\n' in content:
                # Replace literal backslash-n with actual newline
                content = content.replace('\\n', '\n')
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed: {file}")

print("Done fixing JSX files.")
