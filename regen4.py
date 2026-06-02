import subprocess

def fix():
    result = subprocess.run(['git', 'show', 'HEAD:src/pages/DashboardPage.jsx'], capture_output=True, text=True)
    lines = result.stdout.split('\n')
    
    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if '{activeTab === "overview" && (' in line:
            start_idx = i
        if '{activeTab === "subscription" && (' in line:
            end_idx = i
            break
            
    # The block inside `overview` is between start_idx and end_idx
    block_lines = lines[start_idx+1:end_idx]
    
    # We want to remove the opening `<>` and closing `</>` and `)}` and `{/* PLAN & BILLING */}`
    # The first line should be `              <>`
    if '<>' in block_lines[0]:
        block_lines = block_lines[1:]
        
    # The last few lines are:
    #             )}
    #
    #             {/* PLAN & BILLING */}
    # Let's remove from the bottom up
    while block_lines and ('{/* PLAN' in block_lines[-1] or block_lines[-1].strip() == '' or block_lines[-1].strip() == ')}' or block_lines[-1].strip() == '</>'):
        block_lines.pop()
        
    jsx = '\n'.join(block_lines)
    
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
    print("DashboardOverview.jsx regenerated correctly.")

fix()
