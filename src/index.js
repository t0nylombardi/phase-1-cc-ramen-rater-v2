// index.js

// Constants
const BASE_URL = "http://localhost:3000/ramens";

// Callbacks
const handleClick = (ramen) => {
  const detailImg = document.querySelector("#ramen-detail > .detail-image");
  const detailName = document.querySelector("#ramen-detail > .name");
  const detailRestaurant = document.querySelector(
    "#ramen-detail > .restaurant"
  );
  const detailsRating = document.getElementById("rating-display");
  const detailsComment = document.getElementById("comment-display");

  detailImg.src = ramen.image;
  detailImg.dataset.id = ramen.id;
  detailImg.alt = ramen.image;
  detailName.innerText = ramen.name;
  detailRestaurant.innerText = ramen.restaurant;
  detailsRating.innerText = ramen.rating.toString();
  detailsComment.innerText = ramen.comment;
};

const handleEditRamenSubmit = (event) => {
  event.preventDefault();
  const editRamenInfo = {
    rating: event.target["new-rating"].value,
    comment: event.target["new-comment"].value,
  };

  const ramenDetail = document.querySelector("#ramen-detail");
  const ramenId = ramenDetail.querySelector("img").dataset.id;

  fetch(`${BASE_URL}/${ramenId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editRamenInfo),
  })
    .then((response) => response.json())
    .then((ramen) => {
      event.target.reset();
    })
    .catch((error) => console.error("error:", error));

  document.querySelector("#rating-display").innerText = editRamenInfo.rating;
  document.querySelector("#comment-display").innerText = editRamenInfo.comment;
};

const handleDeleteRamen = (event) => {
  const ramenId = event.target.previousElementSibling.id.split("-")[1];
  console.log("ramenId:", ramenId);

  fetch(`${BASE_URL}/${ramenId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {})
    .catch((error) => console.error("error:", error));

  document.querySelector(`#ramenDiv-${ramenId}`).remove();
};

const handleNewRamenSubmit = (event) => {
  event.preventDefault();

  const newRamen = {
    id: (document.querySelectorAll("#ramen-menu img").length + 1).toString(),
    name: event.target["new-name"].value,
    restaurant: event.target.restaurant.value,
    image: event.target.image.value,
    rating: event.target.rating.value,
    comment: event.target["new-comment"].value,
  };

  // add new ramen to server
  fetch("http://localhost:3000/ramens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRamen),
  })
    .then((response) => response.json())
    .then(() => event.target.reset())
    .catch((error) => console.error("error:", error));

  const img = document.createElement("img");
  img.src = newRamen.image;
  img.alt = newRamen.name;
  img.dataset.id = newRamen.id;

  img.classList.add("ramen-image");
  img.addEventListener("click", () => handleClick(img));
  document.querySelector("#ramen-menu").appendChild(img);
};

const addSubmitListener = () => {
  const ramenForm = document.querySelector("#new-ramen");
  if (ramenForm) {
    ramenForm.addEventListener("submit", handleNewRamenSubmit);
  }

  const editForm = document.querySelector("#edit-ramen");
  if (editForm) {
    editForm.addEventListener("submit", handleEditRamenSubmit);
  }
};

const displayRamens = () => {
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((ramens) => {
      document.getElementById("ramen-menu").innerHTML = "";
      ramens.forEach(displayRamen);
      handleClick(ramens[0]);
    })
    .catch((error) => console.log(error));
};

const displayRamen = (ramenObj) => {
  const ramenMenuDiv = document.getElementById("ramen-menu");
  const ramenImgDiv = document.createElement("div");
  const ramenImg = document.createElement("img");
  const ramenDeleteButton = document.createElement("button");

  ramenImgDiv.classList.add("ramen-image-wrapper");
  ramenImgDiv.id = `ramenDiv-${ramenObj.id}`;

  ramenDeleteButton.innerText = "Delete";
  ramenDeleteButton.id = "delete-ramen";
  ramenDeleteButton.classList.add("delete-button");

  ramenImg.src = ramenObj.image;
  ramenImg.alt = ramenObj.name;
  ramenImg.id = `ramen-${ramenObj.id}`;
  ramenImg.dataset.id = ramenObj.id;

  ramenImgDiv.appendChild(ramenImg);
  ramenImgDiv.appendChild(ramenDeleteButton);
  ramenMenuDiv.appendChild(ramenImgDiv);
  ramenImg.addEventListener("click", (event) => handleClick(ramenObj, event));
  ramenDeleteButton.addEventListener("click", handleDeleteRamen);
};

const main = () => {
  addSubmitListener();
  displayRamens();
};

document.addEventListener("DOMContentLoaded", main);
// main();

// Export functions for testing
export {
  addSubmitListener,
  displayRamens,
  handleClick,
  handleDeleteRamen,
  main,
};
