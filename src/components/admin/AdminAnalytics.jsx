import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Download, DollarSign, Filter, Database, Eye } from 'lucide-react';

const PLAN_COLORS = {
  weekly: "var(--color-sport-green)",
  monthly: "var(--color-primary)",
  annual: "var(--color-gold)",
  corporate: "var(--color-business-blue)",
  enterprise: "var(--color-news-red)",
};

const RANGE_COLORS = {
  monthly: "#007e97", // Deep Teal
  weekly: "#f39c12", // Vibrant Orange/Gold
  daily: "#27ae60", // Emerald Green
};

const RANGE_BG = {
  monthly: "rgba(0, 126, 151, 0.1)",
  weekly: "rgba(243, 156, 18, 0.1)",
  daily: "rgba(39, 174, 96, 0.1)",
};

export default function AdminAnalytics({ showToast, setModalType, setModalOpen, totalSubscribers }) {
  const [timeRange, setTimeRange] = useState('monthly');
  const analyticsData = {
    monthly: [
      { label: "Jan", value: 4500, count: 75 },
      { label: "Feb", value: 5200, count: 88 },
      { label: "Mar", value: 4800, count: 82 },
      { label: "Apr", value: 6100, count: 104 },
      { label: "May", value: 7500, count: totalSubscribers }, // Automated linked value
    ],
    weekly: [
      { label: "Week 1", value: 1200, count: 15 },
      { label: "Week 2", value: 1800, count: 22 },
      { label: "Week 3", value: 1500, count: 18 },
      { label: "Week 4", value: 2100, count: 28 },
    ],
    daily: [
      { label: "Mon", value: 300, count: 4 },
      { label: "Tue", value: 450, count: 6 },
      { label: "Wed", value: 380, count: 5 },
      { label: "Thu", value: 520, count: 8 },
      { label: "Fri", value: 600, count: 10 },
      { label: "Sat", value: 400, count: 5 },
      { label: "Sun", value: 350, count: 4 },
    ],
    conversionFunnel: [
      {
        stage: "Site Visits",
        count: 15400,
        percent: 100,
        color: "var(--color-primary)",
      },
      {
        stage: "Article Views",
        count: 12200,
        percent: 79,
        color: "var(--color-primary)",
      },
      {
        stage: "Sign Ups",
        count: 3100,
        percent: 20,
        color: "var(--color-gold)",
      },
      {
        stage: "Subscribers",
        count: 840,
        percent: 5,
        color: "var(--color-sport-green)",
      },
    ],
    topArticles: [
      {
        title: "Oil price dip masks supply issues",
        views: "12.4K",
        engagement: "85%",
        revenue: "P1,240",
      },
      {
        title: "Household Loan Defaults Surge",
        views: "10.1K",
        engagement: "92%",
        revenue: "P980",
      },
      {
        title: "Sports Infrastructure Letdown",
        views: "8.2K",
        engagement: "78%",
        revenue: "P750",
      },
    ],
  };
  const feedbackData = {
    score: 4.7,
    nps: 65,
    positiveMentions: "82%",
    responseRate: "74%",
    sentimentTrend: "+8%",
  };
  const activeChartData = analyticsData[timeRange];
  const maxValue = Math.max(...activeChartData.map((d) => d.value));

  return (
    <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <style>{`
                .admin-analytics-grid {
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: space-between;
                  gap: var(--space-md);
                  width: 100%;
                  margin-bottom: var(--space-xl);
                }
                .admin-analytics-grid > .admin-card {
                  width: calc(50% - (var(--space-md) / 2));
                }
                .admin-analytics-grid > .admin-card.full-width {
                  width: 100%;
                }
                @media (max-width: 900px) {
                  .admin-analytics-grid > .admin-card {
                    width: 100%;
                  }
                }
              `}</style>
              <div className="admin-analytics-grid">
                {/* Revenue Breakdown (top-left) */}
                <div
                  className="admin-card"
                  style={{
                    background: "white",
                    padding: "var(--space-xl)",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "var(--space-xl)",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "var(--text-lg)",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <TrendingUp
                          size={18}
                          color="var(--color-sport-green)"
                        />{" "}
                        Revenue Breakdown
                      </h3>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--color-text-muted)",
                          marginTop: 4,
                        }}
                      >
                        Live financial performance and subscriber growth.
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          background: "#f1f5f9",
                          padding: "3px",
                          borderRadius: "8px",
                        }}
                      >
                        {["monthly", "weekly", "daily"].map((range) => (
                          <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            style={{
                              padding: "4px 12px",
                              border: "none",
                              borderRadius: "6px",
                              background:
                                timeRange === range ? "white" : "transparent",
                              color:
                                timeRange === range
                                  ? "var(--color-primary)"
                                  : "var(--color-text-muted)",
                              fontSize: "10px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              boxShadow:
                                timeRange === range
                                  ? "0 1px 3px rgba(0,0,0,0.1)"
                                  : "none",
                            }}
                          >
                            {range.charAt(0)}
                          </button>
                        ))}
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{
                          padding: "4px 10px",
                          fontSize: "10px",
                          background: "var(--color-primary)",
                          color: "white",
                        }}
                        onClick={() =>
                          showToast(
                            "Financial report downloading...",
                            "success",
                          )
                        }
                      >
                        <Download size={12} /> Export Report
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      height: "240px",
                      gap: "12px",
                      padding: "20px 0 10px",
                      position: "relative",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {/* Y-Axis Guideline */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "20px",
                        borderTop: "1px dashed #f1f5f9",
                        zIndex: 0,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "50%",
                        borderTop: "1px dashed #f1f5f9",
                        zIndex: 0,
                      }}
                    />

                    {activeChartData.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          height: "100%",
                          justifyContent: "flex-end",
                          zIndex: 1,
                        }}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: `${Math.max(5, (item.value / (maxValue || 1)) * 100)}%`,
                          }}
                          transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 100,
                            delay: i * 0.05,
                          }}
                          style={{
                            width: "100%",
                            background: RANGE_COLORS[timeRange],
                            borderRadius: "6px 6px 0 0",
                            position: "relative",
                            boxShadow: `0 4px 15px -2px ${RANGE_COLORS[timeRange]}66`,
                            display: "block",
                            minHeight: "10px",
                          }}
                          className="bar-hover"
                        >
                          <div
                            className="bar-tooltip"
                            style={{
                              position: "absolute",
                              top: "-45px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "var(--color-dark)",
                              color: "white",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              fontSize: "10px",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              opacity: 0,
                              transition: "opacity 0.2s",
                              pointerEvents: "none",
                              boxShadow: "var(--shadow-md)",
                              zIndex: 10,
                            }}
                          >
                            <div
                              style={{
                                color: RANGE_COLORS[timeRange],
                                marginBottom: 2,
                                filter: "brightness(1.5)",
                              }}
                            >
                              P{item.value.toLocaleString()}
                            </div>
                            <div style={{ opacity: 0.8 }}>
                              {item.count} Subscribers
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                bottom: "-4px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                borderLeft: "4px solid transparent",
                                borderRight: "4px solid transparent",
                                borderTop: "4px solid var(--color-dark)",
                              }}
                            />
                          </div>
                        </motion.div>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--color-text-muted)",
                            textAlign: "center",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "24px",
                      marginTop: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          background: RANGE_COLORS[timeRange],
                          borderRadius: "2px",
                        }}
                      />{" "}
                      Revenue (Pula)
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          background: "#cbd5e1",
                          borderRadius: "2px",
                        }}
                      />{" "}
                      Baseline
                    </div>
                  </div>
                </div>

                <div
                  className="admin-card"
                  style={{
                    background: "white",
                    padding: "var(--space-2xl)",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      marginBottom: "var(--space-xl)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <DollarSign size={18} color="var(--color-primary)" /> Reader
                    Feedback
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                      gap: "16px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setModalType("average");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        Average Rating
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.score}
                      </strong>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Based on recent subscriber feedback.
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setModalType("nps");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        NPS Score
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.nps}
                      </strong>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Trending {feedbackData.sentimentTrend} month-over-month.
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setModalType("positive");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        Positive Mentions
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.positiveMentions}
                      </strong>
                    </button>
                    <button
                      onClick={() => {
                        setModalType("response");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        Response Rate
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.responseRate}
                      </strong>
                    </button>
                  </div>
                </div>

                {/* Conversion Funnel */}
                  <div
                    className="admin-card full-width"
                    style={{
                      background: "white",
                      padding: "var(--space-2xl)",
                      borderRadius: "var(--radius-xl)",
                      border: "1px solid var(--color-border)",
                      height: "100%",
                      overflow: "visible",
                    }}
                  >
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      marginBottom: "var(--space-xl)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Filter size={18} color="var(--color-gold)" /> Conversion
                    Funnel
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {analyticsData.conversionFunnel.map((step, i) => (
                      <div key={i}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                            fontSize: "12px",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{step.stage}</span>
                          <span style={{ color: "var(--color-text-muted)" }}>
                            {step.count.toLocaleString()} ({step.percent}%)
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "12px",
                            background: "var(--color-bg-alt)",
                            borderRadius: "6px",
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${step.percent}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{ height: "100%", background: step.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="admin-card"
                style={{
                  background: "white",
                  padding: "var(--space-2xl)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "var(--space-lg)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Database size={18} color="var(--color-primary)" /> Top
                    Content Performance
                  </h3>
                  <button className="btn btn-ghost btn-sm">Full Report</button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Asset Title</th>
                        <th>Impressions</th>
                        <th>Engagement</th>
                        <th>Est. Revenue</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topArticles.map((art, i) => (
                        <tr key={i} className="admin-table-row">
                          <td style={{ fontWeight: 700, fontSize: "13px" }}>
                            {art.title}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <Eye size={14} /> {art.views}
                            </div>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: "60px",
                                  height: "6px",
                                  background: "#f1f5f9",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: art.engagement,
                                    height: "100%",
                                    background: "var(--color-primary)",
                                  }}
                                />
                              </div>
                              <span
                                style={{ fontSize: "11px", fontWeight: 600 }}
                              >
                                {art.engagement}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              color: "var(--color-sport-green)",
                              fontWeight: 700,
                            }}
                          >
                            {art.revenue}
                          </td>
                          <td>
                            <span
                              className="badge badge-default"
                              style={{ fontSize: "10px" }}
                            >
                              Viral
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
  );
}

