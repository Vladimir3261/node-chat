/**
 * Created by vladimir on 1/27/17.
 */
// Check user browser
$(document).ready(function () {
    if(window.localStorage.getItem('username')){
        $("#username").val(window.localStorage.getItem('username'));
        connect();
    }
});
// Public or private message
let receiverForPrivate = false;
let audio = new Audio(); // create new Audio object
audio.src = 'https://psv4.vk.me/c422330/u121723041/audios/2c3c674f3725.mp3'; // Receive message sound
audio.autoplay = false; // Disable autoplay
// Play audio just on call this function
function playAudio() {
    audio.play();
    setTimeout(function () {
        audio.pause();
        audio.currentTime=0;
    }, 1000);
}

let username;
let socket;
function connect() {
    let id = $("#username").val();
    socket = io.connect('http://127.0.0.1:8000/');
    username=id;
    window.localStorage.setItem('username', username);
    $("#user-panel").html("Welcome, <strong>"+id+"</strong>");
    socket.on('connect', function () {
        socket.emit('uid', id);
        $("#login").hide();
        $("#chat").show();
    });

    socket.on('msg', function (msg) {
        if(msg.username === username)
        {
            renderYouMessage(msg);
        }
        else
        {
            renderTheirMessages(msg);
            playAudio();
        }

    });
    socket.on('list', function (list) {
        $.each(list, function (k, msg) {
            if(msg.username === username)
                renderYouMessage(msg);
            else
                renderTheirMessages(msg);
        })
    });

    socket.on('userList', function (users) {
        console.log(users   );
        renderUsers(users);
    })
}

function pressEnter(e) {
    if(e.keyCode == 13)
        sendMessage();
}

function sendMessage() {
    socket.emit("message", {msg:$("#user-msg-input").val()});
    $("#user-msg-input").val('');
}

function private(socketID) {
    $("#myModal").modal('show');
    receiverForPrivate = socketID;
}

function renderYouMessage(msg) {
    let time = new Date();
    $("#chat-content").append('<li class="mar-btm"><div class="media-left">'+
        '<img src="http://bootdey.com/img/Content/avatar/avatar1.png" class="img-circle img-sm" alt="Profile Picture">'+
        '</div>'+
        '<div class="media-body pad-hor">'+
        '<div class="speech">'+
        '<a href="#" class="media-heading">'+msg.username+'</a>' +
        '<p>'+msg.message+'</p>' +
        '<p class="speech-time">' +
        '<i class="fa fa-clock-o fa-fw"></i>'+time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()+'</p></div></div>' +
        '</li>');
}
function renderTheirMessages(msg) {
    let time = new Date();
    $("#chat-content").append('<li class="mar-btm">'+
        '<div class="media-right">'+
        '<img src="http://bootdey.com/img/Content/avatar/avatar2.png" class="img-circle img-sm" alt="Profile Picture">'+
        '</div>'+
        '<div class="media-body pad-hor speech-right">'+
        '<div class="speech">'+
        '<a href="#" class="media-heading">'+msg.username+'</a>' +
        '<p>'+msg.message+'</p>' +
        '<p class="speech-time">' +
        '<i class="fa fa-clock-o fa-fw"></i>'+time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()+'</p> </div> </div> </li>');
}

function renderUsers(users) {
    let htm = '';
    $.each(users, function (k, username) {
        htm+='<li style="cursor: pointer" onclick="private(\''+k+'\')" class="list-group-item">'+username+'</li>';
    });
    $("#usersList").html(htm);
}