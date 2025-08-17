import express from "express"
import dotenv from "dotenv"
import routes from './routes/index.js'
import { corsMiddleware } from "./middleware/cors.js";
dotenv.config()

const app = express()
const PORT = process.env.PORT|| 3000 ;

//MIDDLEWARE

app.use(express.json());
app.use(corsMiddleware); 
//ROUTES
app.use("/api",routes);


app.listen(PORT,()=>{
    console.log(`🛫 Server is running on http://localhost:${PORT}`);
})