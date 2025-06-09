import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Mail, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure your application settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="Vort" />
            </div>
            <div>
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea id="site-description" defaultValue="AI-powered solutions for your business" rows={3} />
            </div>
            <div>
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" defaultValue="support@vort.co.za" />
            </div>
            <Button>Save General Settings</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" placeholder="smtp.resend.com" />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Input id="from-email" placeholder="noreply@vort.co.za" />
            </div>
            <Button>Save Email Settings</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" defaultValue="60" />
            </div>
            <div>
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input id="max-login-attempts" defaultValue="5" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="require-email-verification" defaultChecked />
              <Label htmlFor="require-email-verification">Require Email Verification</Label>
            </div>
            <Button>Save Security Settings</Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Database Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Database Status</Label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Connected</span>
              </div>
            </div>
            <div>
              <Label>Last Backup</Label>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline">Backup Now</Button>
              <Button variant="outline">View Logs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
