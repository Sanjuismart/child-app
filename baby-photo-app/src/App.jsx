import { useState, useRef, useCallback, useEffect } from "react";

// ─── Sample placeholder photos (colored gradients as stand-ins) ───
const SAMPLE_PHOTOS = [
  { id: 1, name: "First Smile 😊", date: "2024-01-10", tags: ["milestone", "smile"], size: "2.4 MB", angle: "front", bg: "linear-gradient(135deg,#FFD6E0,#FFB3C6)", age: "2 months", note: "First real smile!" },
  { id: 2, name: "Tummy Time", date: "2024-02-03", tags: ["play", "milestone"], size: "3.1 MB", angle: "crawling", bg: "linear-gradient(135deg,#D6EEFF,#B3D9FF)", age: "3 months", note: "Getting so strong!" },
  { id: 3, name: "Bath Time Fun", date: "2024-02-20", tags: ["bath", "play"], size: "1.8 MB", angle: "sitting", bg: "linear-gradient(135deg,#D6FFE8,#A8F0C6)", age: "4 months", note: "Loves splashing 💦" },
  { id: 4, name: "Sunday Outfit", date: "2024-03-05", tags: ["fashion", "outing"], size: "2.9 MB", angle: "front", bg: "linear-gradient(135deg,#EDD6FF,#D4AAFF)", age: "5 months", note: "Best dressed baby!" },
  { id: 5, name: "First Solids", date: "2024-03-18", tags: ["milestone", "food"], size: "1.5 MB", angle: "sitting", bg: "linear-gradient(135deg,#FFF9D6,#FFE98A)", age: "6 months", note: "Tried banana today 🍌" },
  { id: 6, name: "Park Walk", date: "2024-04-01", tags: ["outdoor", "outing"], size: "4.2 MB", angle: "front", bg: "linear-gradient(135deg,#C8FFD4,#56E39F)", age: "6 months", note: "First time at the park" },
];

const ALL_TAGS = ["milestone", "smile", "play", "bath", "fashion", "outing", "food", "outdoor", "family", "birthday", "sleeping", "crawling"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Tiny baby SVG avatar ───
function BabyAvatar({ bg, size = 60 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
    }}>
      <svg viewBox="0 0 60 60" width={size * 0.85} height={size * 0.85}>
        <circle cx="30" cy="24" r="14" fill="#FDDCB5" />
        <ellipse cx="23" cy="22" r="2" fill="#3C2A1E" />
        <ellipse cx="37" cy="22" r="2" fill="#3C2A1E" />
        <path d="M26 30 Q30 34 34 30" stroke="#E88" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="30" cy="28" rx="2" ry="1.5" fill="#F4A6A6" opacity="0.6" />
        <ellipse cx="30" cy="14" rx="12" ry="6" fill="#8B6347" opacity="0.5" />
        <rect x="18" y="38" width="24" height="20" rx="8" fill="#FFB3C6" />
        <rect x="10" y="40" width="9" height="18" rx="4.5" fill="#FDDCB5" />
        <rect x="41" y="40" width="9" height="18" rx="4.5" fill="#FDDCB5" />
        <rect x="20" y="56" width="9" height="14" rx="4.5" fill="#FDDCB5" />
        <rect x="31" y="56" width="9" height="14" rx="4.5" fill="#FDDCB5" />
      </svg>
    </div>
  );
}

// ─── Photo Card ───
function PhotoCard({ photo, onSelect, onDelete, isSelected, view }) {
  const [hovered, setHovered] = useState(false);

  if (view === "list") {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: "16px",
          padding: "14px 18px", borderRadius: "16px",
          background: isSelected ? "#FFF0F5" : hovered ? "#FAFAFA" : "white",
          border: isSelected ? "2px solid #FF6B9D" : "2px solid #F0F0F0",
          transition: "all 0.2s", cursor: "pointer", marginBottom: "8px",
        }}
        onClick={() => onSelect(photo)}
      >
        <div style={{ position: "relative" }}>
          <BabyAvatar bg={photo.bg} size={52} />
          <input type="checkbox" checked={isSelected} onChange={() => onSelect(photo)}
            onClick={e => e.stopPropagation()}
            style={{ position: "absolute", top: -4, left: -4, accentColor: "#FF6B9D" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: "14px", color: "#333", fontFamily: "'Nunito', sans-serif" }}>{photo.name}</div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{photo.date} · {photo.age} · {photo.size}</div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {photo.tags.map(t => (
            <span key={t} style={{ padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: "#FFF0F5", color: "#FF6B9D" }}>#{t}</span>
          ))}
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(photo.id); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#CCC", fontSize: "16px", padding: "4px" }}>🗑️</button>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(photo)}
      style={{
        borderRadius: "20px", overflow: "hidden", cursor: "pointer",
        border: isSelected ? "3px solid #FF6B9D" : "2px solid transparent",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        background: "white", position: "relative",
      }}
    >
      {/* Image area */}
      <div style={{ height: "160px", background: photo.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <BabyAvatar bg="rgba(255,255,255,0.3)" size={90} />
        {/* Checkbox */}
        <div style={{ position: "absolute", top: "10px", left: "10px" }}>
          <input type="checkbox" checked={isSelected} onChange={() => onSelect(photo)}
            onClick={e => e.stopPropagation()}
            style={{ width: "18px", height: "18px", accentColor: "#FF6B9D", cursor: "pointer" }} />
        </div>
        {/* Delete */}
        {hovered && (
          <button onClick={e => { e.stopPropagation(); onDelete(photo.id); }}
            style={{
              position: "absolute", top: "10px", right: "10px",
              background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "8px",
              cursor: "pointer", padding: "4px 8px", fontSize: "14px",
            }}>🗑️</button>
        )}
        {/* Age badge */}
        <div style={{
          position: "absolute", bottom: "10px", right: "10px",
          background: "rgba(0,0,0,0.5)", color: "white", padding: "3px 10px",
          borderRadius: "20px", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(4px)",
        }}>{photo.age}</div>
      </div>
      {/* Info */}
      <div style={{ padding: "14px" }}>
        <div style={{ fontWeight: 800, fontSize: "14px", color: "#222", fontFamily: "'Nunito', sans-serif", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.name}</div>
        <div style={{ fontSize: "11px", color: "#AAA", marginBottom: "10px" }}>{photo.date} · {photo.size}</div>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {photo.tags.slice(0, 2).map(t => (
            <span key={t} style={{ padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: "#FFF0F5", color: "#FF6B9D" }}>#{t}</span>
          ))}
          {photo.tags.length > 2 && <span style={{ fontSize: "11px", color: "#CCC" }}>+{photo.tags.length - 2}</span>}
        </div>
        {photo.note && <div style={{ marginTop: "8px", fontSize: "12px", color: "#888", fontStyle: "italic" }}>"{photo.note}"</div>}
      </div>
    </div>
  );
}

// ─── Upload Drop Zone ───
function UploadZone({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length) onUpload(files);
  }, [onUpload]);

  const handleFile = e => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    if (files.length) onUpload(files);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
      style={{
        border: `2.5px dashed ${dragging ? "#FF6B9D" : "#E0D0FF"}`,
        borderRadius: "20px", padding: "40px 24px", textAlign: "center",
        background: dragging ? "#FFF0F5" : "linear-gradient(135deg,#FFF8FF,#F0F8FF)",
        cursor: "pointer", transition: "all 0.2s",
        transform: dragging ? "scale(1.02)" : "scale(1)",
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFile} style={{ display: "none" }} />
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>{dragging ? "🎯" : "📸"}</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "18px", color: "#9B5DE5", marginBottom: "8px" }}>
        {dragging ? "Drop photos here!" : "Upload Baby Photos"}
      </div>
      <div style={{ fontSize: "13px", color: "#AAA" }}>Drag & drop or click to browse · JPG, PNG, HEIC supported</div>
    </div>
  );
}

// ─── Photo Detail Modal ───
function PhotoModal({ photo, onClose, onUpdate }) {
  const [note, setNote] = useState(photo.note || "");
  const [name, setName] = useState(photo.name);
  const [selectedTags, setSelectedTags] = useState(photo.tags);

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: "28px", width: "100%", maxWidth: "560px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)", overflow: "hidden",
        fontFamily: "'Nunito', sans-serif",
      }}>
        {/* Photo display */}
        <div style={{ height: "220px", background: photo.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <BabyAvatar bg="rgba(255,255,255,0.3)" size={130} />
          <button onClick={onClose} style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
            width: "36px", height: "36px", color: "white", cursor: "pointer", fontSize: "16px",
          }}>✕</button>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Name */}
          <input value={name} onChange={e => setName(e.target.value)}
            style={{
              width: "100%", fontSize: "20px", fontWeight: 900, border: "none",
              borderBottom: "2px solid #F0F0F0", outline: "none", padding: "4px 0",
              fontFamily: "'Nunito', sans-serif", color: "#222", boxSizing: "border-box",
              marginBottom: "6px",
            }} />

          <div style={{ fontSize: "13px", color: "#AAA", marginBottom: "18px" }}>
            {photo.date} · {photo.age} · {photo.size}
          </div>

          {/* Note */}
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Add a sweet memory note..."
            style={{
              width: "100%", minHeight: "72px", borderRadius: "12px",
              border: "2px solid #F0F0F0", padding: "10px 14px",
              fontFamily: "'Nunito', sans-serif", fontSize: "14px", color: "#555",
              outline: "none", resize: "none", boxSizing: "border-box", marginBottom: "16px",
            }} />

          {/* Tags */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#AAA", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ALL_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700,
                  border: "none", cursor: "pointer", transition: "all 0.15s",
                  background: selectedTags.includes(tag) ? "#FF6B9D" : "#F0F0F0",
                  color: selectedTags.includes(tag) ? "white" : "#888",
                }}>#{tag}</button>
              ))}
            </div>
          </div>

          {/* Save */}
          <button onClick={() => { onUpdate({ ...photo, name, note, tags: selectedTags }); onClose(); }}
            style={{
              width: "100%", padding: "14px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg,#FF6B9D,#9B5DE5)",
              color: "white", fontSize: "15px", fontWeight: 900, cursor: "pointer",
              fontFamily: "'Nunito', sans-serif", transition: "opacity 0.2s",
            }}>
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Photo Form Modal ───
function AddPhotoModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedBg, setSelectedBg] = useState("linear-gradient(135deg,#FFD6E0,#FFB3C6)");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const inputRef = useRef();

  const BG_OPTIONS = [
    "linear-gradient(135deg,#FFD6E0,#FFB3C6)",
    "linear-gradient(135deg,#D6EEFF,#B3D9FF)",
    "linear-gradient(135deg,#D6FFE8,#A8F0C6)",
    "linear-gradient(135deg,#EDD6FF,#D4AAFF)",
    "linear-gradient(135deg,#FFF9D6,#FFE98A)",
    "linear-gradient(135deg,#FFE4CC,#FFB380)",
    "linear-gradient(135deg,#C8FFD4,#56E39F)",
    "linear-gradient(135deg,#FFD6EC,#FF80C0)",
  ];

  const toggleTag = tag => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    onAdd({
      id: Date.now(),
      name: name.trim(),
      date: today,
      tags: selectedTags,
      size: uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB` : "—",
      angle: "front",
      bg: uploadedPreview ? null : selectedBg,
      previewUrl: uploadedPreview,
      age: age.trim() || "Unknown",
      note: note.trim(),
    });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      overflowY: "auto",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: "28px", width: "100%", maxWidth: "560px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        fontFamily: "'Nunito', sans-serif", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#FF6B9D,#9B5DE5)",
          padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "20px", color: "white" }}>📸 Add Baby Photo</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>Capture a precious moment</div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
            width: "36px", height: "36px", color: "white", cursor: "pointer", fontSize: "16px",
          }}>✕</button>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Upload area */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#AAA", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Photo</div>
            {uploadedPreview ? (
              <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "160px" }}>
                <img src={uploadedPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => { setUploadedFile(null); setUploadedPreview(null); }}
                  style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "8px",
                    color: "white", cursor: "pointer", padding: "4px 10px", fontSize: "12px",
                  }}>Change</button>
              </div>
            ) : (
              <div onClick={() => inputRef.current.click()} style={{
                border: "2px dashed #E0D0FF", borderRadius: "16px", padding: "30px",
                textAlign: "center", cursor: "pointer", background: "#FFF8FF",
              }}>
                <input ref={inputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>🖼️</div>
                <div style={{ fontWeight: 700, color: "#9B5DE5", fontSize: "14px" }}>Click to upload a photo</div>
                <div style={{ fontSize: "12px", color: "#CCC", marginTop: "4px" }}>or choose a background below</div>
              </div>
            )}
          </div>

          {/* BG picker (shown if no upload) */}
          {!uploadedPreview && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#AAA", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Card Background</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {BG_OPTIONS.map(bg => (
                  <div key={bg} onClick={() => setSelectedBg(bg)} style={{
                    width: "40px", height: "40px", borderRadius: "10px", background: bg, cursor: "pointer",
                    border: selectedBg === bg ? "3px solid #FF6B9D" : "2px solid transparent",
                    boxShadow: selectedBg === bg ? "0 0 0 2px rgba(255,107,157,0.3)" : "none",
                    transition: "all 0.15s",
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#AAA", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Photo Name *</div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. First Steps, Bath Time..."
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "12px",
                border: "2px solid #F0F0F0", outline: "none", fontSize: "14px",
                fontFamily: "'Nunito', sans-serif", boxSizing: "border-box",
              }} />
          </div>

          {/* Age */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#AAA", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Baby's Age</div>
            <input value={age} onChange={e => setAge(e.target.value)}
              placeholder="e.g. 3 months, 1 year..."
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "12px",
                border: "2px solid #F0F0F0", outline: "none", fontSize: "14px",
                fontFamily: "'Nunito', sans-serif", boxSizing: "border-box",
              }} />
          </div>

          {/* Note */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#AAA", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Memory Note</div>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Write a sweet memory..."
              style={{
                width: "100%", minHeight: "72px", borderRadius: "12px",
                border: "2px solid #F0F0F0", padding: "10px 14px",
                fontFamily: "'Nunito', sans-serif", fontSize: "14px", color: "#555",
                outline: "none", resize: "none", boxSizing: "border-box",
              }} />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#AAA", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ALL_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700,
                  border: "none", cursor: "pointer", transition: "all 0.15s",
                  background: selectedTags.includes(tag) ? "#FF6B9D" : "#F0F0F0",
                  color: selectedTags.includes(tag) ? "white" : "#888",
                }}>#{tag}</button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={!name.trim()}
            style={{
              width: "100%", padding: "14px", borderRadius: "14px", border: "none",
              background: name.trim() ? "linear-gradient(135deg,#FF6B9D,#9B5DE5)" : "#E0E0E0",
              color: name.trim() ? "white" : "#AAA",
              fontSize: "15px", fontWeight: 900, cursor: name.trim() ? "pointer" : "not-allowed",
              fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
            }}>
            ✨ Add Photo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ───
function StatCard({ emoji, label, value, color }) {
  return (
    <div style={{
      background: "white", borderRadius: "18px", padding: "20px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.07)", flex: "1", minWidth: "140px",
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{emoji}</div>
      <div style={{ fontSize: "26px", fontWeight: 900, color: "#222", fontFamily: "'Nunito', sans-serif" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 700, marginTop: "2px" }}>{label}</div>
    </div>
  );
}

// ─── MAIN APP ───
export default function BabyPhotoDashboard() {
  const [photos, setPhotos] = useState(SAMPLE_PHOTOS);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState([]);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Pacifico&display=swap');`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const filteredPhotos = photos
    .filter(p => activeTag === "all" || p.tags.includes(activeTag))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "date" ? b.date.localeCompare(a.date) : a.name.localeCompare(b.name));

  const handleSelect = (photo) => {
    setSelected(prev => prev.find(p => p.id === photo.id)
      ? prev.filter(p => p.id !== photo.id)
      : [...prev, photo]);
  };

  const handleDelete = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    setSelected(prev => prev.filter(p => p.id !== id));
  };

  const handleDeleteSelected = () => {
    const ids = selected.map(p => p.id);
    setPhotos(prev => prev.filter(p => !ids.includes(p.id)));
    setSelected([]);
  };

  const handleUpdate = (updated) => {
    setPhotos(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAdd = (newPhoto) => {
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const handleUpload = (files) => {
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newPhoto = {
          id: Date.now() + i,
          name: file.name.replace(/\.[^.]+$/, ""),
          date: new Date().toISOString().split("T")[0],
          tags: [],
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          angle: "front",
          bg: null,
          previewUrl: ev.target.result,
          age: "Unknown",
          note: "",
        };
        setPhotos(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  const usedTags = [...new Set(photos.flatMap(p => p.tags))];
  const tagCounts = usedTags.reduce((acc, t) => {
    acc[t] = photos.filter(p => p.tags.includes(t)).length;
    return acc;
  }, {});

  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    count: photos.filter(p => new Date(p.date).getMonth() === i).length,
  }));
  const maxCount = Math.max(...monthlyData.map(d => d.count), 1);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4FF", fontFamily: "'Nunito', sans-serif", display: "flex" }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: sidebarOpen ? "240px" : "0", overflow: "hidden",
        background: "white", borderRight: "1px solid #F0E8FF",
        transition: "width 0.3s ease", flexShrink: 0, display: "flex", flexDirection: "column",
        boxShadow: "4px 0 20px rgba(155,93,229,0.08)",
      }}>
        <div style={{ padding: "24px 20px", minWidth: "240px" }}>
          {/* Logo */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontFamily: "'Pacifico', cursive", fontSize: "20px", background: "linear-gradient(135deg,#FF6B9D,#9B5DE5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              BabyShots ✨
            </div>
            <div style={{ fontSize: "11px", color: "#CCC", marginTop: "2px" }}>Capture every moment</div>
          </div>

          {/* Nav */}
          {[
            { icon: "🏠", label: "All Photos", tag: "all" },
            ...usedTags.map(t => ({ icon: "🏷️", label: `#${t}`, tag: t, count: tagCounts[t] })),
          ].map(item => (
            <div key={item.tag} onClick={() => setActiveTag(item.tag)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", borderRadius: "12px", cursor: "pointer",
                background: activeTag === item.tag ? "#FFF0F5" : "transparent",
                color: activeTag === item.tag ? "#FF6B9D" : "#666",
                fontWeight: activeTag === item.tag ? 800 : 600,
                marginBottom: "4px", transition: "all 0.15s", fontSize: "14px",
              }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count && <span style={{ fontSize: "11px", background: "#F0F0F0", padding: "2px 7px", borderRadius: "10px", color: "#999" }}>{item.count}</span>}
            </div>
          ))}

          {/* Monthly Chart */}
          <div style={{ marginTop: "28px", borderTop: "1px solid #F5F0FF", paddingTop: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#CCC", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Monthly</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "60px" }}>
              {monthlyData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <div style={{
                    width: "100%", background: d.count > 0 ? "linear-gradient(to top,#FF6B9D,#9B5DE5)" : "#F0F0F0",
                    borderRadius: "4px 4px 0 0", height: `${(d.count / maxCount) * 48 + (d.count > 0 ? 4 : 0)}px`,
                    transition: "height 0.3s",
                  }} />
                  <div style={{ fontSize: "8px", color: "#CCC" }}>{d.month[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top Bar */}
        <div style={{
          background: "white", borderBottom: "1px solid #F0E8FF",
          padding: "16px 24px", display: "flex", alignItems: "center", gap: "14px",
          boxShadow: "0 2px 12px rgba(155,93,229,0.06)",
        }}>
          {/* Sidebar toggle */}
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: "20px", padding: "4px",
          }}>☰</button>

          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search photos, tags..."
              style={{
                width: "100%", padding: "10px 14px 10px 40px", borderRadius: "12px",
                border: "2px solid #F0E8FF", outline: "none", fontSize: "14px",
                fontFamily: "'Nunito', sans-serif", background: "#FAFAFA", boxSizing: "border-box",
              }} />
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{
                padding: "9px 12px", borderRadius: "10px", border: "2px solid #F0E8FF",
                fontSize: "13px", fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                background: "white", color: "#666", outline: "none", cursor: "pointer",
              }}>
              <option value="date">📅 Date</option>
              <option value="name">🔤 Name</option>
            </select>

            {/* View Toggle */}
            <div style={{ display: "flex", background: "#F0E8FF", borderRadius: "10px", padding: "3px" }}>
              {["grid", "list"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: "7px 12px", borderRadius: "8px", border: "none",
                  background: view === v ? "white" : "transparent",
                  cursor: "pointer", fontSize: "14px",
                  boxShadow: view === v ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s",
                }}>{v === "grid" ? "⊞" : "☰"}</button>
              ))}
            </div>

            {/* Add Button */}
            <button onClick={() => setShowAddModal(true)} style={{
              padding: "10px 18px", borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg,#FF6B9D,#9B5DE5)",
              color: "white", fontSize: "14px", fontWeight: 900, cursor: "pointer",
              fontFamily: "'Nunito', sans-serif", boxShadow: "0 4px 16px rgba(255,107,157,0.4)",
              transition: "transform 0.15s",
            }}>
              + Add Photo
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
            <StatCard emoji="📸" label="Total Photos" value={photos.length} color="#FF6B9D" />
            <StatCard emoji="🏷️" label="Tags Used" value={usedTags.length} color="#9B5DE5" />
            <StatCard emoji="🗂️" label="This Month" value={photos.filter(p => {
              const d = new Date(p.date); const n = new Date();
              return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
            }).length} color="#06D6A0" />
            <StatCard emoji="⭐" label="Milestones" value={photos.filter(p => p.tags.includes("milestone")).length} color="#FFB347" />
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div style={{
              background: "linear-gradient(135deg,#FFF0F5,#F5F0FF)",
              border: "2px solid #FF6B9D", borderRadius: "14px",
              padding: "12px 18px", marginBottom: "18px",
              display: "flex", alignItems: "center", gap: "14px",
            }}>
              <span style={{ fontWeight: 800, fontSize: "14px", color: "#FF6B9D" }}>{selected.length} selected</span>
              <button onClick={handleDeleteSelected} style={{
                padding: "7px 14px", borderRadius: "10px", border: "none",
                background: "#FF6B9D", color: "white", cursor: "pointer",
                fontSize: "13px", fontWeight: 800, fontFamily: "'Nunito', sans-serif",
              }}>🗑️ Delete Selected</button>
              <button onClick={() => setSelected([])} style={{
                background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#AAA", fontWeight: 700,
              }}>Clear</button>
            </div>
          )}

          {/* Upload Zone */}
          <div style={{ marginBottom: "24px" }}>
            <UploadZone onUpload={handleUpload} />
          </div>

          {/* Tag filter strip */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
            {["all", ...usedTags].map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{
                padding: "7px 16px", borderRadius: "20px", border: "none",
                background: activeTag === tag ? "linear-gradient(135deg,#FF6B9D,#9B5DE5)" : "white",
                color: activeTag === tag ? "white" : "#888",
                fontWeight: 800, fontSize: "13px", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", flexShrink: 0,
                boxShadow: activeTag === tag ? "0 4px 12px rgba(255,107,157,0.35)" : "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.2s",
              }}>
                {tag === "all" ? "✨ All" : `#${tag}`}
              </button>
            ))}
          </div>

          {/* Photos */}
          {filteredPhotos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#CCC" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🍼</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#BBB" }}>No photos found</div>
              <div style={{ fontSize: "14px", marginTop: "6px" }}>Try uploading or adjusting your search</div>
            </div>
          ) : view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "18px" }}>
              {filteredPhotos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} onSelect={handleSelect} onDelete={handleDelete}
                  isSelected={!!selected.find(p => p.id === photo.id)} view="grid"
                  onClick={() => setModalPhoto(photo)} />
              ))}
            </div>
          ) : (
            <div>
              {filteredPhotos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} onSelect={handleSelect} onDelete={handleDelete}
                  isSelected={!!selected.find(p => p.id === photo.id)} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modalPhoto && (
        <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} onUpdate={handleUpdate} />
      )}
      {showAddModal && (
        <AddPhotoModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}