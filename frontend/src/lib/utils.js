import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

export function formatRelativeTime(date) {
  if (!date) return ''
  
  // Ensure we handle the timestamp correctly
  let timestamp;
  
  if (typeof date === 'string') {
    // Check if the date string has timezone information
    const hasTimezone = date.includes('Z') || 
                       date.includes('+') || 
                       (date.includes('-') && date.lastIndexOf('-') > 10)
    
    if (!hasTimezone) {
      // No timezone - assume it's UTC and add 'Z'
      timestamp = new Date(date + 'Z').getTime()
    } else {
      timestamp = new Date(date).getTime()
    }
  } else {
    timestamp = new Date(date).getTime()
  }
  
  const now = Date.now()
  const diffInSeconds = Math.floor((now - timestamp) / 1000)
  
  // Handle edge cases
  if (diffInSeconds < 0 || isNaN(diffInSeconds)) return 'just now'
  if (diffInSeconds > 31536000) return formatDate(date) // > 1 year
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(date)
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}