import os

def clean_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove trailing `{/* ... */}` and `)}` and `</>` from the JSX blocks before `</>\n  );\n}`
    # Instead of regex, let's just find the `    </>\n  );\n}` and clean up the string right before it.
    
    parts = content.split('    </>\n  );\n}')
    if len(parts) == 2:
        body = parts[0]
        # Remove trailing `)}` from body
        body = body.rstrip()
        if body.endswith(')}'):
            body = body[:-2].rstrip()
            
        # remove anything like `{/* ADVERTS & CORPORATE */}` at the end
        if body.endswith('}'):
            # This might be tricky, let's use a simpler heuristic
            pass
            
        # specifically for DashboardSubscription.jsx
        if "ADVERTS & CORPORATE" in body:
            body = body.split('{/* ADVERTS & CORPORATE */}')[0].rstrip()
            
        if "LIBRARY" in body:
            body = body.split('{/* LIBRARY */}')[0].rstrip()
            
        if "SETTINGS" in body:
            body = body.split('{/* SETTINGS */}')[0].rstrip()
            
        if body.endswith(')}'):
            body = body[:-2].rstrip()
            
        if body.endswith('</>'):
            body = body[:-3].rstrip()
            
        new_content = body + '\n    </>\n  );\n}'
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Cleaned", path)

clean_file('src/components/dashboard/DashboardOverview.jsx')
clean_file('src/components/dashboard/DashboardSubscription.jsx')
clean_file('src/components/dashboard/DashboardAdverts.jsx')
clean_file('src/components/dashboard/DashboardLibrary.jsx')

# Fix AdminOverview.jsx syntax error at line 6
with open('src/components/admin/AdminOverview.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
new_lines = []
for line in lines:
    if line.strip().startswith('import { useSt'):
        continue
    new_lines.append(line)
    
with open('src/components/admin/AdminOverview.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Cleaned src/components/admin/AdminOverview.jsx")
