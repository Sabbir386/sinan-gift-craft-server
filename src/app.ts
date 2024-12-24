import express, { Application, Request, Response } from 'express';
import cors, { CorsOptionsDelegate, CorsRequest } from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
const app: Application = express();
import cookieParser from 'cookie-parser';
import router from './app/routes';
import { USER_ROLE } from './app/User/user.constant';
import auth from './app/middleware/auth';
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// use when cors issue face
const allowedOrigin = [
  'https://sinangiftcorner.web.app',
  'http://localhost:5173',
];
// const allowedOrigin = 'http://localhost:5173';

// Configure CORS options
const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Check if the origin is allowed
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   credentials: true,
// };

// Enable CORS with the specified options
app.use(cors(corsOptions));
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('App is Running');
});

//create payment intent



app.use(globalErrorHandler);
app.use(notFound);
export default app;
