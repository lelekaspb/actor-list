window.addEventListener("load", start);

const actorTemplate = document.querySelector("template").content;
const actorList = document.querySelector(".actors");
const modal = document.querySelector(".modal_wrapper");
const filterBtn = document.querySelector("#movie-button");
const dropdown = document.querySelector("#movie-dropdown");
const dropdownList = document.querySelectorAll("#movie-dropdown > a");
let dataArray = [];
let filtered = [];
const filterObj = {
  movie: "All movies",
  sort: "first_name",
};

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function start() {
  fetch("./json/actors.json", options)
    .then((res) => res.json())
    .then((data) => renderActors(data))
    .catch((err) => {
      console.error(err);
    });
}

function renderActors(actors) {
  actorList.innerHTML = "";
  actors.forEach((actor, index) => {
    const actorClone = actorTemplate.cloneNode(true);
    actorClone.querySelector(".number").textContent = index + 1;
    actorClone.querySelector("a.actor_link").textContent = actor.fullname;
    actorClone.querySelector("a.actor_link").dataset.movie = actor.movie;
    actorClone.querySelector("a.actor_link").dataset.actor = actor.fullname;
    actorClone
      .querySelector("a.actor_link")
      .addEventListener("click", showDetails);
    actorList.appendChild(actorClone);
  });
}

function showDetails() {
  modal.querySelector(".movie_name > span").textContent = this.dataset.movie;
  modal.querySelector(".actor_name > span").textContent = this.dataset.actor;
  modal.style.display = "block";
  modal.addEventListener("click", closeDetails);
}

function closeDetails(e) {
  if (
    e.target.classList.contains("modal_wrapper") ||
    e.target.classList.contains("modal_close")
  ) {
    modal.querySelector(".movie_name > span").textContent = "";
    modal.querySelector(".actor_name > span").textContent = "";
    modal.style.display = "none";
  }
}

// filter by movie dropdown
filterBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  dropdown.classList.toggle("hidden");
});

window.addEventListener("click", function () {
  dropdown.classList.add("hidden");
});

//add eventListeners fro filtering and sorting
dropdownList.forEach((link) => {
  link.addEventListener("click", changeMovie);
});
document.querySelector("#sort").addEventListener("change", changeSortBy);

// change filterObj based on input
function changeMovie(e) {
  filterObj.movie = this.innerText;
  document.querySelector("#movie-button span:nth-of-type(1)").textContent =
    e.target.innerText;
  filterActors();
}

function changeSortBy() {
  filterObj.sort = document.querySelector("#sort").value;
  filterActors();
}

// filtering function that calls rendering function after itself
function filterActors() {
  fetch("./json/actors.json", options)
    .then((res) => res.json())
    .then(function (data) {
      if (filterObj.movie !== "All movies") {
        filtered = data.filter((item) => item.movie === filterObj.movie);
      } else {
        filtered = data;
      }
      filtered = filtered.sort(function (x, y) {
        if (filterObj.sort === "last_name") {
          let a = x.fullname.split(" ")[1].toUpperCase();
          let b = y.fullname.split(" ")[1].toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        } else if (filterObj.sort === "first_name") {
          let a = x.fullname.split(" ")[0].toUpperCase();
          let b = y.fullname.split(" ")[0].toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        }
      });
      renderActors(filtered);
    })
    .catch((err) => {
      console.error(err);
    });
}
