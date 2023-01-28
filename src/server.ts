const io = require("socket.io")(5000, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
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
  
  io.on("connection", (socket) => {
    console.log("a user connected");
    io.emit("welcome", "hello th is is socket");
    socket.on("addUser", (userId) => {
      console.log(userId, socket.id)
      adduser(userId, socket.id);
      console.log("a ",users)
      io.emit("getUsers", users);
    });
  
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      console.log("b ", user)
      console.log(users)
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
    });
  });
  

