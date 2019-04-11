const express = require('express');
const server = express();
const helmet = require('helmet');


server.use(helmet());
server.use(express.json());




const PORT = process.env.PORT || '5000';
server.listen(PORT, () => {console.log(`Listening on port ${PORT}....`)});