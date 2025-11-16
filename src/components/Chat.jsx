import { useEffect, useRef, useState } from 'react'

export default function Chat({ token }) {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!token) return
    fetch(`${baseUrl}/chats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setChats).catch(() => {})
  }, [token])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeChat])

  const newChat = async () => {
    const res = await fetch(`${baseUrl}/chats`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    const chat = await res.json()
    setChats([chat, ...chats])
    setActiveChat(chat)
  }

  const send = async () => {
    if (!input.trim() || !activeChat) return
    setLoading(true)
    const res = await fetch(`${baseUrl}/chats/${activeChat._id}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: input })
    })
    const data = await res.json()
    const updated = { ...activeChat, messages: [ ...(activeChat.messages||[]), ...data.messages ] }
    setActiveChat(updated)
    setChats(prev => prev.map(c => c._id === updated._id ? updated : c))
    setInput('')
    setLoading(false)
  }

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-4 min-h-[60vh]">
      <aside className="bg-white/60 dark:bg-white/5 rounded-xl p-3 backdrop-blur border border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Chats</h3>
          <button onClick={newChat} className="px-3 py-1.5 text-sm rounded bg-black text-white dark:bg-white dark:text-black">New</button>
        </div>
        <div className="space-y-2 overflow-auto max-h-[60vh] pr-1">
          {chats.map(c => (
            <button key={c._id} onClick={() => setActiveChat(c)} className={`w-full text-left px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10 ${activeChat?._id===c._id?'bg-black/10 dark:bg-white/10':''}`}>
              <div className="text-sm font-medium truncate">{c.title||'New Chat'}</div>
              <div className="text-xs opacity-60">{new Date(c.updated_at||Date.now()).toLocaleString()}</div>
            </button>
          ))}
        </div>
      </aside>
      <main className="bg-white/60 dark:bg-white/5 rounded-xl p-4 backdrop-blur border border-black/10 dark:border-white/10 flex flex-col">
        {!activeChat ? (
          <div className="m-auto text-center opacity-70">
            <p>Select a chat or start a new one.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto space-y-4 pr-1">
              {(activeChat.messages||[]).map((m,i) => (
                <div key={i} className={`max-w-[85%] rounded px-4 py-2 ${m.role==='user'?'ml-auto bg-black text-white dark:bg-white dark:text-black':'bg-black/5 dark:bg-white/10'}`}>
                  <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="mt-4 flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." className="flex-1 rounded border px-3 py-2 bg-white/80 dark:bg-black/30 border-black/10 dark:border-white/10" />
              <button disabled={loading} onClick={send} className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black disabled:opacity-50">Send</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
