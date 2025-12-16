class WebSocketService {
  constructor() {
    this.ws = null
    this.connected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.messageHandlers = {
      notification: [],
      unread_count: []
    }
  }

  connect(token) {
    if (this.connected || !token) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'
      const WS_URL = API_BASE_URL.replace('/api', '').replace('http', 'ws')
      const wsUrl = `${WS_URL}/ws/notifications?token=${token}`

      try {
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          this.connected = true
          this.reconnectAttempts = 0
          
          // Send heartbeat every 30 seconds
          this.heartbeatInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({ type: 'ping' }))
            }
          }, 30000)
          
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            
            if (message.type === 'notification') {
              this.messageHandlers.notification.forEach(handler => handler(message.data))
            } else if (message.type === 'unread_count') {
              this.messageHandlers.unread_count.forEach(handler => handler(message.count))
            }
          } catch (error) {
            // Invalid message format
          }
        }

        this.ws.onerror = (error) => {
          reject(error)
        }

        this.ws.onclose = () => {
          this.connected = false
          clearInterval(this.heartbeatInterval)
          this.attemptReconnect(token)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  attemptReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    setTimeout(() => {
      this.connect(token).catch(() => {})
    }, delay)
  }

  disconnect() {
    if (this.ws) {
      clearInterval(this.heartbeatInterval)
      this.ws.close()
      this.ws = null
      this.connected = false
      this.reconnectAttempts = 0
    }
  }

  onNotification(handler) {
    this.messageHandlers.notification.push(handler)
    return () => {
      this.messageHandlers.notification = this.messageHandlers.notification.filter(h => h !== handler)
    }
  }

  onUnreadCount(handler) {
    this.messageHandlers.unread_count.push(handler)
    return () => {
      this.messageHandlers.unread_count = this.messageHandlers.unread_count.filter(h => h !== handler)
    }
  }

  isConnected() {
    return this.connected
  }
}

export const websocketService = new WebSocketService()