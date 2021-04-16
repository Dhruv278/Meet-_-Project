const express=require('express');
const app=express();
const path=require('path');
const { v4 : uuidv4}=require('uuid');
const Port=process.env.PORT||3030;
const server=require('http').Server(app);
const io=require('socket.io')(server)
const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 3031, path: '/myapp' });
// app.use('/peerjs',peerServer)
app.use(express.static(path.join(__dirname,'public/')))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views/'));
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
    // console.log(req.params.room)
    res.status(200).render('room',{roomId:req.params.room})
})

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        // console.log(roomId)
        socket.broadcast.to(roomId).emit("user-connected",userId);
        socket.on('message',(message)=>{
            io.to(roomId).emit('createMessage',message)
        })
        // console.log('joined room');
    })

})
server.listen(Port,()=>{
    console.log(`Server is listening on port ${Port}`)
})