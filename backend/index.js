import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import {ENV} from "./config/env.config.js";
import {errorMiddleware} from "./middleware/error.middleware.js";
import {rateLimiter} from "./middleware/rateLimmiter.middleware.js";

const app = express();

// Middlewares
app.use(cors({
    origin: ENV.CORS_ORIGIN,
    methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(rateLimiter);

// Routes
app.use('/api', apiRoutes)
app.use(errorMiddleware);


const PORT = ENV.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
