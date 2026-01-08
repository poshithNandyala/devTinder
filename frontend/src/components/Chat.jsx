import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { connectSocket, disconnectSocket } from '../utils/socket'
import { toast } from 'react-toastify'

function Chat() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const socketRef = useRef(null)
  const offlineQueue = useRef([])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Load offline queue from local storage
  useEffect(() => {
    const savedQueue = localStorage.getItem('chat_offline_queue')
    if (savedQueue) {
      try {
        offlineQueue.current = JSON.parse(savedQueue)
      } catch (e) {
        offlineQueue.current = []
      }
    }
  }, [])

  // Process offline queue
  const processQueue = useCallback(() => {
    if (!socketRef.current?.connected || offlineQueue.current.length === 0) return

    const queue = [...offlineQueue.current]
    offlineQueue.current = []
    localStorage.removeItem('chat_offline_queue')

    queue.forEach(msgItem => {
      socketRef.current.emit('sendMessage', {
        otherUserId: msgItem.otherUserId,
        text: msgItem.text
      }, (response) => {
        if (response?.status === 'ok') {
          setMessages(prev => {
            const exists = prev.some(m => m._id === msgItem.tempId)
            if (exists) {
              return prev.map(m => m._id === msgItem.tempId ? { ...response.data, pending: false } : m)
            }
            // If not in state (e.g. after reload), add it
            return [...prev, { ...response.data, pending: false }]
          })
        } else {
          // If failed, re-queue to try again later
          offlineQueue.current.push(msgItem)
          localStorage.setItem('chat_offline_queue', JSON.stringify(offlineQueue.current))
        }
      })
    })
  }, [])

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const initChat = async () => {
      try {
        const connRes = await axios.get(`${BASE_URL}/connection/allconnections`, { withCredentials: true })
        const otherUserData = connRes.data.find(u => u._id === userId)

        if (!otherUserData) {
          toast.error("You're not connected with this user")
          navigate('/connections')
          return
        }
        setOtherUser(otherUserData)

        const msgRes = await axios.get(`${BASE_URL}/chat/messages/${userId}`, { withCredentials: true })
        setMessages(msgRes.data.messages || [])

        socketRef.current = connectSocket()

        if (!socketRef.current) {
          toast.error('Failed to connect to chat')
          return
        }

        const joinRoom = () => {
          console.log("DEBUG Chat: Emitting joinChat, otherUserId:", userId)
          socketRef.current.emit('joinChat', { otherUserId: userId })
          processQueue()
        }

        if (socketRef.current.connected) {
          console.log("DEBUG Chat: Socket connected, joining now")
          joinRoom()
          setIsOnline(true)
        } else {
          console.log("DEBUG Chat: Waiting for socket connect")
          socketRef.current.once('connect', () => {
            console.log("DEBUG Chat: Socket connected via event, joining now")
            joinRoom()
            setIsOnline(true)
          })
        }

        socketRef.current.on('connect', () => {
          setIsOnline(true)
          processQueue()
        })

        socketRef.current.on('disconnect', () => setIsOnline(false))

        socketRef.current.on('joinedChat', () => {
          setIsOnline(true)
        })

        socketRef.current.on('newMessage', (msg) => {
          setMessages(prev => {
            const exists = prev.some(m => m._id === msg._id)
            if (exists) return prev.map(m => m._id === msg._id ? msg : m)
            return [...prev.filter(m => !m.pending), msg]
          })
        })

        socketRef.current.on('userTyping', () => setIsTyping(true))
        socketRef.current.on('userStopTyping', () => setIsTyping(false))
        socketRef.current.on('userOnline', (id) => id === userId && setIsOnline(true))
        socketRef.current.on('userOffline', (id) => id === userId && setIsOnline(false))

        // Handle generic errors
        socketRef.current.on('error', (err) => {
          // mute mostly, or simplified toast
        })

        setLoading(false)
        inputRef.current?.focus()
      } catch (err) {
        toast.error('Failed to load chat')
        navigate('/connections')
      }
    }

    initChat()

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveChat', { otherUserId: userId })
        socketRef.current.off('connect')
        socketRef.current.off('disconnect')
        socketRef.current.off('joinedChat')
        socketRef.current.off('newMessage')
        socketRef.current.off('userTyping')
        socketRef.current.off('userStopTyping')
        socketRef.current.off('userOnline')
        socketRef.current.off('userOffline')
        socketRef.current.off('error')
      }
      // DON'T disconnect socket - keep it alive for other chats

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [userId, currentUser, navigate, processQueue])

  const handleTyping = () => {
    if (!socketRef.current) return
    socketRef.current.emit('typing', { otherUserId: userId })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stopTyping', { otherUserId: userId })
    }, 2000)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageText = newMessage.trim()
    setNewMessage('')

    socketRef.current?.emit('stopTyping', { otherUserId: userId })

    const tempId = `temp_${Date.now()}`
    const optimisticMsg = {
      _id: tempId,
      senderId: currentUser._id,
      text: messageText,
      createdAt: new Date().toISOString(),
      pending: true
    }

    setMessages(prev => [...prev, optimisticMsg])
    inputRef.current?.focus()

    const sendPayload = { otherUserId: userId, text: messageText }

    const handleSuccess = (data) => {
      setMessages(prev => prev.map(m => m._id === tempId ? { ...data, pending: false } : m))
    }

    const handleFailure = (errMessage, shouldQueue = true) => {
      if (shouldQueue) {
        queueMessage({ ...sendPayload, tempId })
      } else {
        // Remove message or mark as failed
        toast.error(errMessage || "Failed to send")
        setMessages(prev => prev.filter(m => m._id !== tempId))
      }
    }

    // If connected, send immediately with ack
    if (socketRef.current?.connected) {
      console.log("DEBUG: Sending message:", sendPayload)
      try {
        // Use timeout to prevent hanging
        socketRef.current.timeout(5000).emit('sendMessage', sendPayload, (err, response) => {
          console.log("DEBUG: sendMessage callback - err:", err, "response:", response)
          // socket.io timeout signature: (err, response)
          if (err) {
            // Timeout or other emit error
            console.log("DEBUG: Timeout error")
            handleFailure("Request timed out", true)
            return
          }

          if (response?.status === 'ok') {
            console.log("DEBUG: Message sent successfully")
            handleSuccess(response.data)
          } else {
            // Check for permanent errors
            const msg = response?.message || "Error"
            console.log("DEBUG: Message failed:", msg)
            if (msg.includes("Not connected") || msg.includes("Invalid")) {
              handleFailure(msg, false)
            } else {
              handleFailure(msg, true)
            }
          }
        })
      } catch (e) {
        console.log("DEBUG: Catch error:", e)
        handleFailure("Connection error", true)
      }
    } else {
      console.log("DEBUG: Socket not connected, queueing")
      // Offline: Add to queue
      queueMessage({ ...sendPayload, tempId })
    }
  }

  const queueMessage = (msgData) => {
    offlineQueue.current.push(msgData)
    localStorage.setItem('chat_offline_queue', JSON.stringify(offlineQueue.current))
    // Could also show a toast: "Message queued. Will send when online."
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // group messages by date
  const groupMessagesByDate = (msgs) => {
    const groups = {}
    msgs.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(msg)
    })
    return groups
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-rose-500/30 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto relative">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/10 via-transparent to-pink-950/10 pointer-events-none" />

      <div className="relative bg-stone-900/70 backdrop-blur-xl border-b border-stone-800/50 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <Link
            to="/connections"
            className="w-9 h-9 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity" />
            <img
              src={otherUser?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'U')}&background=1c1917&color=e11d48`}
              alt={otherUser?.name}
              className="relative w-11 h-11 rounded-full object-cover ring-2 ring-rose-500/40"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-stone-900 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-stone-100 truncate">{otherUser?.name}</h2>
            <div className="flex items-center gap-1.5">
              {isTyping ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-rose-400">typing</span>
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : (
                <span className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {isOnline ? 'online' : 'offline'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
            </div>
            <p className="text-stone-300 mt-6 font-light">Start the conversation</p>
            <p className="text-stone-600 text-sm mt-1">Say something to break the ice ✨</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 text-xs text-stone-500 bg-stone-800/50 rounded-full">
                  {date === new Date().toLocaleDateString() ? 'Today' : date}
                </span>
              </div>

              {msgs.map((msg, idx) => {
                const isMe = msg.senderId === currentUser._id || msg.senderId === currentUser._id?.toString()
                const showAvatar = !isMe && (idx === 0 || msgs[idx - 1]?.senderId !== msg.senderId)

                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 ${msg.pending ? 'opacity-70' : ''}`}
                  >
                    {!isMe && showAvatar && (
                      <img
                        src={otherUser?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'U')}&background=1c1917&color=e11d48`}
                        alt=""
                        className="w-7 h-7 rounded-full mr-2 mt-1"
                      />
                    )}
                    {!isMe && !showAvatar && <div className="w-7 mr-2" />}

                    <div className={`group relative max-w-[75%] ${isMe ? 'order-1' : ''}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl transition-all ${isMe
                          ? 'bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 text-white rounded-br-md shadow-lg shadow-rose-500/20'
                          : 'bg-stone-800/80 text-stone-100 rounded-bl-md'
                          }`}
                      >
                        <p className="text-sm break-words leading-relaxed">{msg.text}</p>
                      </div>
                      <span className={`text-[10px] text-stone-500 mt-1 block ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {formatTime(msg.createdAt)}
                        {isMe && msg.pending && ' • sending...'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative p-4 bg-stone-900/70 backdrop-blur-xl border-t border-stone-800/50">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                handleTyping()
              }}
              placeholder="Type something sweet..."
              className="w-full px-5 py-3.5 bg-stone-800/60 border border-stone-700/50 rounded-full text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 focus:bg-stone-800/80 transition-all pr-12"
              maxLength={2000}
            />
            {newMessage.length > 1800 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-500">
                {2000 - newMessage.length}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="group relative w-12 h-12 rounded-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 transition-all duration-300 ${newMessage.trim() ? 'opacity-100' : 'opacity-50'
              }`} />

            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className={`absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur opacity-0 transition-opacity ${newMessage.trim() ? 'group-hover:opacity-60' : ''
              }`} />

            <div className="relative flex items-center justify-center w-full h-full transform group-hover:scale-110 group-active:scale-95 transition-transform">
              <svg
                className={`w-5 h-5 text-white transition-transform ${newMessage.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>

            <span className="absolute inset-0 rounded-full overflow-hidden">
              <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-30 transition-opacity" />
            </span>
          </button>
        </div>

        <p className="text-center text-[10px] text-stone-600 mt-2">
          Press Enter to send • Be respectful 💕
        </p>
      </form>
    </div>
  )
}

export default Chat
