import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { YSocketIO } from "y-socket.io/dist/server"

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.static("public"))

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"]
    }
})

const ySocketIO = new YSocketIO(io)
ySocketIO.initialize()

app.get("/", (req, res) => {
    res
        .status(200)
        .json({
            message: "hello from server",
            success: true
        })
})

app.get("/health", (req, res) => {
    res
        .status(200)
        .json({
            message: "Server health is ok",
            success: true
        })
})

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})