import { Link } from "react-router-dom";

export default function DashboardSubscription({ user, authUser, transactions }) {
  return (
    <>
      <div className="dashboard-card">
                <h2 className="dashboard-card-title">Plan & Billing</h2>

                <div className="dashboard-plan-box">
                  <div className="dashboard-plan-header">
                    <div>
                      <h3 style={{ color: "var(--color-primary)" }}>
                        {user.subscription.plan}
                      </h3>
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        {user.subscription.price} per billing cycle
                      </p>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: authUser?.isSubscribed
                          ? "#e8f8f5"
                          : "var(--color-bg-alt)",
                        color: authUser?.isSubscribed
                          ? "#2ecc71"
                          : "var(--color-text-muted)",
                      }}
                    >
                      {user.subscription.status}
                    </span>
                  </div>
                  {authUser?.isSubscribed && (
                    <div className="dashboard-plan-note">
                      Your next charge of{" "}
                      <strong>{user.subscription.price}</strong> is on{" "}
                      <strong>{user.subscription.nextBilling}</strong>.
                    </div>
                  )}
                  <div className="dashboard-plan-actions">
                    {authUser?.isSubscribed ? (
                      <button className="btn btn-primary">
                        Update Payment Method
                      </button>
                    ) : (
                      <Link to="/subscribe" className="btn btn-primary">
                        Subscribe Now
                      </Link>
                    )}
                    {authUser?.isSubscribed && (
                      <button
                        className="btn btn-ghost"
                        style={{ color: "var(--color-news-red)" }}
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>

                <h3
                  style={{
                    margin: "var(--space-xl) 0 var(--space-md)",
                    fontSize: "var(--text-lg)",
                  }}
                >
                  Billing History
                </h3>
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((t, i) => (
                          <tr key={i}>
                            <td style={{ color: "var(--color-text-muted)" }}>
                              {new Date(t.date).toLocaleDateString()}
                            </td>
                            <td style={{ fontWeight: 500 }}>
                              {t.planName || t.type}
                            </td>
                            <td>{t.amount || user.subscription.price}</td>
                            <td style={{ color: "#2ecc71", fontWeight: 600 }}>
                              {t.status || 'Paid'}
                            </td>
                          </tr>
                        ))
                      ) : authUser?.isSubscribed ? (
                        [
                          "April 12, 2026",
                          "March 12, 2026",
                          "February 12, 2026",
                        ].map((date, i) => (
                          <tr key={`mock-${i}`}>
                            <td style={{ color: "var(--color-text-muted)" }}>
                              {date}
                            </td>
                            <td style={{ fontWeight: 500 }}>
                              {user.subscription.plan}
                            </td>
                            <td>{user.subscription.price}</td>
                            <td style={{ color: "#2ecc71", fontWeight: 600 }}>
                              Paid
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              textAlign: "center",
                              color: "var(--color-text-muted)",
                              padding: "var(--space-xl)",
                            }}
                          >
                            No billing history yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
    </>
  );
}