import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../services/agentService'

/**
 * Workspace overview for authenticated users.
 * @param {{ userId: string }} props
 * @returns {JSX.Element}
 */
function Home({ userId }) {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadProjects() {
      try {
        const values = await getProjects(userId)
        if (isCurrent) setProjects(values)
      } catch (loadError) {
        if (isCurrent) setError(loadError.message)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    loadProjects()
    return () => { isCurrent = false }
  }, [userId])

  const greetingName = (projects.length && 'Welcome back') || 'Good to see you'

  return (
    <main className="page-shell overview-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CONTROL ROOM</div>
          <h1>{greetingName}<span className="heading-period">.</span></h1>
          <p className="page-description">A clear view of the systems you are coordinating.</p>
        </div>
        <Link className="button-primary" to="/projects"><span aria-hidden="true">+</span> New project</Link>
      </div>

      {error ? <div className="notice notice-error" role="alert">{error}</div> : null}

      <section className="overview-feature" aria-labelledby="workspace-title">
        <div className="overview-feature-copy">
          <div className="eyebrow eyebrow-light">WORKSPACE SUMMARY</div>
          <h2 id="workspace-title">Orchestration<br />at a glance.</h2>
          <p>Projects are the home for your connected agents, shared context, and the work you route between them.</p>
          <div className="feature-stat">
            <span className="feature-stat-value">{isLoading ? '—' : String(projects.length).padStart(2, '0')}</span>
            <span className="feature-stat-label">PROJECT<br />WORKSPACES</span>
          </div>
        </div>
        <div className="flow-board" aria-label="Project to directive to agent to result flow">
          <div className="flow-board-heading"><span>EXECUTION PATH</span><span className="flow-live"><i /> READY</span></div>
          <div className="flow-line" aria-hidden="true"><i /><i /><i /></div>
          <div className="flow-nodes">
            <div className="flow-node flow-node-project"><span className="flow-node-icon">P</span><span>PROJECT</span><strong>Context</strong></div>
            <div className="flow-node flow-node-directive"><span className="flow-node-icon">D</span><span>DIRECTIVE</span><strong>Intent</strong></div>
            <div className="flow-node flow-node-agent"><span className="flow-node-icon">A</span><span>AGENT</span><strong>Execution</strong></div>
            <div className="flow-node flow-node-result"><span className="flow-node-icon">R</span><span>RESULT</span><strong>Outcome</strong></div>
          </div>
          <div className="flow-board-foot"><span>01 — 04</span><span>CONNECTED SYSTEMS</span></div>
        </div>
      </section>

      <div className="overview-grid">
        <section className="surface recent-projects" aria-labelledby="recent-projects-title">
          <div className="surface-heading">
            <div>
              <div className="eyebrow">PROJECT INDEX</div>
              <h2 id="recent-projects-title">Your projects</h2>
            </div>
            <Link className="text-link" to="/projects">View all <span aria-hidden="true">↗</span></Link>
          </div>

          {isLoading ? <div className="loading-row">Loading workspaces<span className="loading-pulse" /></div> : null}
          {!isLoading && projects.length ? (
            <div className="project-rows">
              {projects.slice(0, 4).map((project, index) => (
                <Link className="project-row" key={project.id} to="/projects">
                  <span className={`project-index project-index-${index % 4}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="project-row-name">{project.projectName || 'Untitled project'}</span>
                  <span className="project-row-id">{project.id.slice(0, 8).toUpperCase()}</span>
                  <span className="project-row-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          ) : null}

          {!isLoading && !projects.length ? (
            <div className="empty-projects">
              <div className="empty-mark" aria-hidden="true">+</div>
              <div><h3>No projects yet</h3><p>Create a workspace to start organizing your agents.</p></div>
              <Link className="button-secondary" to="/projects">Create first project <span aria-hidden="true">→</span></Link>
            </div>
          ) : null}
        </section>

        <section className="surface quick-actions" aria-labelledby="quick-actions-title">
          <div className="eyebrow">QUICK ACCESS</div>
          <h2 id="quick-actions-title">Jump back in.</h2>
          <Link className="action-row" to="/projects"><span className="action-index">01</span><span><strong>Project hub</strong><small>Manage workspaces and agents</small></span><b aria-hidden="true">↗</b></Link>
          <div className="action-divider" />
          <div className="quick-action-note"><span className="note-star" aria-hidden="true">✳</span><span>ONE CONTROL PLANE<br /><strong>BUILT FOR MANY AGENTS</strong></span></div>
        </section>
      </div>
    </main>
  )
}

export default Home
