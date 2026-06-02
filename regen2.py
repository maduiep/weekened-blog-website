def fix_dashboard():
    with open('src/components/dashboard/DashboardOverview.jsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines):
        if line.strip() == '</>' and lines[i+1].strip() == '</>':
            lines.pop(i)
            break
            
    with open('src/components/dashboard/DashboardOverview.jsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
        
fix_dashboard()
