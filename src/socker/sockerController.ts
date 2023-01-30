import { Server } from 'socket.io';

let users = [];

const adduser = (userId, socketId) => {
  !users.some((user) => user.userId == userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId != socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId == userId);
};

const app = server => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  console.log('Socketio initialised!');

  io.on("connection", (socket) => {
    console.log("a user connected");
    io.emit("welcome", "hello th is is socket");
    socket.on("addUser", (userId) => {
      console.log(userId, socket.id)
      adduser(userId, socket.id);
      console.log("a ",users)
      io.emit("getUsers", users);
    });
  
    socket.on("greet", (text) => {
      try{
      console.log(text)
      io.to(socket.id).emit("getGreet", {
        text
      });
    }catch(error){
      console.log("not online")
    }
    });

    // socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    //   try{
    //   const user = getUser(receiverId);
    //   console.log("b ", user)
    //   console.log(users)
    //   io.to(user.socketId).emit("getMessage", {
    //     senderId,
    //     text,
    //   });
    // }catch(error){
    //   console.log("not online")
    // }
    // });
  
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
    });
  });
  
  return io;
};


export default app;