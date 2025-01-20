import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import { UserRoutes } from './app/modules/user.route';



const app: Application = express();

const corsOptions = {
  origin: 'http://localhost:5173', // specify your frontend origin
  credentials: true, // allow credentials like cookies or authorization headers
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser()); // Add cookie-parser middleware

// Register routes
app.use('/api', UserRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Jym Management ');
});

// Global "Not Found" handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
});

export default app;
