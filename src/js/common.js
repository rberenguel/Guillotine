const transformElement = (element, transform) => {
  console.log(transform)
  element.style.transform = `translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`
  if("radius" in transform){
    element.style["border-radius"] = transform.radius + "%";
  }
}

const gotStream = (stream) => {
    window.stream = stream;
    videoElement.srcObject = stream;
    videoMode = true;
  }

  const getStream = (device) => {
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  
    let video = {
        width: { ideal: 800},
        height: { ideal: 600},
        deviceId: device ? { exact: device } : undefined
      }
    const constraints = {
      audio: false,
      video: video
    };
  
    console.log("Requesting ", constraints)

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  }

  const handleError = (error) => {
    console.error("Error: ", error);
  }