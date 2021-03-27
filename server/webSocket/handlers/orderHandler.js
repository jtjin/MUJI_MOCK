"use strict";
const orderHandler = (io, socket) => {
    socket.on('newOrderCreated', (data) => {
        io.emit('freshDashBoard');
    });
};
module.exports = orderHandler;
