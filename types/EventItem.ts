export interface EventItem {
  id?: string
  title?: string
  time?: {
    start: string // format ISO: 'YYYY-MM-DD HH:mm'
    end: string
  }
  with?: string
  color?: string
  description?: string
  colorScheme?: string
  location?: string
  isEditable?: boolean
  isCustom?: boolean
  allDay?: boolean
  isPrivate?: boolean
}
