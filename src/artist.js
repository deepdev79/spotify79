import { artists } from "./spotifyData";
let result = 10;
const artistData = document.querySelector(".artist-data");
const buttons = document.querySelectorAll(".artist-button");

function artistDisplay() {
  let time;
  let tableR, cell, cellText;
  for (let i = result - 10; i < result; i++) {
    if (i >= artists.length) return;
    tableR = document.createElement("tr");
    for (let j = 0; j < 4; j++) {
      cell = document.createElement("td");
      cellText;
      if (j === 0) {
        cellText = document.createTextNode(
          `${i + 1}.${artists[i].get("name")}`
        );
      } else if (j === 1) {
        cellText = document.createTextNode(`${artists[i].get("timesPlayed")}`);
      } else if (j === 2) {
        time = (artists[i].get("mins") / 60000).toFixed(2);
        cellText = document.createTextNode(`${time}`);
      } else cellText = document.createTextNode(`${(time / 60).toFixed(2)}`);
      cell.appendChild(cellText);
      tableR.appendChild(cell);
    }
    artistData.appendChild(tableR);
  }
}

//-------------Function to clear table-----------------//

function clearArtistTable() {
  while (artistData.childNodes.length) {
    artistData.removeChild(artistData.childNodes[0]);
  }
}

//------------------SEEK TABLE(Next and previous buttons)------------------//

function seek() {
  buttons.forEach((btn) =>
    btn.addEventListener("click", function (e) {
      let choice;
      choice = e.target.innerText;
      if (choice === "Next") {
        if (artists.length - (result + 10) <= -10) return;
        result = result + 10;
        clearArtistTable();
        artistDisplay();
      } else {
        if (result === 10) return;
        clearArtistTable();
        result = result - 10;
        artistDisplay();
      }
    })
  );
}

seek();

//------------SORT---------------//

const sortButton = document.querySelector(".sort-artist");

sortButton.addEventListener("click", sortByMinutes);

function sortByMinutes(e) {
  if (e.target.innerText === "Sort by Minutes") {
    sortButton.textContent = "Sort by Times Listened";
    artists.sort((a, b) => b.get("mins") - a.get("mins"));
    clearArtistTable();
    result = 10;
    artistDisplay();
  } else {
    sortButton.textContent = "Sort by Minutes";
    artists.sort((a, b) => b.get("timesPlayed") - a.get("timesPlayed"));
    clearArtistTable();
    result = 10;
    artistDisplay();
  }
}

export { artistDisplay, clearArtistTable };
