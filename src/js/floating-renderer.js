const bodyElement = document.querySelector("body");
const videoElement = document.querySelector("video");
const coverElement = document.querySelector("#cover");
const videoSelect = document.querySelector("select#video-source");

const ipcRenderer = window._ipcRenderer;

let mediaDevice;

ipcRenderer.on("video-arguments", (event, arg) => {
  console.log(arg);
  const mf = Math.ceil
  // Turns out if you leave the values as coming from the other browser, for some combination 
  // of zoom of the frame and the video, the background won't be transparent on MacOS. Converting to intgers fixes it 
  // You gotta love… Javascript? Macs?
  videoElement.style.width = mf(arg.videoWidth) + "px";
  videoElement.style.height = mf(arg.videoHeight) + "px";
  coverElement.style.width = mf(arg.coverOffset.width) + "px";
  coverElement.style.height = mf(arg.coverOffset.height) + "px";
  const radius = mf(arg.coverTransform.radius)
  coverElement.style["border-radius"] = radius + "%";
  videoElement.style.width = mf(arg.videoOffset.width) + "px";
  videoElement.style.height = mf(arg.videoOffset.height) + "px";
  let x = - mf(arg.coverOffset.x) + mf(arg.videoOffset.x);
  let y = - mf(arg.coverOffset.y) + mf(arg.videoOffset.y);
  videoElement.style.transform = transformElement(videoElement, {x: x, y: y, scale: 1});
  mediaDevice = arg.mediaDevice;
  navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  navigator.mediaDevices
    .enumerateDevices()
    .then(getStream(mediaDevice))
    .catch(handleError);
});