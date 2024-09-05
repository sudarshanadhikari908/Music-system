import 'dotenv/config'; 
import express, { Application } from 'express';
import cors from './middleware/cors';
import authRoutes from './routes/authRoutes';

const app: Application = express();

app.use(express.json());
app.use(cors);

app.use('/music-system/auth', authRoutes);

const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));