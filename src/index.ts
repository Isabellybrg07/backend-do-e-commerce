import express, { json } from "express";
import cors from "cors"
import 'dotenv/config'
import authRoutes from "./routes/authRoutes";



const port = process.env.PORT || 8000;
const app = express();

app.use(cors())
app.use(json())
app.use('/auth', authRoutes)


app.listen(port, () => {
    console.log("app iniciado na url http://localhost:" + port)
})
