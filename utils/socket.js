const io = require("socket.io")(
    3001 , {
      cors: {
          origin: ['http://localhost:3000', 'https://delicate-stroopwafel-954035.netlify.app']
      }
  }
  );


io.on('connection', (socket) => {
    console.log('a user connected');
});

module.exports = io;