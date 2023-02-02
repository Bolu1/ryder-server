import { Server } from "socket.io";

// let users = [];

// const adduser = (userId, socketId) => {
//   !users.some((user) => user.userId == userId) &&
//     users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId != socketId);
// };

// const getUser = (userId) => {
//   return users.find((user) => user.userId == userId);
// };

const app = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  //   console.log('Socketio initialised!');

  //   // messages
  //   io.of("/messages").on("connection", (socket) => {
  //     console.log("a user connected");
  //     io.emit("welcome", "hello the is is socket");
  //     socket.on("addUser", (userId) => {
  //       console.log(userId, socket.id)
  //       adduser(userId, socket.id);
  //       console.log("a ",users)
  //       io.emit("getUsers", users);
  //     });

  //     socket.on("sendMessage", ({ senderId, receiverId, text }) => {
  //       try{
  //       const user = getUser(receiverId);
  //       console.log("b ", user)
  //       console.log(users)
  //       io.to(user.socketId).emit("getMessage", {
  //         senderId,
  //         text,
  //       });
  //     }catch(error){
  //       console.log("not online")
  //     }
  //     });

  //     socket.on("disconnect", () => {
  //       console.log("a user disconnected!");
  //       removeUser(socket.id);
  //     });
  //   });

  let users = [];
  let drivers = [];

  const adduser = (userId, socketId) => {
    !users.some((user) => user.userId == userId) &&
      users.push({ userId, socketId });
  };

  const addDriver = (driverId, driverLatitude, driverLongitude, socketId) => {
    !drivers.some((driver) => driver.driverId == driverId) &&
      drivers.push({ driverId, driverLatitude, driverLongitude, socketId });
  };

  const updateDriverLocation = (driverId, driverLatitude, driverLongitude) => {
    console.log("old", drivers)

    drivers.some((driver) => {
      if (driver.driverId == driverId) {
        driver.driverLatitude = driverLatitude;
        driver.driverLongitude = driverLongitude;
      }
    });
    console.log("new", drivers)
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId != socketId);
  };

  const removeDriver = (socketId) => {
    drivers = drivers.filter((driver) => driver.socketId != socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId == userId);
  };

  io.of("/trips").on("connection", (socket) => {
    console.log("a user connected");
    io.emit("welcome", "hello the is is socket");
    socket.on("addUser", (userId) => {
      console.log(userId, socket.id);
      adduser(userId, socket.id);
      console.log("a ", users);
      io.emit("getUsers", users);
    });

    socket.on("addDriver", ({ driverId, driverLatitude, driverLongitude }) => {
      console.log(driverId, driverLatitude, driverLongitude, socket.id);
      addDriver(driverId, driverLatitude, driverLongitude, socket.id);
      console.log("a ",drivers);
      // io.emit("gedrivers",drivers);
    });

    socket.on(
      "updateDriverLocation",
      ({ driverId, driverLatitude, driverLongitude }) => {
        console.log("old", driverId, driverLatitude, driverLongitude, socket.id);
        updateDriverLocation(driverId, driverLatitude, driverLongitude);
        // io.emit("gedrivers",drivers);
      }
    );

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      try {
        const user = getUser(receiverId);
        console.log("b ", user);
        console.log(users);
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      } catch (error) {
        console.log("not online");
      }
    });

    socket.on("disconnectUser", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
    });

    socket.on("disconnectDriver", () => {
      console.log("a driver disconnected!");
      removeDriver(socket.id);
    });
  });

  return io;
};

export default app;
