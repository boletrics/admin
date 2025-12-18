"use client"

import type React from "react"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { Search, MoreHorizontal, Clock, User, Building2, Send, Paperclip, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockSupportTickets, type SupportTicket } from "@/lib/admin-mock-data"

function getRelativeTime(timestamp: string) {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const priorityColors = {
  critical: "bg-red-500 text-white",
  high: "bg-amber-500 text-white",
  medium: "bg-blue-500 text-white",
  low: "bg-slate-400 text-white",
}

const statusColors = {
  open: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "in-progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  waiting: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
}

function useResizablePanel(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(initialWidth)
  const isResizing = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isResizing.current = true
      startX.current = e.clientX
      startWidth.current = width
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return
        const diff = e.clientX - startX.current
        const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth.current + diff))
        setWidth(newWidth)
      }

      const handleMouseUp = () => {
        isResizing.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [width, minWidth, maxWidth],
  )

  return { width, handleMouseDown }
}

function TicketListItem({
  ticket,
  isSelected,
  onClick,
}: {
  ticket: SupportTicket
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`p-4 border-b cursor-pointer transition-colors hover:bg-accent/50 ${isSelected ? "bg-accent" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <span className={`h-2 w-2 rounded-full mt-2 shrink-0 ${priorityColors[ticket.priority].split(" ")[0]}`} />
        <div className="flex-1 min-w-0">
          {/* Row 1: ID, Category badge, and Status badge */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-muted-foreground shrink-0">#{ticket.id.split("-")[1]}</span>
              <Badge variant="outline" className="text-xs shrink-0">
                {ticket.category}
              </Badge>
            </div>
            <Badge className={`shrink-0 text-xs ${statusColors[ticket.status]}`}>{ticket.status}</Badge>
          </div>
          {/* Row 2: Subject */}
          <p className="font-medium text-sm truncate">{ticket.subject}</p>
          {/* Row 3: Tenant and time */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-muted-foreground truncate">{ticket.tenantName}</span>
            <span className="text-xs text-muted-foreground shrink-0">·</span>
            <span className="text-xs text-muted-foreground shrink-0">{getRelativeTime(ticket.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketDetail({ ticket, onBack }: { ticket: SupportTicket; onBack?: () => void }) {
  const [replyText, setReplyText] = useState("")

  return (
    <div className="flex flex-col h-full">
      {/* Ticket Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              {onBack && (
                <Button variant="ghost" size="icon" className="md:hidden shrink-0 -ml-2" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">#{ticket.id.split("-")[1]}</span>
                <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
              </div>
            </div>
            <h2 className="text-lg font-semibold">{ticket.subject}</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Change Priority</DropdownMenuItem>
              <DropdownMenuItem>Change Status</DropdownMenuItem>
              <DropdownMenuItem>Reassign</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Merge Ticket</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Close Ticket</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ticket Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{ticket.tenantName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Created {formatDate(ticket.createdAt)}</span>
          </div>
          {ticket.assigneeName && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Assigned to {ticket.assigneeName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {ticket.messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.authorRole === "admin" ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={message.authorRole === "admin" ? "bg-primary text-primary-foreground" : ""}>
                  {message.authorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.authorRole === "admin" ? "items-end" : ""}`}>
                <div
                  className={`rounded-lg p-3 ${
                    message.authorRole === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div
                  className={`flex flex-wrap items-center gap-1 sm:gap-2 mt-1 ${message.authorRole === "admin" ? "justify-end" : ""}`}
                >
                  <span className="text-xs text-muted-foreground">{message.authorName}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Reply Box */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Select defaultValue="reply">
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reply">Reply</SelectItem>
                <SelectItem value="internal">Internal Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue={ticket.status}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SupportTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(mockSupportTickets[0])
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  const { width: panelWidth, handleMouseDown } = useResizablePanel(380, 280, 600)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredTickets = useMemo(() => {
    return mockSupportTickets.filter((ticket) => {
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
      const matchesSearch =
        searchQuery === "" ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesPriority && matchesSearch
    })
  }, [statusFilter, priorityFilter, searchQuery])

  const ticketCounts = useMemo(() => {
    return {
      all: mockSupportTickets.length,
      open: mockSupportTickets.filter((t) => t.status === "open").length,
      "in-progress": mockSupportTickets.filter((t) => t.status === "in-progress").length,
      waiting: mockSupportTickets.filter((t) => t.status === "waiting").length,
    }
  }, [])

  const handleTicketSelect = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setShowMobileDetail(true)
  }

  const handleMobileBack = () => {
    setShowMobileDetail(false)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Header - Hide on mobile when detail is shown */}
      <div className={`p-4 border-b shrink-0 ${showMobileDetail && isMobile ? "hidden" : ""}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">Manage and respond to customer support requests</p>
          </div>
          <Button className="shrink-0 w-fit">Create Ticket</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({ticketCounts.all})</SelectItem>
                <SelectItem value="open">Open ({ticketCounts.open})</SelectItem>
                <SelectItem value="in-progress">In Progress ({ticketCounts["in-progress"]})</SelectItem>
                <SelectItem value="waiting">Waiting ({ticketCounts.waiting})</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`border-r flex flex-col shrink-0 w-full md:w-auto ${showMobileDetail && isMobile ? "hidden" : ""}`}
          style={{ width: isMobile ? "100%" : panelWidth }}
        >
          <ScrollArea className="flex-1">
            {filteredTickets.map((ticket) => (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicket?.id === ticket.id}
                onClick={() => handleTicketSelect(ticket)}
              />
            ))}
            {filteredTickets.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No tickets match your filters</div>
            )}
          </ScrollArea>
        </div>

        {!isMobile && (
          <div
            className="w-1 hover:w-1.5 bg-transparent hover:bg-primary/20 cursor-col-resize flex items-center justify-center group transition-all shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="w-0.5 h-8 bg-border group-hover:bg-primary/50 rounded-full transition-colors" />
          </div>
        )}

        <div className={`flex-1 flex flex-col min-w-0 ${!showMobileDetail && isMobile ? "hidden" : ""}`}>
          {selectedTicket ? (
            <TicketDetail ticket={selectedTicket} onBack={isMobile ? handleMobileBack : undefined} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
