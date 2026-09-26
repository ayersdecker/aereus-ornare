import { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import { createProject, getProjects } from '../services/agentService'

/**
 * Projects page for creating and managing orchestration projects.
 * @param {{ userId: string, apiBaseUrl: string }} props
 * @returns {JSX.Element}
 */
function Projects({ userId, apiBaseUrl }) {
  const [projectName, setProjectName] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProjects() {
      try {
        const values = await getProjects(userId)
        setProjects(values)
        if (values.length > 0 && !selectedProjectId) {
          setSelectedProjectId(values[0].id)
        }
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    if (userId) {
      loadProjects()
    }
  }, [userId, selectedProjectId])

  async function handleCreateProject(event) {
    event.preventDefault()
    setError('')

    try {
      const projectId = await createProject(projectName, userId)
      setProjectName('')
      const values = await getProjects(userId)
      setProjects(values)
      setSelectedProjectId(projectId)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <main className="page-shell projects-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> PROJECT DIRECTORY</div>
          <h1>Project workspaces<span className="heading-period">.</span></h1>
          <p className="page-description">Group agents around a shared mission and route work with intent.</p>
        </div>
        <div className="project-count"><span>{String(projects.length).padStart(2, '0')}</span><small>WORKSPACES</small></div>
      </div>

      <section className="surface create-project-panel">
        <div className="create-project-copy"><span className="create-project-icon" aria-hidden="true">+</span><div><h2>Start a workspace</h2><p>Give a project a name to create its agent room.</p></div></div>
        <form className="create-project-form" onSubmit={handleCreateProject}>
          <label className="visually-hidden" htmlFor="projectName">Project name</label>
          <input
            className="form-input"
            id="projectName"
            placeholder="e.g. Research operations"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            required
          />
          <button className="button-primary" type="submit">Create project <span aria-hidden="true">→</span></button>
        </form>
        {error ? <p className="notice notice-error" role="alert">{error}</p> : null}
      </section>

      <Dashboard
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        apiBaseUrl={apiBaseUrl}
      />
    </main>
  )
}

export default Projects
