import { motion } from "framer-motion";
import { Download, FileText, Star, Lock, Zap, Award, Globe, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function XtraPage() {
  const [downloading, setDownloading] = useState(null);
  const [email, setEmail] = useState("");
  const { isLoggedIn, isSubscribed } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    const currentSubs = JSON.parse(localStorage.getItem("wp_newsletter_subs") || "[]");
    if (currentSubs.find(s => s.email === email)) {
      alert("You are already subscribed!");
      return;
    }
    currentSubs.push({ email, date: new Date().toISOString() });
    localStorage.setItem("wp_newsletter_subs", JSON.stringify(currentSubs));
    alert("Thank you for subscribing to WeekendPost Xtra newsletter!");
    setEmail("");
    window.dispatchEvent(new Event("storage"));
  };

  const xtraEditions = [
    {
      id: 6,
      title: "The Innovation Issue",
      description: "Exploring Botswana's growing tech hubs, startup ecosystems, and the digital pioneers reshaping the economy.",
      date: "June 15, 2026",
      cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      fileSize: "4.2 MB",
      isFree: false,
    },
    {
      id: 5,
      title: "Business Leaders Summit",
      description: "An exclusive recap of the annual corporate summit, featuring interviews with top CEOs and market analysts.",
      date: "May 15, 2026",
      cover: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
      fileSize: "5.1 MB",
      isFree: false,
    },
    {
      id: 4,
      title: "Sustainable Futures",
      description: "Deep dive into renewable energy projects, conservation efforts, and eco-tourism transforming the region.",
      date: "April 15, 2026",
      cover: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
      fileSize: "3.8 MB",
      isFree: false,
    },
    {
      id: 3,
      title: "Healthcare Innovators",
      description: "A look at the new generation of medical professionals and the technologies transforming patient care.",
      date: "March 15, 2026",
      cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
      fileSize: "4.5 MB",
      isFree: false,
    },
    {
      id: 2,
      title: "Arts & Culture Special",
      description: "Celebrating local artists, the rise of digital art galleries, and the impact of the global creative economy.",
      date: "February 15, 2026",
      cover: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
      fileSize: "6.2 MB",
      isFree: false,
    },
    {
      id: 1,
      title: "The Premiere Edition",
      description: "Our inaugural WeekendPost Xtra issue, setting the standard for long-form digital journalism.",
      date: "January 15, 2026",
      cover: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
      fileSize: "4.0 MB",
      isFree: false,
    }
  ];

  const handleDownload = (edition) => {
    if (!isLoggedIn) {
      navigate("/user-auth?tab=signup");
      return;
    }
    if (!isSubscribed) {
      navigate("/subscribe");
      return;
    }

    setDownloading(edition.id);
    setTimeout(() => {
      setDownloading(null);
      const link = document.createElement('a');
      link.href = '/pdfs/weekendpost-demo.pdf';
      link.download = `${edition.title.replace(/\s+/g, '-')}-Edition.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <div className="xtra-page">
      {/* Hero Section */}
      <div
        className="page-header"
        style={{
          background: "linear-gradient(135deg, var(--color-dark) 0%, #1a3a44 100%)",
          color: "#fff",
          padding: "var(--space-4xl) 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge"
            style={{ background: "var(--color-gold)", color: "white", marginBottom: "var(--space-lg)" }}
          >
            Digital Exclusive
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: "#fff", fontSize: "var(--text-5xl)", marginBottom: "var(--space-md)" }}
          >
            WeekendPost Xtra
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              color: "rgba(255,255,255,0.7)",
              maxWidth: "600px",
              margin: "0 auto",
              fontSize: "var(--text-lg)",
            }}
          >
            Our premier online-only publication. Deep dives, exclusive interviews, and rich multimedia content. Available exclusively for our subscribers.
          </motion.p>
        </div>
      </div>

      {/* Content Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" />
              Latest Editions
            </h2>
          </div>

          <div className="grid-3" style={{ gap: "var(--space-2xl)" }}>
            {xtraEditions.map((edition, index) => (
              <motion.div
                key={edition.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: "white",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}
              >
                <div style={{ height: "250px", overflow: "hidden", position: "relative" }}>
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={edition.cover}
                    alt={edition.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: edition.isFree ? "var(--color-primary)" : "var(--color-gold)",
                      color: "white",
                      fontSize: "var(--text-xs)",
                      fontWeight: 800,
                      padding: "6px 12px",
                      borderRadius: "20px",
                      textTransform: "uppercase",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}
                  >
                    {edition.isFree ? "Free Download" : "Premium"}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
                      padding: "30px 16px 12px",
                      color: "white",
                      fontSize: "var(--text-xs)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><FileText size={14} /> PDF Document</span>
                    <span style={{ opacity: 0.9 }}>{edition.fileSize}</span>
                  </div>
                </div>
                <div style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-sm)" }}>
                    <span style={{ color: "var(--color-primary)", fontWeight: 800, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Issue #{edition.id}
                    </span>
                    <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                      {edition.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-sm)", lineHeight: 1.3 }}>
                    {edition.title}
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-xl)", lineHeight: 1.6, flexGrow: 1 }}>
                    {edition.description}
                  </p>
                  <button
                    onClick={() => handleDownload(edition)}
                    className="btn btn-primary btn-block"
                    disabled={downloading === edition.id}
                  >
                    {downloading === edition.id ? (
                      "Preparing..."
                    ) : (
                      <>
                        <Download size={18} /> Download PDF
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="section" style={{ background: "rgba(0,0,0,0.03)" }}>
        <div className="container">
          <div className="section-header text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 className="section-title">Why Read Xtra?</h2>
            <p style={{ color: "var(--color-text-secondary)", maxWidth: "600px", marginTop: "var(--space-sm)", fontSize: "var(--text-lg)", textAlign: "center" }}>
              Experience journalism without limits. WeekendPost Xtra is designed for the modern reader who values depth and quality.
            </p>
          </div>
          
          <div className="grid-4" style={{ gap: "var(--space-2xl)", marginTop: "var(--space-3xl)" }}>
            {[
              { icon: Zap, title: "In-Depth Analysis", desc: "Long-form journalism exploring the 'why' behind the headlines." },
              { icon: Award, title: "Exclusive Interviews", desc: "Uncut, candid conversations with leaders and changemakers." },
              { icon: Globe, title: "Global Perspective", desc: "Local stories with international context and significance." },
              { icon: Download, title: "Read Offline", desc: "Download high-res PDFs and read anywhere, anytime." },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", background: "rgba(0, 150, 136, 0.1)", color: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-xl)" }}>
                  <feature.icon size={36} />
                </div>
                <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-sm)" }}>{feature.title}</h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-md)", lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Banner */}
      <section style={{ background: "var(--color-gold)", padding: "var(--space-4xl) 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-xl)" }}>
          <div style={{ flex: "1 1 400px" }}>
            <h2 style={{ color: "var(--color-dark)", fontSize: "var(--text-4xl)", marginBottom: "var(--space-sm)", fontWeight: 800 }}>Never Miss an Edition</h2>
            <p style={{ color: "var(--color-dark)", opacity: 0.9, fontSize: "var(--text-lg)" }}>Subscribe to our mailing list and get notified the moment a new Xtra issue drops.</p>
          </div>
          <div style={{ flex: "1 1 500px", display: "flex", gap: "var(--space-sm)" }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, padding: "var(--space-lg) var(--space-xl)", border: "none", borderRadius: "var(--radius-md)", outline: "none", fontSize: "var(--text-md)", boxShadow: "var(--shadow-sm)" }} 
            />
            <button 
              className="btn btn-dark" 
              onClick={handleSubscribe}
              style={{ padding: "var(--space-lg) var(--space-xl)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}
            >
              Subscribe <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
