import { tracks } from "./spotifyData";
let result = 10;
const trackData = document.querySelector(".track-data");
const buttons = document.querySelectorAll(".track-button");
function tracksDisplay() {
  let time;
  let tableR, cell, cellText;
  for (let i = result - 10; i < result; i++) {
    if (i >= tracks.length) return;
    tableR = document.createElement("tr");
    for (let j = 0; j < 4; j++) {
      cell = document.createElement("td");
      cellText;
      if (j === 0) {
        cellText = document.createTextNode(`${i + 1}.${tracks[i].get("name")}`);
      } else if (j === 1)
        cellText = document.createTextNode(`${tracks[i].get("aname")}`);
      else if (j === 2)
        cellText = document.createTextNode(`${tracks[i].get("timesPlayed")}`);
      else {
        time = (tracks[i].get("mins") / 60000 / 60).toFixed(2);
        cellText = document.createTextNode(`${time}`);
      }
      cell.appendChild(cellText);
      tableR.appendChild(cell);
    }
    trackData.appendChild(tableR);
  }
}

//-------------Function to clear table-----------------//

function clearTrackTable() {
  while (trackData.childNodes.length) {
    trackData.removeChild(trackData.childNodes[0]);
  }
}

//------------------SEEK TABLE(Next and previous buttons)------------------//

function seek() {
  buttons.forEach((btn) =>
    btn.addEventListener("click", function (e) {
      let choice;
      choice = e.target.innerText;
      if (choice === "Next") {
        if (tracks.length - (result + 10) <= -10) return;
        result = result + 10;
        clearTrackTable();
        tracksDisplay();
      } else {
        if (result === 10) return;
        clearTrackTable();
        result = result - 10;
        tracksDisplay();
      }
    })
  );
}
seek();

//------------SORT---------------//

const sortButton = document.querySelector(".sort-track");

sortButton.addEventListener("click", sortByMinutes);

function sortByMinutes(e) {
  if (e.target.innerText === "Sort by Minutes") {
    sortButton.textContent = "Sort by Times Listened";
    tracks.sort((a, b) => b.get("mins") - a.get("mins"));
    clearTrackTable();
    result = 10;
    tracksDisplay();
  } else {
    sortButton.textContent = "Sort by Minutes";
    tracks.sort((a, b) => b.get("timesPlayed") - a.get("timesPlayed"));
    clearTrackTable();
    result = 10;
    tracksDisplay();
  }
}

export { tracksDisplay, clearTrackTable };
