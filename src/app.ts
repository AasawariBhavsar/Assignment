import { connect } from 'mongoose';
import express from "express";
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import bodyParser from "body-parser";
import { Application } from 'express';

const app:Application = express();

app.use(bodyParser.json())

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Connect to MongoDB
run().catch(err => console.log(err));

async function run() {
await connect('mongodb://127.0.0.1:27017/test')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
}
