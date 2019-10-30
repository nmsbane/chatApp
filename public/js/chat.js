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
  socket.emit("sendMessage", textContent);
  event.target.elements.message.value = "";
});
