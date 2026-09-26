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
    <main>
      <section className="card">
        <h1>Projects</h1>
        <form onSubmit={handleCreateProject}>
          <label htmlFor="projectName">Project name</label>
          <input
            id="projectName"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            required
          />
          <button type="submit">Create project</button>
        </form>
        {error ? <p className="error">{error}</p> : null}
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
