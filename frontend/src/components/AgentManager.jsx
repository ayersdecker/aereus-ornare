import { useEffect, useState } from 'react'
import {
  generateAgentCode,
  getAgentsByProject,
  removeAgent,
} from '../services/agentService'

/**
 * Manage project agents and connection codes.
 * @param {{ projectId: string }} props
 * @returns {JSX.Element}
 */
function AgentManager({ projectId }) {
  const [agents, setAgents] = useState([])
  const [generatedCode, setGeneratedCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!projectId) {
      setAgents([])
      return
    }

    async function loadAgents() {
      try {
        const values = await getAgentsByProject(projectId)
        setAgents(values)
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    loadAgents()
  }, [projectId])

  async function handleGenerateCode() {
    setError('')
    try {
      const code = await generateAgentCode(projectId)
      setGeneratedCode(code)
    } catch (generateError) {
      setError(generateError.message)
    }
  }

  async function handleRemoveAgent(agentId) {
    try {
      await removeAgent(projectId, agentId)
      setAgents((current) => current.filter((agent) => agent.id !== agentId))
    } catch (removeError) {
      setError(removeError.message)
    }
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('Could not copy the code. Select it to copy manually.')
    }
  }

  return (
    <section className="surface agent-panel">
      <div className="tool-panel-heading">
        <div><div className="eyebrow">CONNECTED SYSTEMS</div><h2>Agents<span className="inline-count">{String(agents.length).padStart(2, '0')}</span></h2></div>
        <span className="panel-symbol" aria-hidden="true">A</span>
      </div>
      <p className="tool-description">Agents are the workers attached to this project context.</p>

      <div className="agent-list">
        {agents.map((agent) => (
          <div className="agent-row" key={agent.id}>
            <span className="agent-avatar" aria-hidden="true">{(agent.agentName || agent.id).slice(0, 1).toUpperCase()}</span>
            <span className="agent-details"><strong>{agent.agentName || agent.id}</strong><small>{agent.id}</small></span>
            <span className={`status-pill status-${(agent.status || 'unknown').toLowerCase()}`}><i />{agent.status || 'unknown'}</span>
            <button className="remove-agent" type="button" onClick={() => handleRemoveAgent(agent.id)} aria-label={`Remove ${agent.agentName || agent.id}`} title="Remove agent">×</button>
          </div>
        ))}
        {!agents.length ? <div className="agent-empty"><span aria-hidden="true">◎</span><p>No agents connected</p><small>Generate a connection code to onboard one.</small></div> : null}
      </div>

      {generatedCode ? (
        <div className="connection-code"><span>CONNECTION CODE</span><code>{generatedCode}</code><button type="button" onClick={handleCopyCode} aria-label="Copy connection code" title="Copy connection code">{copied ? 'Copied' : 'Copy'}</button></div>
      ) : null}

      {error ? <p className="notice notice-error" role="alert">{error}</p> : null}
      <button className="button-secondary generate-code" type="button" onClick={handleGenerateCode} disabled={!projectId}>
        <span aria-hidden="true">+</span> Generate connection code
      </button>
    </section>
  )
}

export default AgentManager
