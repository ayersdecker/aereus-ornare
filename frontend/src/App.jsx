import { createContext, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Projects from './pages/Projects'
import { auth } from './services/firebaseConfig'
import { getCurrentUser, signOut } from './services/authService'

export const AuthContext = createContext({ user: null })

/**
 * Root application with auth-aware routing.
 * @returns {JSX.Element}
 */
function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser())
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((value) => {
      setUser(value)
    })

    return () => unsubscribe()
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const authValue = useMemo(() => ({ user }), [user])

  return (
    <AuthContext.Provider value={authValue}>
      <header className="topbar">
        <h1>Agent Orchestration SaaS</h1>
        {user ? (
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        ) : null}
      </header>

      <Routes>
        <Route path="/login" element={<Login onAuthed={() => navigate('/projects')} />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route
          path="/projects"
          element={
            user ? <Projects userId={user.uid} apiBaseUrl={apiBaseUrl} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
