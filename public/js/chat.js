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

// Elements
const $msgForm = document.querySelector("#submit");
const $msgFormInput = document.querySelector("input");
const $msgFormButton = document.querySelector("button");

const $locationButton = document.querySelector("#sendLocation");

socket.on("message", msg => {
  console.log("msg is ", msg);
});

$msgForm.addEventListener("submit", event => {
  event.preventDefault();

  // disable the form
  $msgFormButton.setAttribute("disabled", "disabled");
  let textContent = event.target.elements.message.value;

  // the last argument to socket.emit runs when the event is acknowledged
  socket.emit("sendMessage", textContent, error => {
    // enable the form
    $msgFormButton.removeAttribute("disabled");
    $msgFormInput.value = "";

    $msgFormInput.focus();

    if (error) {
      console.log(error);
    } else {
      console.log("message delivered");
    }
  });
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation is not supported by your browser");
  }

  locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    // emit sendLocation event
    locationButton.removeAttribute("disabled");
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", { latitude, longitude }, feedbackMsg => {
      console.log(feedbackMsg);
    });
  });
});
