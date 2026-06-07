import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Megaphone, Activity } from "lucide-react";
import { getRotatingPopupAd, canShowPopupAd, recordPopupShown, trackAdImpression, trackAdClick } from '../../data/adInventory';
import { useNavigate } from "react-router-dom";

export default function AdPopup({ open, onClose }) {
  const [ad, setAd] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      if (!canShowPopupAd()) {
        onClose();
        return;
      }
      const popupAd = getRotatingPopupAd();
      setAd(popupAd);
      recordPopupShown();
      trackAdImpression(popupAd.id);
    }
  }, [open, onClose]);

  const handleCtaClick = useCallback(() => {
    if (ad) {
      trackAdClick(ad.id);
      window.open(ad.ctaUrl, '_blank');
    }
    onClose();
  }, [ad, onClose]);

  if (!ad && open) return null;

  const accentColor = ad?.color || "var(--color-primary)";

  return (
    <AnimatePresence>
      {open && ad && (
        <motion.div
          className="ad-popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 18, 34, 0.65)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "white",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                padding: "28px 28px 16px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                    color: accentColor,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontSize: "12px",
                  }}
                >
                  <Megaphone size={16} /> Sponsored Reach
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "var(--text-3xl)",
                    lineHeight: 1.1,
                    color: "var(--color-dark)",
                  }}
                >
                  {ad.title}
                </h3>
                <p
                  style={{
                    marginTop: "16px",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.8,
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {ad.description}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  padding: 0,
                }}
                aria-label="Close advertisement"
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                padding: "0 28px 28px",
                display: "grid",
                gap: "18px",
                borderTop: "1px solid rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Sponsored by {ad.advertiser}
                  </p>
                  <strong
                    style={{
                      display: "block",
                      marginTop: "8px",
                      fontSize: "var(--text-lg)",
                    }}
                  >
                    {ad.title}
                  </strong>
                </div>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: accentColor,
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                  }}
                >
                  <Activity size={24} />
                </div>
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: "100%", background: accentColor, borderColor: accentColor }}
                onClick={handleCtaClick}
              >
                {ad.cta}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
