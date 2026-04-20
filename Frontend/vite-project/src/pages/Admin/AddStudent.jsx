

import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Upload, FileSpreadsheet, Users, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const AddStudent = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Flexible column name mapping for your Excel
  const normalizeKey = (key) => {
    const k = key.toString().toLowerCase().trim();
    if (k.includes("name") && !k.includes("parent")) return "name";
    if (k.includes("phone") || k.includes("mobile") || k.includes("number")) return "phone";
    if (k.includes("parent") || k.includes("father") || k.includes("mother")) return "parentName";
    if (k.includes("city") || k.includes("location")) return "city";
    if (k.includes("email")) return "email";
    if (k.includes("neet")) return "neetStatus";
    if (k.includes("budget")) return "budget";
    if (k.includes("country") || k.includes("prefer")) return "preferredCountry";
    return k;
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    setLoading(true);
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setStudents([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const processedStudents = jsonData.map((row) => {
          const student = {};
          Object.keys(row).forEach((key) => {
            const normalized = normalizeKey(key);
            student[normalized] = row[key];
          });

          return {
            name: student.name || "",
            phone: student.phone || "",
            parentName: student.parentName || "",
            city: student.city || "",
            email: student.email || "",
            neetStatus: student.neetStatus || "",
            budget: student.budget || "",
            preferredCountry: student.preferredCountry || "",
          };
        });

        // Filter out completely empty rows
        const validStudents = processedStudents.filter(s => s.name || s.phone);

        setStudents(validStudents);
        
        if (validStudents.length > 0) {
          toast.success(`${validStudents.length} students loaded successfully from your Excel!`);
        } else {
          toast.warning("No valid student data found in the file.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to parse Excel file. Please check the format.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && /\.(xlsx|xls|csv)$/i.test(droppedFile.name)) {
      processFile(droppedFile);
    } else {
      toast.error("Please upload a valid Excel or CSV file (.xlsx, .xls, .csv)");
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const clearData = () => {
    setFile(null);
    setFileName("");
    setStudents([]);
    toast.info("Data cleared successfully");
  };

  // ==================== BACKEND SAVE FUNCTION ====================
  const addAllStudents = async () => {
    if (!file || students.length === 0) {
      toast.error("No students to add");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/leads/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message);
        
      } else {
        toast.error(result.message || "Failed to save students to database");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Network error! Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Add Students</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload Excel sheet to bulk import students into database
          </p>
        </div>

        {students.length > 0 && (
          <div className="flex gap-3">
            <Button 
              onClick={addAllStudents} 
              size="lg" 
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving to Database...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Save All Students ({students.length})
                </>
              )}
            </Button>

            <Button variant="outline" onClick={clearData} size="lg" disabled={uploading}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-10">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="mx-auto w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
              <FileSpreadsheet className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Upload Excel or CSV File</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Drag and drop your file here or click to browse.<br />
              Supported formats: <strong>.xlsx, .xls, .csv</strong>
            </p>

            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button asChild size="lg">
                <span>
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Excel File
                </span>
              </Button>
            </Label>

            <Input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
            />

            {fileName && (
              <p className="mt-6 text-sm text-muted-foreground">
                Selected File: <span className="font-medium text-foreground">{fileName}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Preview — {students.length} Students Ready to Save
              <Badge variant="secondary">{fileName}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Parent's Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>NEET Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Preferred Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {student.name || "—"}
                      </TableCell>
                      <TableCell className="font-mono">
                        {student.phone || "—"}
                      </TableCell>
                      <TableCell>{student.parentName || "—"}</TableCell>
                      <TableCell>{student.city || "—"}</TableCell>
                      <TableCell>{student.email || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={student.neetStatus ? "default" : "secondary"}>
                          {student.neetStatus || "Not Specified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.budget ? `₹${student.budget}` : "—"}
                      </TableCell>
                      <TableCell>{student.preferredCountry || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {students.length === 0 && !loading && (
        <Card className="py-20">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">
              Upload your Excel file to see student preview here
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your file should have columns: Name, Phone Number, Parent's Name, etc.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-lg">Processing your Excel file...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddStudent;