"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2, CalendarIcon, List, Clock } from "lucide-react"
import { useState } from "react"

export function CalendarModule() {
  const { events, addEvent, updateEvent, deleteEvent, universalCategories } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"today" | "week" | "month">("month") // Added view mode state
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    type: "meeting" as const,
  })

  const eventTypes = universalCategories
    .filter((c) => c.module === "calendar")
    .map((c) => ({ value: c.name.toLowerCase().replace(/\s+/g, "_"), label: c.name }))

  const defaultTypes = [
    { value: "meeting", label: "Reunião" },
    { value: "call", label: "Ligação" },
    { value: "task", label: "Tarefa" },
    { value: "reminder", label: "Lembrete" },
  ]

  const availableTypes = eventTypes.length > 0 ? eventTypes : defaultTypes

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      if (editingEvent) {
        updateEvent(editingEvent, {
          ...newEvent,
          date: new Date(newEvent.date),
        })
        setEditingEvent(null)
      } else {
        addEvent({
          ...newEvent,
          date: new Date(newEvent.date),
          status: "scheduled",
        })
      }
      setNewEvent({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        type: "meeting",
      })
      setShowForm(false)
      setSelectedDate(null)
    }
  }

  const handleEdit = (event: any) => {
    setNewEvent({
      title: event.title,
      description: event.description || "",
      date: new Date(event.date).toISOString().split("T")[0],
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type,
    })
    setEditingEvent(event.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEvent(null)
    setSelectedDate(null)
    setNewEvent({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      type: "meeting",
    })
  }

  const today = new Date()
  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear() &&
      event.status === "scheduled"
    )
  })

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const getEndOfWeek = (date: Date) => {
    const start = getStartOfWeek(date)
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
  }

  const weekStart = getStartOfWeek(today)
  const weekEnd = getEndOfWeek(today)

  const weekEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate >= weekStart && eventDate <= weekEnd && event.status === "scheduled"
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getEventsForDay = (day: number) => {
    const dateToCheck = new Date(year, month, day)
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year &&
        event.status === "scheduled"
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agenda e Calendário</h2>
          <p className="text-sm text-muted-foreground">Gerencie eventos e compromissos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Evento
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === "today" ? "default" : "outline"}
          onClick={() => setViewMode("today")}
          className="gap-2"
        >
          <Clock className="w-4 h-4" />
          Hoje
        </Button>
        <Button
          variant={viewMode === "week" ? "default" : "outline"}
          onClick={() => setViewMode("week")}
          className="gap-2"
        >
          <List className="w-4 h-4" />
          Semana
        </Button>
        <Button
          variant={viewMode === "month" ? "default" : "outline"}
          onClick={() => setViewMode("month")}
          className="gap-2"
        >
          <CalendarIcon className="w-4 h-4" />
          Mês
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Eventos</p>
          <p className="text-2xl font-bold">{events.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Este Mês</p>
          <p className="text-2xl font-bold text-blue-600">
            {
              events.filter((e) => {
                const d = new Date(e.date)
                return d.getMonth() === month && d.getFullYear() === year
              }).length
            }
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Hoje</p>
          <p className="text-2xl font-bold text-green-600">{todayEvents.length}</p>
        </Card>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="p-6 space-y-4 border-2 border-primary">
          <h3 className="font-semibold text-lg">{editingEvent ? "Editar Evento" : "Novo Evento"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Título do Evento</label>
              <input
                placeholder="Ex: Reunião com cliente"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Evento</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {availableTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Cadastre tipos em Categorias → Agenda</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hora de Início</label>
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hora de Término</label>
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                placeholder="Detalhes do evento..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleAddEvent}>{editingEvent ? "Atualizar" : "Agendar"} Evento</Button>
          </div>
        </Card>
      )}

      {viewMode === "today" && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Eventos de Hoje</h3>
          {todayEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum evento agendado para hoje</p>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{event.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{event.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.startTime} - {event.endTime}
                    </p>
                    {event.description && <p className="text-sm mt-2">{event.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Excluir este evento?")) {
                          deleteEvent(event.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {viewMode === "week" && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">
            Eventos da Semana ({weekStart.toLocaleDateString("pt-BR")} - {weekEnd.toLocaleDateString("pt-BR")})
          </h3>
          {weekEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum evento agendado para esta semana</p>
          ) : (
            <div className="space-y-3">
              {weekEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{event.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{event.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString("pt-BR")} • {event.startTime} - {event.endTime}
                    </p>
                    {event.description && <p className="text-sm mt-2">{event.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Excluir este evento?")) {
                          deleteEvent(event.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {viewMode === "month" && (
        <Card className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              {monthNames[month]} {year}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const dayEvents = getEventsForDay(day)
              const isTodayDate = isToday(day)

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 hover:bg-muted/50 transition-colors cursor-pointer ${
                    isTodayDate ? "border-primary border-2 bg-primary/5" : ""
                  }`}
                  onClick={() => {
                    setSelectedDate(new Date(year, month, day))
                    setNewEvent({
                      ...newEvent,
                      date: new Date(year, month, day).toISOString().split("T")[0],
                    })
                    setShowForm(true)
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-semibold mb-1 ${isTodayDate ? "text-primary" : ""}`}>{day}</div>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate flex items-center justify-between gap-1 group"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <span className="truncate flex-1">{event.title}</span>
                          <div className="hidden group-hover:flex gap-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(event)
                              }}
                              className="hover:bg-blue-200 rounded p-0.5"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm("Excluir este evento?")) {
                                  deleteEvent(event.id)
                                }
                              }}
                              className="hover:bg-red-200 rounded p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} mais</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Events Legend */}
      <Card className="p-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">Legenda:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-primary bg-primary/5"></div>
            <span>Hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100"></div>
            <span>Evento</span>
          </div>
          <span className="text-muted-foreground">Clique em um dia para adicionar evento</span>
        </div>
      </Card>
    </div>
  )
}
