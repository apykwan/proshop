import path from 'path';
import express from "express";
import dotenv from "dotenv";
import morgan from 'morgan';
import helmet from "helmet";
import colors from "colors";

import connectDB from './config/db.js';
import productsRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/upload', uploadRoutes);

// PayPal Client_Id
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${__dirname}/frontend/build`));

    app.get('*', (req, res) => res.sendFile(`${__dirname}/frontend/build/index.html`));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));