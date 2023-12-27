import fileUpload from 'express-fileupload';
import router from './src/router/index.js';
import express from 'express';
import cors from 'cors';
import "./options.js"
import dotenv from 'dotenv';
dotenv.config();


const corsOptions = {
  origin: 'https://picture-flow-front-production.up.railway.app/', //YOU ROOT APP REACT/REACT NATIVE
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Headers"],
};

const app = express()

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './upload'
}))


/* if (isProduction) {
  app.use(express.static(CLIENT_PATH))
} */

app.use('/api', router)

/* if (isProduction) {
  app.get('*', (_req, res) => {
    res.sendFile(CLIENT_PATH + '/index.html')
  })
} */

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
server.on("error", err => console.log(err));