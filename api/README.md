# Gym Management API

Base URL: `/api`

## Auth
- `POST /auth/register` - Register member
- `POST /auth/login` - Login
- `GET /auth/me` - Current user

## Users (Admin only)
- `GET /users` - List users
- `POST /users` - Create trainer or member
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PATCH /users/members/:memberId/assign-trainer` - Assign trainer

## Membership Plans
- `GET /memberships` - List plans
- `POST /memberships` - Create plan (Admin)
- `PATCH /memberships/:id` - Update plan (Admin)
- `DELETE /memberships/:id` - Delete plan (Admin)

## Attendance
- `GET /attendance` - List attendance (members see own)
- `POST /attendance` - Mark attendance (Admin/Trainer)

## Payments
- `GET /payments` - List payments (members see own)
- `POST /payments` - Create payment (Admin)
- `GET /payments/razorpay` - Razorpay placeholder (Admin)

## Workouts
- `GET /workouts` - List workouts (members see own)
- `POST /workouts` - Create workout (Admin/Trainer)
- `PATCH /workouts/:id` - Update workout (Admin/Trainer)

## Diets
- `GET /diets` - List diets (members see own)
- `POST /diets` - Create diet plan (Admin/Trainer)
- `PATCH /diets/:id` - Update diet plan (Admin/Trainer)

## Progress
- `GET /progress` - List progress (members see own)
- `POST /progress` - Create progress entry (Admin/Trainer)

## Reports
- `GET /reports/summary` - Admin summary
