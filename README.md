# Process Monitoring System — Frontend

A web interface for monitoring processes and acquisitions across different stages, featuring a Kanban board, analytics dashboard, and stage-based checklist tracking.

## ✨ Features

* **Kanban Board** — Visualize processes organized by stage, including a dedicated column for canceled items.
* **Analytics Dashboard** — Track totals, values, distributions by status, type, category, and monthly trends.
* **Stage Checklist** — Monitor progress through sub-stages with visual indicators for the current stage and completion percentage.
* **Process Management** — Create, view details, confirm actions, and cancel processes through modal interfaces.
* **Dynamic Filters** — Refine data visualization using project, type, status, and other criteria.

## 🛠️ Technologies

* React 19
* React Router
* Axios
* React Toastify
* Create React App

## 📁 Project Structure

```text
src/
├── components/
│   ├── checklist/      # Stage and sub-stage checklist
│   ├── kanban/         # Board, columns and cards
│   ├── modals/         # Create, details and confirmation modals
│   └── UI/             # Filters, loading components, selects and tabs
├── pages/
│   ├── DashboardPage.jsx
│   └── KanbanPage.jsx
├── services/           # API integration
└── styles/
```

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/ca2sy/Sistema-De-Monitoramento-FrontEnd.git

cd Sistema-De-Monitoramento-FrontEnd

# Install dependencies
npm install

# Configure environment variables (.env)
# REACT_APP_API_URL=http://localhost:3001

# Start the application
npm start
```

Access the application at `http://localhost:3000`.

> This frontend consumes the Process Monitoring System Backend API. The backend must be running for the application to function correctly.

## 📜 Available Scripts

| Command       | Description                           |
| ------------- | ------------------------------------- |
| npm start     | Starts the development server         |
| npm run build | Builds the application for production |
| npm test      | Runs the test suite                   |

## 📌 Status

Personal project under active development, created for learning purposes and full-stack software engineering practice.

