let io;
const initIo = (server) => {
  io = server;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initIo, getIo };
