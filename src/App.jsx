import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Chat from './components/Chat'

function App() {
  const [theme, setTheme] = useState('dark')
  const [token, setToken] = useState(localStorage.getItem('token')||'')
  const [me, setMe] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', theme==='dark')
  }, [theme])

  useEffect(()=>{
    if (!token) { setMe(null); return }
    fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r=> r.ok ? r.json() : Promise.reject())
      .then(setMe)
      .catch(()=>{ setToken(''); localStorage.removeItem('token') })
  }, [token])

  const onAuth = (t) => { setToken(t); localStorage.setItem('token', t) }
  const logout = () => { setToken(''); localStorage.removeItem('token'); setMe(null) }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-zinc-900 text-white">
      <header className="flex items-center justify-between p-4">
        <div className="font-semibold">Mini Bot</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="px-3 py-1.5 rounded bg-white/10">{theme==='dark'?'Light':'Dark'}</button>
          {me ? (
            <>
              <span className="text-sm opacity-80">{me.email}</span>
              <button onClick={logout} className="px-3 py-1.5 rounded bg-white/10">Logout</button>
            </>
          ) : null}
        </div>
      </header>
      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {!me ? (
          <Auth onAuth={onAuth} />
        ) : (
          <Chat token={token} />
        )}
        <footer className="text-center opacity-60 text-sm">Offline-ready PWA. History auto-saves. Delete account anytime.</footer>
      </main>
    </div>
  )
}

export default App