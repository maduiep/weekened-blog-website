import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Bookmark, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDeviceFingerprint } from '../../utils/drm';

export default function InteractiveViewer({ epaper, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [fingerprint, setFingerprint] = useState('');
  const { user } = useAuth();
  
  const totalPages = 48; // Mock total pages

  useEffect(() => {
    // Generate DRM fingerprint on load
    getDeviceFingerprint().then(fp => setFingerprint(fp));
  }, []);

  // Simple CSS 3D Flip effect variables
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      
      {/* Viewer Toolbar */}
      <div style={{ padding: '16px 24px', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', borderBottom: '1px solid #333' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <X size={20} /> Close
          </button>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{epaper.title}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ZoomOut size={18} /></button>
          <span style={{ fontSize: '12px' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ZoomIn size={18} /></button>
          <div style={{ width: 1, height: 24, background: '#333', margin: '0 8px' }} />
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Bookmark size={18} /></button>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Download size={18} /></button>
        </div>
      </div>

      {/* Viewer Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Navigation Arrows */}
        <button onClick={handlePrev} disabled={currentPage === 1} style={{ position: 'absolute', left: 24, zIndex: 10, background: 'rgba(255,255,255,0.2)', color: 'white', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1 }}>
          <ChevronLeft size={24} />
        </button>

        <div style={{ 
          transform: `scale(${zoom})`, 
          transition: 'transform 0.3s ease',
          display: 'flex',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          background: 'white',
          position: 'relative'
        }}>
          {/* Mock Page Content */}
          <div style={{ width: 450, height: 600, padding: 32, position: 'relative', borderRight: '1px solid #ccc' }}>
             {currentPage === 1 ? (
                <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <h1 style={{ fontSize: '36px', fontFamily: 'serif', marginTop: 'auto', marginBottom: 16 }}>{epaper.title}</h1>
                  <p style={{ color: 'gray', marginBottom: 'auto' }}>{epaper.date}</p>
                </div>
             ) : (
                <div style={{ height: '100%' }}>
                  <h2 style={{ fontSize: '24px', fontFamily: 'serif', marginBottom: 16 }}>Editorial Page {currentPage * 2 - 2}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: '#eee', height: 150 }} />
                    <div style={{ background: '#eee', height: 150 }} />
                  </div>
                  <p style={{ marginTop: 16, fontSize: '12px', lineHeight: 1.6, color: '#333' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
             )}
          </div>
          <div style={{ width: 450, height: 600, padding: 32, position: 'relative' }}>
             <div style={{ height: '100%' }}>
                <h2 style={{ fontSize: '24px', fontFamily: 'serif', marginBottom: 16 }}>News Section {currentPage * 2 - 1}</h2>
                <div style={{ background: '#eee', height: 200, marginBottom: 16 }} />
                <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#333' }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
             </div>
          </div>

          {/* DRM Watermark Overlay */}
          <div style={{ 
            position: 'absolute', inset: 0, 
            pointerEvents: 'none', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.1, zIndex: 50, overflow: 'hidden'
          }}>
             <div style={{ transform: 'rotate(-45deg)', whiteSpace: 'nowrap', textAlign: 'center' }}>
               <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'red' }}>LICENSED TO: {user?.email || 'GUEST'}</p>
               <p style={{ fontSize: '16px', margin: 0, color: 'red' }}>IP/Device: {fingerprint}</p>
               <p style={{ fontSize: '16px', margin: 0, color: 'red' }}>UNAUTHORIZED SHARING PROHIBITED</p>
             </div>
          </div>
        </div>

        <button onClick={handleNext} disabled={currentPage === totalPages} style={{ position: 'absolute', right: 24, zIndex: 10, background: 'rgba(255,255,255,0.2)', color: 'white', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', opacity: currentPage === totalPages ? 0.3 : 1 }}>
          <ChevronRight size={24} />
        </button>

      </div>

      {/* Page Progress Indicator */}
      <div style={{ height: 4, background: '#333', width: '100%' }}>
        <div style={{ height: '100%', background: 'var(--color-gold)', width: `${(currentPage / totalPages) * 100}%`, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
