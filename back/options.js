import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.URL_MONGO; /* mongodb://localhost:27017/pictureflow*/
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then (() => {
    console.log("Conexión a la base de datos exitosa");
});