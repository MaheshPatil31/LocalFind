# LocalFind

A Hyderabad-focused local business directory built with the MERN stack. LocalFind allows customers to discover local businesses, view business details, submit enquiries and reviews, while business owners can manage their listings, respond to enquiries, and upload business images.

## Live Demo

**Website:** https://client-7o8-er.vercel.app/

**GitHub:** https://github.com/MaheshPatil31/LocalFind

## Features

### Customer

* User registration and login
* Browse approved local businesses
* Search businesses by name or keyword
* Filter businesses by category and area
* View detailed business information
* View business location on a map
* Submit enquiries to businesses
* View business replies
* Submit, edit, and delete reviews

### Business Owner

* Business owner registration and authentication
* Create and manage business listings
* Edit business information
* Upload and delete business images
* Manage customer enquiries
* Update enquiry status
* Reply to customer enquiries
* View business dashboard

### Admin

* Admin authentication
* View all businesses
* Approve, reject, or suspend business listings

### Backend

* JWT-based authentication
* Role-based access control
* Password hashing with bcrypt
* MongoDB database with Mongoose
* REST API
* Business search and filtering
* Pagination
* Cloudinary image uploads
* CORS configuration
* Protected API routes

## Tech Stack

### Frontend

* React
* React Router
* Vite
* CSS
* Leaflet

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database
* Cloudinary — Image storage
* GitHub — Source control

## Project Structure

```text
LocalFind/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

## Environment Variables

### Client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Server

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=localFind
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Never commit `.env` files or secret credentials to GitHub.**

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/MaheshPatil31/LocalFind.git
cd LocalFind
```

### 2. Install dependencies

Install the root dependencies:

```bash
npm install
```

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create:

```text
client/.env
server/.env
```

and add the required values described above.

### 4. Start the backend

From the `server` directory:

```bash
npm run dev
```

The API will run locally on:

```text
http://localhost:5000
```

### 5. Start the frontend

From the `client` directory:

```bash
npm run dev
```

The frontend will run locally on:

```text
http://localhost:5173
```

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Businesses

```text
GET    /api/businesses
GET    /api/businesses/:id
GET    /api/businesses/nearby
GET    /api/businesses/mine
POST   /api/businesses
PATCH  /api/businesses/mine/:id
DELETE /api/businesses/mine/:id
```

### Reviews

```text
GET    /api/businesses/:businessId/reviews
POST   /api/businesses/:businessId/reviews
PATCH  /api/reviews/:reviewId
DELETE /api/reviews/:reviewId
```

### Enquiries

```text
POST  /api/businesses/:businessId/enquiries
GET   /api/enquiries/mine
GET   /api/businesses/:businessId/enquiries
PATCH /api/enquiries/:enquiryId/status
PATCH /api/enquiries/:enquiryId/reply
```

### Health Check

```text
GET /api/health
```

## User Roles

LocalFind uses role-based access control with three user roles:

| Role           | Main capabilities                     |
| -------------- | ------------------------------------- |
| Customer       | Search businesses, reviews, enquiries |
| Business Owner | Manage businesses, images, enquiries  |
| Admin          | Manage and moderate businesses        |

Business listings go through an approval process before becoming publicly visible.

## Deployment

The production application is deployed using:

```text
Frontend  → Vercel
Backend   → Render
Database  → MongoDB Atlas
Images    → Cloudinary
```

The frontend communicates with the deployed Express API through the `VITE_API_URL` environment variable.

## Future Improvements

Possible future improvements include:

* Business notifications
* Advanced search and filtering
* Improved business analytics
* Additional map functionality
* Business verification
* More detailed admin moderation tools
* Improved mobile experience

## Author

**Mahesh Pateel**

BCA Student | MERN Stack Developer

GitHub: https://github.com/MaheshPatil31

LinkedIn: https://www.linkedin.com/in/mahesh-pateel-17b898220/
