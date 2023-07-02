import express from 'express';
import {
  newUserHandler,
  //validateEmailHandler,
  //loginHandler,
  //createTokenHandler,
} from './contollers/userControlers.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('', (req, res) => {
  res.status(200).json({ status: 'User API is up and running' });
});

// User routes
app.get('', (req, res)=>{res.status(200).json({status:'Users API is up and running'})})
app.post('/api/users/new', newUserHandler);
//app.post('/api/users/validate-email', validateEmailHandler);
//app.post('/api/users/login', loginHandler);
//app.post('/api/users/token', createTokenHandler);

app.listen(port, () => {
  console.log(`👉 Server listening on port http://localhost:${port}`);
});