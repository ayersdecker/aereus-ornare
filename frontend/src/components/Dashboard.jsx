import AgentManager from './AgentManager'
import DirectiveBuilder from './DirectiveBuilder'

/**
 * Dashboard for project and agent orchestration.
 * @param {{ projects: Array<{id: string, projectName?: string}>, selectedProjectId: string, onSelectProject: (value: string) => void, apiBaseUrl: string }} props
 * @returns {JSX.Element}
 */
function Dashboard({ projects, selectedProjectId, onSelectProject, apiBaseUrl }) {
  return (
    <section className="project-control-layout">
      <aside className="surface project-list-panel">
        <div className="eyebrow">YOUR WORKSPACES</div>
        <div className="project-list-heading"><h2>Projects</h2><span>{String(projects.length).padStart(2, '0')}</span></div>
        <div className="project-select-list">
          {projects.map((project, index) => (
            <button
              type="button"
              className={project.id === selectedProjectId ? 'project-select is-selected' : 'project-select'}
              key={project.id}
              onClick={() => onSelectProject(project.id)}
            >
              <span className={`project-select-index project-index-${index % 4}`}>{String(index + 1).padStart(2, '0')}</span>
              <span className="project-select-name">{project.projectName || project.id}</span>
              <span className="project-select-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className="project-list-foot"><i /> PRIVATE WORKSPACE</div>
      </aside>

      {selectedProjectId ? (
        <div className="project-tools-grid">
          <AgentManager projectId={selectedProjectId} />
          <DirectiveBuilder projectId={selectedProjectId} apiBaseUrl={apiBaseUrl} />
        </div>
      ) : (
        <section className="surface project-empty-state">
          <span className="empty-mark" aria-hidden="true">↗</span>
          <div className="eyebrow">READY WHEN YOU ARE</div>
          <h2>Your first project starts here.</h2>
          <p>Create a workspace above. It will become the shared context for your agents and directives.</p>
        </section>
      )}
    </section>
  )
}

export default Dashboard
