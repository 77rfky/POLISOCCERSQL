# POLISOCCER - Mini Soccer Field Information and Online Booking System

A modern, responsive, and fully functional reservation system for the Mini Soccer Field at Politeknik Negeri Lampung.

## Prerequisites
- Node.js (v14 or higher)
- MySQL / XAMPP
- npm or yarn

## Database Import Guide / Database Setup
1. Start MySQL via XAMPP.
2. Open phpMyAdmin or your MySQL client.
3. Import the `database/schema.sql` to create the structure.
4. Import the `database/seed.sql` to add sample data (including admin account).

## Environment Variables
In the `backend` directory, create a `.env` file with the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_mini_soccer_polinela
JWT_SECRET=super_secret_polisoccer_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Backend Startup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server (development mode): `npm run dev` (Ensure you added `"dev": "nodemon app.js"` in `package.json` scripts, or just run `node app.js`)
*(Alternatively: `node app.js`)*

## Frontend Startup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open the displayed local URL (usually `http://localhost:5173`) in your browser.

## Admin Credentials
Use the following credentials to access the Admin Dashboard (after database seeding):
- **Email**: admin@polisoccer.com
- **Password**: admin123

## Email Verification Setup
To enable the email verification feature for new user registrations:
1. Ensure your backend `.env` file contains `EMAIL_USER` and `EMAIL_PASS`.
2. For Gmail, you must use an **App Password** (not your regular login password).
3. Go to your Google Account > Security > 2-Step Verification > App passwords.
4. Generate a new app password and paste it into `EMAIL_PASS` (without spaces).

## Testing the Application
1. **Registration Flow**: Register a new account. The system will create the user with `is_verified = false` and send an email containing a verification link.
2. **Login Protection**: Attempting to login without verifying will display an error message prompting you to verify your email.
3. **Verification**: Clicking the verification link or visiting `http://localhost:5001/api/auth/verify/<token>` will activate your account and redirect you to the success page.
4. **Resend Email**: If the link is lost or expired, users can use the "Resend Verification" link on the login page to request a new one.
