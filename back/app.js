import fileUpload from 'express-fileupload';
import router from './src/router/index.js';
import express from 'express';
//import cors from 'cors';
import "./options.js"
import dotenv from 'dotenv';
dotenv.config();

const app = express()

/* const corsOptions = {
  origin: process.env.ROOT_CLIENT, //YOU ROOT APP REACT/REACT NATIVE
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  /* optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Headers", "url"], 
}; */

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://picture-flow-front-production.up.railway.app");
  
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    next();
  });



app.use(express.json());
//app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

app.use('/api', router)

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './upload'
}))





const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
server.on("error", err => console.log(err));