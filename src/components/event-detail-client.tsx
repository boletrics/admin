"use client"

import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { TicketSelector } from "@/components/ticket-selector"
import { OrderSummary } from "@/components/order-summary"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/hooks/use-locale"
import { useThemeEffect } from "@/hooks/use-theme"
import type { Event } from "@/lib/mock-data"

interface EventDetailClientProps {
  event: Event
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  useThemeEffect()
  const { t, locale } = useLocale()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return locale === "es"
      ? date.toLocaleDateString("es-MX", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
      : date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      concert: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      sports: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      theater: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
      festival: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    }
    return colors[category as keyof typeof colors] || "bg-secondary text-secondary-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 -ml-4" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-muted">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
              <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category)}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Badge>
            </div>

            {/* Event Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{event.title}</h1>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("event.date")}</p>
                    <p className="font-medium">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("event.time")}</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 sm:col-span-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("event.location")}</p>
                    <p className="font-medium">{event.venue}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-3">{t("event.description")}</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{event.description}</p>
              </div>
            </div>

            <TicketSelector event={event} />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary event={event} />
          </div>
        </div>
      </div>
    </div>
  )
}
