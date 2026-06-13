# Lead Management System

A complete Lead Management System with a Node.js, Express.js, PostgreSQL, JWT, bcrypt, and Sequelize backend plus a React, Vite, Bootstrap, Axios, and React Router frontend.

## Project Structure

```text
.
├── backend
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── .sequelizerc
│   ├── config
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers
│   │   ├── activityLog.controller.js
│   │   ├── auth.controller.js
│   │   ├── lead.controller.js
│   │   └── util.controller.js
│   ├── database
│   │   └── schema.sql
│   ├── middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── validate.middleware.js
│   ├── migrations
│   │   ├── 202606130001-create-users.js
│   │   ├── 202606130002-create-leads.js
│   │   └── 202606130003-create-activity-logs.js
│   ├── models
│   │   ├── activityLog.model.js
│   │   ├── index.js
│   │   ├── lead.model.js
│   │   └── user.model.js
│   ├── repositories
│   │   ├── activityLog.repository.js
│   │   ├── lead.repository.js
│   │   └── user.repository.js
│   ├── routes
│   │   ├── activityLog.routes.js
│   │   ├── auth.routes.js
│   │   ├── index.js
│   │   ├── lead.routes.js
│   │   └── util.routes.js
│   ├── seeders
│   │   └── 202606130001-demo-users.js
│   ├── services
│   │   ├── activityLog.service.js
│   │   ├── assignment.service.js
│   │   ├── auth.service.js
│   │   ├── lead.service.js
│   │   └── randomLead.service.js
│   └── utils
│       ├── apiError.js
│       ├── asyncHandler.js
│       ├── constants.js
│       ├── jwt.js
│       └── pagination.js
└── frontend
    ├── App.jsx
    ├── .env.example
    ├── index.html
    ├── main.jsx
    ├── package.json
    ├── package-lock.json
    ├── styles.css
    ├── vite.config.js
    ├── components
    │   ├── LeadForm.jsx
    │   ├── LeadTable.jsx
    │   ├── Loading.jsx
    │   ├── Navbar.jsx
    │   ├── Pagination.jsx
    │   └── StatusBadge.jsx
    ├── context
    │   └── AuthContext.jsx
    ├── pages
    │   ├── CreateLead.jsx
    │   ├── Dashboard.jsx
    │   ├── EditLead.jsx
    │   ├── LeadDetails.jsx
    │   ├── LeadList.jsx
    │   ├── Login.jsx
    │   ├── NotFound.jsx
    │   └── Register.jsx
    ├── routes
    │   ├── AppRoutes.jsx
    │   └── ProtectedRoute.jsx
    ├── services
    │   ├── api.js
    │   ├── authService.js
    │   └── leadService.js
    └── utils
        └── leadOptions.js
```

## Database Schema

The schema is defined in `backend/database/schema.sql` and mirrored by Sequelize migrations.

- `users`: application users with `Admin`, `Manager`, or `Agent` roles.
- `leads`: lead records with contact data, source, status, assignment, and audit ownership.
- `activity_logs`: immutable lead activity entries for creation, updates, assignment, and status changes.

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Demo seeded users:

```text
admin@example.com / Admin@123
manager@example.com / Manager@123
agent1@example.com / Agent@123
agent2@example.com / Agent@123
```
