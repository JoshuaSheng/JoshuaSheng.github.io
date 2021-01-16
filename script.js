let canvas = document.querySelector(".home-bg")
let ctx = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')

let font_size = 10;
let num_columns = canvas.width/font_size

let letter_height = Array(Math.floor(num_columns)).fill(0)

function fall() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < num_columns; i++) {
    char = letters[Math.floor(Math.random()*letters.length)]
    ctx.fillStyle = "#0f0"
    ctx.fillText(char, i*font_size, letter_height[i]*font_size)
    letter_height[i] += 1;

    if (letter_height[i]*font_size > canvas.height && Math.random() > 0.95) {
      letter_height[i] = 0;
    }
  }
}

setInterval(fall, 33)

setTimeout(() => {
  let homepage = document.querySelector(".homepage-content")
  homepage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
}, window.innerHeight*33/font_size)

flipcard_dom = document.querySelectorAll(".flipcard-front, .flipcard-back")

for (i = 0; i < flipcard_dom.length; i++) {
  flipcard_dom[i].addEventListener("click", (e) => {
    inner = e.target
    while (!inner.classList.contains("flipcard-inner")) {
      inner = inner.parentElement
    }
    inner.classList.toggle("flip")
  })
}
