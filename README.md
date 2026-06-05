# SaaSFlow - Role-Based SaaS Billing Portal (MERN Stack)

This is a clean, developer-friendly, and professional billing portal built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled using Tailwind CSS v4.

It features JWT authentication, two roles (`Admin` and `User`), a dashboard with analytics, subscription plans, dynamic invoices, and billing logs.

---

## Features

### Authentication & Authorization
- User Registration and Login with JWT token management stored in `localStorage`.
- Protected React routing (`ProtectedRoute.jsx`) with automatic user/admin authorization.
- Admin vs. Regular User dashboard layouts.

### User Options
- View available subscription tiers (Basic, Pro, Premium).
- Subscribe to plans (mock payment checkout).
- Cancel active subscriptions.
- View personal billing/payment histories.
- Download dynamic PDF invoices directly from the browser using native printing stylesheets.

### Admin Options
- View administrative dashboard metrics:
  - Total registered users.
  - Active subscription totals.
  - Live revenue summary.
- Audit the master transactions ledger (list of all payments across all users).
- Create new subscription plans on-the-fly (features, billing cycles, pricing).
- Deactivate plans (soft delete plans).
- Browse registered user directory.

---

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS v4 (native CSS imports), Lucide React (Icons), Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB, Mongoose ODM.
- **Security**: JWT (jsonwebtoken), bcryptjs.

---

## Project Structure

```text
mern-billing-portal/
├── backend/
│   ├── config/db.js           # Database Mongoose connection
│   ├── controllers/           # API request logic handlers
│   ├── middleware/            # JWT validation & Admin verification
│   ├── models/                # MongoDB Models (User, Plan, Subscription, Payment)
│   ├── routes/                # Express API endpoint declarations
│   ├── seed.js                # Database seeder script
│   ├── server.js              # Express main server configuration
│   ├── .env                   # Server environment configurations
│   └── package.json           # Server dependencies & scripts
│
├── frontend/
│   ├── src/
│   │   ├── components/        # ProtectedRoute, Sidebar, Header layout
│   │   ├── context/           # AuthContext managing global state & Axios instance
│   │   ├── pages/             # Login, Register, Dashboard, Plans, History, UsersList
│   │   ├── utils/             # invoicePrinter.js print/PDF helper
│   │   ├── App.jsx            # Routing navigation configuration
│   │   ├── index.css          # Tailwind CSS imports & custom styles
│   │   └── main.jsx           # React bootstrap entry point
│   ├── index.html
│   ├── vite.config.js         # Vite configuration with Tailwind CSS v4 plugin
│   └── package.json           # Frontend package declarations
└── README.md                  # This file
```

---

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (`node -v`).
- **MongoDB**: Ensure you have MongoDB running locally (typically `mongodb://localhost:27017`) OR a MongoDB Atlas connection string.

### Step 1: Clone or Open the Workspace
Open a terminal in the root folder `mern-billing-portal`.

### Step 2: Set up Backend Config
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Inspect the `.env` file (one has been pre-created for you).
   - If your local MongoDB runs on a custom port, update the `MONGO_URI`.
   - If using **MongoDB Atlas**, change the `MONGO_URI` value:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/billing-portal?retryWrites=true&w=majority
     ```

### Step 3: Populate Mock Data (Seeding)
We have provided a database seeder script to populate default plans, test users, and billing history so you can immediately see the portal in action.
1. Run the seed script:
   ```bash
   node seed.js
   ```
2. You should see a success message: `Mock subscriptions and payments seeded successfully. Seeding complete.`

### Step 4: Run Backend Server
Start the Express server on port `5000`:
```bash
npm run dev
```
*(Uses nodemon to automatically watch and reload on file changes).*

### Step 5: Start the Frontend React Client
1. Open a new terminal window in the root directory and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the address shown in the terminal (typically `http://localhost:5173`).

---

## Demo Credentials

You can use these pre-seeded logins directly from the **Quick Demo Login** buttons on the login page, or input them manually:

### 1. Admin Role
- **Email**: `admin@example.com`
- **Password**: `admin123`

### 2. Standard User Role
- **Email**: `user@example.com`
- **Password**: `user123`
