# User Management API

## Overview
A Node.js Express API for user management using Prisma ORM with MongoDB.

## Features
- Create new users
- Retrieve user lists with pagination
- Get individual user details
- Update user information
- Delete users
- Advanced user statistics aggregation

## Prerequisites
- Node.js
- MongoDB
- Prisma
- TypeScript

## Installation
```bash
npm install
npx prisma generate
npm run dev
```

## Prisma Schema
```prisma
model User {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  email       String
  phoneNumber String    @map("phone_number")
  gender      String
  age         Int
  city        String
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
}
```

## API Endpoints
- `POST /users`: Create a new user
- `GET /users`: Retrieve paginated users
- `GET /users/:userId`: Get single user
- `PATCH /users/:userId`: Update user
- `DELETE /users/:userId`: Delete user
- `GET /users/stats`: Get user statistics

## Query Parameters
### User List
- `page`: Page number
- `limit`: Items per page
- `sort`: Sorting field
- `order`: Sort order

### User Statistics
- `minAge`: Minimum user age
- `maxAge`: Maximum user age
- `city`: Filter by city (case-insensitive)

## Error Handling
Consistent JSON response:
```json
{
  "status": false/true,
  "message": "Description",
  "data": {}
}
```

## Development
- Validate input using Zod schemas
- Implement pagination
- Case-insensitive search
- Aggregation pipeline for user statistics
- Aggregation pipeline fetches the average age of uses and the number of users in each city
- If the queries for the aggregation are added, it filters by the queries