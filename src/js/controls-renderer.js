const ipcRenderer = window._ipcRenderer;
const MenuItem = window._MenuItem;
const contextMenu = window._contextMenu;
const remote = window._remote;

let cameraDevice;
let videoMode = false;

const separator = new MenuItem({
  type: "separator",
});

const addFrameMenu = () => {
  const rounder = new MenuItem({
    label: "Rounder frame",
    accelerator: "R",
    click: makeRounder,
  });
  const squarer = new MenuItem({
    label: "Squarer frame",
    accelerator: "S",
    click: makeSquarer,
  });
  const zoomIn = new MenuItem({
    label: "Larger frame",
    accelerator: "F",
    click: largerFrame,
  });
  const zoomOut = new MenuItem({
    label: "Smaller frame",
    accelerator: "Shift+F",
    click: smallerFrame,
  });
  contextMenu.append(separator);
  contextMenu.append(rounder);
  contextMenu.append(squarer);
  contextMenu.append(zoomIn);
  contextMenu.append(zoomOut);
};

const addVideoMenu = () => {
  const zoomIn = new MenuItem({
    label: "Zoom in video",
    accelerator: "Plus",
    click: zoomInVideo,
  });
  const zoomOut = new MenuItem({
    label: "Zoom out video",
    accelerator: "-",
    click: zoomOutVideo,
  });
  contextMenu.append(separator);
  contextMenu.append(zoomIn);
  contextMenu.append(zoomOut);
};

const makeRounder = () => {
  let radius = coverTransform.radius;
  radius = radius + 5;
  if (radius >= 50) {
    radius = 50;
  }
  coverTransform.radius = radius;
  transformElement(cover, coverTransform);
};

const makeSquarer = () => {
  let radius = coverTransform.radius;
  radius = radius - 5;
  if (radius < 0) {
    radius = 0;
  }
  coverTransform.radius = radius;
  transformElement(cover, coverTransform);
};

document.body.onkeyup = function (e) {
  if (e.key == " ") {
    generate();
  }

  if (e.key == "r") {
    makeRounder();
  }
  if (e.key == "s") {
    makeSquarer();
  }
  if (e.key == "+") {
    zoomInVideo();
  }
  if (e.key == "-") {
    zoomOutVideo();
  }
  if (e.key == "f") {
    smallerFrame();
  }
  if (e.key == "F") {
    largerFrame();
  }
};

const videoElement = document.querySelector("video");
const coverElement = document.querySelector("#cover");
const videoSelect = document.querySelector("select#video-source");

let videoTransform = {
  x: 0,
  y: 0,
  scale: 1,
};

let coverTransform = {
  x: 0,
  y: 0,
  scale: 1,
  radius: 50,
};

const centerCover = () => {
  console.log(coverTransform);
  const left = window.innerWidth / 2 - 100;
  const top = window.innerHeight / 2 - 100;
  coverTransform.x = left;
  coverTransform.y = top;
  console.log(coverTransform);
  transformElement(coverElement, coverTransform);
};

const gotDevices = (deviceInfos) => {
  let videoDevices = {};
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement("option");
    if (deviceInfo.kind === "videoinput") {
      const text = deviceInfo.label || "camera " + (videoSelect.length + 1);
      videoDevices[text] = deviceInfo.deviceId;
    } else {
      console.log("Found another kind of device: ", deviceInfo);
    }
  }
  for (const [label, deviceId] of Object.entries(videoDevices)) {
    const menuItem = new MenuItem({
      label: label,
      click: () => {
        cameraDevice = deviceId;
        getStream(deviceId);
      },
    });
    contextMenu.append(menuItem);
  }
  addFrameMenu();
  addVideoMenu();
  window.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
      contextMenu.popup(remote.getCurrentWindow());
    },
    false
  );
};

const generate = () => {
  let rect = coverElement.getBoundingClientRect();
  let coverOffset = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
    top: rect.top,
    left: rect.left,
  };
  rect = videoElement.getBoundingClientRect();
  let videoOffset = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
    top: rect.top,
    left: rect.left,
  };
  ipcRenderer.send("video-arguments", {
    width: coverOffset.width,
    height: coverOffset.height,
    videoWidth: videoOffset.width,
    videoHeight: videoOffset.height,
    coverOffset: coverOffset,
    videoOffset: videoOffset,
    coverTransform: coverTransform,
    videoTransform: videoTransform,
    mediaDevice: cameraDevice,
  });
};

const init = () => {
  const menuItem = new MenuItem({
    label: "Cut",
    click: () => {
      generate();
    },
    accelerator: "Space",
  });
  contextMenu.append(menuItem);
  contextMenu.append(separator);
  centerCover();

  navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  navigator.mediaDevices.enumerateDevices().then(gotDevices).then(getStream());
};

init();
