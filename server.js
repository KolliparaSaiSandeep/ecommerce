import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
dotenv.config();
import bodyParser from 'body-parser';

connectDB();

var app = express();
const corsOption = {
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors(corsOption));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.get('/', (req, res) => {
  res.send({
    message: 'welcome to shopnow',
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('App is running on 8080 port');
});
