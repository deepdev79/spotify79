const options = document.querySelectorAll("a");
let choice;
let choices = ["Home", "Album", "Track", "Other", "Artist"];

function display(opt) {
  choice = document.getElementById(`${opt}`);
  choice.classList.remove("hidden");
  choices.forEach((tempch) => {
    if (tempch != opt) {
      document.getElementById(`${tempch}`).classList.add("hidden");
    }
  });
}

function active() {
  options.forEach((opt) => {
    opt.addEventListener("click", function (e) {
      display(e.target.innerText);
    });
  });
}
export { active };
