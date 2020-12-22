let gMouseDownX = 0;
let gMouseDownY = 0;
let gMouseDownOffsetX = 0;
let gMouseDownOffsetY = 0;

const addListeners = () => {
  coverElement.addEventListener(
    "mousedown",
    (e) => {
      if (e.button !== 0) return;
      mouseDown(coverTransform, e);
      window.addEventListener("mousemove", coverMove, true);
    },
    false
  );
  videoElement.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    mouseDown(videoTransform, e);
    window.addEventListener("mousemove", videoMove, true);
  });
  window.addEventListener("mouseup", mouseUp, false);

  videoElement.addEventListener("wheel", function (e) {
    videoScale(e);
    e.preventDefault();
  });
  
  coverElement.addEventListener("wheel", function (e) {
    coverScale(e);
    e.preventDefault();
  });
}

const mouseUp = (e) => {
  if (e.button !== 0) return;
  window.removeEventListener("mousemove", coverMove, true);
  window.removeEventListener("mousemove", videoMove, true);
}

const mouseDown = (transform, e) => {
  if (e.button !== 0) return;
  gMouseDownX = e.clientX;
  gMouseDownY = e.clientY;
  gMouseDownOffsetX = gMouseDownX - transform.x;
  gMouseDownOffsetY = gMouseDownY - transform.y;
}

const videoMove = (e) => {
  let topAmount = e.clientY - gMouseDownOffsetY;
  let leftAmount = e.clientX - gMouseDownOffsetX;
  videoTransform.x = leftAmount;
  videoTransform.y = topAmount;
  transformElement(videoElement, videoTransform);
}

const zoomInVideo = () => {
  if (videoTransform.scale > 8) return;
  videoTransform.scale *= 1.03;
  transformElement(videoElement, videoTransform);
}

const zoomOutVideo = () => {
  if (videoTransform.scale < 0.1) return;
  videoTransform.scale /= 1.03;
  transformElement(videoElement, videoTransform);
}

const videoScale = (e) =>  {
  if (videoMode) {
    if (e.deltaY > 0) {
      zoomInVideo();
    } else if (e.deltaY < 0) {
      zoomOutVideo();
    }
  }
}

const coverMove = (e) => {
  let top = e.clientY - gMouseDownOffsetY;
  let left = e.clientX - gMouseDownOffsetX;
  coverTransform.x = left;
  coverTransform.y = top;
  transformElement(coverElement, coverTransform);
}

addListeners();

const largerFrame = () => {
  if (coverTransform.scale > 8) {
    return;
  }
  coverTransform.scale *= 1.03;
  transformElement(coverElement, coverTransform);
  coverElement.style.border = 2 / coverTransform.scale + "px dashed blue";
};

const smallerFrame = () => {
  if (coverTransform.scale < 0.1) {
    return;
  }
  coverTransform.scale /= 1.03;
  transformElement(coverElement, coverTransform);
  coverElement.style.border = 2 / coverTransform.scale + "px dashed blue";
};

const coverScale = (e) => {
  if (e.deltaY > 0) {
    largerFrame();
  } else if (e.deltaY < 0) {
    smallerFrame();
  }
}
