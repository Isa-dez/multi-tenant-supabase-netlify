import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setError(error.message)
      return
    }

    // Create profile row
    await supabase.from('profiles').insert({
      id: data.user.id,
      email
    })

    // OPTIONAL: auto-add user to an org
    // Replace with your org ID
    const acmeOrgId = '7e0c6802-d434-41e2-888c-f6b52c16568b'

    await supabase.from('user_organizations').insert({
      user_id: data.user.id,
      organization_id: acmeOrgId,
      role: 'member'
    })

    setMessage('Signup successful! You can now log in.')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Sign Up</h1>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br/><br/>

        <button type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  )
}
