console.log("client side script");
// const socket = io();

// socket.on("countUpdated", count => {
//   console.log("the count has been updated", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   console.log("clicked");
//   socket.emit("increment");
// });

const socket = io();

socket.on("message", msg => {
  console.log("msg is ", msg);
});

document.querySelector("#submit").addEventListener("submit", event => {
  event.preventDefault();
  let textContent = event.target.elements.message.value;
  // the last argument to socket.emit runs when the event is acknowledged
  socket.emit("sendMessage", textContent, error => {
    if (error) {
      console.log(error);
    } else {
      console.log("message delivered");
    }
  });
  event.target.elements.message.value = "";
});

document.querySelector("#sendLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition(position => {
    // emit sendLocation event
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", { latitude, longitude }, feedbackMsg => {
      console.log(feedbackMsg);
    });
  });
});
