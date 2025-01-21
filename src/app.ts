import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import { UserRoutes } from './app/modules/user.route';
import globalErrorHandler from './app/Middlewar/globalErrorHandler';



const app: Application = express();


app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware

// Register routes
app.use('/api', UserRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Jym Management ');
});

app.use(globalErrorHandler);

// Global "Not Found" handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
});

export default app;
