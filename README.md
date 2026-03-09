# Gym Management System (MERN)

Production-ready gym management system with role-based access for Admin, Trainer, and Member.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT + Role-based access control

## Folder Structure
```
api/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    seeds/
client/
  src/
    context/
    data/
    routes/
    ui/
      components/
      layouts/
      navigation/
      pages/
```

## Setup
1. Backend
```
cd api
cp .env.example .env
npm install
npm run seed
npm run dev
```

2. Frontend
```
cd client
cp .env.example .env
npm install
npm run dev
```

## Environment Variables
Backend: `api/.env`
- `PORT=5000`
- `MONGO_URI=mongodb://localhost:27017/gym-management`
- `JWT_SECRET=change_me`
- `NODE_ENV=development`

Frontend: `client/.env`
- `VITE_API_URL=http://localhost:5000`

## Notes
- Razorpay integration is included as a placeholder endpoint.
- QR attendance is represented as a UI placeholder.
- Seed creates one admin, trainer, and member user for demo.


From your backend seed script, you have these users:
Super Admin: {
  "email": "owner@gym.local",
  "password": "Owner@123"
}

Admin: admin@gym.local / Admin@123
Trainer: trainer@gym.local / Trainer@123
Member: member@gym.local / Member@123