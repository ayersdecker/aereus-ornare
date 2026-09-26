import { useState } from 'react'
import { signInWithEmail, signUpWithEmail } from '../services/authService'

/**
 * Login and sign-up page.
 * @param {{ onAuthed: () => void }} props
 * @returns {JSX.Element}
 */
function Login({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }
      onAuthed()
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <main className="auth-layout">
      <section className="card">
        <h1>{isSignUp ? 'Create account' : 'Sign in'}</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">{isSignUp ? 'Sign up' : 'Sign in'}</button>
        </form>

        <button type="button" onClick={() => setIsSignUp((current) => !current)}>
          {isSignUp ? 'Already have an account?' : 'Need an account?'}
        </button>

        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  )
}

export default Login
