

// const { Socket } = require("node:dgram");
const socket = io();
const videoGrid = document.getElementById('video-grid')
// console.log(videoGrid)
const peer = new Peer()

let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    console.log("hello")
    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
    //   video.muted=true;
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })
  
    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
    })
})

peer.on('open', id => {
    // console.log(id)
    socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
    console.log(userId)
    const call = peer.call(userId, stream)
    // call.answer(stream)
    console.log('helllllllllll')
    const video = document.createElement('video')
    // video.muted=true
    call.on('stream', userVideoStream => {
        console.log('working')
        addVideoStream(video, userVideoStream)
    })
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    // console.log(video)
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}

let text=$('input')
// console.log(text)
$('html').keydown((e)=>{
  if(e.which==13 && text.val().length !==0){
    // console.log(text.val())
    socket.emit('message',text.val());
    text.val('')
  }
})

socket.on('createMessage',(message)=>{
  $('ul').append(`<li class="message"><b>user</b><br /> ${message}</li>`)
  scrollToBottom();

 })

 const scrollToBottom=()=>{
   var d=$('.main_chat_window');
   d.scrollTop(d.prop("scrollHeight"))
 }


//  mute button

const muteUnmute=()=>{

  // console.log(myVideoStream)
  const enabled=myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled=false;
    setUnmuteButton();
  }else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled=true
  }
}

const setMuteButton=()=>{
  const html=`
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector('.main_mute_button').innerHTML=html;
}

const setUnmuteButton=()=>{
  const html=`<i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `
  document.querySelector('.main_mute_button').innerHTML=html;
}

// For Stop video


const playStop=()=>{

  // console.log(myVideoStream)
  const enabled=myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled=false;
    setPlay();
  }else{
    setStop();
    myVideoStream.getVideoTracks()[0].enabled=true
  }
}
const setStop=()=>{
  const html=`
  <i class="fas fa-video"></i>
  <span>Stop</span>
  `
  document.querySelector('.main_video_button').innerHTML=html;
}

const setPlay=()=>{
  const html=`<i class="unmute fas fa-video-slash"></i>
  <span>Play</span>
  `
  document.querySelector('.main_video_button').innerHTML=html;
}