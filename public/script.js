const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
myVideo.muted = true;
const peers = {}

backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});


userName = user ? user : prompt('Enter your username');
// var user = prompt("Enter your name:");
// if (user) {
//   console.log("name is typed");
// } else {
//   var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = randomChars.length;
//   user = "user ";
//   for ( var i = 0; i < 5; i++ ) {
//       user += randomChars.charAt(Math.floor(Math.random() * charactersLength));
//   }
// }

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});


let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

// toggling mute button event

muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

// toggling video show event
stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

// to send invite to someone button
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

//
loadAllEmoji();
function loadAllEmoji() {
  var emoji = "";
  for (var i = 128512; i <= 128567; i++) {
    emoji += `<a href="#" onclick="getEmoji(this)">&#${i};</a>`;
  }
  for (var i = 128577; i <= 128580; i++) {
    emoji += `<a href="#" onclick="getEmoji(this)">&#${i};</a>`;
  }
  document.getElementById("emoji").innerHTML = emoji;
}
function showEmojiPanel() {
  document.getElementById('emoji').removeAttribute("style");
}

function hideEmojiPanel() {
  document.getElementById('emoji').setAttribute("style", "display:none;");
}

function getEmoji(control) {
  document.getElementById("chat_message").value += control.innerHTML;
}

// function so that messages will automatically scroll to up
function scrollToBottom() {
  let scrollMessage = document.querySelector(".messages").lastElementChild;
  scrollMessage.scrollIntoView();
}

// event called when someone sends new messages

socket.on("createMessage", (message, userName) => {
  let time = new Date();
  let formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
  if(userName === user) {
    messages.innerHTML =
      messages.innerHTML +
      `<div class="message">
          <span style="margin-left: auto;">${message}<p>${formattedTime}</p></span>
      </div>`;
  } else {
    messages.innerHTML =
      messages.innerHTML +
      `<div class="message">
          <b>
          <i class="far fa-user-circle"></i>
          <span> ${userName}</span>
          </b>
          <span style="background-color: #9495A7;">${message} <p>${formattedTime}</p></span>
      </div>`;
  }
  scrollToBottom();
});

const end_call = document.getElementById('callEnd');
end_call.addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    location.replace('/');
  }
});
