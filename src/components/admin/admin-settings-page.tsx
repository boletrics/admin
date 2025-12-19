"use client";

import { useState } from "react";
import { Shield, Database, Key, Save, RefreshCw } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AdminSettingsPage() {
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [slackNotifications, setSlackNotifications] = useState(true);
	const [criticalAlerts, setCriticalAlerts] = useState(true);
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const [autoApproval, setAutoApproval] = useState(false);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Admin Settings</h1>
				<p className="text-muted-foreground">
					Configure platform settings and administrative controls
				</p>
			</div>

			<Tabs defaultValue="general" className="space-y-6">
				<TabsList>
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="maintenance">Maintenance</TabsTrigger>
				</TabsList>

				<TabsContent value="general" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Platform Settings</CardTitle>
							<CardDescription>General platform configuration</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="platformName">Platform Name</Label>
									<Input id="platformName" defaultValue="Boletrics" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="supportEmail">Support Email</Label>
									<Input
										id="supportEmail"
										type="email"
										defaultValue="support@boletrics.com"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="defaultTimezone">Default Timezone</Label>
									<Select defaultValue="america-mexico">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="america-mexico">
												America/Mexico_City
											</SelectItem>
											<SelectItem value="america-new-york">
												America/New_York
											</SelectItem>
											<SelectItem value="america-los-angeles">
												America/Los_Angeles
											</SelectItem>
											<SelectItem value="europe-london">
												Europe/London
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="defaultCurrency">Default Currency</Label>
									<Select defaultValue="mxn">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="mxn">MXN - Mexican Peso</SelectItem>
											<SelectItem value="usd">USD - US Dollar</SelectItem>
											<SelectItem value="eur">EUR - Euro</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Auto-approve New Tenants</Label>
									<p className="text-sm text-muted-foreground">
										Automatically approve new tenant registrations without
										manual review
									</p>
								</div>
								<Switch
									checked={autoApproval}
									onCheckedChange={setAutoApproval}
								/>
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end">
						<Button>
							<Save className="h-4 w-4 mr-2" />
							Save Changes
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="notifications" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Notification Preferences</CardTitle>
							<CardDescription>
								Configure how you receive alerts and notifications
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Email Notifications</Label>
									<p className="text-sm text-muted-foreground">
										Receive notifications via email
									</p>
								</div>
								<Switch
									checked={emailNotifications}
									onCheckedChange={setEmailNotifications}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Slack Notifications</Label>
									<p className="text-sm text-muted-foreground">
										Send alerts to Slack channel
									</p>
								</div>
								<Switch
									checked={slackNotifications}
									onCheckedChange={setSlackNotifications}
								/>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Critical Alerts</Label>
									<p className="text-sm text-muted-foreground">
										Receive immediate alerts for critical issues (system down,
										security breaches)
									</p>
								</div>
								<Switch
									checked={criticalAlerts}
									onCheckedChange={setCriticalAlerts}
								/>
							</div>

							<Separator />

							<div className="space-y-2">
								<Label>Slack Webhook URL</Label>
								<Input
									type="url"
									placeholder="https://hooks.slack.com/services/..."
									disabled={!slackNotifications}
								/>
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end">
						<Button>
							<Save className="h-4 w-4 mr-2" />
							Save Changes
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="security" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Security Settings</CardTitle>
							<CardDescription>
								Manage platform security and access controls
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Session Timeout (minutes)</Label>
									<Input type="number" defaultValue="60" />
								</div>
								<div className="space-y-2">
									<Label>Max Login Attempts</Label>
									<Input type="number" defaultValue="5" />
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h4 className="font-medium">Two-Factor Authentication</h4>
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center gap-3">
										<Shield className="h-5 w-5 text-emerald-500" />
										<div>
											<p className="font-medium">2FA Enabled</p>
											<p className="text-sm text-muted-foreground">
												Your account is protected with 2FA
											</p>
										</div>
									</div>
									<Button variant="outline">Manage</Button>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h4 className="font-medium">API Keys</h4>
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center gap-3">
										<Key className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium">Admin API Key</p>
											<p className="text-sm text-muted-foreground font-mono">
												sk_admin_****...****8f2d
											</p>
										</div>
									</div>
									<Button variant="outline">Regenerate</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end">
						<Button>
							<Save className="h-4 w-4 mr-2" />
							Save Changes
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="maintenance" className="space-y-6">
					<Card
						className={
							maintenanceMode ? "border-amber-500/50 bg-amber-500/5" : ""
						}
					>
						<CardHeader>
							<CardTitle>Maintenance Mode</CardTitle>
							<CardDescription>
								Enable maintenance mode to temporarily disable platform access
								for users
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Enable Maintenance Mode</Label>
									<p className="text-sm text-muted-foreground">
										Users will see a maintenance page when enabled
									</p>
								</div>
								<Switch
									checked={maintenanceMode}
									onCheckedChange={setMaintenanceMode}
								/>
							</div>

							{maintenanceMode && (
								<>
									<Separator />
									<div className="space-y-2">
										<Label>Maintenance Message</Label>
										<Textarea
											placeholder="We're currently performing scheduled maintenance. Please check back soon."
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Estimated End Time</Label>
										<Input type="datetime-local" />
									</div>
								</>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Database Operations</CardTitle>
							<CardDescription>
								Perform database maintenance tasks
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<p className="font-medium">Clear Cache</p>
									<p className="text-sm text-muted-foreground">
										Clear all cached data from Redis
									</p>
								</div>
								<Button variant="outline">
									<RefreshCw className="h-4 w-4 mr-2" />
									Clear
								</Button>
							</div>
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<p className="font-medium">Run Database Migrations</p>
									<p className="text-sm text-muted-foreground">
										Apply pending database migrations
									</p>
								</div>
								<Button variant="outline">
									<Database className="h-4 w-4 mr-2" />
									Run
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
