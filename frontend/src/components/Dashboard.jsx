import AgentManager from './AgentManager'
import DirectiveBuilder from './DirectiveBuilder'

/**
 * Dashboard for project and agent orchestration.
 * @param {{ projects: Array<{id: string, projectName?: string}>, selectedProjectId: string, onSelectProject: (value: string) => void, apiBaseUrl: string }} props
 * @returns {JSX.Element}
 */
function Dashboard({ projects, selectedProjectId, onSelectProject, apiBaseUrl }) {
  return (
    <main className="dashboard-grid">
      <section className="card">
        <h2>Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className={project.id === selectedProjectId ? 'active' : ''}
                onClick={() => onSelectProject(project.id)}
              >
                {project.projectName || project.id}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <AgentManager projectId={selectedProjectId} />

      <section className="card">
        <h3>Recent Messages</h3>
        <p>Message history appears here after agents exchange data.</p>
      </section>

      <DirectiveBuilder projectId={selectedProjectId} apiBaseUrl={apiBaseUrl} />
    </main>
  )
}

export default Dashboard
