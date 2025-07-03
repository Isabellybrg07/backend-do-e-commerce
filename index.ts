import express, { json } from "express";
import cors from "cors"
import { PrismaClient } from './generated/prisma'
import argon2 from 'argon2'

const prisma = new PrismaClient()

const app = express();

app.use(cors())
app.use(json())

const port = 3000;

app.get("/", (req, res) => {
res.send("hello world")
});

app.post("/auth/user", async(req,res) => {
const {body} =req
if (!body.email ||  !body.password) {
    res.status(400).send({
        message: "resquisição invalida"
    })
    return;
}

body.password = await argon2.hash(body.password)

const createdUser = await prisma.user.create (body);
res.send(createdUser)
})

app.listen(port, () => {
    console.log("app iniciado na porta:" + port);

})
