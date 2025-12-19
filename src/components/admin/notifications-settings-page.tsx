"use client";

import { useState } from "react";
import {
	Mail,
	MessageSquare,
	AlertTriangle,
	CheckCircle,
	Info,
	Save,
	TestTube,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const notificationTypes = [
	{
		id: "new_tenant",
		title: "New Tenant Registration",
		description: "When a new tenant signs up for the platform",
		icon: CheckCircle,
		email: true,
		slack: true,
		priority: "normal",
	},
	{
		id: "ticket_created",
		title: "Support Ticket Created",
		description: "When a new support ticket is submitted",
		icon: MessageSquare,
		email: true,
		slack: true,
		priority: "high",
	},
	{
		id: "ticket_escalated",
		title: "Ticket Escalated",
		description: "When a ticket is escalated to higher priority",
		icon: AlertTriangle,
		email: true,
		slack: true,
		priority: "critical",
	},
	{
		id: "system_alert",
		title: "System Alerts",
		description: "Critical system health and performance issues",
		icon: AlertTriangle,
		email: true,
		slack: true,
		priority: "critical",
	},
	{
		id: "payment_failed",
		title: "Payment Failed",
		description: "When a tenant's payment fails",
		icon: AlertTriangle,
		email: true,
		slack: false,
		priority: "high",
	},
	{
		id: "daily_digest",
		title: "Daily Digest",
		description: "Summary of platform activity",
		icon: Info,
		email: true,
		slack: false,
		priority: "normal",
	},
];

export function NotificationsSettingsPage() {
	const [notifications, setNotifications] = useState(notificationTypes);
	const [emailEnabled, setEmailEnabled] = useState(true);
	const [slackEnabled, setSlackEnabled] = useState(true);
	const [slackWebhook, setSlackWebhook] = useState("");

	const updateNotification = (
		id: string,
		field: "email" | "slack",
		value: boolean,
	) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
		);
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Notification Settings</h1>
					<p className="text-muted-foreground">
						Configure how and when you receive alerts
					</p>
				</div>
				<Button>
					<Save className="h-4 w-4 mr-2" />
					Save Changes
				</Button>
			</div>

			{/* Channels */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
									<Mail className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<CardTitle className="text-base">
										Email Notifications
									</CardTitle>
									<CardDescription>Receive alerts via email</CardDescription>
								</div>
							</div>
							<Switch
								checked={emailEnabled}
								onCheckedChange={setEmailEnabled}
							/>
						</div>
					</CardHeader>
					{emailEnabled && (
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Notification Email</Label>
								<Input type="email" defaultValue="admin@boletrics.com" />
							</div>
							<div className="space-y-2">
								<Label>CC Additional Emails</Label>
								<Input type="email" placeholder="team@boletrics.com" />
							</div>
						</CardContent>
					)}
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
									<MessageSquare className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<CardTitle className="text-base">
										Slack Notifications
									</CardTitle>
									<CardDescription>
										Send alerts to Slack channel
									</CardDescription>
								</div>
							</div>
							<Switch
								checked={slackEnabled}
								onCheckedChange={setSlackEnabled}
							/>
						</div>
					</CardHeader>
					{slackEnabled && (
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Webhook URL</Label>
								<Input
									type="url"
									placeholder="https://hooks.slack.com/services/..."
									value={slackWebhook}
									onChange={(e) => setSlackWebhook(e.target.value)}
								/>
							</div>
							<Button variant="outline" size="sm">
								<TestTube className="h-4 w-4 mr-2" />
								Test Connection
							</Button>
						</CardContent>
					)}
				</Card>
			</div>

			{/* Notification Types */}
			<Card>
				<CardHeader>
					<CardTitle>Notification Types</CardTitle>
					<CardDescription>
						Choose which notifications to receive and how
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{notifications.map((notification, index) => {
							const Icon = notification.icon;
							return (
								<div key={notification.id}>
									{index > 0 && <Separator className="mb-4" />}
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-3">
											<div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center mt-0.5">
												<Icon className="h-4 w-4 text-muted-foreground" />
											</div>
											<div>
												<div className="flex items-center gap-2">
													<h4 className="font-medium">{notification.title}</h4>
													<Badge
														variant="outline"
														className={
															notification.priority === "critical"
																? "text-red-600 border-red-200"
																: notification.priority === "high"
																	? "text-amber-600 border-amber-200"
																	: "text-slate-600"
														}
													>
														{notification.priority}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">
													{notification.description}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-6">
											<div className="flex items-center gap-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<Switch
													checked={notification.email}
													onCheckedChange={(v) =>
														updateNotification(notification.id, "email", v)
													}
													disabled={!emailEnabled}
												/>
											</div>
											<div className="flex items-center gap-2">
												<MessageSquare className="h-4 w-4 text-muted-foreground" />
												<Switch
													checked={notification.slack}
													onCheckedChange={(v) =>
														updateNotification(notification.id, "slack", v)
													}
													disabled={!slackEnabled}
												/>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Quiet Hours */}
			<Card>
				<CardHeader>
					<CardTitle>Quiet Hours</CardTitle>
					<CardDescription>
						Pause non-critical notifications during specific times
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<Label>Enable Quiet Hours</Label>
							<p className="text-sm text-muted-foreground">
								Only critical alerts will be sent during this time
							</p>
						</div>
						<Switch />
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label>Start Time</Label>
							<Select defaultValue="22">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: 24 }, (_, i) => (
										<SelectItem key={i} value={i.toString()}>
											{i.toString().padStart(2, "0")}:00
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>End Time</Label>
							<Select defaultValue="8">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: 24 }, (_, i) => (
										<SelectItem key={i} value={i.toString()}>
											{i.toString().padStart(2, "0")}:00
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
