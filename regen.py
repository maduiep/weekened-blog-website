import subprocess

def fix():
    # Get original AdminPage.jsx
    result = subprocess.run(['git', 'show', 'HEAD:src/pages/AdminPage.jsx'], capture_output=True, text=True)
    lines = result.stdout.split('\n')
    
    overview_start = -1
    overview_end = -1
    
    for i, line in enumerate(lines):
        if '{activeTab === "analytics" && (' in line and '<>' in lines[i+1]:
            overview_start = i
        if '</>' in line and ')}' in lines[i+1] and overview_start != -1 and overview_end == -1:
            overview_end = i + 1
            break
            
    if overview_start != -1 and overview_end != -1:
        overview_jsx = '\n'.join(lines[overview_start+1:overview_end])
        # strip the outer <> and </>
        overview_jsx = overview_jsx.strip()
        if overview_jsx.startswith('<>'):
            overview_jsx = overview_jsx[2:]
        if overview_jsx.endswith('</>'):
            overview_jsx = overview_jsx[:-3]
            
        code = f"""import {{ motion }} from "framer-motion";
import {{ Link }} from "react-router-dom";
import {{ Users, CreditCard, Eye, ShieldCheck, DollarSign, Database, Download }} from "lucide-react";

export default function AdminOverview({{ adminUser, showToast, allUsers, subscribers, activeReaders, corporateSubs, enterpriseSubs, mtdRevenue, adminUsersCount }}) {{
  return (
    <>
{overview_jsx}
    </>
  );
}}
"""
        with open('src/components/admin/AdminOverview.jsx', 'w', encoding='utf-8') as f:
            f.write(code)
        print("AdminOverview.jsx regenerated.")
        
fix()
