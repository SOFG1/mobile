let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;

socket.on("offer", handleOffer);
socket.on("answer", handleAnswer);
socket.on("ice-candidate", handleIceCandidate);

function handleOffer(offer) {
  remoteConnection = new RTCPeerConnection();
  remoteConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate);
    }
  };

  remoteConnection
    ?.setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => {
      return remoteConnection.createAnswer();
    })
    .then((answer) => {
      remoteConnection.setLocalDescription(answer);
      socket.emit("answer", answer);
    })
    .catch((error) => console.error("Error handling offer: ", error));

  remoteConnection.ondatachannel = (event) => {
    receiveChannel = event.channel;
    receiveChannel.onmessage = (event) => {
      const message = event.data;
      if (message === "start") window.start();
      if (message === "stop") window.stop();

      console.log(message);
    };
  };
}

function handleAnswer(answer) {
  localConnection
    ?.setRemoteDescription(new RTCSessionDescription(answer))
    .catch((error) => console.error("Error handling answer: ", error));
}

function handleIceCandidate(candidate) {
  const iceCandidate = new RTCIceCandidate(candidate);
  if (localConnection) {
    localConnection
      .addIceCandidate(iceCandidate)
      .catch((error) => console.error("Error adding ICE candidate: ", error));
  } else {
    remoteConnection
      .addIceCandidate(iceCandidate)
      .catch((error) => console.error("Error adding ICE candidate: ", error));
  }
}
