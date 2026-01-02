# Haiku

A collaborative chat application where multiple users can join discussions with an AI.

## Tech Stack

**Backend:** Express.js, MongoDB, Cloudinary
**Frontend:** React

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5050
JWT_SECRET=supersecret
MONGODB_URI=mongodb+srv://username123:password123@cluster123.abcdefg.mongodb.net/?appName=cluster123
CLOUDINARY_CLOUD_NAME=cloudname123
CLOUDINARY_API_KEY=000000001111111
CLOUDINARY_API_SECRET=12-000000fffffffff11
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5050/api
```

Start the dev server:

```bash
npm run dev
```
## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/    # Business logic
│       ├── middleware/     # Auth middleware
│       ├── models/         # MongoDB schemas
│       ├── routes/         # API routes
│       └── lib/            # Utilities
└── frontend/
    └── src/
        ├── components/     # Reusable components
        ├── pages/          # Route pages
        ├── store/          # Zustand store
        └── lib/            # Axios config
```
