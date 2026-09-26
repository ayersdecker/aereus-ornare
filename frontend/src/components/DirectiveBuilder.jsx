import { useState } from 'react'

/**
 * Create and send directives to agents.
 * @param {{ projectId: string, apiBaseUrl: string }} props
 * @returns {JSX.Element}
 */
function DirectiveBuilder({ projectId, apiBaseUrl }) {
  const [targetAgent, setTargetAgent] = useState('')
  const [instruction, setInstruction] = useState('')
  const [priority, setPriority] = useState('normal')
  const [status, setStatus] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!projectId) {
      setStatus('Select a project first.')
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/directives/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, targetAgent, instruction, priority }),
      })

      if (!response.ok) {
        throw new Error('Failed to create directive')
      }

      const payload = await response.json()
      setStatus(`Directive ${payload.directiveId} queued.`)
      setInstruction('')
    } catch (submitError) {
      setStatus(submitError.message)
    }
  }

  return (
    <section className="card">
      <h3>Directive Builder</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="targetAgent">Target Agent</label>
        <input
          id="targetAgent"
          value={targetAgent}
          onChange={(event) => setTargetAgent(event.target.value)}
          required
        />

        <label htmlFor="instruction">Instruction</label>
        <textarea
          id="instruction"
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          rows={4}
          required
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Send directive</button>
      </form>
      {status ? <p>{status}</p> : null}
    </section>
  )
}

export default DirectiveBuilder
