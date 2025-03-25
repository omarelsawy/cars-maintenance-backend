const io = require("socket.io")(
    3001 , {
      cors: {
          origin: "*"
      }
  }
  );


io.on('connection', (socket) => {
    console.log('a user connected');
});

module.exports = io;