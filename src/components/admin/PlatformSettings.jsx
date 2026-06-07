import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, CreditCard, Landmark } from "lucide-react";
import { getSubscriptionPlans, saveSubscriptionPlans, getPaymentMethods, savePaymentMethods } from "../../utils/settings";

export default function PlatformSettings() {
  const [plans, setPlans] = useState([]);
  const [methods, setMethods] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);

  useEffect(() => {
    setPlans(getSubscriptionPlans());
    setMethods(getPaymentMethods());
  }, []);

  const handleSavePlan = (e) => {
    e.preventDefault();
    const updated = plans.map(p => p.id === editingPlan.id ? editingPlan : p);
    setPlans(updated);
    saveSubscriptionPlans(updated);
    setEditingPlan(null);
  };

  const handleSaveMethod = (e) => {
    e.preventDefault();
    let updated;
    if (editingMethod.isNew) {
      const { isNew, ...rest } = editingMethod;
      updated = [...methods, rest];
    } else {
      updated = methods.map(m => m.id === editingMethod.id ? editingMethod : m);
    }
    setMethods(updated);
    savePaymentMethods(updated);
    setEditingMethod(null);
  };

  const handleDeleteMethod = (id) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      const updated = methods.filter(m => m.id !== id);
      setMethods(updated);
      savePaymentMethods(updated);
    }
  };

  const addNewMethod = () => {
    setEditingMethod({
      id: "method-" + Date.now(),
      name: "",
      provider: "",
      icon: "💳",
      color: "#000000",
      description: "",
      instructions: "",
      type: "mobile-money",
      active: true,
      isNew: true,
    });
  };

  return (
    <div style={{ padding: "var(--space-md)", background: "white", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
      <div style={{ marginBottom: "var(--space-2xl)" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: 8 }}>
          <Landmark size={20} color="var(--color-primary)" /> Subscription Plans
        </h3>
        
        {editingPlan ? (
          <form onSubmit={handleSavePlan} style={{ background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
            <h4 style={{ marginBottom: 16 }}>Edit Plan: {editingPlan.name}</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "16px", marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Name</label>
                <input required className="input" value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Price</label>
                <input required type="number" className="input" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: Number(e.target.value)})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Currency</label>
                <input required className="input" value={editingPlan.currency} onChange={e => setEditingPlan({...editingPlan, currency: e.target.value})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Period</label>
                <input required className="input" value={editingPlan.period} onChange={e => setEditingPlan({...editingPlan, period: e.target.value})} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditingPlan(null)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="admin-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}><table style={{ width: "100%", minWidth: "600px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--color-border)" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--color-border)" }}>Price</th>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--color-border)" }}>Period</th>
                  <th style={{ textAlign: "right", padding: "12px", borderBottom: "1px solid var(--color-border)" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px" }}><strong>{plan.name}</strong></td>
                    <td style={{ padding: "12px" }}>{plan.currency}{plan.price}</td>
                    <td style={{ padding: "12px" }}>{plan.period}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <button className="btn btn-ghost" onClick={() => setEditingPlan(plan)} style={{ padding: "6px 12px", fontSize: "12px", height: "auto" }}>
                        <Edit2 size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <h3 style={{ fontSize: "18px", display: "flex", alignItems: "center", gap: 8 }}>
            <CreditCard size={20} color="var(--color-primary)" /> Payment Methods
          </h3>
          {!editingMethod && (
            <button className="btn btn-primary" onClick={addNewMethod} style={{ padding: "6px 12px", fontSize: "12px", height: "auto" }}>
              <Plus size={14} /> Add Method
            </button>
          )}
        </div>

        {editingMethod ? (
          <form onSubmit={handleSaveMethod} style={{ background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
            <h4 style={{ marginBottom: 16 }}>{editingMethod.isNew ? "Add Payment Method" : "Edit Payment Method"}</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "16px", marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Internal ID (no spaces)</label>
                <input required className="input" value={editingMethod.id} disabled={!editingMethod.isNew} onChange={e => setEditingMethod({...editingMethod, id: e.target.value})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Display Name</label>
                <input required className="input" value={editingMethod.name} onChange={e => setEditingMethod({...editingMethod, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Provider</label>
                <input required className="input" value={editingMethod.provider} onChange={e => setEditingMethod({...editingMethod, provider: e.target.value})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Type</label>
                <select className="input" value={editingMethod.type} onChange={e => setEditingMethod({...editingMethod, type: e.target.value})}>
                  <option value="mobile-money">Mobile Money</option>
                  <option value="card">Card / Online</option>
                  <option value="bank-transfer">Direct Bank Transfer / EFT</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Short Description</label>
                <input required className="input" value={editingMethod.description} onChange={e => setEditingMethod({...editingMethod, description: e.target.value})} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>User Instructions</label>
                <input required className="input" value={editingMethod.instructions} onChange={e => setEditingMethod({...editingMethod, instructions: e.target.value})} />
              </div>
            </div>

            {editingMethod.type === 'bank-transfer' && (
              <div style={{ background: "white", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 16 }}>
                <h5 style={{ marginBottom: 12 }}>Bank Details</h5>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Bank Name</label>
                    <input className="input" value={editingMethod.bankDetails?.bankName || ""} onChange={e => setEditingMethod({...editingMethod, bankDetails: {...editingMethod.bankDetails, bankName: e.target.value}})} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Account Name</label>
                    <input className="input" value={editingMethod.bankDetails?.accountName || ""} onChange={e => setEditingMethod({...editingMethod, bankDetails: {...editingMethod.bankDetails, accountName: e.target.value}})} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Account Number</label>
                    <input className="input" value={editingMethod.bankDetails?.accountNumber || ""} onChange={e => setEditingMethod({...editingMethod, bankDetails: {...editingMethod.bankDetails, accountNumber: e.target.value}})} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", marginBottom: 4 }}>Branch Code</label>
                    <input className="input" value={editingMethod.bankDetails?.branchCode || ""} onChange={e => setEditingMethod({...editingMethod, bankDetails: {...editingMethod.bankDetails, branchCode: e.target.value}})} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary">Save Method</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditingMethod(null)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="admin-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}><table style={{ width: "100%", minWidth: "600px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--color-border)" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--color-border)" }}>Type</th>
                  <th style={{ textAlign: "right", padding: "12px", borderBottom: "1px solid var(--color-border)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map(method => (
                  <tr key={method.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px" }}><strong>{method.name}</strong><div style={{fontSize: "12px", color:"var(--color-text-muted)"}}>{method.provider}</div></td>
                    <td style={{ padding: "12px", fontSize: "13px" }}>{method.type}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="btn btn-ghost" onClick={() => setEditingMethod(method)} style={{ padding: "6px 12px", fontSize: "12px", height: "auto" }}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="btn btn-ghost" onClick={() => handleDeleteMethod(method.id)} style={{ padding: "6px 12px", fontSize: "12px", height: "auto", color: "var(--color-news-red)" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </div>
    </div>
  );
}

