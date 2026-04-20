import React, { useState } from "react";
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
import { Users, UserCheck, Clock, Edit2, Eye, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

const Counsellorandtellecaller = () => {
  const [activeTab, setActiveTab] = useState("interested");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [remark, setRemark] = useState("");
  const [moveToStatus, setMoveToStatus] = useState("");

  // Progress Modal State
  const [progressModal, setProgressModal] = useState(null);

  const [students, setStudents] = useState({
    interested: [
      {
        id: 1,
        name: "Rahul Sharma",
        phone: "9876543210",
        city: "Indore",
        budget: "15L",
        lastFollowUp: "2 days ago",
        leadType: "hot",
        status: "Interested",
      },
      {
        id: 2,
        name: "Priya Patel",
        phone: "8765432109",
        city: "Bhopal",
        budget: "12L",
        lastFollowUp: "Yesterday",
        leadType: "warm",
        status: "Interested",
      },
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
        status: "Admitted",
      },
    ],
    followUp: [
      {
        id: 4,
        name: "Neha Verma",
        phone: "6543210987",
        city: "Indore",
        budget: "10L",
        lastFollowUp: "5 days ago",
        leadType: "warm",
        status: "Follow-up",
      },
      {
        id: 5,
        name: "Rohan Gupta",
        phone: "5432109876",
        city: "Ujjain",
        budget: "14L",
        lastFollowUp: "1 week ago",
        leadType: "cold",
        status: "Follow-up",
      },
    ],
  });

  // Admission Progress Form State
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
    // Reset form for new student
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

    toast.success(`Admission progress updated for ${progressModal.name}`);
    console.log("Saved Progress:", {
      student: progressModal.name,
      ...progressData,
    });
    setProgressModal(null);
  };

  const handleProgressChange = (field, value) => {
    setProgressData((prev) => ({ ...prev, [field]: value }));
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
            <TableHead className="text-center">Progress</TableHead>
            {isFollowUp && <TableHead className="text-right">Remark</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isFollowUp ? 8 : 7}
                className="text-center py-12 text-muted-foreground"
              >
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
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {student.phone}
                  </TableCell>
                  <TableCell>{student.city}</TableCell>
                  <TableCell className="font-medium">
                    ₹{student.budget}
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.variant} className="text-xs">
                      {lead.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student.lastFollowUp}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openProgressModal(student)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View Progress
                    </Button>
                  </TableCell>
                  {isFollowUp && (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRemarkModal(student)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Remark
                      </Button>
                    </TableCell>
                  )}
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
            Counselor Dashboard
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
              <CardContent>
                {renderTable("interested", students.interested)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followUp" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Queue</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable("followUp", students.followUp)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="closed" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Closed / Admitted Students</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable("closed", students.closed)}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* ====================== ADMISSION PROGRESS MODAL ====================== */}
      <Dialog
        open={!!progressModal}
        onOpenChange={() => setProgressModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Admission Progress • {progressModal?.name}
            </DialogTitle>
            <DialogDescription>
              Update all stages of the student's admission journey
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-6">
            {/* 1. Registration & Documents */}
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Registration & Documents
              </h3>
              <div className="space-y-4 pl-6">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="regFee"
                    checked={progressData.registrationFeeSubmitted}
                    onCheckedChange={(checked) =>
                      handleProgressChange("registrationFeeSubmitted", checked)
                    }
                  />
                  <Label htmlFor="regFee" className="cursor-pointer text-base">
                    Registration Fee Submitted
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="documents"
                    checked={progressData.documentsSubmitted}
                    onCheckedChange={(checked) =>
                      handleProgressChange("documentsSubmitted", checked)
                    }
                  />
                  <Label
                    htmlFor="documents"
                    className="cursor-pointer text-base"
                  >
                    Documents Submitted
                  </Label>
                </div>
              </div>
            </div>

            {/* 2. Admission Process */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Admission Process</h3>
              <div className="space-y-4 pl-6">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="docReady"
                    checked={progressData.documentFileReady}
                    onCheckedChange={(checked) =>
                      handleProgressChange("documentFileReady", checked)
                    }
                  />
                  <Label
                    htmlFor="docReady"
                    className="cursor-pointer text-base"
                  >
                    Document File Ready
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="collegeApp"
                    checked={progressData.collegeApplicationDone}
                    onCheckedChange={(checked) =>
                      handleProgressChange("collegeApplicationDone", checked)
                    }
                  />
                  <Label
                    htmlFor="collegeApp"
                    className="cursor-pointer text-base"
                  >
                    College/University Application Done
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="admissionLetter"
                    checked={progressData.admissionLetterIssued}
                    onCheckedChange={(checked) =>
                      handleProgressChange("admissionLetterIssued", checked)
                    }
                  />
                  <Label
                    htmlFor="admissionLetter"
                    className="cursor-pointer text-base"
                  >
                    Admission Letter Issued
                  </Label>
                </div>
              </div>
            </div>

            {/* 3. Visa & Travel */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Visa & Departure</h3>
              <div className="space-y-4 pl-6">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="visaApplied"
                    checked={progressData.visaApplied}
                    onCheckedChange={(checked) =>
                      handleProgressChange("visaApplied", checked)
                    }
                  />
                  <Label
                    htmlFor="visaApplied"
                    className="cursor-pointer text-base"
                  >
                    Visa Applied
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="visaIssued"
                    checked={progressData.visaIssued}
                    onCheckedChange={(checked) =>
                      handleProgressChange("visaIssued", checked)
                    }
                  />
                  <Label
                    htmlFor="visaIssued"
                    className="cursor-pointer text-base"
                  >
                    Visa Issued
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="ticketBooked"
                    checked={progressData.ticketBooked}
                    onCheckedChange={(checked) =>
                      handleProgressChange("ticketBooked", checked)
                    }
                  />
                  <Label
                    htmlFor="ticketBooked"
                    className="cursor-pointer text-base"
                  >
                    Ticket Booked
                  </Label>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <Label className="text-base">Additional Remarks / Notes</Label>
              <Textarea
                value={progressData.remarks}
                onChange={(e) =>
                  handleProgressChange("remarks", e.target.value)
                }
                placeholder="Any special observations, issues, or next steps..."
                className="mt-2 min-h-30"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={saveProgress}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Save Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remark Modal (Kept for Follow-up) */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Follow-up for {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Add your remark and choose where to move the student
            </DialogDescription>
          </DialogHeader>
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
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Cancel
            </Button>
            <Button onClick={saveFollowUp} disabled={!remark.trim()}>
              Save Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Counsellorandtellecaller;
