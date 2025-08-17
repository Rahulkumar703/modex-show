## 🎟️ Modex Show

Modex Show is a full-stack ticket booking system built with **Node.js**, **Redis**, **Zod**, and **React + TypeScript**. It supports real-time seat selection, booking confirmation polling, and robust backend validation.

---

### 🚀 Features

- 🎬 Show creation with seat and time configuration
- 🪑 Interactive seat grid with live booking status
- 🔁 Booking confirmation polling via request ID
- 🧠 Zod-based schema validation
- 🧱 Rate limiting with `express-rate-limit`
- 🕒 Scheduled cleanup using `node-cron`
- ⚡ Redis-backed booking queue with `ioredis`

---

### 🧩 Tech Stack

**Frontend**

- React.js + TypeScript
- ShadCN UI
- React Hook Form + Zod
- Vite

**Backend**

- Node.js + Express
- Redis (via `ioredis`)
- Zod for validation
- node-cron for scheduled tasks
- express-rate-limit for throttling

---

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Rahulkumar703/modex-show.git
cd modex-show

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 🛠️ Running Locally

#### Backend

```bash
cd backend
npm run dev
```

Make sure Redis is running locally on default port `6379`.

#### Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to access the app.

---

### 📐 API Overview

#### `POST /api/shows/new`

Create a new show with name, start time, duration, and seat count.

#### `POST /api/bookings/new`

Book seats for a show. Returns a `requestId` for polling.

#### `GET /api/bookings/:requestId`

Poll booking status (`PENDING`, `CONFIRMED`, `FAILED`).

#### `GET /api/bookings/show/:showId`

Return all bookings for a specific show.

#### `GET /api/shows/:showId`

Fetch show details including booked seats.
