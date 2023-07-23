const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users=[];
let rooms =[];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinServer',({username})=>{
    const user = {
      username:username,
      id:socket.id,
    }
    users.push(user);
    socket.emit('usersJoined',{users})
    }
  )

  // Join room
  socket.on('joinRoom', ({ username, roomName }) => {
    socket.join(roomName);

    // Create room if it doesn't exist
    if (!rooms[roomName]) {
      rooms[roomName] = {
        participants: [],
        messages: [],
        unreadMessages: 0,
      };
    }

    console.log("rooms after join",rooms)

    const room = rooms[roomName];
    room.participants.push(username);
    room.messages=[];

    // Send joined rooms to user
    const joinedRooms = Object.keys(rooms).map((roomName) => ({
      name: roomName,
      participants: rooms[roomName].participants.length,
      unreadMessages: rooms[roomName].unreadMessages,
      messages:rooms[roomName].messages,
    }));
    socket.emit('joinedRooms', joinedRooms);

    // Send room information to user
    socket.emit('roomInfo', {
      participants: room.participants,
      messages: room.messages,
    });

    // Broadcast participant joined event to room
    socket.broadcast.to(roomName).emit('participantJoined', {
      participant: username,
      participants: room.participants,
    });
  });

  // Leave room
  socket.on('leaveRoom', ({ username, roomName }) => {
    socket.leave(roomName);

    if (rooms[roomName]) {
      const room = rooms[roomName];
      room.participants = room.participants.filter(
        (participant) => participant !== username
      );
      if (room.participants.length === 0) {
        delete rooms[roomName];
      }
    }
  });

  // Send message
  socket.on('sendMessage', ({ roomName, username, message, time }) => {

    const room = rooms[roomName];
    // room.participants.push(username);
    // room.messages={...room.messages, username:username, message:message, time:time}
    room.messages.push({ username, message, time });
    
    // room.unreadMessages++;

    console.log(roomName, " ... ",room);

    //Broadcast new message to room
    socket.broadcast.to(roomName).emit('newMessage', {
      username,
      message,
      time,
      unreadMessages: room.unreadMessages,
    });

  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = 3001;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
