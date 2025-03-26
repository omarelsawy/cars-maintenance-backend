let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: [
          'http://localhost:3000',
          'https://delicate-stroopwafel-954035.netlify.app'
        ],
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('a user connected');
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};