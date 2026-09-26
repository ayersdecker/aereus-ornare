import { createContext, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Projects from './pages/Projects'
import { auth } from './services/firebaseConfig'
import { getCurrentUser, signOut } from './services/authService'
import './App.css'

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
  const userLabel = user?.displayName || user?.email || 'Workspace operator'

  return (
    <AuthContext.Provider value={authValue}>
      <div className={user ? 'application' : 'application application-auth'}>
        {user ? (
          <aside className="sidebar">
            <Link className="brand" to="/" aria-label="Aereus overview">
              <span className="brand-mark" aria-hidden="true">A</span>
              <span className="brand-name">AEREUS<span>CONTROL PLANE</span></span>
            </Link>

            <div className="sidebar-section-label">WORKSPACE</div>
            <nav className="primary-nav" aria-label="Main navigation">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'}>
                <span className="nav-mark" aria-hidden="true">01</span>
                Overview
              </NavLink>
              <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'}>
                <span className="nav-mark" aria-hidden="true">02</span>
                Projects
              </NavLink>
            </nav>

            <div className="sidebar-bottom">
              <span className="sidebar-orbit" aria-hidden="true" />
              <p>ORCHESTRATION<br />WORKSPACE</p>
              <span className="sidebar-version">AEREUS / 01</span>
            </div>
          </aside>
        ) : null}

        <div className="main-column">
          {user ? (
            <header className="workspace-bar">
              <div className="breadcrumbs"><span>WORKSPACE</span><i>/</i><strong>CONTROL PLANE</strong></div>
              <div className="account-tools">
                <span className="account-presence"><i /> Online</span>
                <span className="account-name" title={userLabel}>{userLabel}</span>
                <button className="button-quiet" type="button" onClick={handleSignOut}>Sign out</button>
              </div>
            </header>
          ) : null}

          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onAuthed={() => navigate('/')} />} />
            <Route path="/" element={user ? <Home userId={user.uid} /> : <Navigate to="/login" replace />} />
            <Route
              path="/projects"
              element={user ? <Projects userId={user.uid} apiBaseUrl={apiBaseUrl} /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </AuthContext.Provider>
  )
}

export default App
