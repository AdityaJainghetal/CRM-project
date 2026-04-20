// import React, { useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../../contexts/AuthContext";

// const BASE_URL = "http://localhost:8000/api";

// const AddStudent = () => {
//   const { user } = useAuth();
//   const isAdmin = user?.role === "admin";

//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadResult, setUploadResult] = useState(null);

//   const getAuthConfig = () => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       toast.error("Session expired. Please login again.");
//       return null;
//     }
//     return { headers: { Authorization: `Bearer ${token}` } };
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile || null);
//     setUploadResult(null);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       return toast.error("Please select an Excel or CSV file first.");
//     }

//     const config = getAuthConfig();
//     if (!config) return;

//     setUploading(true);
//     setUploadResult(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/leads/bulk-upload`,
//         formData,
//         config, // Do NOT add extra Content-Type header
//       );

//       const { message, imported = 0, totalRows = 0, skipped = 0 } = res.data;

//       setUploadResult({ success: true, message, imported, totalRows, skipped });
//       toast.success(message);

//       setFile(null);
//       document.getElementById("student-file-input").value = "";
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || "Upload failed";
//       setUploadResult({ success: false, message: msg });
//       toast.error(msg);
//       console.error("Full error:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "24px",
//         fontFamily: "Arial, sans-serif",
//         maxWidth: "900px",
//         margin: "0 auto",
//       }}
//     >
//       <h1>Bulk Upload Students / Leads</h1>

//       <div
//         style={{
//           padding: "25px",
//           border: "1px solid #ddd",
//           borderRadius: "10px",
//           backgroundColor: "#fff",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//           marginBottom: "25px",
//         }}
//       >
//         <h2>Upload Excel / CSV File</h2>
//         <p style={{ color: "#555", marginBottom: "20px" }}>
//           Supported formats: <strong>.xlsx, .xls, .csv</strong>
//           <br />
//           Make sure your file has columns like: Name, Phone Number, Parent's
//           Name, City, Email, etc.
//         </p>

//         <input
//           id="student-file-input"
//           type="file"
//           accept=".csv,.xlsx,.xls"
//           onChange={handleFileChange}
//           style={{ marginBottom: "20px", display: "block" }}
//         />

//         <button
//           onClick={handleUpload}
//           disabled={uploading || !file}
//           style={{
//             padding: "12px 28px",
//             backgroundColor: uploading || !file ? "#ccc" : "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "6px",
//             cursor: uploading || !file ? "not-allowed" : "pointer",
//             fontSize: "16px",
//           }}
//         >
//           {uploading ? "Uploading..." : "Upload Student Data"}
//         </button>

//         {uploadResult && (
//           <div
//             style={{
//               marginTop: "20px",
//               padding: "15px",
//               borderRadius: "6px",
//               backgroundColor: uploadResult.success ? "#d4edda" : "#f8d7da",
//               color: uploadResult.success ? "#155724" : "#721c24",
//             }}
//           >
//             <strong>{uploadResult.message}</strong>
//             {uploadResult.success && (
//               <div style={{ marginTop: "10px" }}>
//                 <p>
//                   Total Rows: <strong>{uploadResult.totalRows}</strong>
//                 </p>
//                 <p>
//                   Successfully Imported:{" "}
//                   <strong>{uploadResult.imported}</strong>
//                 </p>
//                 {uploadResult.skipped > 0 && (
//                   <p>
//                     Skipped (duplicates/invalid):{" "}
//                     <strong>{uploadResult.skipped}</strong>
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Sample Format Info */}
//       <div
//         style={{
//           padding: "20px",
//           backgroundColor: "#f8f9fa",
//           borderRadius: "8px",
//         }}
//       >
//         <h3>Expected Columns (Your file format is perfect)</h3>
//         <p>
//           <strong>
//             Name, Phone Number, Parent's Name, City, Email, NEET Status, Budget,
//             Preferred Country
//           </strong>
//         </p>
//         <p style={{ color: "#28a745", fontWeight: "bold" }}>
//           Your current Excel file matches the expected format. Just upload it
//           directly.
//         </p>
//       </div>

//       <ToastContainer position="top-right" autoClose={6000} />
//     </div>
//   );
// };

// export default AddStudent;

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8000/api";

const AddStudent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a file first");
    }

    const formData = new FormData();
    formData.append("file", file); // 👈 MUST match backend

    try {
      setUploading(true);

      const res = await axios.post(
        `${BASE_URL}/leads/bulk-upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success(res.data.message);
      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Bulk Upload</h2>

      <input
        id="fileInput"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <ToastContainer />
    </div>
  );
};

export default AddStudent;