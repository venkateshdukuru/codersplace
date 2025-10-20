import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code, Brain, Trophy, Calendar, Award, TrendingUp, 
  CheckCircle, Clock, Star, Target, Zap, Users, 
  BookOpen, ChevronRight, Edit, Github, Linkedin, 
  Mail, MapPin, Briefcase, GraduationCap, Medal,
  Activity, BarChart3, Flame, ArrowUpRight
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    setTimeout(() => setStatsInView(true), 100);
  }, []);

  // Mock user data - replace with actual data
  const userData = {
    name: "Krish Kumar",
    username: "Krish1212",
    email: "krish@example.com",
    location: "Chennai, Tamil Nadu, India",
    college: "Anna University",
    graduationYear: "2025",
    bio: "Aspiring Software Engineer | Passionate about DSA & Competitive Programming | FAANG Aspirant",
    joined: "September 2024",
    rank: "1,021,648",
    contestRating: 1499,
    globalRanking: "339,045 / 771,462",
    github: "krish9113",
    linkedin: "krish9113",
    website: "krish.dev",
    avatar: "KK"
  };

  const stats = [
    { label: "Contest Rating", value: "1,499", icon: Trophy, color: "from-orange-500 to-red-500", trend: "+45" },
    { label: "Global Rank", value: "339K", icon: TrendingUp, color: "from-blue-500 to-indigo-500", trend: "↑2K" },
    { label: "Problems Solved", value: "136", icon: Code, color: "from-green-500 to-emerald-500", trend: "+12" },
    { label: "Hackathons Won", value: "3", icon: Award, color: "from-purple-500 to-pink-500", trend: "+1" },
  ];

  const detailedStats = {
    coding: {
      total: 3715,
      solved: 136,
      easy: { solved: 75, total: 907, percentage: 8.3 },
      medium: { solved: 56, total: 1932, percentage: 2.9 },
      hard: { solved: 5, total: 876, percentage: 0.6 },
      attempting: 9
    },
    aptitude: {
      total: 2500,
      solved: 450,
      quant: { solved: 180, total: 900, percentage: 20 },
      reasoning: { solved: 150, total: 800, percentage: 18.75 },
      verbal: { solved: 120, total: 800, percentage: 15 },
      accuracy: 82
    },
    interview: {
      os: { prepared: 45, total: 100 },
      dbms: { prepared: 38, total: 80 },
      oops: { prepared: 52, total: 90 },
      systemDesign: { prepared: 15, total: 50 },
      networks: { prepared: 28, total: 70 }
    },
    hackathons: {
      attended: 12,
      won: 3,
      runner: 2,
      participant: 7
    }
  };

  const recentActivity = [
    { type: "coding", title: "Solved 'Two Sum'", time: "2 hours ago", icon: Code, color: "text-green-600" },
    { type: "contest", title: "Participated in Weekly Contest 380", time: "1 day ago", icon: Trophy, color: "text-orange-600" },
    { type: "aptitude", title: "Completed Probability Quiz", time: "2 days ago", icon: Brain, color: "text-blue-600" },
    { type: "hackathon", title: "Won 'Smart India Hackathon'", time: "1 week ago", icon: Award, color: "text-purple-600" }
  ];

  const achievements = [
    { title: "100 Days Streak", icon: Flame, color: "bg-orange-100 text-orange-600", date: "2025" },
    { title: "Contest Master", icon: Trophy, color: "bg-yellow-100 text-yellow-600", date: "2024" },
    { title: "Problem Solver", icon: CheckCircle, color: "bg-green-100 text-green-600", date: "2024" },
    { title: "Hackathon Winner", icon: Award, color: "bg-purple-100 text-purple-600", date: "2024" },
    { title: "Top Contributor", icon: Star, color: "bg-blue-100 text-blue-600", date: "2024" },
    { title: "Fast Learner", icon: Zap, color: "bg-pink-100 text-pink-600", date: "2025" }
  ];

  const submissions = Array(365).fill(0).map(() => Math.floor(Math.random() * 5));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const renderHeatmap = () => {
    const weeks = [];
    for (let i = 0; i < 52; i++) {
      weeks.push(
        <div key={i} className="flex flex-col gap-1">
          {[0, 1, 2, 3, 4, 5, 6].map(day => {
            const index = i * 7 + day;
            const count = submissions[index] || 0;
            const intensity = count === 0 ? 'bg-gray-100' : 
                            count === 1 ? 'bg-green-200' :
                            count === 2 ? 'bg-green-400' :
                            count === 3 ? 'bg-green-600' :
                            'bg-green-800';
            return (
              <div
                key={day}
                className={`w-3 h-3 rounded-sm ${intensity} transition-all hover:ring-2 hover:ring-indigo-400`}
                title={`${count} submissions`}
              />
            );
          })}
        </div>
      );
    }
    return weeks;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower.png')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-4xl font-bold shadow-2xl border-4 border-white">
                {userData.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{userData.name}</h1>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  Rank #{userData.rank}
                </div>
              </div>
              <p className="text-blue-100 text-lg mb-3">@{userData.username}</p>
              <p className="text-white/90 max-w-2xl mb-4">{userData.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {userData.location}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {userData.college}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {userData.joined}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-blue-50">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </Button>
                <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-blue-50">
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </Button>
                <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-blue-50">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button className=" text-indigo-600 hover:bg-blue-50 font-semibold">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className={`border-0 shadow-lg transform transition-all duration-500 hover:scale-105 ${
                  statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <span className="text-green-600 text-sm font-semibold flex items-center">
                      <ArrowUpRight className="w-4 h-4" />
                      {stat.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-x-auto">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'coding', label: 'Coding', icon: Code },
              { id: 'aptitude', label: 'Aptitude', icon: Brain },
              { id: 'interview', label: 'Interview Prep', icon: BookOpen },
              { id: 'hackathons', label: 'Hackathons', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="pb-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Activity Heatmap */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Activity</h3>
                      <p className="text-gray-600 mt-1">231 submissions in the past year</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Total active days: <strong className="text-gray-900">121</strong></span>
                      <span>Max streak: <strong className="text-gray-900">118</strong></span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="flex gap-1 mb-2">
                      {renderHeatmap()}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <div className="flex gap-8">
                        {months.map(month => (
                          <span key={month}>{month}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                        <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity & Quick Stats */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${activity.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.time}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">DSA Problems</span>
                          <span className="font-semibold text-gray-900">136/3715 (3.7%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '3.7%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Aptitude Questions</span>
                          <span className="font-semibold text-gray-900">450/2500 (18%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Interview Topics</span>
                          <span className="font-semibold text-gray-900">178/390 (45.6%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '45.6%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Hackathon Win Rate</span>
                          <span className="font-semibold text-gray-900">3/12 (25%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Coding Tab */}
          {activeTab === 'coding' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-block relative">
                      <svg className="w-48 h-48" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="85" fill="none" stroke="#f3f4f6" strokeWidth="20" />
                        <circle 
                          cx="100" cy="100" r="85" fill="none" 
                          stroke="url(#gradient)" strokeWidth="20"
                          strokeDasharray={`${(detailedStats.coding.solved / detailedStats.coding.total) * 534} 534`}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900">{detailedStats.coding.solved}</span>
                        <span className="text-gray-600">/{detailedStats.coding.total}</span>
                        <span className="text-sm text-gray-500 mt-1">Solved</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{detailedStats.coding.attempting} attempting</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { level: 'Easy', data: detailedStats.coding.easy, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
                      { level: 'Medium', data: detailedStats.coding.medium, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
                      { level: 'Hard', data: detailedStats.coding.hard, color: 'from-red-500 to-pink-500', bg: 'bg-red-50' }
                    ].map((item, index) => (
                      <div key={index} className={`${item.bg} rounded-xl p-6 border-2 border-transparent hover:border-gray-200 transition-all`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-gray-900">{item.level}</span>
                          <span className="text-2xl font-bold text-gray-900">{item.data.solved}</span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
                          <div className={`h-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.data.percentage}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600">{item.data.solved}/{item.data.total} ({item.data.percentage.toFixed(1)}%)</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Distribution */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Problem Categories</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Arrays & Strings', solved: 45, total: 120 },
                      { name: 'Dynamic Programming', solved: 22, total: 80 },
                      { name: 'Trees & Graphs', solved: 28, total: 95 },
                      { name: 'Recursion & Backtracking', solved: 18, total: 60 },
                      { name: 'Sorting & Searching', solved: 23, total: 70 }
                    ].map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{category.name}</span>
                          <span className="font-semibold text-gray-900">{category.solved}/{category.total}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${(category.solved / category.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Aptitude Tab */}
          {activeTab === 'aptitude' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h3>
                    <div className="space-y-6">
                      <div className="text-center pb-6 border-b">
                        <div className="text-5xl font-bold text-gray-900 mb-2">{detailedStats.aptitude.solved}</div>
                        <div className="text-gray-600">Total Questions Solved</div>
                        <div className="text-sm text-gray-500 mt-1">out of {detailedStats.aptitude.total}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700 font-medium">Accuracy Rate</span>
                          <span className="text-3xl font-bold text-indigo-600">{detailedStats.aptitude.accuracy}%</span>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            style={{ width: `${detailedStats.aptitude.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Category Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Quantitative Aptitude', data: detailedStats.aptitude.quant, color: 'from-blue-500 to-cyan-500' },
                        { name: 'Logical Reasoning', data: detailedStats.aptitude.reasoning, color: 'from-purple-500 to-pink-500' },
                        { name: 'Verbal Ability', data: detailedStats.aptitude.verbal, color: 'from-green-500 to-emerald-500' }
                      ].map((category, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-gray-900">{category.name}</span>
                            <span className="text-xl font-bold text-gray-900">{category.data.solved}</span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden mb-2">
                            <div 
                              className={`h-full bg-gradient-to-r ${category.color}`}
                              style={{ width: `${category.data.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">{category.data.solved}/{category.data.total} ({category.data.percentage.toFixed(1)}%)</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Topic-wise Progress */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Topic-wise Progress</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { topic: 'Percentages', score: 85 },
                      { topic: 'Probability', score: 78 },
                      { topic: 'Time & Work', score: 92 },
                      { topic: 'Algebra', score: 74 },
                      { topic: 'Puzzles', score: 88 },
                      { topic: 'Blood Relations', score: 95 },
                      { topic: 'Grammar', score: 82 },
                      { topic: 'Vocabulary', score: 76 },
                      { topic: 'Reading Comp', score: 80 }
                    ].map((item, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.topic}</span>
                          <span className="text-lg font-bold text-indigo-600">{item.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Interview Prep Tab */}
          {activeTab === 'interview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Subject Coverage</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Operating Systems', data: detailedStats.interview.os, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
                        { name: 'DBMS', data: detailedStats.interview.dbms, icon: BookOpen, color: 'from-green-500 to-emerald-500' },
                        { name: 'OOPs', data: detailedStats.interview.oops, icon: Code, color: 'from-purple-500 to-pink-500' },
                        { name: 'System Design', data: detailedStats.interview.systemDesign, icon: Activity, color: 'from-orange-500 to-red-500' },
                        { name: 'Computer Networks', data: detailedStats.interview.networks, icon: Activity, color: 'from-indigo-500 to-blue-500' }
                      ].map((subject, index) => {
                        const Icon = subject.icon;
                        const percentage = (subject.data.prepared / subject.data.total) * 100;
                        return (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-900">{subject.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{subject.data.prepared}/{subject.data.total}</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${subject.color}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Overall Preparation</h3>
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" strokeWidth="20" />
                          <circle 
                            cx="100" cy="100" r="80" fill="none" 
                            stroke="url(#interviewGradient)" strokeWidth="20"
                            strokeDasharray={`${(178/390) * 502.4} 502.4`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="interviewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-gray-900">45.6%</span>
                          <span className="text-sm text-gray-600 mt-1">Complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                      <p className="text-gray-700 font-medium mb-1">Total Topics Covered</p>
                      <p className="text-3xl font-bold text-purple-600">178/390</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Study Sessions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Study Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { topic: 'Process Synchronization in OS', questions: 12, time: '45 min ago' },
                      { topic: 'SQL Joins & Subqueries', questions: 18, time: '2 hours ago' },
                      { topic: 'SOLID Principles in OOPs', questions: 8, time: '1 day ago' },
                      { topic: 'Load Balancing Concepts', questions: 6, time: '2 days ago' }
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">{session.topic}</p>
                          <p className="text-sm text-gray-600">{session.questions} questions • {session.time}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hackathons Tab */}
          {activeTab === 'hackathons' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Attended', value: detailedStats.hackathons.attended, icon: Calendar, color: 'from-blue-500 to-indigo-500' },
                  { label: 'Won', value: detailedStats.hackathons.won, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
                  { label: 'Runner Up', value: detailedStats.hackathons.runner, icon: Medal, color: 'from-gray-400 to-gray-600' },
                  { label: 'Participated', value: detailedStats.hackathons.participant, icon: Users, color: 'from-green-500 to-emerald-500' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Hackathon History */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Hackathon History</h3>
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'Smart India Hackathon 2024', 
                        date: 'Dec 2024', 
                        result: 'Winner', 
                        prize: '₹1,00,000',
                        color: 'bg-yellow-100 text-yellow-700',
                        icon: Trophy 
                      },
                      { 
                        name: 'Google Solution Challenge', 
                        date: 'Nov 2024', 
                        result: 'Runner Up', 
                        prize: 'Google Cloud Credits',
                        color: 'bg-gray-100 text-gray-700',
                        icon: Medal 
                      },
                      { 
                        name: 'HackBattle 2024', 
                        date: 'Oct 2024', 
                        result: 'Winner', 
                        prize: '₹50,000',
                        color: 'bg-yellow-100 text-yellow-700',
                        icon: Trophy 
                      },
                      { 
                        name: 'AngelHack Global', 
                        date: 'Sep 2024', 
                        result: 'Participant', 
                        prize: 'Certificate',
                        color: 'bg-blue-100 text-blue-700',
                        icon: Users 
                      },
                      { 
                        name: 'AWS BuildOn', 
                        date: 'Aug 2024', 
                        result: 'Participant', 
                        prize: 'AWS Credits',
                        color: 'bg-blue-100 text-blue-700',
                        icon: Users 
                      }
                    ].map((hackathon, index) => {
                      const Icon = hackathon.icon;
                      return (
                        <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl ${hackathon.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{hackathon.name}</h4>
                                <p className="text-gray-600 text-sm mb-2">{hackathon.date}</p>
                                <div className="flex items-center gap-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${hackathon.color}`}>
                                    {hackathon.result}
                                  </span>
                                  <span className="text-sm text-gray-600">Prize: <strong>{hackathon.prize}</strong></span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Learned */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Gained from Hackathons</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
                      'Machine Learning', 'Python', 'TensorFlow', 'Git', 'Agile',
                      'UI/UX Design', 'API Development', 'Cloud Computing'
                    ].map((skill, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                      <Star className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Achievement Master</h3>
                  <p className="text-gray-600 mb-4">You've unlocked {achievements.length} badges!</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-600">{achievements.length}</p>
                      <p className="text-sm text-gray-600">Total Badges</p>
                    </div>
                    <div className="w-px h-12 bg-gray-300"></div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">85%</p>
                      <p className="text-sm text-gray-600">Completion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <Card 
                      key={index}
                      className="border-2 border-gray-200 hover:border-indigo-400 hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-2 duration-300"
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-20 h-20 ${achievement.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">Earned in {achievement.date}</p>
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Progress to Next Badge */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Progress to Next Badges</h3>
                  <div className="space-y-4">
                    {[
                      { name: '500 Problems Solved', current: 136, target: 500, icon: Target },
                      { name: '10 Hackathon Wins', current: 3, target: 10, icon: Trophy },
                      { name: '200 Day Streak', current: 118, target: 200, icon: Flame },
                      { name: 'Interview Master', current: 178, target: 300, icon: BookOpen }
                    ].map((progress, index) => {
                      const Icon = progress.icon;
                      const percentage = (progress.current / progress.target) * 100;
                      return (
                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-gray-900">{progress.name}</span>
                                <span className="text-sm font-medium text-gray-600">{progress.current}/{progress.target}</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;