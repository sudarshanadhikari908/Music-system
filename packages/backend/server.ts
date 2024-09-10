import 'dotenv/config'; 
import express, { Application } from 'express';
const cookieParser = require('cookie-parser');
import cors from './middleware/cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import artistRoutes from './routes/artistRoutes';
import songRoutes from './routes/songRoutes';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);

app.use('/music-system/auth', authRoutes);
app.use('/music-system', userRoutes);
app.use('/music-system', artistRoutes);
app.use('/music-system', songRoutes);


const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));