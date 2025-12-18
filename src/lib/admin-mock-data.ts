import type { SystemHealth, Tenant, SupportTicket, UserActivity, AdminUser, PlatformStats } from "./admin-store"

// Mock Admin Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: "admin-1",
    name: "System Administrator",
    email: "admin@boletrics.com",
    role: "super_admin",
    avatar: "/admin-avatar.png",
    lastLoginAt: "2025-01-12T10:30:00Z",
    status: "active",
  },
  {
    id: "admin-2",
    name: "Support Lead",
    email: "support@boletrics.com",
    role: "admin",
    lastLoginAt: "2025-01-12T09:15:00Z",
    status: "active",
  },
  {
    id: "admin-3",
    name: "Technical Support",
    email: "tech@boletrics.com",
    role: "support",
    lastLoginAt: "2025-01-11T18:45:00Z",
    status: "active",
  },
]

// Mock System Health
export const mockSystemHealth: SystemHealth = {
  status: "healthy",
  uptime: 99.98,
  lastChecked: new Date().toISOString(),
  services: [
    { id: "api", name: "API Gateway", status: "operational", latency: 45 },
    { id: "db", name: "Database Cluster", status: "operational", latency: 12 },
    { id: "cache", name: "Redis Cache", status: "operational", latency: 3 },
    { id: "cdn", name: "CDN", status: "operational", latency: 28 },
    { id: "payments", name: "Payment Processing", status: "operational", latency: 180 },
    { id: "email", name: "Email Service", status: "degraded", latency: 450, lastIncident: "2025-01-12T08:00:00Z" },
    { id: "storage", name: "Object Storage", status: "operational", latency: 65 },
    { id: "search", name: "Search Engine", status: "operational", latency: 35 },
  ],
}

// Mock Platform Stats
export const mockPlatformStats: PlatformStats = {
  totalTenants: 1_247,
  activeTenants: 1_089,
  totalUsers: 45_832,
  totalMRR: 487_650,
  totalRevenue: 5_851_800,
  openTickets: 23,
  avgResponseTime: 2.4,
  uptime: 99.98,
}

// Mock Tenants
export const mockTenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "OCESA Presents",
    slug: "ocesa-presents",
    email: "contacto@ocesa.com.mx",
    plan: "enterprise",
    status: "active",
    mrr: 4_999,
    usersCount: 45,
    eventsCount: 128,
    createdAt: "2024-01-15T00:00:00Z",
    lastActiveAt: "2025-01-12T10:30:00Z",
    region: "Mexico City",
  },
  {
    id: "tenant-2",
    name: "Live Nation México",
    slug: "live-nation-mexico",
    email: "info@livenation.com.mx",
    plan: "enterprise",
    status: "active",
    mrr: 4_999,
    usersCount: 32,
    eventsCount: 89,
    createdAt: "2024-03-20T00:00:00Z",
    lastActiveAt: "2025-01-12T09:45:00Z",
    region: "Mexico City",
  },
  {
    id: "tenant-3",
    name: "Zignia Live",
    slug: "zignia-live",
    email: "eventos@zignia.mx",
    plan: "professional",
    status: "active",
    mrr: 999,
    usersCount: 12,
    eventsCount: 34,
    createdAt: "2024-06-01T00:00:00Z",
    lastActiveAt: "2025-01-12T08:20:00Z",
    region: "Monterrey",
  },
  {
    id: "tenant-4",
    name: "Teatro Diana",
    slug: "teatro-diana",
    email: "boletos@teatrodiana.com",
    plan: "professional",
    status: "active",
    mrr: 999,
    usersCount: 8,
    eventsCount: 56,
    createdAt: "2024-02-10T00:00:00Z",
    lastActiveAt: "2025-01-11T22:10:00Z",
    region: "Guadalajara",
  },
  {
    id: "tenant-5",
    name: "EDM México",
    slug: "edm-mexico",
    email: "info@edmmexico.com",
    plan: "starter",
    status: "active",
    mrr: 299,
    usersCount: 5,
    eventsCount: 8,
    createdAt: "2024-09-15T00:00:00Z",
    lastActiveAt: "2025-01-10T16:30:00Z",
    region: "Cancún",
  },
  {
    id: "tenant-6",
    name: "Nuevo Promotor MX",
    slug: "nuevo-promotor",
    email: "nuevo@promotor.mx",
    plan: "free",
    status: "pending",
    mrr: 0,
    usersCount: 1,
    eventsCount: 0,
    createdAt: "2025-01-10T00:00:00Z",
    lastActiveAt: "2025-01-10T12:00:00Z",
    region: "Mexico City",
  },
  {
    id: "tenant-7",
    name: "Conciertos Premium",
    slug: "conciertos-premium",
    email: "info@conciertospremium.mx",
    plan: "professional",
    status: "suspended",
    mrr: 0,
    usersCount: 15,
    eventsCount: 42,
    createdAt: "2023-11-01T00:00:00Z",
    lastActiveAt: "2024-12-15T10:00:00Z",
    region: "Monterrey",
  },
  {
    id: "tenant-8",
    name: "Festival Hub",
    slug: "festival-hub",
    email: "hello@festivalhub.mx",
    plan: "starter",
    status: "churned",
    mrr: 0,
    usersCount: 3,
    eventsCount: 5,
    createdAt: "2024-04-01T00:00:00Z",
    lastActiveAt: "2024-10-20T08:00:00Z",
    region: "Querétaro",
  },
]

// Mock Support Tickets
export const mockSupportTickets: SupportTicket[] = [
  {
    id: "ticket-1",
    subject: "Payment processing error during checkout",
    description: "Users are experiencing timeout errors when trying to complete purchases with credit cards.",
    status: "in-progress",
    priority: "critical",
    category: "technical",
    tenantId: "tenant-1",
    tenantName: "OCESA Presents",
    assigneeId: "admin-3",
    assigneeName: "Technical Support",
    createdAt: "2025-01-12T08:30:00Z",
    updatedAt: "2025-01-12T10:15:00Z",
    messages: [
      {
        id: "msg-1",
        content: "We are seeing multiple payment failures in our dashboard. This started around 8:00 AM.",
        authorId: "user-ocesa-1",
        authorName: "María García",
        authorRole: "user",
        createdAt: "2025-01-12T08:30:00Z",
      },
      {
        id: "msg-2",
        content: "We've identified the issue with our payment gateway. Working on a fix now. ETA: 30 minutes.",
        authorId: "admin-3",
        authorName: "Technical Support",
        authorRole: "admin",
        createdAt: "2025-01-12T10:15:00Z",
      },
    ],
  },
  {
    id: "ticket-2",
    subject: "Need to upgrade plan but billing page not loading",
    description: "When I try to access the billing settings, the page shows a blank screen.",
    status: "open",
    priority: "high",
    category: "billing",
    tenantId: "tenant-3",
    tenantName: "Zignia Live",
    createdAt: "2025-01-12T07:45:00Z",
    updatedAt: "2025-01-12T07:45:00Z",
    messages: [
      {
        id: "msg-3",
        content: "We want to upgrade to Enterprise plan but cannot access billing. Please help urgently.",
        authorId: "user-zignia-1",
        authorName: "Carlos Rodríguez",
        authorRole: "user",
        createdAt: "2025-01-12T07:45:00Z",
      },
    ],
  },
  {
    id: "ticket-3",
    subject: "Request for API rate limit increase",
    description:
      "Our integration is hitting rate limits during peak hours. Need higher limits for our enterprise usage.",
    status: "waiting",
    priority: "medium",
    category: "feature",
    tenantId: "tenant-2",
    tenantName: "Live Nation México",
    assigneeId: "admin-2",
    assigneeName: "Support Lead",
    createdAt: "2025-01-11T14:20:00Z",
    updatedAt: "2025-01-12T09:00:00Z",
    messages: [
      {
        id: "msg-4",
        content: "We need our API rate limits increased from 1000 to 5000 requests per minute.",
        authorId: "user-livenation-1",
        authorName: "Tech Team",
        authorRole: "user",
        createdAt: "2025-01-11T14:20:00Z",
      },
      {
        id: "msg-5",
        content:
          "I've escalated this to our engineering team. They will review your usage patterns and get back to you.",
        authorId: "admin-2",
        authorName: "Support Lead",
        authorRole: "admin",
        createdAt: "2025-01-12T09:00:00Z",
      },
    ],
  },
  {
    id: "ticket-4",
    subject: "How to set up custom domain?",
    description: "We purchased the professional plan and want to configure our custom domain for ticket pages.",
    status: "resolved",
    priority: "low",
    category: "account",
    tenantId: "tenant-4",
    tenantName: "Teatro Diana",
    assigneeId: "admin-3",
    assigneeName: "Technical Support",
    createdAt: "2025-01-10T11:00:00Z",
    updatedAt: "2025-01-10T15:30:00Z",
    messages: [
      {
        id: "msg-6",
        content: "Can you guide me through the custom domain setup process?",
        authorId: "user-diana-1",
        authorName: "Admin Teatro Diana",
        authorRole: "user",
        createdAt: "2025-01-10T11:00:00Z",
      },
      {
        id: "msg-7",
        content:
          "Here's the step-by-step guide: 1) Go to Settings > Domains 2) Add your domain 3) Update DNS records as shown. Let me know if you need help with DNS configuration.",
        authorId: "admin-3",
        authorName: "Technical Support",
        authorRole: "admin",
        createdAt: "2025-01-10T12:15:00Z",
      },
      {
        id: "msg-8",
        content: "Thank you! It's working now.",
        authorId: "user-diana-1",
        authorName: "Admin Teatro Diana",
        authorRole: "user",
        createdAt: "2025-01-10T15:30:00Z",
      },
    ],
  },
  {
    id: "ticket-5",
    subject: "Account suspension appeal",
    description: "Our account was suspended but we believe this was in error. We need immediate reinstatement.",
    status: "open",
    priority: "high",
    category: "account",
    tenantId: "tenant-7",
    tenantName: "Conciertos Premium",
    createdAt: "2025-01-11T16:00:00Z",
    updatedAt: "2025-01-11T16:00:00Z",
    messages: [
      {
        id: "msg-9",
        content:
          "We received notice that our account was suspended for ToS violation, but we don't understand why. Can someone please review our account?",
        authorId: "user-premium-1",
        authorName: "Account Manager",
        authorRole: "user",
        createdAt: "2025-01-11T16:00:00Z",
      },
    ],
  },
]

// Mock User Activity
export const mockUserActivity: UserActivity[] = [
  {
    id: "activity-1",
    userId: "user-ocesa-1",
    userName: "María García",
    userEmail: "maria@ocesa.com.mx",
    tenantId: "tenant-1",
    tenantName: "OCESA Presents",
    action: "event.created",
    details: "Created new event: 'Bad Bunny World Tour 2025'",
    ipAddress: "189.203.45.67",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    timestamp: "2025-01-12T10:30:00Z",
  },
  {
    id: "activity-2",
    userId: "user-livenation-1",
    userName: "Carlos Méndez",
    userEmail: "carlos@livenation.com.mx",
    tenantId: "tenant-2",
    tenantName: "Live Nation México",
    action: "user.login",
    details: "User logged in successfully",
    ipAddress: "201.175.89.234",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2025-01-12T10:25:00Z",
  },
  {
    id: "activity-3",
    userId: "user-zignia-1",
    userName: "Ana López",
    userEmail: "ana@zignia.mx",
    tenantId: "tenant-3",
    tenantName: "Zignia Live",
    action: "ticket.refund",
    details: "Processed refund for order #ORD-2025-4521",
    ipAddress: "187.190.123.45",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1)",
    timestamp: "2025-01-12T10:20:00Z",
  },
  {
    id: "activity-4",
    userId: "user-diana-1",
    userName: "Roberto Sánchez",
    userEmail: "roberto@teatrodiana.com",
    tenantId: "tenant-4",
    tenantName: "Teatro Diana",
    action: "settings.updated",
    details: "Updated payment settings",
    ipAddress: "148.234.67.89",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    timestamp: "2025-01-12T10:15:00Z",
  },
  {
    id: "activity-5",
    userId: "user-ocesa-2",
    userName: "Pedro Hernández",
    userEmail: "pedro@ocesa.com.mx",
    tenantId: "tenant-1",
    tenantName: "OCESA Presents",
    action: "team.invited",
    details: "Invited new team member: elena@ocesa.com.mx",
    ipAddress: "189.203.45.68",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2025-01-12T10:10:00Z",
  },
  {
    id: "activity-6",
    userId: "user-edm-1",
    userName: "DJ Mike",
    userEmail: "mike@edmmexico.com",
    tenantId: "tenant-5",
    tenantName: "EDM México",
    action: "event.published",
    details: "Published event: 'Ultra Music Festival Cancún'",
    ipAddress: "177.234.12.89",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    timestamp: "2025-01-12T10:05:00Z",
  },
  {
    id: "activity-7",
    userId: "user-livenation-2",
    userName: "Sofia Torres",
    userEmail: "sofia@livenation.com.mx",
    tenantId: "tenant-2",
    tenantName: "Live Nation México",
    action: "report.generated",
    details: "Generated monthly sales report for December 2024",
    ipAddress: "201.175.89.235",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2025-01-12T09:55:00Z",
  },
  {
    id: "activity-8",
    userId: "user-nuevo-1",
    userName: "New User",
    userEmail: "nuevo@promotor.mx",
    tenantId: "tenant-6",
    tenantName: "Nuevo Promotor MX",
    action: "account.created",
    details: "New account registered",
    ipAddress: "189.145.78.90",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1)",
    timestamp: "2025-01-10T12:00:00Z",
  },
]

// Revenue over time for charts
export const mockRevenueTimeline = [
  { month: "Jul", mrr: 385_000, tenants: 980 },
  { month: "Aug", mrr: 402_000, tenants: 1_020 },
  { month: "Sep", mrr: 418_000, tenants: 1_065 },
  { month: "Oct", mrr: 445_000, tenants: 1_120 },
  { month: "Nov", mrr: 462_000, tenants: 1_180 },
  { month: "Dec", mrr: 478_000, tenants: 1_220 },
  { month: "Jan", mrr: 487_650, tenants: 1_247 },
]

// Ticket stats for charts
export const mockTicketStats = {
  byStatus: [
    { status: "Open", count: 8, color: "#ef4444" },
    { status: "In Progress", count: 6, color: "#f59e0b" },
    { status: "Waiting", count: 4, color: "#8b5cf6" },
    { status: "Resolved", count: 45, color: "#22c55e" },
    { status: "Closed", count: 120, color: "#6b7280" },
  ],
  byPriority: [
    { priority: "Critical", count: 2 },
    { priority: "High", count: 5 },
    { priority: "Medium", count: 8 },
    { priority: "Low", count: 8 },
  ],
  responseTime: [
    { day: "Mon", time: 2.1 },
    { day: "Tue", time: 1.8 },
    { day: "Wed", time: 2.5 },
    { day: "Thu", time: 2.2 },
    { day: "Fri", time: 3.1 },
    { day: "Sat", time: 4.2 },
    { day: "Sun", time: 3.8 },
  ],
}

// Mock Platform Users
export interface PlatformUser {
  id: string
  name: string
  email: string
  tenantId: string
  tenantName: string
  role: "owner" | "admin" | "manager" | "staff"
  status: "active" | "inactive" | "suspended"
  lastLoginAt: string
  createdAt: string
  mfaEnabled: boolean
}

export const mockPlatformUsers: PlatformUser[] = [
  {
    id: "user-1",
    name: "María García",
    email: "maria@ocesa.com.mx",
    tenantId: "tenant-1",
    tenantName: "OCESA Presents",
    role: "owner",
    status: "active",
    lastLoginAt: "2025-01-12T10:30:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    mfaEnabled: true,
  },
  {
    id: "user-2",
    name: "Pedro Hernández",
    email: "pedro@ocesa.com.mx",
    tenantId: "tenant-1",
    tenantName: "OCESA Presents",
    role: "admin",
    status: "active",
    lastLoginAt: "2025-01-12T10:10:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    mfaEnabled: true,
  },
  {
    id: "user-3",
    name: "Carlos Méndez",
    email: "carlos@livenation.com.mx",
    tenantId: "tenant-2",
    tenantName: "Live Nation México",
    role: "owner",
    status: "active",
    lastLoginAt: "2025-01-12T10:25:00Z",
    createdAt: "2024-03-20T00:00:00Z",
    mfaEnabled: true,
  },
  {
    id: "user-4",
    name: "Sofia Torres",
    email: "sofia@livenation.com.mx",
    tenantId: "tenant-2",
    tenantName: "Live Nation México",
    role: "manager",
    status: "active",
    lastLoginAt: "2025-01-12T09:55:00Z",
    createdAt: "2024-04-15T00:00:00Z",
    mfaEnabled: false,
  },
  {
    id: "user-5",
    name: "Ana López",
    email: "ana@zignia.mx",
    tenantId: "tenant-3",
    tenantName: "Zignia Live",
    role: "owner",
    status: "active",
    lastLoginAt: "2025-01-12T10:20:00Z",
    createdAt: "2024-06-01T00:00:00Z",
    mfaEnabled: false,
  },
  {
    id: "user-6",
    name: "Roberto Sánchez",
    email: "roberto@teatrodiana.com",
    tenantId: "tenant-4",
    tenantName: "Teatro Diana",
    role: "owner",
    status: "active",
    lastLoginAt: "2025-01-12T10:15:00Z",
    createdAt: "2024-02-10T00:00:00Z",
    mfaEnabled: true,
  },
  {
    id: "user-7",
    name: "DJ Mike",
    email: "mike@edmmexico.com",
    tenantId: "tenant-5",
    tenantName: "EDM México",
    role: "owner",
    status: "active",
    lastLoginAt: "2025-01-12T10:05:00Z",
    createdAt: "2024-09-15T00:00:00Z",
    mfaEnabled: false,
  },
  {
    id: "user-8",
    name: "New User",
    email: "nuevo@promotor.mx",
    tenantId: "tenant-6",
    tenantName: "Nuevo Promotor MX",
    role: "owner",
    status: "active",
    lastLoginAt: "2025-01-10T12:00:00Z",
    createdAt: "2025-01-10T00:00:00Z",
    mfaEnabled: false,
  },
  {
    id: "user-9",
    name: "Account Manager",
    email: "manager@conciertospremium.mx",
    tenantId: "tenant-7",
    tenantName: "Conciertos Premium",
    role: "owner",
    status: "suspended",
    lastLoginAt: "2024-12-15T10:00:00Z",
    createdAt: "2023-11-01T00:00:00Z",
    mfaEnabled: true,
  },
  {
    id: "user-10",
    name: "Festival Admin",
    email: "admin@festivalhub.mx",
    tenantId: "tenant-8",
    tenantName: "Festival Hub",
    role: "owner",
    status: "inactive",
    lastLoginAt: "2024-10-20T08:00:00Z",
    createdAt: "2024-04-01T00:00:00Z",
    mfaEnabled: false,
  },
]

// Infrastructure data
export interface DatabaseMetrics {
  connections: number
  maxConnections: number
  queryLatency: number
  replicationLag: number
  storageUsed: number
  storageTotal: number
  queries24h: number
  slowQueries: number
}

export interface CDNMetrics {
  requestsPerSecond: number
  bandwidthUsed: number
  bandwidthTotal: number
  cacheHitRate: number
  edgeLocations: number
  activeEdges: number
}

export interface APIMetrics {
  requestsPerMinute: number
  avgLatency: number
  p99Latency: number
  errorRate: number
  activeConnections: number
  rateLimitHits24h: number
}

export const mockDatabaseMetrics: DatabaseMetrics = {
  connections: 847,
  maxConnections: 1000,
  queryLatency: 12,
  replicationLag: 0.3,
  storageUsed: 245,
  storageTotal: 500,
  queries24h: 2_450_000,
  slowQueries: 23,
}

export const mockCDNMetrics: CDNMetrics = {
  requestsPerSecond: 12_500,
  bandwidthUsed: 2.4,
  bandwidthTotal: 10,
  cacheHitRate: 94.2,
  edgeLocations: 28,
  activeEdges: 28,
}

export const mockAPIMetrics: APIMetrics = {
  requestsPerMinute: 45_000,
  avgLatency: 45,
  p99Latency: 180,
  errorRate: 0.02,
  activeConnections: 3_250,
  rateLimitHits24h: 1_240,
}

// Regions data
export interface Region {
  id: string
  name: string
  code: string
  status: "active" | "maintenance" | "inactive"
  tenantsCount: number
  dataCenter: string
  latency: number
}

export const mockRegions: Region[] = [
  {
    id: "region-1",
    name: "Mexico City",
    code: "MEX",
    status: "active",
    tenantsCount: 845,
    dataCenter: "DC-MEX-01",
    latency: 12,
  },
  {
    id: "region-2",
    name: "Monterrey",
    code: "MTY",
    status: "active",
    tenantsCount: 234,
    dataCenter: "DC-MTY-01",
    latency: 18,
  },
  {
    id: "region-3",
    name: "Guadalajara",
    code: "GDL",
    status: "active",
    tenantsCount: 156,
    dataCenter: "DC-GDL-01",
    latency: 15,
  },
  {
    id: "region-4",
    name: "Cancún",
    code: "CUN",
    status: "active",
    tenantsCount: 89,
    dataCenter: "DC-CUN-01",
    latency: 22,
  },
  {
    id: "region-5",
    name: "Tijuana",
    code: "TIJ",
    status: "maintenance",
    tenantsCount: 67,
    dataCenter: "DC-TIJ-01",
    latency: 45,
  },
  {
    id: "region-6",
    name: "Querétaro",
    code: "QRO",
    status: "active",
    tenantsCount: 45,
    dataCenter: "DC-QRO-01",
    latency: 14,
  },
]

// Growth metrics for analytics
export const mockGrowthMetrics = {
  userGrowth: [
    { month: "Jul", users: 38_500, newUsers: 2_100 },
    { month: "Aug", users: 40_200, newUsers: 1_700 },
    { month: "Sep", users: 41_800, newUsers: 1_600 },
    { month: "Oct", users: 43_100, newUsers: 1_300 },
    { month: "Nov", users: 44_500, newUsers: 1_400 },
    { month: "Dec", users: 45_200, newUsers: 700 },
    { month: "Jan", users: 45_832, newUsers: 632 },
  ],
  tenantGrowth: [
    { month: "Jul", tenants: 980, churn: 12, new: 45 },
    { month: "Aug", tenants: 1_020, churn: 8, new: 48 },
    { month: "Sep", tenants: 1_065, churn: 15, new: 60 },
    { month: "Oct", tenants: 1_120, churn: 10, new: 65 },
    { month: "Nov", tenants: 1_180, churn: 5, new: 65 },
    { month: "Dec", tenants: 1_220, churn: 8, new: 48 },
    { month: "Jan", tenants: 1_247, churn: 3, new: 30 },
  ],
  conversionRate: [
    { month: "Jul", rate: 3.2 },
    { month: "Aug", rate: 3.5 },
    { month: "Sep", rate: 3.8 },
    { month: "Oct", rate: 4.1 },
    { month: "Nov", rate: 4.3 },
    { month: "Dec", rate: 4.0 },
    { month: "Jan", rate: 4.2 },
  ],
}

// Revenue breakdown
export const mockRevenueBreakdown = {
  byPlan: [
    { plan: "Enterprise", revenue: 289_950, percentage: 59.5 },
    { plan: "Professional", revenue: 142_857, percentage: 29.3 },
    { plan: "Starter", revenue: 44_850, percentage: 9.2 },
    { plan: "Free", revenue: 0, percentage: 0 },
  ],
  byRegion: [
    { region: "Mexico City", revenue: 298_450 },
    { region: "Monterrey", revenue: 89_200 },
    { region: "Guadalajara", revenue: 54_000 },
    { region: "Cancún", revenue: 28_500 },
    { region: "Other", revenue: 17_500 },
  ],
}
