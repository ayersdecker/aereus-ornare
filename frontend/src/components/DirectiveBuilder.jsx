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
    <section className="surface directive-panel">
      <div className="tool-panel-heading">
        <div><div className="eyebrow">ROUTE WORK</div><h2>New directive</h2></div>
        <span className="panel-symbol panel-symbol-directive" aria-hidden="true">D</span>
      </div>
      <p className="tool-description">Send a focused instruction to an agent in this project.</p>
      <form className="directive-form" onSubmit={handleSubmit}>
        <label htmlFor="targetAgent">Target agent</label>
        <input
          className="form-input"
          id="targetAgent"
          placeholder="Agent ID"
          value={targetAgent}
          onChange={(event) => setTargetAgent(event.target.value)}
          required
        />

        <label htmlFor="instruction">Instruction</label>
        <textarea
          className="form-input form-textarea"
          id="instruction"
          placeholder="Describe the work, context, and expected outcome..."
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          rows={5}
          required
        />

        <label htmlFor="priority">Priority</label>
        <select
          className="form-input form-select"
          id="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <button className="button-primary directive-submit" type="submit" disabled={!projectId}>Queue directive <span aria-hidden="true">→</span></button>
      </form>
      {status ? <p className={status.startsWith('Directive ') ? 'directive-status is-success' : 'directive-status'} role="status">{status}</p> : null}
    </section>
  )
}

export default DirectiveBuilder
