// index.js

// Constants
const BASE_URL = "http://localhost:3000/ramens";

// Utility Functions
const fetchRamens = async () => {
  try {
    const response = await fetch(BASE_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching ramens:", error);
    return [];
  }
};

const createElement = (tag, attributes = {}, ...children) => {
  const element = document.createElement(tag);
  for (let key in attributes) {
    element[key] = attributes[key];
  }
  children.forEach((child) => element.appendChild(child));
  return element;
};

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
  detailImg.alt = ramen.image;
  detailName.innerText = ramen.name;
  detailRestaurant.innerText = ramen.restaurant;
  detailsRating.innerText = ramen.rating.toString();
  detailsComment.innerText = ramen.comment;
};

const displayRamen = (ramenObj) => {
  const ramenMenuDiv = document.getElementById("ramen-menu");
  const ramenImg = document.createElement("img");
  ramenImg.src = ramenObj.image;
  ramenImg.alt = ramenObj.name;
  ramenImg.dataset.id = ramenObj.id;
  ramenMenuDiv.appendChild(ramenImg);
  ramenImg.addEventListener("click", (event) => handleClick(ramenObj, event));
};

const handleEditRamenSubmit = (event) => {
  console.log("event.target.dataset.id", event.target);
  event.preventDefault();

  const editRamenInfo = {
    rating: event.target["new-rating"].value,
    comment: event.target["new-comment"].value,
  };

  const ramenId = event.target.dataset.id;

  fetch(`${BASE_URL}/${ramenId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editRamenInfo),
  })
    .then((response) => response.json())
    .then((ramen) => {
      const ramenDetail = document.querySelector("#ramen-detail");
      ramenDetail.querySelector("#rating-display").innerText = ramen.rating;
      ramenDetail.querySelector("#comment-display").innerText = ramen.comment;
    })
    .catch((error) => console.error("error:", error));

  event.target.reset();
};

const handleNewRamenSubmit = (event) => {
  event.preventDefault();

  const newRamen = {
    id: document.querySelectorAll("#ramen-menu img").length + 1,
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
    .then((ramen) => event.target.reset())
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
  ramenForm.addEventListener("submit", handleNewRamenSubmit);

  const editForm = document.querySelector("#edit-ramen");
  if (editForm) {
    editForm.addEventListener("submit", handleEditRamenSubmit);
  }

  // const deleteButton = document.querySelector("#delete-ramen");
  // if (deleteButton) {
  //   deleteButton.addEventListener("click", handleDeleteRamen);
  // }
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

const main = () => {
  addSubmitListener();
  displayRamens();
};

document.addEventListener("DOMContentLoaded", main);
// main();

// Export functions for testing
export { addSubmitListener, displayRamens, handleClick, main };
