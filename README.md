# Agent Orchestration SaaS

Control plane for orchestrating multi-agent systems with a React dashboard, Firebase auth and data, and Firebase Functions APIs.

## Project Structure

- `frontend/`: React + Vite dashboard
- `backend/functions/`: Firebase Functions API routers for agents, messages, and directives
- `.github/workflows/deploy.yml`: CI/CD workflow for GitHub Pages + optional Firebase deploy

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Backend Setup

```bash
cd backend/functions
npm install
```

Set backend credentials in `backend/.env.example` format.

## API Routes

- `POST /agents/register`
- `GET /agents/:projectId`
- `POST /agents/verify`
- `DELETE /agents/:projectId/:agentId`
- `POST /messages/send`
- `GET /messages/:projectId/agent/:agentId`
- `GET /messages/:projectId/message/:messageId`
- `POST /directives/create`
- `GET /directives/:projectId/:agentId`
- `POST /directives/:directiveId/acknowledge`
