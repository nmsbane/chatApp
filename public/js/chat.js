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
const $msgFormInput = $msgForm.querySelector("input");
const $msgFormButton = $msgForm.querySelector("button");

const $locationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const autoScroll = () => {
  // new message element
  const $newMessage = $messages.lastElementChild;

  // height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // visible height
  const visibleHeight = $messages.offsetHeight;

  // height of messages container
  const contentHeight = $messages.scrollHeight;

  // how far have i scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (contentHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

// options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.on("locationMessage", locationMessageObj => {
  const locationHtml = Mustache.render(locationTemplate, {
    url: locationMessageObj.url,
    createdAt: moment(locationMessageObj.createdAt).format("h:mm A"),
    username: locationMessageObj.username
  });
  $messages.insertAdjacentHTML("beforeend", locationHtml);
  autoScroll();
});

socket.on("message", msg => {
  // msg is an object, with properties text and createdAt
  const html = Mustache.render(messageTemplate, {
    message: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm A"),
    username: msg.username
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
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

$locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation is not supported by your browser");
  }

  $locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    // emit sendLocation event
    $locationButton.removeAttribute("disabled");
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", { latitude, longitude }, feedbackMsg => {
      console.log(feedbackMsg);
    });
  });
});

socket.on("roomUsers", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
