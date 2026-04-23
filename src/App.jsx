import { useEffect, useState } from 'react'

const sections = [
  {
    title: 'Trending Now',
    items: Array.from({ length: 8 }, (_, i) => `Show ${i + 1}`),
  },
  {
    title: 'Top Picks For You',
    items: Array.from({ length: 8 }, (_, i) => `Movie ${i + 1}`),
  },
  {
    title: 'New Releases',
    items: Array.from({ length: 8 }, (_, i) => `Series ${i + 1}`),
  },
]

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('netflixUser'))
    } catch {
      return null
    }
  })
  const [authMode, setAuthMode] = useState('login')
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      localStorage.setItem('netflixUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('netflixUser')
    }
  }, [user])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const authEmailIsValid = (value) => /^\S+@\S+\.\S+$/.test(value)

  const handleAuth = (event) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedName = name.trim()

    if (!trimmedEmail || !trimmedPassword || (authMode === 'register' && !trimmedName)) {
      setError('Please complete all required fields.')
      return
    }

    if (!authEmailIsValid(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (authMode === 'register') {
      if (trimmedPassword !== confirmPassword.trim()) {
        setError('Passwords do not match.')
        return
      }

      setUser({
        name: trimmedName,
        email: trimmedEmail,
        plan: 'Premium',
        memberSince: '2025',
      })
    } else {
      setUser({
        name: trimmedEmail.split('@')[0].replace(/\d+/g, '') || 'Member',
        email: trimmedEmail,
        plan: 'Premium',
        memberSince: '2025',
      })
    }

    resetForm()
    setShowAuth(false)
    setAuthMode('login')
  }

  const handleLogout = () => {
    setUser(null)
    setShowProfile(false)
    resetForm()
  }

  const openAuth = (mode) => {
    resetForm()
    setAuthMode(mode)
    setShowAuth(true)
  }

  const heroTitle = user ? `Welcome back, ${user.name}!` : 'Stream your next obsession'
  const heroSubtitle = user
    ? 'Resume browsing your favorites or discover new hits.'
    : 'Browse the latest movies, series, and originals in a sleek Netflix-style experience built with React and Tailwind.'

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black text-[#e50914]">NETFLIX</div>
            <nav className="hidden items-center gap-4 text-sm font-medium text-white/80 md:flex">
              <a href="#" className="hover:text-white">Home</a>
              <a href="#" className="hover:text-white">TV Shows</a>
              <a href="#" className="hover:text-white">Movies</a>
              <a href="#" className="hover:text-white">My List</a>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/90">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile((current) => !current)}
                  className="rounded border border-white/20 px-3 py-2 text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  {user.name}
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-white/10 bg-[#0e0e0e] p-4 shadow-2xl shadow-black/50">
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">Signed in as</p>
                      <p className="text-base font-semibold text-white">{user.email}</p>
                      <div className="mt-4 space-y-1 rounded-2xl bg-[#111] p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Plan</p>
                        <p className="text-sm text-white">{user.plan}</p>
                      </div>
                      <div className="rounded-2xl bg-[#111] p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Member since</p>
                        <p className="text-sm text-white">{user.memberSince}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-2xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openAuth('login')}
                  className="rounded border border-white/20 px-3 py-2 text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="rounded bg-white/10 px-3 py-2 text-white transition hover:bg-white/20"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showAuth && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 shadow-2xl shadow-black/60">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {authMode === 'register' ? 'Create your account' : 'Sign in'}
                </h2>
                <p className="text-sm text-white/60">
                  {authMode === 'register'
                    ? 'Register to save your profile and browse faster.'
                    : 'Enter your email and password to continue.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAuth(false)
                  setError('')
                }}
                className="rounded-full bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
              >
                Close
              </button>
            </div>
            <div className="mb-6 flex items-center gap-3 text-sm text-white/70">
              <button
                onClick={() => setAuthMode('login')}
                className={`rounded-2xl px-4 py-2 transition ${authMode === 'login' ? 'bg-[#e50914] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`rounded-2xl px-4 py-2 transition ${authMode === 'register' ? 'bg-[#e50914] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                Register
              </button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#e50914]"
                    placeholder="Your name"
                  />
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#e50914]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#e50914]"
                  placeholder="Enter password"
                />
              </div>
              {authMode === 'register' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#e50914]"
                    placeholder="Confirm password"
                  />
                </div>
              )}
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#e50914] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#f6121d]"
              >
                {authMode === 'register' ? 'Create Account' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      )}

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.35),_transparent_35%),linear-gradient(180deg,_rgba(17,24,39,0)_0%,_rgba(17,24,39,1)_100%)]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-50"></div>
          <div className="relative mx-auto max-w-7xl px-5 py-24 text-center sm:py-32 lg:px-8">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-white/70">Featured Today</p>
            <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
              {heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="rounded bg-[#e50914] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#f6121d]">
                Watch Now
              </button>
              <button className="rounded border border-white/20 bg-white/5 px-8 py-3 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/10">
                Browse Categories
              </button>
            </div>
          </div>
        </section>

        {user && (
          <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-[#121212] p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/50">Your profile</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{user.name}</h2>
                  <p className="text-sm text-white/60">{user.email}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-[#161616] p-4 text-sm">
                    <p className="text-white/50">Plan</p>
                    <p className="mt-2 text-white">{user.plan}</p>
                  </div>
                  <div className="rounded-3xl bg-[#161616] p-4 text-sm">
                    <p className="text-white/50">Member since</p>
                    <p className="mt-2 text-white">{user.memberSince}</p>
                  </div>
                  <div className="rounded-3xl bg-[#161616] p-4 text-sm">
                    <p className="text-white/50">Favorites</p>
                    <p className="mt-2 text-white">8 saved</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-10 px-5 py-12 lg:px-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {section.items.map((item) => (
                  <div key={item} className="min-w-[200px] rounded-xl bg-[#181818] p-4 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-white/10">
                    <div className="h-40 rounded-3xl bg-gradient-to-br from-[#bb0a1e] via-[#76181b] to-[#121212]" />
                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-semibold text-white">{item}</h3>
                      <p className="text-sm text-white/60">Action · Drama · Sci-Fi</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
