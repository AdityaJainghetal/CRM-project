

import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import {
  Users, UserCheck, Target, Calendar, TrendingUp, Clock,
  Bell, Award, Activity, Phone, Globe, FileCheck,Building2 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // CRM Stats
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    converted: 0,
    pendingFollowUps: 0,
    admissionsInProgress: 0,
    visaPending: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [monthlyConversionData, setMonthlyConversionData] = useState([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const API_BASE = API_URL;

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data?.data || res.data;

        setStats({
          totalLeads: data.totalLeads || 0,
          hotLeads: data.hotLeads || 0,
          warmLeads: data.warmLeads || 0,
          coldLeads: data.coldLeads || 0,
          converted: data.converted || 0,
          pendingFollowUps: data.pendingFollowUps || 0,
          admissionsInProgress: data.admissionsInProgress || 0,
          visaPending: data.visaPending || 0,
        });

        setRecentActivities(data.recentActivities || []);
        setUpcomingFollowUps(data.upcomingFollowUps || []);
        setLeadSourceData(data.leadSourceData || []);
        setMonthlyConversionData(data.monthlyConversionData || []);

      } catch (err) {
        console.error('Dashboard data fetch failed', err);
        toast.error('Failed to load dashboard data');

        // Fallback mock data (for development)
        setStats({
          totalLeads: 1248,
          hotLeads: 87,
          warmLeads: 234,
          coldLeads: 612,
          converted: 315,
          pendingFollowUps: 68,
          admissionsInProgress: 42,
          visaPending: 19,
        });

        setRecentActivities([
          { id: 1, action: "New lead assigned", user: "Rahul Sharma", time: "10 min ago", type: "lead" },
          { id: 2, action: "Lead converted to admission", user: "Priya Patel", time: "2 hours ago", type: "conversion" },
          { id: 3, action: "Follow-up completed", user: "Amit Kumar", time: "Yesterday", type: "followup" },
        ]);

        setUpcomingFollowUps([
          { id: 1, student: "Vikas Singh", country: "Canada", date: "Today" },
          { id: 2, student: "Neha Gupta", country: "UK", date: "Tomorrow" },
          { id: 3, student: "Rohan Mehta", country: "Germany", date: "Apr 20" },
        ]);

        setLeadSourceData([
          { name: 'Website', value: 45, color: '#3b82f6' },
          { name: 'WhatsApp', value: 30, color: '#10b981' },
          { name: 'Social Media', value: 15, color: '#f59e0b' },
          { name: 'Calls', value: 10, color: '#ef4444' },
        ]);

        setMonthlyConversionData([
          { month: 'Oct', conversions: 28 },
          { month: 'Nov', conversions: 35 },
          { month: 'Dec', conversions: 42 },
          { month: 'Jan', conversions: 51 },
          { month: 'Feb', conversions: 47 },
          { month: 'Mar', conversions: 63 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'Team Member'}!
            </h1>
            <p className="text-blue-100">
              Here's your EDU-HAWK CRM overview for today.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-IN')}</div>
            <div className="text-sm opacity-75">Today</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toLocaleString()}
          change="+12%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Hot Leads"
          value={stats.hotLeads}
          change="+5"
          icon={Target}
          trend="up"
          color="text-orange-600"
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          change="+18"
          icon={FileCheck}
          trend="up"
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          change="-3"
          icon={Clock}
          trend="down"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Admissions In Progress"
          value={stats.admissionsInProgress}
          icon={Building2}
        />
        <StatCard
          title="Visa Pending"
          value={stats.visaPending}
          icon={Globe}
        />
        <StatCard
          title="Warm Leads"
          value={stats.warmLeads}
          icon={TrendingUp}
        />
        <StatCard
          title="Cold Leads"
          value={stats.coldLeads}
          icon={Users}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Conversion Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Conversions
            </CardTitle>
            <CardDescription>Lead to Conversion Trend (Last 6 Months)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyConversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  dot={{ fill: '#3b82f6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Lead Sources
            </CardTitle>
            <CardDescription>Distribution by Source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-3 mt-6">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm">{source.name} ({source.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Upcoming Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback>
                        {activity.user?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Follow-ups
            </CardTitle>
            <CardDescription>Leads needing attention soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingFollowUps.length > 0 ? (
                upcomingFollowUps.map((followup) => (
                  <div key={followup.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{followup.student}</p>
                      <p className="text-sm text-muted-foreground">{followup.country}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{followup.date}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No upcoming follow-ups</p>
              )}
            </div>

            <Button 
              className="w-full mt-6"
              onClick={() => navigate('/follow-ups')}
            >
              View All Follow-ups
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/leads/new')}
            >
              <Users className="w-6 h-6" />
              Add New Lead
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/leads')}
            >
              <Target className="w-6 h-6" />
              All Leads
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/admissions')}
            >
              <FileCheck className="w-6 h-6" />
              Admissions
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/visa')}
            >
              <Globe className="w-6 h-6" />
              Visa Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;