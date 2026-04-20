// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const BASE_URL = "http://localhost:8000/api";

// const STATUS_OPTIONS = ["New", "Not Interested", "Call Back", "Interested", "Converted", "Dropped"];
// const TAG_OPTIONS = ["Hot", "Warm", "Cold"];

// const defaultForm = {
//   name: "", phone: "", parentName: "", city: "", email: "",
//   neetStatus: "", budget: "", preferredCountry: "", collegeName: "",
//   emergencyContact: "", status: "New", leadTag: "Warm",
// };

// const LeadList = () => {
//   const [leads, setLeads] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [editingLead, setEditingLead] = useState(null); // null = add, object = edit
//   const [form, setForm] = useState(defaultForm);
//   const [saving, setSaving] = useState(false);

//   const authHeader = {
//     headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//   };

//   const fetchLeads = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = { page, limit: 10, search, status: statusFilter };
//       const res = await axios.get(`${BASE_URL}/leads`, { ...authHeader, params });
//       setLeads(res.data.data);
//       setTotal(res.data.total);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to fetch leads");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, statusFilter]);

//   useEffect(() => { fetchLeads(); }, [fetchLeads]);

//   const openAddModal = () => {
//     setEditingLead(null);
//     setForm(defaultForm);
//     setShowModal(true);
//   };

//   const openEditModal = (lead) => {
//     setEditingLead(lead);
//     setForm({
//       name: lead.name || "",
//       phone: lead.phone || "",
//       parentName: lead.parentName || "",
//       city: lead.city || "",
//       email: lead.email || "",
//       neetStatus: lead.neetStatus || "",
//       budget: lead.budget || "",
//       preferredCountry: lead.preferredCountry || "",
//       collegeName: lead.collegeName || "",
//       emergencyContact: lead.emergencyContact || "",
//       status: lead.status || "New",
//       leadTag: lead.leadTag || "Warm",
//     });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!form.name || !form.phone) {
//       return toast.error("Name and Phone are required");
//     }

//     try {
//       setSaving(true);
//       if (editingLead) {
//         await axios.put(`${BASE_URL}/leads/${editingLead._id}`, form, authHeader);
//         toast.success("Lead updated!");
//       } else {
//         // Single lead add
//         await axios.post(`${BASE_URL}/leads/add`, form, authHeader);
//         toast.success("Lead added!");
//       }
//       setShowModal(false);
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this lead?")) return;
//     try {
//       await axios.delete(`${BASE_URL}/leads/${id}`, authHeader);
//       toast.success("Lead deleted!");
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Leads ({total})</h2>

//       {/* Filters */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
//         <input
//           placeholder="Search name / phone / email..."
//           value={search}
//           onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//           style={{ padding: "6px 10px", minWidth: 220 }}
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
//           style={{ padding: "6px 10px" }}
//         >
//           <option value="">All Status</option>
//           {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
//         </select>
//         <button onClick={openAddModal} style={{ padding: "6px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
//           + Add Lead
//         </button>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
//             <thead>
//               <tr style={{ background: "#f1f5f9" }}>
//                 {["Name", "Phone", "City", "Email", "Status", "Tag", "Country", "Actions"].map((h) => (
//                   <th key={h} style={{ padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {leads.length === 0 ? (
//                 <tr><td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#888" }}>No leads found</td></tr>
//               ) : (
//                 leads.map((lead) => (
//                   <tr key={lead._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
//                     <td style={{ padding: "8px 12px" }}>{lead.name}</td>
//                     <td style={{ padding: "8px 12px" }}>{lead.phone}</td>
//                     <td style={{ padding: "8px 12px" }}>{lead.city || "—"}</td>
//                     <td style={{ padding: "8px 12px" }}>{lead.email || "—"}</td>
//                     <td style={{ padding: "8px 12px" }}>
//                       <span style={{
//                         padding: "2px 8px", borderRadius: 12, fontSize: 12,
//                         background: lead.status === "Converted" ? "#dcfce7" : lead.status === "New" ? "#dbeafe" : "#fef9c3",
//                         color: lead.status === "Converted" ? "#166534" : lead.status === "New" ? "#1e40af" : "#854d0e"
//                       }}>
//                         {lead.status}
//                       </span>
//                     </td>
//                     <td style={{ padding: "8px 12px" }}>
//                       <span style={{
//                         padding: "2px 8px", borderRadius: 12, fontSize: 12,
//                         background: lead.leadTag === "Hot" ? "#fee2e2" : lead.leadTag === "Warm" ? "#ffedd5" : "#e0f2fe",
//                         color: lead.leadTag === "Hot" ? "#991b1b" : lead.leadTag === "Warm" ? "#9a3412" : "#0369a1"
//                       }}>
//                         {lead.leadTag}
//                       </span>
//                     </td>
//                     <td style={{ padding: "8px 12px" }}>{lead.preferredCountry || "—"}</td>
//                     <td style={{ padding: "8px 12px" }}>
//                       <button onClick={() => openEditModal(lead)} style={{ marginRight: 8, padding: "4px 10px", cursor: "pointer", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 4 }}>
//                         Edit
//                       </button>
//                       <button onClick={() => handleDelete(lead._id)} style={{ padding: "4px 10px", cursor: "pointer", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4 }}>
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
//         <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "4px 12px" }}>Prev</button>
//         <span>Page {page} of {totalPages}</span>
//         <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "4px 12px" }}>Next</button>
//       </div>

//       {/* Add/Edit Modal */}
//       {showModal && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
//           <div style={{ background: "#fff", borderRadius: 8, padding: 24, width: 500, maxHeight: "90vh", overflowY: "auto" }}>
//             <h3 style={{ marginTop: 0 }}>{editingLead ? "Edit Lead" : "Add Lead"}</h3>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//               {[
//                 { label: "Name *", key: "name" },
//                 { label: "Phone *", key: "phone" },
//                 { label: "Parent Name", key: "parentName" },
//                 { label: "City", key: "city" },
//                 { label: "Email", key: "email" },
//                 { label: "NEET Status", key: "neetStatus" },
//                 { label: "Budget", key: "budget" },
//                 { label: "Preferred Country", key: "preferredCountry" },
//                 { label: "College Name", key: "collegeName" },
//                 { label: "Emergency Contact", key: "emergencyContact" },
//               ].map(({ label, key }) => (
//                 <div key={key}>
//                   <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
//                   <input
//                     value={form[key]}
//                     onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//                     style={{ width: "100%", padding: "6px 8px", marginTop: 2, borderRadius: 4, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label style={{ fontSize: 12, color: "#555" }}>Status</label>
//                 <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
//                   style={{ width: "100%", padding: "6px 8px", marginTop: 2, borderRadius: 4, border: "1px solid #cbd5e1" }}>
//                   {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
//                 </select>
//               </div>

//               <div>
//                 <label style={{ fontSize: 12, color: "#555" }}>Lead Tag</label>
//                 <select value={form.leadTag} onChange={(e) => setForm({ ...form, leadTag: e.target.value })}
//                   style={{ width: "100%", padding: "6px 8px", marginTop: 2, borderRadius: 4, border: "1px solid #cbd5e1" }}>
//                   {TAG_OPTIONS.map((t) => <option key={t}>{t}</option>)}
//                 </select>
//               </div>
//             </div>

//             <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
//               <button onClick={() => setShowModal(false)} style={{ padding: "7px 18px", borderRadius: 4, border: "1px solid #cbd5e1", cursor: "pointer" }}>
//                 Cancel
//               </button>
//               <button onClick={handleSave} disabled={saving}
//                 style={{ padding: "7px 18px", borderRadius: 4, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}>
//                 {saving ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default LeadList;

// import React, { useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const BASE_URL = "http://localhost:8000/api"; // ✅ Fixed port: 8000

// const AddStudent = () => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       return toast.error("Please select a file first");
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setUploading(true);

//       const res = await axios.post(`${BASE_URL}/leads/bulk-upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           // Do NOT set Content-Type manually — axios sets multipart/form-data automatically
//         },
//       });

//       toast.success(res.data.message);
//       setFile(null);
//       document.getElementById("fileInput").value = "";
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Bulk Upload Leads</h2>

//       <input
//         id="fileInput"
//         type="file"
//         accept=".csv,.xlsx,.xls"
//         onChange={handleFileChange}
//       />

//       <br />
//       <br />

//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? "Uploading..." : "Upload"}
//       </button>

//       {file && (
//         <p style={{ marginTop: 8, color: "#555" }}>
//           Selected: <strong>{file.name}</strong>
//         </p>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default AddStudent;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8000/api";

const STATUS_OPTIONS = ["New", "Interested", "Call Back", "Not Interested", "Converted", "Dropped"];
const TAG_OPTIONS = ["Hot", "Warm", "Cold"];

const defaultForm = {
  name: "", phone: "", parentName: "", city: "", email: "",
  neetStatus: "", budget: "", preferredCountry: "", collegeName: "",
  emergencyContact: "", status: "New", leadTag: "Warm",
};

// ─────────────────────────── styles ───────────────────────────
const S = {
  page: { padding: "20px", fontFamily: "sans-serif", color: "#1e293b" },
  tabs: { display: "flex", gap: 4, borderBottom: "1px solid #e2e8f0", marginBottom: 20 },
  tab: (active) => ({
    padding: "8px 20px", border: "none", background: "none", cursor: "pointer",
    fontSize: 13, color: active ? "#1e293b" : "#64748b", fontWeight: active ? 600 : 400,
    borderBottom: active ? "2px solid #2563eb" : "2px solid transparent", marginBottom: -1,
  }),
  stats: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 },
  statCard: { background: "#f8fafc", borderRadius: 10, padding: "12px 16px", border: "1px solid #e2e8f0" },
  statLabel: { fontSize: 11, color: "#94a3b8", marginBottom: 4 },
  statNum: (color) => ({ fontSize: 24, fontWeight: 700, color: color || "#1e293b" }),
  filters: { display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" },
  input: { padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, color: "#1e293b", background: "#fff", outline: "none" },
  select: { padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, color: "#1e293b", background: "#fff", outline: "none" },
  tableWrap: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { padding: "10px 12px", textAlign: "left", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: 12, color: "#64748b", fontWeight: 600 },
  td: { padding: "10px 12px", borderBottom: "1px solid #f1f5f9", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  btn: (bg, color) => ({ padding: "7px 16px", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, background: bg, color: color || "#fff", fontWeight: 500 }),
  pagination: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", justifyContent: "flex-end", fontSize: 13, color: "#64748b" },
  pageBtn: (disabled) => ({ padding: "4px 14px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, opacity: disabled ? 0.4 : 1 }),
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 12, padding: 28, width: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  fieldLabel: { fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  fieldInput: { padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, color: "#1e293b", outline: "none" },
  uploadCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 24, maxWidth: 520 },
  dropZone: (drag) => ({
    border: `2px dashed ${drag ? "#2563eb" : "#cbd5e1"}`, borderRadius: 10, padding: "36px 24px",
    textAlign: "center", cursor: "pointer", background: drag ? "#eff6ff" : "#f8fafc",
    transition: "all 0.2s",
  }),
};

// ─────────────────────── badge helpers ───────────────────────
const statusBadge = (status) => {
  const map = {
    Converted: { bg: "#dcfce7", color: "#166534" },
    New: { bg: "#dbeafe", color: "#1e40af" },
    Interested: { bg: "#d1fae5", color: "#065f46" },
    "Call Back": { bg: "#fef9c3", color: "#854d0e" },
    "Not Interested": { bg: "#fee2e2", color: "#991b1b" },
    Dropped: { bg: "#f1f5f9", color: "#475569" },
  };
  const c = map[status] || { bg: "#f1f5f9", color: "#475569" };
  return <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>{status}</span>;
};

const tagBadge = (tag) => {
  const map = {
    Hot: { bg: "#fee2e2", color: "#991b1b" },
    Warm: { bg: "#ffedd5", color: "#9a3412" },
    Cold: { bg: "#e0f2fe", color: "#0369a1" },
  };
  const c = map[tag] || { bg: "#f1f5f9", color: "#475569" };
  return <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>{tag || "—"}</span>;
};

// ═══════════════════════ MAIN COMPONENT ═══════════════════════
const AddStudent = () => {
  const [activeTab, setActiveTab] = useState("leads");

  // ── leads state ──
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, newCount: 0, converted: 0, hot: 0 });

  // ── modal state ──
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  // ── upload state ──
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null); // { type: 'success'|'error', text }

  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } };

  // ── fetch leads ──
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (tagFilter) params.leadTag = tagFilter;
      const res = await axios.get(`${BASE_URL}/leads`, { ...authHeader, params });
      setLeads(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, tagFilter]);

  // ── fetch stats (separate call without pagination limit) ──
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/leads`, { ...authHeader, params: { page: 1, limit: 1000 } });
      const all = res.data.data || [];
      setStats({
        total: res.data.total || 0,
        newCount: all.filter((l) => l.status === "New").length,
        converted: all.filter((l) => l.status === "Converted").length,
        hot: all.filter((l) => l.leadTag === "Hot").length,
      });
    } catch (_) {}
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const reload = () => { fetchLeads(); fetchStats(); };

  // ── field change ──
  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // ── open add modal ──
  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  // ── open edit modal ──
  const openEdit = (lead) => {
    setEditingId(lead._id);
    setForm({
      name: lead.name || "",
      phone: lead.phone || "",
      parentName: lead.parentName || "",
      city: lead.city || "",
      email: lead.email || "",
      neetStatus: lead.neetStatus || "",
      budget: lead.budget || "",
      preferredCountry: lead.preferredCountry || "",
      collegeName: lead.collegeName || "",
      emergencyContact: lead.emergencyContact || "",
      status: lead.status || "New",
      leadTag: lead.leadTag || "Warm",
    });
    setShowModal(true);
  };

  // ── save lead (add or edit) ──
  const saveLead = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      return toast.error("Name and Phone are required");
    }
    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${BASE_URL}/leads/${editingId}`, form, authHeader);
        toast.success("Lead updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/leads/add`, form, authHeader);
        toast.success("Lead added successfully!");
      }
      setShowModal(false);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── delete lead ──
  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${BASE_URL}/leads/${id}`, authHeader);
      toast.success("Lead deleted!");
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ── file handlers ──
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    document.getElementById("bulkFileInput").value = "";
    setUploadMsg(null);
  };

  // ── bulk upload ──
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first");
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      setUploadMsg(null);
      const res = await axios.post(`${BASE_URL}/leads/bulk-upload`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setUploadMsg({ type: "success", text: `✓ Imported ${res.data.imported} leads! ${res.data.skipped} skipped.` });
      clearFile();
      reload();
    } catch (err) {
      setUploadMsg({ type: "error", text: "✗ " + (err.response?.data?.message || "Upload failed") });
    } finally {
      setUploading(false);
    }
  };

  // ════════════════════════ RENDER ════════════════════════
  return (
    <div style={S.page}>

      {/* ── Tabs ── */}
      <div style={S.tabs}>
        {["leads", "upload"].map((t) => (
          <button key={t} style={S.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
            {t === "leads" ? "Leads" : "Bulk Upload"}
          </button>
        ))}
      </div>

      {/* ══════════ LEADS TAB ══════════ */}
      {activeTab === "leads" && (
        <>
          {/* Stats */}
          <div style={S.stats}>
            {[
              { label: "Total Leads", value: stats.total, color: "#1e293b" },
              { label: "New", value: stats.newCount, color: "#2563eb" },
              { label: "Converted", value: stats.converted, color: "#16a34a" },
              { label: "Hot Leads", value: stats.hot, color: "#dc2626" },
            ].map((s) => (
              <div key={s.label} style={S.statCard}>
                <div style={S.statLabel}>{s.label}</div>
                <div style={S.statNum(s.color)}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={S.filters}>
            <input
              style={{ ...S.input, minWidth: 220 }}
              placeholder="Search name / phone / email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select style={S.select} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select style={S.select} value={tagFilter} onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}>
              <option value="">All Tags</option>
              {TAG_OPTIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button style={S.btn("#2563eb")} onClick={openAdd}>+ Add Lead</button>
          </div>

          {/* Table */}
          <div style={S.tableWrap}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading…</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {["#", "Name", "Phone", "Parent", "City", "Email", "Status", "Tag", "Country", "Budget", "Actions"].map((h) => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
                          No leads found
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead, idx) => (
                        <tr key={lead._id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <td style={S.td}>{(page - 1) * 10 + idx + 1}</td>
                          <td style={{ ...S.td, fontWeight: 600 }} title={lead.name}>{lead.name}</td>
                          <td style={S.td}>{lead.phone}</td>
                          <td style={S.td} title={lead.parentName}>{lead.parentName || "—"}</td>
                          <td style={S.td} title={lead.city}>{lead.city || "—"}</td>
                          <td style={S.td} title={lead.email}>{lead.email || "—"}</td>
                          <td style={S.td}>{statusBadge(lead.status)}</td>
                          <td style={S.td}>{tagBadge(lead.leadTag)}</td>
                          <td style={S.td} title={lead.preferredCountry}>{lead.preferredCountry || "—"}</td>
                          <td style={S.td}>{lead.budget ? `₹${Number(lead.budget).toLocaleString("en-IN")}` : "—"}</td>
                          <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                            <button
                              style={{ ...S.btn("#f59e0b"), padding: "4px 12px", fontSize: 12, marginRight: 6 }}
                              onClick={() => openEdit(lead)}
                            >Edit</button>
                            <button
                              style={{ ...S.btn("#ef4444"), padding: "4px 12px", fontSize: 12 }}
                              onClick={() => deleteLead(lead._id)}
                            >Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={S.pagination}>
                <span>{total} leads total</span>
                <button style={S.pageBtn(page === 1)} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button style={S.pageBtn(page === totalPages)} disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════ UPLOAD TAB ══════════ */}
      {activeTab === "upload" && (
        <div style={{ maxWidth: 560 }}>
          <div style={S.uploadCard}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Bulk Upload Leads</h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Upload an Excel or CSV file. Required: <strong>Name</strong>, <strong>Phone Number</strong>.
              Optional: Parent's Name, City, Email, NEET Status, Budget, Preferred Country.
            </p>

            {/* Drop Zone */}
            <div
              style={S.dropZone(dragging)}
              onClick={() => document.getElementById("bulkFileInput").click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleFileDrop}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                {file ? file.name : "Click or drag & drop file here"}
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Supports .xlsx, .xls, .csv</p>
            </div>
            <input type="file" id="bulkFileInput" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleFileChange} />

            {/* File info */}
            {file && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📄 {file.name} <span style={{ color: "#64748b" }}>({(file.size / 1024).toFixed(1)} KB)</span></span>
                <button onClick={clearFile} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94a3b8", lineHeight: 1 }}>×</button>
              </div>
            )}

            {/* Upload button */}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <button style={{ ...S.btn("#2563eb"), padding: "9px 28px" }} onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading…" : "Upload"}
              </button>
              {uploadMsg && (
                <span style={{ fontSize: 13, fontWeight: 500, color: uploadMsg.type === "success" ? "#16a34a" : "#dc2626" }}>
                  {uploadMsg.text}
                </span>
              )}
            </div>
          </div>

          {/* Sample format */}
          <div style={{ ...S.uploadCard, marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Sample Excel Format</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ ...S.table, fontSize: 12 }}>
                <thead>
                  <tr>
                    {["Name", "Phone Number", "Parent's Name", "City", "Email", "NEET Status", "Budget", "Preferred Country"].map((h) => (
                      <th key={h} style={{ ...S.th, fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={S.td}>Rahul Sharma</td>
                    <td style={S.td}>9876543210</td>
                    <td style={S.td}>Suresh Sharma</td>
                    <td style={S.td}>Indore</td>
                    <td style={S.td}>rahul@gmail.com</td>
                    <td style={S.td}>Appeared</td>
                    <td style={S.td}>1500000</td>
                    <td style={S.td}>Russia</td>
                  </tr>
                  <tr>
                    <td style={S.td}>Priya Patel</td>
                    <td style={S.td}>8765432109</td>
                    <td style={S.td}>Rajesh Patel</td>
                    <td style={S.td}>Bhopal</td>
                    <td style={S.td}>priya@gmail.com</td>
                    <td style={S.td}>2024</td>
                    <td style={S.td}>1200000</td>
                    <td style={S.td}>Georgia</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ADD / EDIT MODAL ══════════ */}
      {showModal && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{editingId ? "Edit Lead" : "Add New Lead"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
            </div>

            <div style={S.grid2}>
              {[
                { label: "Name *", key: "name", placeholder: "Full name" },
                { label: "Phone *", key: "phone", placeholder: "10-digit number" },
                { label: "Parent Name", key: "parentName", placeholder: "Parent / guardian name" },
                { label: "City", key: "city", placeholder: "City" },
                { label: "Email", key: "email", placeholder: "email@example.com" },
                { label: "NEET Status", key: "neetStatus", placeholder: "e.g. Appeared 2024" },
                { label: "Budget (₹)", key: "budget", placeholder: "e.g. 1500000", type: "number" },
                { label: "Preferred Country", key: "preferredCountry", placeholder: "Russia, Georgia…" },
                { label: "College Name", key: "collegeName", placeholder: "College name" },
                { label: "Emergency Contact", key: "emergencyContact", placeholder: "Phone number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} style={S.field}>
                  <label style={S.fieldLabel}>{label}</label>
                  <input
                    type={type || "text"}
                    style={S.fieldInput}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setField(key, e.target.value)}
                  />
                </div>
              ))}

              <div style={S.field}>
                <label style={S.fieldLabel}>Status</label>
                <select style={S.fieldInput} value={form.status} onChange={(e) => setField("status", e.target.value)}>
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={S.field}>
                <label style={S.fieldLabel}>Lead Tag</label>
                <select style={S.fieldInput} value={form.leadTag} onChange={(e) => setField("leadTag", e.target.value)}>
                  {TAG_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button style={{ ...S.btn("#f1f5f9", "#475569"), border: "1px solid #e2e8f0" }} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button style={S.btn("#2563eb")} onClick={saveLead} disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update Lead" : "Add Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddStudent;