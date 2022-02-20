// create socket server
const io = require('socket.io')(8000, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
  });

// define username
const users = {};

io.on('connection', socket => {

    // if new user joined the chat inform other users
    socket.on('new-user-joined', username => {
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    })

    // if someone send message to the server inform other users
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, username: users[socket.id] });
    })

    // if user is disconnected inform other users
    socket.on('disconnect', name => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    })
})

