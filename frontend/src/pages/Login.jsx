import { useState } from 'react'
import { signInWithGoogle } from '../services/authService'

/**
 * Login and sign-up page.
 * @param {{ onAuthed: () => void }} props
 * @returns {JSX.Element}
 */
function Login({ onAuthed }) {
  const [error, setError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  async function handleGoogleSignIn() {
    setError('')
    setIsSigningIn(true)

    try {
      await signInWithGoogle()
      onAuthed()
    } catch (submitError) {
      if (submitError.code !== 'auth/popup-closed-by-user') {
        setError(submitError.message || 'Google sign-in could not be completed. Please try again.')
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <main className="login-layout">
      <section className="login-aside">
        <div className="login-aside-top"><span className="brand-mark">A</span><span>AEREUS <i>CONTROL PLANE</i></span></div>
        <div className="login-aside-copy">
          <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> AGENT OPERATIONS</div>
          <h1>Make every<br />agent <em>count.</em></h1>
          <p>A considered space to coordinate systems, delegate work, and see what moves next.</p>
        </div>
        <div className="login-diagram" aria-hidden="true">
          <div className="diagram-ring diagram-ring-outer" />
          <div className="diagram-ring diagram-ring-inner" />
          <span className="diagram-center">A</span>
          <span className="diagram-node diagram-node-one">01</span>
          <span className="diagram-node diagram-node-two">02</span>
          <span className="diagram-node diagram-node-three">03</span>
          <span className="diagram-cross">+</span>
        </div>
        <div className="login-aside-foot"><span>DESIGNED FOR COMPLEX WORK</span><span>EST. 2025</span></div>
      </section>

      <section className="login-form-side">
        <div className="login-form-wrap">
          <div className="eyebrow">YOUR WORKSPACE AWAITS</div>
          <h2>Welcome back</h2>
          <p className="login-intro">Sign in with your Google account to continue to your control plane.</p>

          <div className="login-form">
            {error ? <p className="notice notice-error" role="alert">{error}</p> : null}
            <button className="google-signin-button" type="button" onClick={handleGoogleSignIn} disabled={isSigningIn}>
              <span className="google-g" aria-hidden="true">G</span>
              <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
              <span className="google-arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <div className="login-security"><span aria-hidden="true">◈</span> SECURE GOOGLE SIGN-IN VIA FIREBASE</div>
        </div>
      </section>
    </main>
  )
}

export default Login
