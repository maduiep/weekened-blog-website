import subprocess

def fix():
    result = subprocess.run(['git', 'show', 'HEAD:src/pages/DashboardPage.jsx'], capture_output=True, text=True)
    lines = result.stdout.split('\n')
    
    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if '{activeTab === "overview" && (' in line:
            start_idx = i
        if '{activeTab === "subscription" && (' in line and start_idx != -1 and end_idx == -1:
            end_idx = i
            break
            
    if start_idx != -1 and end_idx != -1:
        jsx = '\n'.join(lines[start_idx+1:end_idx])
        jsx = jsx.strip()
        if jsx.startswith('<>'):
            jsx = jsx[2:]
        if jsx.endswith(')}'):
            jsx = jsx[:-2].strip()
        if jsx.endswith('</>'):
            jsx = jsx[:-3]
            
        code = f"""import {{ Link }} from "react-router-dom";
import {{ Clock, Database }} from "lucide-react";

export default function DashboardOverview({{ user, authUser, setActiveTab }}) {{
  return (
    <>
{jsx}
    </>
  );
}}
"""
        with open('src/components/dashboard/DashboardOverview.jsx', 'w', encoding='utf-8') as f:
            f.write(code)
        print("DashboardOverview.jsx regenerated.")

fix()
