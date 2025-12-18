"use client"

import { Database, Activity, HardDrive, Clock, AlertTriangle, RefreshCw, Zap, Server } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { mockDatabaseMetrics } from "@/lib/admin-mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

function formatNumber(num: number) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

const queryData = [
  { time: "00:00", queries: 85000 },
  { time: "04:00", queries: 42000 },
  { time: "08:00", queries: 125000 },
  { time: "12:00", queries: 180000 },
  { time: "16:00", queries: 210000 },
  { time: "20:00", queries: 165000 },
  { time: "Now", queries: 145000 },
]

export function DatabaseInfraPage() {
  const db = mockDatabaseMetrics
  const connectionPercent = (db.connections / db.maxConnections) * 100
  const storagePercent = (db.storageUsed / db.storageTotal) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Database Infrastructure</h1>
          <p className="text-muted-foreground">Monitor database performance and health</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Metrics
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Connections</CardDescription>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {db.connections}/{db.maxConnections}
            </div>
            <Progress value={connectionPercent} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{connectionPercent.toFixed(1)}% utilized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Query Latency</CardDescription>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{db.queryLatency}ms</div>
            <p className="text-xs text-emerald-600 mt-2">Excellent performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Replication Lag</CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{db.replicationLag}s</div>
            <p className="text-xs text-emerald-600 mt-2">Within threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Storage</CardDescription>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {db.storageUsed}GB/{db.storageTotal}GB
            </div>
            <Progress value={storagePercent} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{storagePercent.toFixed(1)}% used</p>
          </CardContent>
        </Card>
      </div>

      {/* Query Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Query Volume</CardTitle>
          <CardDescription>Queries processed over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              queries: { label: "Queries", color: "hsl(var(--chart-1))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={queryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis tickFormatter={(v) => formatNumber(v)} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="var(--color-queries)"
                  fill="var(--color-queries)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Database Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Instances</CardTitle>
            <CardDescription>Active database nodes and replicas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instance</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Load</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">db-primary-01</TableCell>
                  <TableCell>
                    <Badge>Primary</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-emerald-600">
                      Healthy
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">42%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">db-replica-01</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Replica</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-emerald-600">
                      Healthy
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">38%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">db-replica-02</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Replica</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-emerald-600">
                      Healthy
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">35%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Statistics</CardTitle>
            <CardDescription>Last 24 hours performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total Queries</p>
                  <p className="text-sm text-muted-foreground">Last 24 hours</p>
                </div>
              </div>
              <span className="text-xl font-bold">{formatNumber(db.queries24h)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Slow Queries</p>
                  <p className="text-sm text-muted-foreground">Queries &gt; 1000ms</p>
                </div>
              </div>
              <span className="text-xl font-bold text-amber-600">{db.slowQueries}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Active Connections</p>
                  <p className="text-sm text-muted-foreground">Current</p>
                </div>
              </div>
              <span className="text-xl font-bold">{db.connections}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
