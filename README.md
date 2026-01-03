# Contact Manager

A full-stack contact management application with Google OAuth authentication and CSV import/export capabilities.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- NextAuth.js (Google OAuth)
- shadcn/ui components
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer (file uploads)
- csv-parser

## Features

- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **Contact Management** - Create, read, update, and delete contacts
- **CSV Import** - Bulk import contacts from CSV files (max 5MB)
- **CSV Export** - Download all contacts as CSV
- **Dashboard** - View total contacts and quick statistics
- **Responsive Design** - Mobile, tablet, and desktop support
- **User Isolation** - Each user has their own contact list

## Project Structure

```
contact_manager/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   └── lib/           # Utilities
│   └── package.json
├── server/                # Express backend
│   ├── models/           # MongoDB schemas
│   ├── index.js          # Server entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB
- Google OAuth credentials

## Environment Variables

### Client (.env.local)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/contact_manager
JWT_SECRET=your-jwt-secret
PORT=5000
```

## Installation

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

- `POST /api/newuser` - Create/authenticate user
- `POST /api/createContact` - Create new contact
- `GET /api/contacts` - Get all user contacts
- `GET /api/contacts/export` - Export contacts as CSV
- `POST /api/deleteContacts` - Delete selected contacts
- `POST /upload/users-file` - Import contacts from CSV

## CSV Import Format

```csv
name,email,phone,message
John Doe,john@example.com,555-1234,Optional note
Jane Smith,jane@example.com,555-5678,Another note
```

## License

MIT
