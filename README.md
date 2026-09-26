# Agent Orchestration SaaS

Control plane for orchestrating multi-agent systems with a React dashboard, Firebase auth and data, and Firebase Functions APIs.

## Project Structure

- `frontend/`: React + Vite dashboard
- `backend/functions/`: Firebase Functions API routers for agents, messages, and directives
- `.github/workflows/deploy.yml`: CI/CD workflow for GitHub Pages and Firebase

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

## GitHub Actions Deployment

Add one repository secret named `DEPLOY_CONFIG` in **Settings → Secrets and variables → Actions**. Set its value to JSON with this shape:

```json
{
	"firebaseProjectId": "aereus-55b87",
	"serviceAccount": {
		"type": "service_account",
		"project_id": "aereus-55b87",
		"private_key_id": "YOUR_PRIVATE_KEY_ID",
		"private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
		"client_email": "YOUR_SERVICE_ACCOUNT_EMAIL",
		"client_id": "YOUR_SERVICE_ACCOUNT_CLIENT_ID",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "YOUR_SERVICE_ACCOUNT_CERT_URL",
		"universe_domain": "googleapis.com"
	},
	"apiBaseUrl": "https://us-central1-aereus-55b87.cloudfunctions.net/api",
	"allowedOrigins": ["https://YOUR_GITHUB_OWNER.github.io"],
	"webConfig": {
		"apiKey": "YOUR_FIREBASE_WEB_API_KEY",
		"authDomain": "aereus-55b87.firebaseapp.com",
		"projectId": "aereus-55b87",
		"storageBucket": "aereus-55b87.firebasestorage.app",
		"messagingSenderId": "YOUR_SENDER_ID",
		"appId": "YOUR_WEB_APP_ID",
		"measurementId": "YOUR_MEASUREMENT_ID"
	}
}
```

The workflow validates this secret, creates the frontend and Functions environment files, builds GitHub Pages, and deploys Functions and Firestore rules to the selected Firebase project using Application Default Credentials. Create a Google service-account key for the Firebase project and grant it the IAM permissions needed to deploy Functions and Firestore rules and enable required Google APIs. Keep the entire secret private and rotate the key if it is exposed. `allowedOrigins` entries are origins only, with no path (for example, `https://YOUR_GITHUB_OWNER.github.io`). Also add the GitHub Pages hostname to Firebase Authentication's authorized domains for Google sign-in.

Local development still uses `frontend/.env`; `DEPLOY_CONFIG` is for GitHub Actions.

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
