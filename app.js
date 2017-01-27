/**
 * Created by vladimir on 1/27/17.
 */
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
// Static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


var users = {};
var messages = [];
io.on('connection', function(socket){
    socket.emit('list', messages);
    socket.on('uid', function (uid) {
        users[socket.id] = uid;
        io.emit('userList', users);
        console.log(uid+' Joined to chat');
    });
    socket.on('disconnect', function () {
        delete users[socket.id];
        io.emit('userList', users);
        console.log(users[socket.id]+' Disconnected from chat');
    });

    socket.on('message', function (msg) {
        console.log(msg);
        messages.push({username:users[socket.id], message: msg.msg});
        if(messages.length >= 10){
            messages.shift();
        }
        io.emit('msg', {username:users[socket.id], message: msg.msg});
    })
});

http.listen(8000, function(){
    console.log('listening on *:8000');
});