# JYM Management System Documentation

## Project Overview
The JYM Management System is designed to streamline gym operations by allowing admins to manage trainers, class schedules, and trainees. The system provides secure authentication, scheduling capabilities, and trainee management features.

---

## Relation Diagram
**Relation Diagram:**

Include an ERD showcasing relationships between:
- Users (Admin, Trainers, Trainees)
- Class Schedules
- Trainees

Certainly, let's create an ER diagram (Entity-Relationship Diagram) based on the provided data model and relationships.

**Entities:**

* **User**
    * Fields: name, email, password, role (admin, trainer, trainee), createdAt, updatedAt
* **Trainer**
    * Fields: name, expertise, availability, createdAt, updatedAt
* **Class Schedule**
    * Fields: title, description, trainerId (foreign key to Trainer), timing, createdAt, updatedAt
* **Trainee**
    * Fields: name, age, classesEnrolled (array of foreign keys to Class Schedule), contactInfo, createdAt, updatedAt

**Relationships:**

1. **User** (1:N) **Trainer** 
    * One User can be associated with many Trainers.
2. **User** (1:N) **Trainee** 
    * One User can be associated with many Trainees.
3. **Trainer** (1:N) **Class Schedule** 
    * One Trainer can conduct many Class Schedules.
4. **Class Schedule** (1:N) **Trainee** 
    * One Class Schedule can have many Trainees enrolled.

**ER Diagram:**

```
+-------------------+     +-------------------+     +-------------------+
|       User        |     |     Trainer       |     | Class Schedule   |
+-------------------+     +-------------------+     +-------------------+
| name             |     | name             |     | title            |
| email            |     | expertise        |     | description      |
| password         |     | availability     |     | trainerId (FK)    |
| role (enum)      |     | createdAt        |     | timing           |
| createdAt        |     | updatedAt        |     | createdAt        |
| updatedAt        |     +-------------------+     | updatedAt        |
+-------------------+                                 +-------------------+
  |                                                       |
  |                                                       |
  |--------------------------------------------------------|
                                                           |
                                                           |
                                                           |
+-------------------+
|     Trainee      |
+-------------------+
| name            |
| age             |
| classesEnrolled (FK array) |
| contactInfo     |
| createdAt        |
| updatedAt        |
+-------------------+
```

**Explanation:**

* **User** entity is the base for both **Trainer** and **Trainee** entities, representing the shared attributes like name, email, password, etc.
* The **role** attribute in the **User** entity determines whether a user is an admin, trainer, or trainee.
* The **trainerId** foreign key in the **Class Schedule** entity links it to the **Trainer** entity.
* The **classesEnrolled** attribute in the **Trainee** entity stores an array of foreign keys to the **Class Schedule** entity, representing the schedules the trainee is enrolled in.



---

## Technology Stack
**Backend:**
- **TypeScript**: For strong type-checking and maintainable code.
- **Node.js**: Runtime environment.
- **Express.js**: Web framework for building APIs.
- **Mongoose**: For MongoDB object modeling.
- **JWT**: For secure authentication.
- **Cloudinary**: For image and media storage.

**Frontend:** (If applicable)
- React.js or other frameworks.

**Database:**
- **MongoDB**: For storing user, trainee, and schedule data.

---

## API Endpoints

### Authentication
- **POST /auth/signup**: Register a new admin.
- **POST /auth/signin**: Admin login and token generation.
- **POST /auth/refresh-token**: Generate a new token.

### Trainer Management
- **POST /auth/create-trainer**: Add a new trainer (Admin only).
- **GET /auth/all-trainer**: Fetch all trainers (Admin only).
- **PUT /auth/update-trainer**: Update a trainer's details (Admin only).
- **DELETE /auth/delete-trainer**: Soft delete a trainer (Admin only).

### Class Schedule Management
- **POST /schedule-class**: Create a new class schedule (Admin only).
- **GET /schedule-class**: Fetch all class schedules.
- **GET /schedule-class/:trainerId**: View class schedules assigned to a specific trainer.

### Trainee Management
- **POST /create-trainee**: Create a trainee profile.
- **POST /trainee-booking**: Book a class schedule for a trainee.
- **PUT /update-trainee**: Update a trainee's profile.
- **GET /get-trainee-booking**: Fetch all class bookings for trainees.

---

## Database Schema

### User
```typescript
{
  name: string;
  email: string;
  password: string;
  role: "admin" | "trainer";
  createdAt: Date;
  updatedAt: Date;
}
```

### Trainer
```typescript
{
  name: string;
  expertise: string;
  availability: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Class Schedule
```typescript
{
  title: string;
  description: string;
  trainerId: ObjectId;
  timing: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Trainee
```typescript
{
  name: string;
  age: number;
  classesEnrolled: ObjectId[];
  contactInfo: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Admin Credentials
- **Email:** `debos.das.02@gmail.com`
- **Password:** `123456`

---

## Instructions to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Refer to `.env.example` and create a `.env` file with appropriate values.
4. **Start the server:**
   ```bash
   npm run dev
   ```
5. **Access the application:**
   - Server runs on `http://localhost:5000`.

---

## Live Hosting Link
https://jym-backend.vercel.app

---

## Testing Instructions

1. **Admin Login:**
   - Use the provided credentials to log in.
2. **Feature Testing:**
   - **Trainer Management:** Add, update, delete, and fetch trainers.
   - **Class Scheduling:** Create, update, delete, and view class schedules.
   - **Trainee Management:** Add, update, delete, and fetch trainees.
3. **Postman Collection:**
   - Import the provided Postman collection for API testing.

---

### Note
This documentation assumes the backend is set up with the file structure shown in the image. Adjustments can be made based on project-specific requirements.

