import { useState, useMemo } from 'react';

import { 
  Phone, 
  Download, 
  Clock, 
  Ban, 
  CheckCircle, 
  Search, 
  Users,
  DollarSign, 
  Target, 
  TrendingUp 
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const initialLeads = [
  {
    id: 1,
    name: "John Doe",
    phone: "1234567890",
    parent: "Jane Doe",
    city: "New York",
    email: "john.doe@example.com",
    neet: "Yes",
    budget: 50000,
    country: "USA",
    status: "Pending",
  },
  {
    id: 2,
    name: "Alice Smith",
    phone: "9876543210",
    parent: "Bob Smith",
    city: "Los Angeles",
    email: "alice.smith@example.com",
    neet: "No",
    budget: 45000,
    country: "USA",
    status: "In Progress",
  },
];

export default function TelecallerDashboard() {
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [neetFilter, setNeetFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNeet = neetFilter === 'all' || lead.neet === neetFilter;
      const matchesCountry = countryFilter === 'all' || lead.country === countryFilter;

      return matchesSearch && matchesNeet && matchesCountry;
    });
  }, [leads, searchTerm, neetFilter, countryFilter]);

  // Dashboard Statistics
  const totalLeads = leads.length;
  const totalBudget = leads.reduce((sum, lead) => sum + lead.budget, 0);
  const qualifiedLeads = leads.filter(l => l.neet === "Yes").length;
  const closedLeads = leads.filter(l => l.status === "Closed").length;

  const updateLeadStatus = (id, newStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
    setOpenDropdownId(null);

    const leadName = leads.find((l) => l.id === id)?.name;
    alert(`✅ ${leadName} marked as "${newStatus}"`);
  };

  const callLead = (phone) => {
    alert(`📞 Calling ${phone}... (Demo Mode)`);
  };

  const exportCSV = () => {
    const headers = "Name,Phone,Parent,City,Email,NEET,Budget,Country,Status\n";
    const rows = leads
      .map((lead) =>
        `"${lead.name}","${lead.phone}","${lead.parent}","${lead.city}","${lead.email}","${lead.neet}","₹${lead.budget}","${lead.country}","${lead.status || 'Pending'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'telecaller_leads.csv';
    link.click();
    alert('✅ CSV Exported Successfully!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Closed':
        return <Badge className="bg-emerald-100 text-emerald-700">Closed</Badge>;
      case 'Not Interested':
        return <Badge className="bg-red-100 text-red-700">Not Interested</Badge>;
      case 'Follow-up Queue':
        return <Badge className="bg-amber-100 text-amber-700">Follow-up</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md">
              T
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Telecaller Dashboard</h1>
              <p className="text-sm text-slate-500">Real-time Lead Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <Input
                placeholder="Search by name, phone or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-11"
              />
            </div>

            <Select value={neetFilter} onValueChange={setNeetFilter}>
              <SelectTrigger className="w-52 h-11">
                <SelectValue placeholder="All NEET" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All NEET Status</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-52 h-11">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
              </SelectContent>
            </Select>

        
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        {/* Summary Stats Cards - Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">{totalLeads}</p>
                <p className="text-sm text-slate-500">Total Leads</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">
                  ₹{(totalBudget / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-slate-500">Total Budget</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Target className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">{qualifiedLeads}</p>
                <p className="text-sm text-slate-500">Qualified Leads</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">{closedLeads}</p>
                <p className="text-sm text-slate-500">Closed Deals</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">All Leads</h2>
            <p className="text-slate-500 mt-1">Showing {filteredLeads.length} of {totalLeads} leads</p>
          </div>
          <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-8">Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>NEET</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center pr-8">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="pl-8 font-medium">{lead.name}</TableCell>
                    <TableCell className="font-mono">{lead.phone}</TableCell>
                    <TableCell>{lead.parent}</TableCell>
                    <TableCell>{lead.city}</TableCell>
                    <TableCell className="text-sm text-slate-600">{lead.email}</TableCell>
                    <TableCell>
                      <Badge variant={lead.neet === "Yes" ? "default" : "secondary"}>
                        {lead.neet}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{lead.budget.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.country}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="pr-8">
                      <DropdownMenu
                        open={openDropdownId === lead.id}
                        onOpenChange={(open) => setOpenDropdownId(open ? lead.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Phone size={18} className="mr-2" />
                            Take Action
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          
                          <DropdownMenuItem 
                            onClick={() => updateLeadStatus(lead.id, 'Not Interested')} 
                            className="text-red-600"
                          >
                            <Ban size={18} className="mr-3" /> Not Interested
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => updateLeadStatus(lead.id, 'Closed')} 
                            className="text-emerald-600"
                          >
                            <CheckCircle size={18} className="mr-3" /> Closed
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => updateLeadStatus(lead.id, 'Follow-up Queue')} 
                            className="text-amber-600"
                          >
                            <Clock size={18} className="mr-3" /> Follow-up Queue
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => updateLeadStatus(lead.id, 'In Progress')} 
                            className="text-blue-600"
                          >
                            <Users size={18} className="mr-3" /> In Progress
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => callLead(lead.phone)}>
                            <Phone size={18} className="mr-3" /> Call Now
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredLeads.length === 0 && (
          <div className="text-center py-20 text-slate-400 text-lg">
            No leads found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}