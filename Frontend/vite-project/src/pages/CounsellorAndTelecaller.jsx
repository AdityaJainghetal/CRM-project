


// import React, { useState, useEffect } from "react";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import { Badge } from "../components/ui/badge";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";
// import { Checkbox } from "../components/ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { Avatar, AvatarFallback } from "../components/ui/avatar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";

// // Lucide React Icons
// import { 
//   Users, 
//   UserCheck, 
//   Clock, 
//   Edit2, 
//   Eye, 
//   DollarSign, 
//   Save 
// } from "lucide-react";
// import { toast } from "react-toastify";

// const BASE_URL = "http://localhost:8000/api";

// const Counsellorandtellecaller = () => {
//   const [activeTab, setActiveTab] = useState("interested");
//   const [students, setStudents] = useState({
//     interested: [],
//     followUp: [],
//     closed: [],
//   });
//   const [loading, setLoading] = useState(true);

//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [remark, setRemark] = useState("");
//   const [moveToStatus, setMoveToStatus] = useState("");

//   const [progressModal, setProgressModal] = useState(null);
//   const [progressData, setProgressData] = useState({
//     registrationFeeSubmitted: false,
//     documentsSubmitted: false,
//     documentFileReady: false,
//     collegeApplicationDone: false,
//     admissionLetterIssued: false,
//     visaApplied: false,
//     visaIssued: false,
//     ticketBooked: false,
//     remarks: "",
//   });

//   const authHeader = {
//     headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//   };

//   // Fetch Leads from Backend
//   const fetchLeads = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/leads`, {
//         method: "GET",
//         ...authHeader,
//       });

//       if (!res.ok) throw new Error("Failed to fetch leads");

//       const data = await res.json();
//       const allLeads = data.data || [];

//       const categorized = {
//         interested: allLeads.filter((lead) =>
//           ["New", "Interested"].includes(lead.status)
//         ),
//         followUp: allLeads.filter((lead) =>
//           ["Call Back"].includes(lead.status)
//         ),
//         closed: allLeads.filter((lead) =>
//           ["Converted", "Admitted", "Dropped"].includes(lead.status)
//         ),
//       };

//       setStudents(categorized);
//     } catch (err) {
//       toast.error("Failed to load students. Please login again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const LEAD_TYPES = {
//     Hot: { label: "🔥 Hot", variant: "destructive" },
//     Warm: { label: "☀️ Warm", variant: "default" },
//     Cold: { label: "❄️ Cold", variant: "secondary" },
//   };

//   const openRemarkModal = (student) => {
//     setSelectedStudent(student);
//     setRemark("");
//     setMoveToStatus("");
//   };

//   const openProgressModal = (student) => {
//     setProgressModal(student);
//     setProgressData({
//       registrationFeeSubmitted: false,
//       documentsSubmitted: false,
//       documentFileReady: false,
//       collegeApplicationDone: false,
//       admissionLetterIssued: false,
//       visaApplied: false,
//       visaIssued: false,
//       ticketBooked: false,
//       remarks: "",
//     });
//   };

//   // Save Follow-up
//   const saveFollowUp = async () => {
//     if (!selectedStudent || !remark.trim()) {
//       toast.error("Please write a remark");
//       return;
//     }

//     try {
//       const newStatus = moveToStatus || selectedStudent.status;

//       await fetch(`${BASE_URL}/leads/${selectedStudent._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           ...authHeader.headers,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       toast.success("Follow-up saved successfully!");
//       setSelectedStudent(null);
//       setRemark("");
//       setMoveToStatus("");
//       fetchLeads();
//     } catch (err) {
//       toast.error("Failed to save follow-up");
//     }
//   };

//   // Save Progress
//   const saveProgress = async () => {
//     if (!progressModal) return;

//     try {
//       await fetch(`${BASE_URL}/leads/${progressModal._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           ...authHeader.headers,
//         },
//         body: JSON.stringify({ status: "Interested" }),
//       });

//       toast.success(`Progress updated for ${progressModal.name}`);
//       setProgressModal(null);
//       fetchLeads();
//     } catch (err) {
//       toast.error("Failed to update progress");
//     }
//   };

//   const handleProgressChange = (field, value) => {
//     setProgressData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Reusable Student Info Card Component
//   const StudentInfoCard = ({ student }) => (
//     <div className="bg-slate-50 border rounded-xl p-6 mb-8">
//       <div className="flex items-start gap-5">
//         <Avatar className="h-20 w-20 flex-shrink-0">
//           <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
//             {student?.name?.split(" ").map((n) => n[0]).join("") || "???"}
//           </AvatarFallback>
//         </Avatar>

//         <div className="flex-1 min-w-0">
//           <h2 className="text-2xl font-bold text-slate-900 mb-1">
//             {student?.name}
//           </h2>
//           <p className="text-slate-600 mb-4">{student?.email || "—"}</p>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-4 text-sm">
//             <div>
//               <p className="text-slate-500 text-xs uppercase tracking-widest">Phone</p>
//               <p className="font-medium font-mono">{student?.phone}</p>
//             </div>
//             <div>
//               <p className="text-slate-500 text-xs uppercase tracking-widest">City</p>
//               <p className="font-medium">{student?.city || "—"}</p>
//             </div>
//             <div>
//               <p className="text-slate-500 text-xs uppercase tracking-widest">Budget</p>
//               <p className="font-medium">
//                 {student?.budget 
//                   ? `₹${Number(student.budget).toLocaleString("en-IN")}` 
//                   : "—"}
//               </p>
//             </div>
//             <div>
//               <p className="text-slate-500 text-xs uppercase tracking-widest">Lead Type</p>
//               <Badge 
//                 variant={LEAD_TYPES[student?.leadTag]?.variant || "secondary"}
//                 className="text-xs"
//               >
//                 {LEAD_TYPES[student?.leadTag]?.label || "❄️ Cold"}
//               </Badge>
//             </div>
//             <div>
//               <p className="text-slate-500 text-xs uppercase tracking-widest">Current Status</p>
//               <p className="font-medium">{student?.status}</p>
//             </div>
//             <div>
//               <p className="text-slate-500 text-xs uppercase tracking-widest">Last Follow-up</p>
//               <p className="font-medium">{student?.lastFollowUp || "—"}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderTable = (key, data) => {
//     const isFollowUp = key === "followUp";

//     return (
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-12"></TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Phone</TableHead>
//             <TableHead>City</TableHead>
//             <TableHead>Budget</TableHead>
//             <TableHead>Lead Type</TableHead>
//             <TableHead>Last Follow-up</TableHead>
//             <TableHead className="text-center">Progress</TableHead>
//             {isFollowUp && <TableHead className="text-right">Remark</TableHead>}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {loading ? (
//             <TableRow>
//               <TableCell colSpan={isFollowUp ? 8 : 7} className="text-center py-12">
//                 Loading students...
//               </TableCell>
//             </TableRow>
//           ) : data.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={isFollowUp ? 8 : 7}
//                 className="text-center py-12 text-muted-foreground"
//               >
//                 No students in this section
//               </TableCell>
//             </TableRow>
//           ) : (
//             data.map((student) => {
//               const lead = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;
//               return (
//                 <TableRow key={student._id} className="hover:bg-muted/50">
//                   <TableCell>
//                     <Avatar className="h-9 w-9">
//                       <AvatarFallback className="bg-primary/10 text-primary font-medium">
//                         {student.name?.split(" ").map((n) => n[0]).join("") || "???"}
//                       </AvatarFallback>
//                     </Avatar>
//                   </TableCell>
//                   <TableCell className="font-medium">{student.name}</TableCell>
//                   <TableCell className="font-mono text-sm">{student.phone}</TableCell>
//                   <TableCell>{student.city || "—"}</TableCell>
//                   <TableCell className="font-medium">
//                     {student.budget ? `₹${Number(student.budget).toLocaleString("en-IN")}` : "—"}
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={lead.variant} className="text-xs">
//                       {lead.label}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-sm text-muted-foreground">
//                     {student.lastFollowUp || "—"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => openProgressModal(student)}
//                       className="flex items-center gap-1"
//                     >
//                       <Eye className="h-4 w-4" />
//                       View Progress
//                     </Button>
//                   </TableCell>
//                   {isFollowUp && (
//                     <TableCell className="text-right">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openRemarkModal(student)}
//                       >
//                         <Edit2 className="h-4 w-4 mr-1" />
//                         Remark
//                       </Button>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               );
//             })
//           )}
//         </TableBody>
//       </Table>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 space-y-8">
//       <div className="flex justify-between items-end">
//         <div>
//           <h1 className="text-4xl font-bold tracking-tight text-slate-900">
//             Counselor & Telecaller Dashboard
//           </h1>
//           <p className="text-slate-500 mt-2">
//             Student Pipeline & Admission Progress Management
//           </p>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-blue-100 rounded-xl">
//               <Users className="h-8 w-8 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">
//                 {Object.values(students).flat().length}
//               </p>
//               <p className="text-sm text-slate-500">Total Students</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-amber-100 rounded-xl">
//               <Users className="h-8 w-8 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">
//                 {students.interested.length}
//               </p>
//               <p className="text-sm text-slate-500">Interested</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-orange-100 rounded-xl">
//               <Clock className="h-8 w-8 text-orange-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">
//                 {students.followUp.length}
//               </p>
//               <p className="text-sm text-slate-500">Follow-up</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-emerald-100 rounded-xl">
//               <UserCheck className="h-8 w-8 text-emerald-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">
//                 {students.closed.length}
//               </p>
//               <p className="text-sm text-slate-500">Closed / Admitted</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border">
//           <TabsTrigger value="interested" className="flex items-center gap-2">
//             <Users className="h-4 w-4" /> Interested
//           </TabsTrigger>
//           <TabsTrigger value="followUp" className="flex items-center gap-2">
//             <Clock className="h-4 w-4" /> Follow-up
//           </TabsTrigger>
//           <TabsTrigger value="closed" className="flex items-center gap-2">
//             <UserCheck className="h-4 w-4" /> Closed
//           </TabsTrigger>
//         </TabsList>

//         <div className="mt-8 space-y-8">
//           <TabsContent value="interested" className="m-0">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Interested Students</CardTitle>
//               </CardHeader>
//               <CardContent>{renderTable("interested", students.interested)}</CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="followUp" className="m-0">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Follow-up Queue</CardTitle>
//               </CardHeader>
//               <CardContent>{renderTable("followUp", students.followUp)}</CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="closed" className="m-0">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Closed / Admitted Students</CardTitle>
//               </CardHeader>
//               <CardContent>{renderTable("closed", students.closed)}</CardContent>
//             </Card>
//           </TabsContent>
//         </div>
//       </Tabs>

//       {/* ====================== ADMISSION PROGRESS MODAL ====================== */}
//       <Dialog open={!!progressModal} onOpenChange={() => setProgressModal(null)}>
//         <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">Admission Progress</DialogTitle>
//             <DialogDescription>
//               Update all stages of the student's admission journey
//             </DialogDescription>
//           </DialogHeader>

//           <StudentInfoCard student={progressModal} />

//           <div className="space-y-8 py-2">
//             {/* Registration & Documents */}
//             <div>
//               <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
//                 <DollarSign className="h-5 w-5 text-emerald-600" />
//                 Registration & Documents
//               </h3>
//               <div className="space-y-4 pl-6">
//                 {[
//                   { id: "regFee", label: "Registration Fee Submitted", field: "registrationFeeSubmitted" },
//                   { id: "documents", label: "Documents Submitted", field: "documentsSubmitted" },
//                 ].map((item) => (
//                   <div key={item.id} className="flex items-center space-x-3">
//                     <Checkbox
//                       id={item.id}
//                       checked={progressData[item.field]}
//                       onCheckedChange={(checked) => handleProgressChange(item.field, checked)}
//                     />
//                     <Label htmlFor={item.id} className="cursor-pointer text-base">
//                       {item.label}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Admission Process & Visa */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <h3 className="font-semibold text-lg mb-4">Admission Process</h3>
//                 <div className="space-y-4 pl-6">
//                   {[
//                     { id: "docReady", label: "Document File Ready", field: "documentFileReady" },
//                     { id: "collegeApp", label: "College Application Done", field: "collegeApplicationDone" },
//                     { id: "admissionLetter", label: "Admission Letter Issued", field: "admissionLetterIssued" },
//                   ].map((item) => (
//                     <div key={item.id} className="flex items-center space-x-3">
//                       <Checkbox
//                         id={item.id}
//                         checked={progressData[item.field]}
//                         onCheckedChange={(checked) => handleProgressChange(item.field, checked)}
//                       />
//                       <Label htmlFor={item.id} className="cursor-pointer text-base">
//                         {item.label}
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg mb-4">Visa & Departure</h3>
//                 <div className="space-y-4 pl-6">
//                   {[
//                     { id: "visaApplied", label: "Visa Applied", field: "visaApplied" },
//                     { id: "visaIssued", label: "Visa Issued", field: "visaIssued" },
//                     { id: "ticketBooked", label: "Ticket Booked", field: "ticketBooked" },
//                   ].map((item) => (
//                     <div key={item.id} className="flex items-center space-x-3">
//                       <Checkbox
//                         id={item.id}
//                         checked={progressData[item.field]}
//                         onCheckedChange={(checked) => handleProgressChange(item.field, checked)}
//                       />
//                       <Label htmlFor={item.id} className="cursor-pointer text-base">
//                         {item.label}
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Remarks */}
//             <div>
//               <Label className="text-base">Additional Remarks / Notes</Label>
//               <Textarea
//                 value={progressData.remarks}
//                 onChange={(e) => handleProgressChange("remarks", e.target.value)}
//                 placeholder="Any special observations, issues, or next steps..."
//                 className="mt-2 min-h-32"
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setProgressModal(null)}>
//               Cancel
//             </Button>
//             <Button onClick={saveProgress} className="bg-emerald-600 hover:bg-emerald-700">
//               <Save className="mr-2 h-4 w-4" />
//               Save Progress
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ====================== REMARK MODAL ====================== */}
//       <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Follow-up Note</DialogTitle>
//             <DialogDescription>
//               Add remark and update student status
//             </DialogDescription>
//           </DialogHeader>

//           <StudentInfoCard student={selectedStudent} />

//           <div className="space-y-6">
//             <div>
//               <Label>Remark / Follow-up Note</Label>
//               <Textarea
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 placeholder="What was discussed? Next steps, objections, etc..."
//                 className="min-h-32 mt-2"
//               />
//             </div>

//             <div>
//               <Label>Move Student To</Label>
//               <Select value={moveToStatus} onValueChange={setMoveToStatus}>
//                 <SelectTrigger className="mt-2">
//                   <SelectValue placeholder="Keep in Follow-up Queue" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Interested">Interested</SelectItem>
//                   <SelectItem value="Call Back">Call Back</SelectItem>
//                   <SelectItem value="Converted">Converted / Admitted</SelectItem>
//                   <SelectItem value="Not Interested">Not Interested</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setSelectedStudent(null)}>
//               Cancel
//             </Button>
//             <Button onClick={saveFollowUp} disabled={!remark.trim()}>
//               <Save className="mr-2 h-4 w-4" />
//               Save Follow-up
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Counsellorandtellecaller;

import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// Lucide React Icons
import {
  Users,
  UserCheck,
  Clock,
  Edit2,
  Eye,
  DollarSign,
  Save,
  User,
  Phone,
  MapPin,
  IndianRupee,
  Tag,
  Calendar,
  BookOpen,
  Users as UsersIcon
} from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000/api";

const Counsellorandtellecaller = () => {
  const [activeTab, setActiveTab] = useState("interested");
  const [students, setStudents] = useState({
    interested: [],
    followUp: [],
    closed: [],
  });
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [remark, setRemark] = useState("");
  const [moveToStatus, setMoveToStatus] = useState("");

  const [progressModal, setProgressModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  const [progressData, setProgressData] = useState({
    registrationFeeSubmitted: false,
    documentsSubmitted: false,
    documentFileReady: false,
    collegeApplicationDone: false,
    admissionLetterIssued: false,
    visaApplied: false,
    visaIssued: false,
    ticketBooked: false,
    remarks: "",
  });

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  };

  // Fetch Leads from Backend
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/leads`, {
        method: "GET",
        ...authHeader,
      });

      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      const allLeads = data.data || [];

      const categorized = {
        interested: allLeads.filter((lead) =>
          ["New", "Interested"].includes(lead.status)
        ),
        followUp: allLeads.filter((lead) =>
          ["Call Back"].includes(lead.status)
        ),
        closed: allLeads.filter((lead) =>
          ["Converted", "Admitted", "Dropped"].includes(lead.status)
        ),
      };

      setStudents(categorized);
    } catch (err) {
      toast.error("Failed to load students. Please login again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const LEAD_TYPES = {
    Hot: { label: "🔥 Hot", variant: "destructive" },
    Warm: { label: "☀️ Warm", variant: "default" },
    Cold: { label: "❄️ Cold", variant: "secondary" },
  };

  const openRemarkModal = (student) => {
    setSelectedStudent(student);
    setRemark("");
    setMoveToStatus("");
  };

  const openProgressModal = (student) => {
    setProgressModal(student);
    setProgressData({
      registrationFeeSubmitted: false,
      documentsSubmitted: false,
      documentFileReady: false,
      collegeApplicationDone: false,
      admissionLetterIssued: false,
      visaApplied: false,
      visaIssued: false,
      ticketBooked: false,
      remarks: "",
    });
  };

  const openDetailModal = (student) => {
    setDetailModal(student);
  };

  // Save Follow-up
  const saveFollowUp = async () => {
    if (!selectedStudent || !remark.trim()) {
      toast.error("Please write a remark");
      return;
    }

    try {
      const newStatus = moveToStatus || selectedStudent.status;

      await fetch(`${BASE_URL}/leads/${selectedStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader.headers,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      toast.success("Follow-up saved successfully!");
      setSelectedStudent(null);
      setRemark("");
      setMoveToStatus("");
      fetchLeads();
    } catch (err) {
      toast.error("Failed to save follow-up");
    }
  };

  // Save Progress
  const saveProgress = async () => {
    if (!progressModal) return;

    try {
      await fetch(`${BASE_URL}/leads/${progressModal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader.headers,
        },
        body: JSON.stringify({ status: "Interested" }),
      });

      toast.success(`Progress updated for ${progressModal.name}`);
      setProgressModal(null);
      fetchLeads();
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  const handleProgressChange = (field, value) => {
    setProgressData((prev) => ({ ...prev, [field]: value }));
  };

  // ====================== FULL STUDENT DETAILS ======================
  const StudentFullDetails = ({ student }) => {
    if (!student) return null;

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-2xl border">
          <Avatar className="h-28 w-28 border-4 border-white shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-5xl font-bold">
              {student.name?.split(" ").map((n) => n[0]).join("") || "??"}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-3xl font-bold text-slate-900">{student.name || "—"}</h2>
            <p className="text-lg text-slate-600 mt-1">{student.email || "—"}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={LEAD_TYPES[student.leadTag]?.variant || "secondary"} className="text-sm">
                {LEAD_TYPES[student.leadTag]?.label || "❄️ Cold"}
              </Badge>
              <span className="text-sm text-slate-500">• {student.status || "—"}</span>
            </div>
          </div>
        </div>

        {/* Main Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Phone className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Phone Number</p>
                <p className="font-medium text-base">{student.phone || "—"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <UsersIcon className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Parent Name</p>
                <p className="font-medium text-base">{student.parentName || "—"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">City</p>
                <p className="font-medium text-base">{student.city || "—"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <IndianRupee className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Budget</p>
                <p className="font-medium text-base">
                  {student.budget ? `₹${Number(student.budget).toLocaleString("en-IN")}` : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <Tag className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Lead Type</p>
                <p className="font-medium text-base">{LEAD_TYPES[student.leadTag]?.label || "❄️ Cold"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <BookOpen className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">NEET Status</p>
                <p className="font-medium text-base">{student.neetStatus || "—"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Calendar className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Preferred Country</p>
                <p className="font-medium text-base">{student.preferredCountry || "—"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <User className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Current Status</p>
                <p className="font-medium text-base">{student.status || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="pt-6 border-t space-y-4">
          <h3 className="font-semibold text-lg">Other Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">College Name:</span> {student.collegeName || "—"}</div>
            <div><span className="text-slate-500">Emergency Contact:</span> {student.emergencyContact || "—"}</div>
            <div><span className="text-slate-500">Service Manager:</span> {student.serviceManager || "—"}</div>
            <div><span className="text-slate-500">Last Follow-up:</span> {student.lastFollowUp || "—"}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = (key, data) => {
    const isFollowUp = key === "followUp";

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Lead Type</TableHead>
            <TableHead>Last Follow-up</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">Loading students...</TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                No students in this section
              </TableCell>
            </TableRow>
          ) : (
            data.map((student) => {
              const lead = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;
              return (
                <TableRow key={student._id} className="hover:bg-muted/50">
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {student.name?.split(" ").map((n) => n[0]).join("") || "???"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="font-mono text-sm">{student.phone}</TableCell>
                  <TableCell>{student.city || "—"}</TableCell>
                  <TableCell className="font-medium">
                    {student.budget ? `₹${Number(student.budget).toLocaleString("en-IN")}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.variant} className="text-xs">
                      {lead.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student.lastFollowUp || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailModal(student)}
                      >
                        <User className="h-4 w-4 mr-1" />
                        Full Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProgressModal(student)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Progress
                      </Button>
                      {isFollowUp && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRemarkModal(student)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Remark
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Counselor & Telecaller Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Student Pipeline & Admission Progress Management
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {Object.values(students).flat().length}
              </p>
              <p className="text-sm text-slate-500">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Users className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {students.interested.length}
              </p>
              <p className="text-sm text-slate-500">Interested</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {students.followUp.length}
              </p>
              <p className="text-sm text-slate-500">Follow-up</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <UserCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {students.closed.length}
              </p>
              <p className="text-sm text-slate-500">Closed / Admitted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border">
          <TabsTrigger value="interested" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Interested
          </TabsTrigger>
          <TabsTrigger value="followUp" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Follow-up
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" /> Closed
          </TabsTrigger>
        </TabsList>

        <div className="mt-8 space-y-8">
          <TabsContent value="interested" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Interested Students</CardTitle>
              </CardHeader>
              <CardContent>{renderTable("interested", students.interested)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followUp" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Queue</CardTitle>
              </CardHeader>
              <CardContent>{renderTable("followUp", students.followUp)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="closed" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Closed / Admitted Students</CardTitle>
              </CardHeader>
              <CardContent>{renderTable("closed", students.closed)}</CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Full Details Modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Student Full Details</DialogTitle>
            <DialogDescription>Complete profile and information</DialogDescription>
          </DialogHeader>

          <StudentFullDetails student={detailModal} />

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailModal(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admission Progress Modal */}
      <Dialog open={!!progressModal} onOpenChange={() => setProgressModal(null)}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admission Progress</DialogTitle>
            <DialogDescription>Update all stages of the student's admission journey</DialogDescription>
          </DialogHeader>

          <StudentFullDetails student={progressModal} />

          <div className="space-y-8 py-6">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Registration & Documents
              </h3>
              <div className="space-y-4 pl-6">
                {[
                  { id: "regFee", label: "Registration Fee Submitted", field: "registrationFeeSubmitted" },
                  { id: "documents", label: "Documents Submitted", field: "documentsSubmitted" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={item.id}
                      checked={progressData[item.field]}
                      onCheckedChange={(checked) => handleProgressChange(item.field, checked)}
                    />
                    <Label htmlFor={item.id} className="cursor-pointer text-base">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Admission Process</h3>
                <div className="space-y-4 pl-6">
                  {[
                    { id: "docReady", label: "Document File Ready", field: "documentFileReady" },
                    { id: "collegeApp", label: "College Application Done", field: "collegeApplicationDone" },
                    { id: "admissionLetter", label: "Admission Letter Issued", field: "admissionLetterIssued" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={progressData[item.field]}
                        onCheckedChange={(checked) => handleProgressChange(item.field, checked)}
                      />
                      <Label htmlFor={item.id} className="cursor-pointer text-base">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Visa & Departure</h3>
                <div className="space-y-4 pl-6">
                  {[
                    { id: "visaApplied", label: "Visa Applied", field: "visaApplied" },
                    { id: "visaIssued", label: "Visa Issued", field: "visaIssued" },
                    { id: "ticketBooked", label: "Ticket Booked", field: "ticketBooked" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={progressData[item.field]}
                        onCheckedChange={(checked) => handleProgressChange(item.field, checked)}
                      />
                      <Label htmlFor={item.id} className="cursor-pointer text-base">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base">Additional Remarks / Notes</Label>
              <Textarea
                value={progressData.remarks}
                onChange={(e) => handleProgressChange("remarks", e.target.value)}
                placeholder="Any special observations, issues, or next steps..."
                className="mt-2 min-h-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressModal(null)}>
              Cancel
            </Button>
            <Button onClick={saveProgress} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="mr-2 h-4 w-4" />
              Save Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remark Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Follow-up for {selectedStudent?.name}</DialogTitle>
            <DialogDescription>Add your remark and choose where to move the student</DialogDescription>
          </DialogHeader>

          <StudentFullDetails student={selectedStudent} />

          <div className="space-y-6 py-4">
            <div>
              <Label>Remark / Follow-up Note</Label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="What was discussed? Next steps, objections, etc..."
                className="min-h-32 mt-2"
              />
            </div>
            <div>
              <Label>Move Student To</Label>
              <Select value={moveToStatus} onValueChange={setMoveToStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Keep in Follow-up Queue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interested">Interested</SelectItem>
                  <SelectItem value="Call Back">Call Back</SelectItem>
                  <SelectItem value="Converted">Converted / Admitted</SelectItem>
                  <SelectItem value="Not Interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Cancel
            </Button>
            <Button onClick={saveFollowUp} disabled={!remark.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Save Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Counsellorandtellecaller;