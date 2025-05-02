// import express from "express";
// import chalk from "chalk";
// import connectDB from "./db/config.js";
// import cors from "cors";
// import SignInRoutes from "./routes/SignInRoutes.js";




// const app = express();
// const port = process.env.PORT || 1814;
// // Connect to MongoDB
// connectDB();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/v2/Quizdb", SignInRoutes);




// // Start server
// app.listen(port, () => {
//   console.log(chalk.magenta(`Server running at http://localhost:${port}`));
 
// });
import express from 'express';
import chalk from 'chalk';
import connectDB from './db/config.js';
import cors from 'cors';
import SignInRoutes from './routes/SignInRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';

const app = express();
const port = process.env.PORT || 1814;

// Debug environment variables
console.log('MONGO_URL:', process.env.MONGO_URL);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v2/Quizdb', SignInRoutes);
app.use('/api/v2/Quizdb', UserRoutes);
// Routes
app.use('/api/v2/Quizdb/users/score',scoreRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(chalk.magenta(`Server running at http://localhost:${port}`));
    });
  } catch (err) {
    console.error(chalk.red('Failed to start server:', err));
  }
};

startServer();