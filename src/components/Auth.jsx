import { useEffect, useState } from 'react'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{ setMessage('') }, [mode])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'login') {
        const res = await fetch(`${baseUrl}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
        const data = await res.json()
        if (res.ok) { onAuth(data.access_token) } else { setMessage(data.detail || 'Login failed') }
      } else if (mode === 'register') {
        const res = await fetch(`${baseUrl}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password }) })
        const data = await res.json()
        if (res.ok) { onAuth(data.access_token) } else { setMessage(data.detail || 'Register failed') }
      } else if (mode === 'forgot') {
        const res = await fetch(`${baseUrl}/auth/forgot`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
        const data = await res.json()
        setMessage(data.message || 'If an account exists, a reset link was created')
      }
    } catch (e) { setMessage(e.message) }
  }

  return (
    <div className="max-w-md mx-auto bg-white/60 dark:bg-white/5 backdrop-blur border border-black/10 dark:border-white/10 p-6 rounded-xl">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={()=>setMode('login')} className={`px-3 py-1.5 rounded ${mode==='login'?'bg-black text-white dark:bg-white dark:text-black':'bg-black/5 dark:bg-white/10'}`}>Login</button>
        <button onClick={()=>setMode('register')} className={`px-3 py-1.5 rounded ${mode==='register'?'bg-black text-white dark:bg-white dark:text-black':'bg-black/5 dark:bg-white/10'}`}>Register</button>
        <button onClick={()=>setMode('forgot')} className={`px-3 py-1.5 rounded ${mode==='forgot'?'bg-black text-white dark:bg-white dark:text-black':'bg-black/5 dark:bg-white/10'}`}>Forgot</button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode==='register' && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full rounded border px-3 py-2 bg-white/80 dark:bg-black/30 border-black/10 dark:border-white/10" />
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded border px-3 py-2 bg-white/80 dark:bg-black/30 border-black/10 dark:border-white/10" />
        {mode!=='forgot' && (
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded border px-3 py-2 bg-white/80 dark:bg-black/30 border-black/10 dark:border-white/10" />
        )}
        <button className="w-full px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black">{mode==='login'?'Login':mode==='register'?'Create account':'Send reset link'}</button>
      </form>
      {message && <p className="mt-3 text-sm opacity-80 text-center">{message}</p>}
    </div>
  )
}
