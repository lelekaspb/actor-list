window.addEventListener("load", start);

const actorTemplate = document.querySelector("template").content;
const actorList = document.querySelector(".actors");
const modal = document.querySelector(".modal_wrapper");

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
  console.log(this);
  modal.querySelector(".movie_name > span").textContent = this.dataset.movie;
  modal.querySelector(".actor_name > span").textContent = this.dataset.actor;
  modal.style.display = "block";
  modal.addEventListener("click", closeDetails);
}

function closeDetails(e) {
  console.log(e.target);
  if (
    e.target.classList.contains("modal_wrapper") ||
    e.target.classList.contains("modal_close")
  ) {
    modal.querySelector(".movie_name > span").textContent = "";
    modal.querySelector(".actor_name > span").textContent = "";
    modal.style.display = "none";
  }
}
