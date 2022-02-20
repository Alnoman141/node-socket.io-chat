// init socket server
const socket = io('http://localhost:8080');

// make dom instance for the respective elements
const form = document.querySelector('#msg-form');
const input = document.querySelector('#msg');
const chatContainer = document.querySelector('.chat-container');

// create audo instance
let audio = new Audio('../tune.mp3');

// append server message to the dom
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('msg-box');
    messageElement.classList.add(position);
    messageElement.innerText = message;
    chatContainer.append(messageElement);
    if(position == 'left') {
        audio.play();
    }
}

// receive new user name and inform to the server
const username = prompt("Enter your username to join the chat");
socket.emit('new-user-joined', username);

// receive new user name and inform other users
socket.on('user-joined', username => {
    append(`${username} joined the chat`, 'left');
})

// receive message from server and append to the dom
socket.on('receive', data => {
    append(`${data.username}: ${data.message}`, 'left')
})

// if user is disconnected inform other users
socket.on('user-left', name => {
    append(`${name} left the chat`, 'left');
})

// send message to server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    input.value = '';
})
