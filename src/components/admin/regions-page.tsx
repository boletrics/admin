"use client"

import { useState } from "react"
import {
  Globe,
  MapPin,
  Plus,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Pause,
  Play,
  Settings,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockRegions } from "@/lib/admin-mock-data"
import { Progress } from "@/components/ui/progress"

const statusConfig = {
  active: { label: "Active", color: "text-emerald-600", icon: CheckCircle },
  maintenance: { label: "Maintenance", color: "text-amber-600", icon: AlertTriangle },
  inactive: { label: "Inactive", color: "text-slate-500", icon: Pause },
}

export function RegionsPage() {
  const [addRegionOpen, setAddRegionOpen] = useState(false)

  const totalTenants = mockRegions.reduce((sum, r) => sum + r.tenantsCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Regions</h1>
          <p className="text-muted-foreground">Manage regional deployments and data centers</p>
        </div>
        <Dialog open={addRegionOpen} onOpenChange={setAddRegionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Region
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Region</DialogTitle>
              <DialogDescription>Configure a new regional deployment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Region Name</Label>
                <Input placeholder="e.g., São Paulo" />
              </div>
              <div className="space-y-2">
                <Label>Region Code</Label>
                <Input placeholder="e.g., SAO" maxLength={3} />
              </div>
              <div className="space-y-2">
                <Label>Data Center</Label>
                <Input placeholder="e.g., DC-SAO-01" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue="inactive">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddRegionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setAddRegionOpen(false)}>Add Region</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Regions</CardDescription>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRegions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Active Regions</CardDescription>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {mockRegions.filter((r) => r.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>In Maintenance</CardDescription>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {mockRegions.filter((r) => r.status === "maintenance").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Tenants</CardDescription>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Region Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Distribution</CardTitle>
          <CardDescription>How tenants are distributed across regions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockRegions
            .sort((a, b) => b.tenantsCount - a.tenantsCount)
            .map((region) => {
              const percentage = (region.tenantsCount / totalTenants) * 100
              return (
                <div key={region.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{region.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {region.code}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{region.tenantsCount} tenants</span>
                      <span className="w-12 text-right font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
        </CardContent>
      </Card>

      {/* Regions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Regions</CardTitle>
          <CardDescription>Manage regional configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Data Center</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tenants</TableHead>
                <TableHead className="text-right">Latency</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRegions.map((region) => {
                const StatusIcon = statusConfig[region.status].icon
                return (
                  <TableRow key={region.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{region.name}</p>
                          <p className="text-xs text-muted-foreground">{region.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{region.dataCenter}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[region.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[region.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{region.tenantsCount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={region.latency > 30 ? "text-amber-600" : "text-emerald-600"}>
                        {region.latency}ms
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </DropdownMenuItem>
                          {region.status === "active" ? (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              Set Maintenance
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Region
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
