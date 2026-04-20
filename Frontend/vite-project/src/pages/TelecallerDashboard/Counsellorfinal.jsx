import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// Lucide React Icons
import { 
  Users, 
  UserCheck, 
  Clock, 
  Edit2, 
  Eye, 
  DollarSign, 
  User 
} from "lucide-react";
import { toast } from "react-toastify";

const Counsellorfinal = () => {
  const [activeTab, setActiveTab] = useState("interested");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [remark, setRemark] = useState("");
  const [moveToStatus, setMoveToStatus] = useState("");
  
  // Progress Modal
  const [progressModal, setProgressModal] = useState(null);
  
  // New: Admitted Details Modal
  const [admittedModal, setAdmittedModal] = useState(null);
  const [admittedData, setAdmittedData] = useState({
    collegeName: "",
    emergencyContact: "",
    serviceManager: ""
  });

  const [students, setStudents] = useState({
    interested: [
      { id: 1, name: "Rahul Sharma", phone: "9876543210", city: "Indore", budget: "15L", lastFollowUp: "2 days ago", leadType: "hot" },
      { id: 2, name: "Priya Patel", phone: "8765432109", city: "Bhopal", budget: "12L", lastFollowUp: "Yesterday", leadType: "warm" },
    ],
    closed: [
      { 
        id: 3, 
        name: "Aarav Singh", 
        phone: "7654321098", 
        city: "Indore", 
        budget: "18L", 
        lastFollowUp: "1 week ago", 
        leadType: "hot",
        status: "Admitted"
      },
    ],
    followUp: [
      { id: 4, name: "Neha Verma", phone: "6543210987", city: "Indore", budget: "10L", lastFollowUp: "5 days ago", leadType: "warm" },
      { id: 5, name: "Rohan Gupta", phone: "5432109876", city: "Ujjain", budget: "14L", lastFollowUp: "1 week ago", leadType: "cold" },
    ],
  });

  // Progress Data (for non-admitted)
  const [progressData, setProgressData] = useState({
    registrationFeeSubmitted: false,
    documentsSubmitted: false,
    documentFileReady: false,
    collegeApplicationDone: false,
    admissionLetterIssued: false,
    visaApplied: false,
    visaIssued: false,
    ticketBooked: false,
    remarks: ""
  });

  const LEAD_TYPES = {
    hot: { label: "🔥 Hot", variant: "destructive" },
    warm: { label: "☀️ Warm", variant: "default" },
    cold: { label: "❄️ Cold", variant: "secondary" },
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
      remarks: ""
    });
  };

  // New: Open Admitted Details Modal
  const openAdmittedModal = (student) => {
    setAdmittedModal(student);
    setAdmittedData({
      collegeName: "",
      emergencyContact: "",
      serviceManager: ""
    });
  };

  const saveFollowUp = () => {
    if (!remark.trim()) {
      toast.error("Please write a remark");
      return;
    }
    toast.success("Follow-up saved successfully!");
    setSelectedStudent(null);
    setRemark("");
    setMoveToStatus("");
  };

  const saveProgress = () => {
    if (!progressModal) return;
    toast.success(`Progress updated for ${progressModal.name}`);
    setProgressModal(null);
  };

  const saveAdmittedDetails = () => {
    if (!admittedModal) return;
    toast.success(`Admitted details saved for ${admittedModal.name}`);
    console.log("Admitted Details:", { student: admittedModal.name, ...admittedData });
    setAdmittedModal(null);
  };

  const handleProgressChange = (field, value) => {
    setProgressData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdmittedChange = (field, value) => {
    setAdmittedData(prev => ({ ...prev, [field]: value }));
  };

  const renderTable = (key, data) => {
    const isFollowUp = key === "followUp";
    const isClosed = key === "closed";

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
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                No students in this section
              </TableCell>
            </TableRow>
          ) : (
            data.map((student) => {
              const lead = LEAD_TYPES[student.leadType] || LEAD_TYPES.cold;
              return (
                <TableRow key={student.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="font-mono text-sm">{student.phone}</TableCell>
                  <TableCell>{student.city}</TableCell>
                  <TableCell className="font-medium">₹{student.budget}</TableCell>
                  <TableCell>
                    <Badge variant={lead.variant} className="text-xs">
                      {lead.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student.lastFollowUp}
                  </TableCell>
                  <TableCell className="text-center">
                    {isClosed ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAdmittedModal(student)}
                        className="flex items-center gap-1"
                      >
                        <User className="h-4 w-4" />
                        Admitted Details
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProgressModal(student)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Progress
                      </Button>
                    )}
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
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Counselor & Telecaller Dashboard</h1>
        <p className="text-slate-500 mt-2">Complete Student Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">{Object.values(students).flat().length}</p>
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
              <p className="text-3xl font-semibold text-slate-900">{students.interested.length}</p>
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
              <p className="text-3xl font-semibold text-slate-900">{students.followUp.length}</p>
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
              <p className="text-3xl font-semibold text-slate-900">{students.closed.length}</p>
              <p className="text-sm text-slate-500">Admitted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border">
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="followUp">Follow-up</TabsTrigger>
          <TabsTrigger value="closed">Admitted</TabsTrigger>
        </TabsList>

        <div className="mt-8 space-y-8">
          <TabsContent value="interested" className="m-0">
            <Card>
              <CardHeader><CardTitle>Interested Students</CardTitle></CardHeader>
              <CardContent>{renderTable("interested", students.interested)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followUp" className="m-0">
            <Card>
              <CardHeader><CardTitle>Follow-up Queue</CardTitle></CardHeader>
              <CardContent>{renderTable("followUp", students.followUp)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="closed" className="m-0">
            <Card>
              <CardHeader><CardTitle>Admitted Students</CardTitle></CardHeader>
              <CardContent>{renderTable("closed", students.closed)}</CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* ====================== ADMISSION PROGRESS MODAL ====================== */}
      <Dialog open={!!progressModal} onOpenChange={() => setProgressModal(null)}>
        {/* ... (Your previous progress modal code remains same) ... */}
        {/* I kept it short here for brevity - use the previous full progress modal code */}
      </Dialog>

      {/* ====================== ADMITTED DETAILS MODAL (NEW) ====================== */}
      <Dialog open={!!admittedModal} onOpenChange={() => setAdmittedModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Admitted Student Details</DialogTitle>
            <DialogDescription>
              {admittedModal?.name} - Update College & Support Information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label>College / University Name</Label>
              <Input
                value={admittedData.collegeName}
                onChange={(e) => handleAdmittedChange('collegeName', e.target.value)}
                placeholder="Enter college name"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Emergency Contact Details</Label>
              <Input
                value={admittedData.emergencyContact}
                onChange={(e) => handleAdmittedChange('emergencyContact', e.target.value)}
                placeholder="Name + Phone Number"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Service Manager Assigned</Label>
              <Select 
                value={admittedData.serviceManager} 
                onValueChange={(value) => handleAdmittedChange('serviceManager', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Service Manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager1">Rajesh Kumar (Senior)</SelectItem>
                  <SelectItem value="manager2">Priya Sharma</SelectItem>
                  <SelectItem value="manager3">Amit Verma</SelectItem>
                  <SelectItem value="manager4">Sneha Gupta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdmittedModal(null)}>
              Cancel
            </Button>
            <Button onClick={saveAdmittedDetails} className="bg-emerald-600 hover:bg-emerald-700">
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remark Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        {/* Your existing remark modal code */}
      </Dialog>
    </div>
  );
};

export default Counsellorfinal;