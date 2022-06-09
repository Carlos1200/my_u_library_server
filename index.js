const express = require('express');
const cors = require('cors');
const users=require('./routes/users.routes');
require('dotenv').config();

//creating the server
const app = express();

//use cors
app.use(cors());

//enable body parser
app.use(express.json());

//importing routes
app.use('/api/users',users);

//start the server
app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});