"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, Eye, MousePointer, Globe, Smartphone, Monitor, Tablet } from "lucide-react"

const visitorData = [
  { month: "Jan", visitors: 1200, pageViews: 3400, conversions: 45 },
  { month: "Feb", visitors: 1900, pageViews: 4200, conversions: 67 },
  { month: "Mar", visitors: 2100, pageViews: 5100, conversions: 89 },
  { month: "Apr", visitors: 2800, pageViews: 6200, conversions: 112 },
  { month: "May", visitors: 3200, pageViews: 7800, conversions: 134 },
  { month: "Jun", visitors: 3800, pageViews: 8900, conversions: 156 },
]

const deviceData = [
  { name: "Desktop", value: 45, color: "#000000" },
  { name: "Mobile", value: 35, color: "#404040" },
  { name: "Tablet", value: 20, color: "#808080" },
]

const topPages = [
  { page: "/", views: 12500, bounce: 32 },
  { page: "/about", views: 8900, bounce: 28 },
  { page: "/store", views: 7200, bounce: 45 },
  { page: "/contact", views: 5600, bounce: 22 },
  { page: "/train-ai", views: 4800, bounce: 38 },
]

const trafficSources = [
  { source: "Direct", visitors: 4200, percentage: 35 },
  { source: "Google Search", visitors: 3600, percentage: 30 },
  { source: "Social Media", visitors: 2400, percentage: 20 },
  { source: "Referrals", visitors: 1200, percentage: 10 },
  { source: "Email", visitors: 600, percentage: 5 },
]

export default function AnalyticsPage() {
  const totalVisitors = visitorData.reduce((sum, item) => sum + item.visitors, 0)
  const totalPageViews = visitorData.reduce((sum, item) => sum + item.pageViews, 0)
  const totalConversions = visitorData.reduce((sum, item) => sum + item.conversions, 0)
  const conversionRate = ((totalConversions / totalVisitors) * 100).toFixed(2)

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track website performance and user engagement metrics.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalPageViews.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.3% from last month
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.7% from last month
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2.1% from last month
                </p>
              </div>
              <Globe className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Line type="monotone" dataKey="visitors" stroke="#000000" strokeWidth={2} />
                <Line type="monotone" dataKey="pageViews" stroke="#666666" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span className="text-sm">Desktop: 45%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">Mobile: 35%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tablet className="h-4 w-4" />
                <span className="text-sm">Tablet: 20%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{page.page}</p>
                    <p className="text-sm text-gray-600">{page.views.toLocaleString()} views</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={page.bounce > 40 ? "destructive" : page.bounce > 30 ? "secondary" : "default"}>
                      {page.bounce}% bounce
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{source.source}</p>
                    <p className="text-sm text-gray-600">{source.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Bar dataKey="conversions" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
