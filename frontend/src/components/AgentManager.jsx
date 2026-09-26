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

  return (
    <section className="card">
      <h3>Agent Manager</h3>
      <button type="button" onClick={handleGenerateCode} disabled={!projectId}>
        Generate connection code
      </button>
      {generatedCode ? <p>Latest code: {generatedCode}</p> : null}

      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>
            <strong>{agent.agentName || agent.id}</strong>
            <span> · {agent.status || 'unknown'}</span>
            <button type="button" onClick={() => handleRemoveAgent(agent.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      {error ? <p className="error">{error}</p> : null}
    </section>
  )
}

export default AgentManager
