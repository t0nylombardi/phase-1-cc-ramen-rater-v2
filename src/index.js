"use strict";

// index.js

/*
  As a user, I can:

  - See all ramen images in the div with the id of ramen-menu. When the page loads, fire a function called displayRamens
  that requests the data from the server to get all the ramen objects. Then, display the image for each of the ramen
  using an img tag inside the #ramen-menu div.

  - Click on an image from the #ramen-menu div and fire a callback called handleClick to see all the info about that
  ramen displayed inside the #ramen-detail div (where it says insert comment here and insert rating here).

  - Attach a submit even listener to the new-ramen form using a function called addSubmitListener. After the submission,
  create a new ramen and add it to the#ramen-menu div. The new ramen does not need to persist; in other words,
  if you refresh the page, it's okay that the new ramen is no longer on the page.

Endpoints
  base URL: http://localhost:3000
  GET /ramens
  GET /ramens/:id
*/

// Callbacks
const handleClick = (ramenElm) => {
  // Add code
  const ramenId = ramenElm.dataset.id;
  fetch(`http://localhost:3000/ramens/${ramenId}`)
    .then((response) => response.json())
    .then((ramen) => {
      const detailImage = document.querySelector(".detail-image");
      detailImage.src = ramen.image;
      detailImage.alt = ramen.name;
      document.querySelector(".name").textContent = ramen.name;
      document.querySelector(".restaurant").innerHTML = ramen.restaurant;
      document.querySelector("#rating-display").innerHTML = ramen.rating;
      document.querySelector("#comment-display").innerHTML = ramen.comment;
    })
    .catch((error) => console.log("Error:", error));
};

const handleSubmit = (event) => {
  const name = event.target.name.value;
  const restaurant = event.target.restaurant.value;
  const image = event.target.image.value;
  const rating = event.target.rating.value;
  const comment = event.target["new-comment"].value;

  const newRamen = {
    name,
    restaurant,
    image,
    rating,
    comment,
  };
  console.log("newRamen", JSON.stringify(newRamen));

  // add new ramen to server
  fetch("http://localhost:3000/ramens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRamen),
  })
    .then((response) => response.json())
    .then((ramen) => {
      const img = document.createElement("img");
      img.src = ramen.image;
      img.alt = ramen.name;
      img.dataset.id = ramen.id;
      document.querySelector("#ramen-menu").appendChild(img);
    })
    .catch((error) => console.error("error:", error));
  event.preventDefault();
};

const addSubmitListener = () => {
  // Add code
  document.querySelector("#new-ramen").addEventListener("submit", handleSubmit);
};

const displayRamens = () => {
  // Add code
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((ramen) => {
        const img = document.createElement("img");
        img.classList.add("ramen-image");
        img.src = ramen.image;
        img.alt = ramen.name;
        img.dataset.id = ramen.id;
        img.addEventListener("click", () => handleClick(img));
        document.querySelector("#ramen-menu").appendChild(img);
      });
    })
    .catch((error) => console.error(error));
};

const main = () => {
  // Invoke displayRamens here
  displayRamens();
  // Invoke addSubmitListener here
  addSubmitListener();
};

main();

// Export functions for testing
export { displayRamens, addSubmitListener, handleClick, main };
