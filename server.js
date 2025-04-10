import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173','http://localhost:5174', 'https://todo-frontend-becodewala.vercel.app']; 
    // Add all allowed origins here
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Reject the request
    }
  },
  credentials: true,  // Allow cookies to be sent
}));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});