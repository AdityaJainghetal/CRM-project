

// import React, { useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const BASE_URL = "http://localhost:8000/api";

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
//     formData.append("file", file); // 👈 MUST match backend

//     try {
//       setUploading(true);

//       const res = await axios.post(
//         `${BASE_URL}/leads/bulk-upload`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );

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
//       <h2>Bulk Upload</h2>

//       <input
//         id="fileInput"
//         type="file"
//         accept=".csv,.xlsx,.xls"
//         onChange={handleFileChange}
//       />

//       <br /><br />

//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? "Uploading..." : "Upload"}
//       </button>

//       <ToastContainer />
//     </div>
//   );
// };

// export default AddStudent;

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8000/api"; // ✅ Fixed port: 8000

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
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await axios.post(`${BASE_URL}/leads/bulk-upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          // Do NOT set Content-Type manually — axios sets multipart/form-data automatically
        },
      });

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
      <h2>Bulk Upload Leads</h2>

      <input
        id="fileInput"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {file && (
        <p style={{ marginTop: 8, color: "#555" }}>
          Selected: <strong>{file.name}</strong>
        </p>
      )}

      <ToastContainer />
    </div>
  );
};

export default AddStudent;