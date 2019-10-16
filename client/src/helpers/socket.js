import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:5001/");

const getSocketId = (clients, name) => {
  let getSocketId;
  clients.map(({ userName, socketId }) => {
    return userName === name ? (getSocketId = socketId) : "";
  });
  return getSocketId;
};

export { socket, getSocketId };
