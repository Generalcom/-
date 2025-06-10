"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Settings,
  Server,
  Database,
  Shield,
  Activity,
  Users,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Power,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Globe,
} from "lucide-react"

interface SystemStatus {
  database: "online" | "offline" | "maintenance"
  api: "online" | "offline" | "degraded"
  storage: "online" | "offline" | "full"
  email: "online" | "offline" | "limited"
  auth: "online" | "offline" | "maintenance"
}

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
  activeUsers: number
  totalRequests: number
  errorRate: number
}

export default function ControlPanelPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: "online",
    api: "online",
    storage: "online",
    email: "online",
    auth: "online",
  })

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkLatency: 23,
    activeUsers: 127,
    totalRequests: 15420,
    errorRate: 0.2,
  })

  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        activeUsers: Math.max(50, Math.min(200, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20))),
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 50),
        networkLatency: Math.max(10, Math.min(100, prev.networkLatency + (Math.random() - 0.5) * 15)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const refreshSystemStatus = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100"
      case "offline":
        return "text-red-600 bg-red-100"
      case "maintenance":
        return "text-yellow-600 bg-yellow-100"
      case "degraded":
        return "text-orange-600 bg-orange-100"
      case "limited":
        return "text-yellow-600 bg-yellow-100"
      case "full":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />
      case "offline":
        return <XCircle className="h-4 w-4" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Control Panel</h1>
          <p className="text-gray-600">Monitor and control all system operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refreshSystemStatus} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge variant={maintenanceMode ? "destructive" : "default"}>
            {maintenanceMode ? "Maintenance Mode" : "Live"}
          </Badge>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(systemStatus).map(([service, status]) => (
          <Card key={service}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">{service}</p>
                  <Badge className={`mt-1 ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="ml-1 capitalize">{status}</span>
                  </Badge>
                </div>
                <div className="text-right">
                  {service === "database" && <Database className="h-6 w-6 text-gray-400" />}
                  {service === "api" && <Server className="h-6 w-6 text-gray-400" />}
                  {service === "storage" && <HardDrive className="h-6 w-6 text-gray-400" />}
                  {service === "email" && <Mail className="h-6 w-6 text-gray-400" />}
                  {service === "auth" && <Shield className="h-6 w-6 text-gray-400" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{systemMetrics.cpuUsage.toFixed(1)}%</span>
                <Badge
                  variant={
                    systemMetrics.cpuUsage > 80 ? "destructive" : systemMetrics.cpuUsage > 60 ? "secondary" : "default"
                  }
                >
                  {systemMetrics.cpuUsage > 80 ? "High" : systemMetrics.cpuUsage > 60 ? "Medium" : "Normal"}
                </Badge>
              </div>
              <Progress value={systemMetrics.cpuUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MemoryStick className="h-4 w-4 mr-2" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{systemMetrics.memoryUsage.toFixed(1)}%</span>
                <Badge
                  variant={
                    systemMetrics.memoryUsage > 85
                      ? "destructive"
                      : systemMetrics.memoryUsage > 70
                        ? "secondary"
                        : "default"
                  }
                >
                  {systemMetrics.memoryUsage > 85 ? "High" : systemMetrics.memoryUsage > 70 ? "Medium" : "Normal"}
                </Badge>
              </div>
              <Progress value={systemMetrics.memoryUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <span className="text-2xl font-bold">{systemMetrics.activeUsers}</span>
              <p className="text-sm text-gray-600">Currently online</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Network className="h-4 w-4 mr-2" />
              Network Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <span className="text-2xl font-bold">{systemMetrics.networkLatency}ms</span>
              <Badge
                variant={
                  systemMetrics.networkLatency > 50
                    ? "destructive"
                    : systemMetrics.networkLatency > 30
                      ? "secondary"
                      : "default"
                }
              >
                {systemMetrics.networkLatency > 50 ? "Slow" : systemMetrics.networkLatency > 30 ? "Medium" : "Fast"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              System Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Temporarily disable public access</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Debug Mode</p>
                <p className="text-sm text-gray-600">Enable detailed error logging</p>
              </div>
              <Switch checked={debugMode} onCheckedChange={setDebugMode} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Backup</p>
                <p className="text-sm text-gray-600">Automatic daily database backups</p>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Power className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Backup Database Now
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear System Cache
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <Monitor className="mr-2 h-4 w-4" />
              View System Logs
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Performance Report
            </Button>

            <Button className="w-full justify-start" variant="destructive">
              <Power className="mr-2 h-4 w-4" />
              Restart Services
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Database backup completed</p>
                    <p className="text-sm text-gray-600">2 minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">New user registration</p>
                    <p className="text-sm text-gray-600">5 minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">High CPU usage detected</p>
                    <p className="text-sm text-gray-600">12 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Disk space running low</p>
                    <p className="text-sm text-red-600">Only 15% remaining</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Resolve
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">SSL certificate expires soon</p>
                    <p className="text-sm text-yellow-600">Expires in 7 days</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Renew
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">System update available</p>
                    <p className="text-sm text-blue-600">Version 2.1.0 ready</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
