import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import router from './app/routes';

const app: Application = express();
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allowed origins
const allowedOrigin = [
  'https://sinangiftcorner.web.app',
  'http://localhost:5173',
  'https://sinanshopbd.com',
  'https://www.sinanshopbd.com',
];

// Configure CORS options
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin) {
      // Allow requests without an origin (e.g., Postman or server-side)
      return callback(null, true);
    }

    // Normalize origin by removing 'www.' for comparison
    const normalizedOrigin = origin.replace(/^www\./, '');
    const isAllowed = allowedOrigin.some(
      (allowed) =>
        allowed === normalizedOrigin || allowed === `https://www.${normalizedOrigin}`
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

app.use('/api/v1', router);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('App is Running');
});

// Global error handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;
