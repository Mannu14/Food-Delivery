require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require("./db/conn")
const server = http.createServer(app);
const path = require("path");
const { setupSocketIoListeners } = require('../Controller/userController');

const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_API_URL}`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const { initIo } = require('../Controller/socket');
initIo(io);
app.set('socketio', io);
setupSocketIoListeners(io);

const userRoutes = require('../Route/userRoute')

app.use('/', userRoutes);

app.use(express.static(path.join(__dirname, "../../client/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../../client","dist","index.html"))
})

const port = process.env.PORT || 4000
server.listen(port, console.log(`server is runnong at PORT NO. ${port}`));