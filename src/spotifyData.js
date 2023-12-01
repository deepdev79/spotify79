import { albumDisplay, clearAlbumTable } from "./albums";
import { artistDisplay, clearArtistTable } from "./artist";
import { clearTrackTable, tracksDisplay } from "./tracks";
import { clearOtherData, other, other2 } from "./other";
import { clearMessage, home, noUpload } from "./home";
import { active } from "./script";

const loader = document.querySelector(".loader");

let data = [];
let albums = [];
let artists = [];
let tracks = [];
let platform, countries;
let tempPlatform = [];
let tempCountry = [];
let flag;
let hoursListened = 0;

let dayStart, dayEnd;

//------------------------LIFETIME CALCULATION--------------------------------//

//Data valid from

function dataValid(start, end) {
  dayStart = new Date(start).toUTCString();
  dayEnd = new Date(end).toUTCString();
}

//Different platform used to play songs
function platformInfo() {
  data.forEach((ele) => {
    hoursListened += ele.ms_played;
    tempPlatform.push(ele.platform);
    tempCountry.push(ele.conn_country);
  });
  platform = new Set(tempPlatform);
  countries = new Set(tempCountry);
}

//-------ARTISTS LISTENED TO--------//

function artistsInfo(record) {
  flag = 1;
  let unArtist = new Map();
  artists.forEach((ele) => {
    if (ele.get("name") === record.master_metadata_album_artist_name) {
      flag = 0;
      ele.set("mins", ele.get("mins") + record.ms_played);
      ele.set("timesPlayed", ele.get("timesPlayed") + 1);
    }
  });
  if (flag === 1) {
    unArtist.set("name", record.master_metadata_album_artist_name);
    unArtist.set("mins", record.ms_played);
    unArtist.set("timesPlayed", 1);
    artists.push(unArtist);
  }
}

//-------TRACKS--------//

function tracksInfo(record) {
  flag = 1;
  let unTrack = new Map();
  tracks.forEach((ele) => {
    if (ele.get("url") === record.spotify_track_uri) {
      flag = 0;
      ele.set("mins", ele.get("mins") + record.ms_played);
      ele.set("timesPlayed", ele.get("timesPlayed") + 1);
    }
  });
  if (flag === 1) {
    unTrack.set("name", record.master_metadata_track_name);
    unTrack.set("aname", record.master_metadata_album_artist_name);
    unTrack.set("mins", record.ms_played);
    unTrack.set("timesPlayed", 1);
    unTrack.set("url", record.spotify_track_uri);
    tracks.push(unTrack);
  }
}

//-------ALBUMS--------//

function albumInfo(record) {
  flag = 1;
  let unAlbum = new Map();
  albums.forEach((ele) => {
    if (ele.get("name") === record.master_metadata_album_album_name) {
      flag = 0;
      ele.set("mins", ele.get("mins") + record.ms_played);
      ele.set("timesPlayed", ele.get("timesPlayed") + 1);
    }
  });
  if (flag === 1) {
    unAlbum.set("name", record.master_metadata_album_album_name);
    unAlbum.set("aname", record.master_metadata_album_artist_name);
    unAlbum.set("mins", record.ms_played);
    unAlbum.set("timesPlayed", 1);
    albums.push(unAlbum);
  }
}

//----------JSON DATA is stored as array of maps for(artist/tracks/album) sorted by the times played------//

function info() {
  for (const record of data) {
    artistsInfo(record);
    tracksInfo(record);
    albumInfo(record);
  }
  artists.sort((a, b) => b.get("timesPlayed") - a.get("timesPlayed"));
  tracks.sort((a, b) => b.get("timesPlayed") - a.get("timesPlayed"));
  albums.sort((a, b) => b.get("timesPlayed") - a.get("timesPlayed"));
}

//----------------YEARLY CALCULATIONS------------------------//

function artistsInfoYear(record) {
  flag = 1;
  let unArtist = new Map();
  artists.forEach((ele) => {
    if (ele.get("name") === record.artistName) {
      flag = 0;
      ele.set("mins", ele.get("mins") + record.msPlayed);
      ele.set("timesPlayed", ele.get("timesPlayed") + 1);
    }
  });
  if (flag === 1) {
    unArtist.set("name", record.artistName);
    unArtist.set("mins", record.msPlayed);
    unArtist.set("timesPlayed", 1);
    artists.push(unArtist);
  }
}

function tracksInfoYear(record) {
  flag = 1;
  hoursListened += record.msPlayed;
  let unTrack = new Map();
  tracks.forEach((ele) => {
    if (ele.get("name") === record.trackName) {
      flag = 0;
      ele.set("mins", ele.get("mins") + record.msPlayed);
      ele.set("timesPlayed", ele.get("timesPlayed") + 1);
    }
  });
  if (flag === 1) {
    unTrack.set("name", record.trackName);
    unTrack.set("aname", record.artistName);
    unTrack.set("mins", record.msPlayed);
    unTrack.set("timesPlayed", 1);
    tracks.push(unTrack);
  }
}

function infoYear() {
  for (const record of data) {
    artistsInfoYear(record);
    tracksInfoYear(record);
  }
  artists.sort((a, b) => b.get("timesPlayed") - a.get("timesPlayed"));
  tracks.sort((a, b) => b.get("timesPlayed") - a.get("timesPlayed"));
}

//--------MAIN FUNCTION will only execute when correct files are uploaded and PROMISEALL is fulfilled down in HOME section--------//
// inp contains array of parsed JSON files

function spotify(inp) {
  if (data.length > 0) {
    data = [];
    artists = [];
    tracks = [];
    albums = [];
    tempCountry = [];
    tempPlatform = [];
    hoursListened = 0;
  }
  data = inp.flat();
  // console.log(data[0]); //uncomment to see how data is stored
  if (Object.keys(data[0]).length < 5) {
    infoYear();
    dataValid(data[0].endTime, data.slice(-1)[0].endTime);
    artistDisplay();
    tracksDisplay();
    home();
  } else {
    platformInfo();
    info();
    dataValid(data[0].ts, data.slice(-1)[0].ts);
    albumDisplay();
    other();
    other2();
    artistDisplay();
    tracksDisplay();
    home();
  }
  loader.classList.add("hidden-loader");
}

export {
  platform,
  artists,
  tracks,
  albums,
  dayStart,
  dayEnd,
  hoursListened,
  countries,
};

///------------------HOME PAGE-----------------------///
const ele2 = document.createElement("p");
let form = document.querySelector("#upload");
let file = document.querySelector('input[type="file"]');
const fileInfo = document.querySelector(".file-info");
const fileList = document.querySelector(".file-list");

//-----------Executed immediately when user selects files to upload-----------//

function clearFileMessage() {
  while (fileList.childNodes.length) {
    fileList.removeChild(fileList.childNodes[0]);
  }
}

function filesSelected(event) {
  clearFileMessage();
  let files = event.target.files;
  ele2.textContent = `Click upload to use the above file(s)`;
  fileInfo.appendChild(ele2);
  for (let i = 0; i < files.length; i++) {
    let li = document.createElement("li");
    li.textContent = `File ${i + 1} = ${files[i].name}`;
    fileList.appendChild(li);
  }
}

//-----------Executed when user clicks upload button, Files are read one by one---------//

function handleSubmit(event) {
  event.preventDefault();

  let files = file.files;
  if (files.length === 0) {
    noUpload();
    return;
  }

  loader.classList.remove("hidden-loader");
  clearMessage();
  clearAlbumTable();
  clearArtistTable();
  clearTrackTable();
  clearOtherData();
  let readers = [];
  for (let i = 0; i < files.length; i++) {
    readers.push(readFileAsText(files[i]));
  }

  Promise.all(readers).then((values) => {
    spotify(values);
  });
}
function readFileAsText(file) {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve(JSON.parse(fr.result));
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsText(file);
  });
}

//-------------EVENT HANDLERS for selecting and uploading files----------//

file.addEventListener("change", filesSelected);

form.addEventListener("submit", handleSubmit);

//---------------script.js function-----------------//
active();
