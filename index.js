const express = require('express');
const cors = require('cors');
require('dotenv').config();

//creating the server
const app = express();

//use cors
app.use(cors());

//enable body parser
app.use(express.json());

//start the server
app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});