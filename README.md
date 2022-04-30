# Video-chat-v1

This is a video chat app that makes it easy to group up with people you want to meet.

![IMG](./video-chat.png)

Check out the live demo: https://video-chat-app12.herokuapp.com/

This app is build using NodeJS, Socket.io, and Peerjs(WebRTC) and auth0 for user authentication.


# HOW TO RUN THE PROJECT??

1. First Open a cmd promt or terminal in root folder of this repo and Install Node Modules and dependencies using this cmd.

> npm install

2. After all packages are installed , in a same cmd promt / terminal run this cmd.

> npm start

3. Thats it , now the programming is running on the localhost:3000.

> #THATS ALL , THANK YOU

### Features
- Is 100% free and open-source.
- Calling will ask for User authentication.
- Multi-participants.
- Toggling of video stream.
- Toggling of audio stream (mute & unmute).
- Messaging chat and video streaming in real-time.
- Everyting is peer-to-peer thanks to webrtc.

## Tech Stack 💻

- [Heroku (Hosting)](https://heroku.com/)
- [Web RTC](https://github.com/webrtc)
- [Socket.io](https://socket.io/)
- [Node.js](https://nodejs.org/en/)
- [auth0](https://auth0.com/docs/quickstart/webapp/express#2-configure-logout-url/)

## Application Logic and Implementations

To connect two users over WebRTC, we exchange information to allow browsers to talk to each other. This process is called signaling and it is facilitated by using NodeJS and socket server chained to the express 4.0 engine to provide the plumbing. Other than signaling, no data has to be sent through a server. When a connection is successfully established and authentication and authorization are complete, stream data exchanged between peers is directed to a ejs component for rendering.
