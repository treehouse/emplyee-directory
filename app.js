const addUser = document.getElementById("addUser");
const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchInput");
const filterByLocation = document.getElementById("filterByLocation");

async function randomUser() {
  const response = await fetch("https://randomuser.me/api/?lego");
  const data = await response.json();
  let randomUser = data.results[0];

  // Save the user to local storage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(randomUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Load the user to the page
  loadUser(randomUser);
}

function loadUser(user) {
  console.log(user);
  let li = document.createElement("li");

  let img = document.createElement("img");
  img.src = user.picture.thumbnail;

  let name = document.createElement("p");
  name.classList = "name";
  name.textContent = user.name.first + " " + user.name.last;

  let location = document.createElement("p");
  location.classList = "location";
  location.textContent = user.location.city + ", " + user.location.state;

  let deleteBtn = document.createElement("button");
  deleteBtn.classList = "delete";
  deleteBtn.textContent = "delete";
  deleteBtn.id = "deleteBtn";
  deleteBtn.addEventListener("click", deleteUser);

  li.appendChild(img);
  li.appendChild(name);
  li.appendChild(location);
  li.appendChild(deleteBtn);

  userList.appendChild(li);
}

function deleteUser(event) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let parent = event.target.parentElement;
  let name = parent.querySelector("p").textContent;
  let index = users.findIndex(
    (user) => user.name.first + " " + user.name.last === name
  );
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  parent.remove();
}

window.onload = function () {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach((user) => loadUser(user));
};

searchInput.addEventListener("keyup", (e) => {
  let query = e.target.value.toLowerCase();

  if (!filterByLocation.checked) {
    let names = document.querySelectorAll("p.name");
    names.forEach((name) => {
      if (name.textContent.toLowerCase().includes(query)) {
        name.parentNode.style.display = "flex";
      } else {
        name.parentNode.style.display = "none";
      }
    });
  } else {
    let locations = document.querySelectorAll("p.location");
    locations.forEach((location) => {
      if (location.textContent.toLowerCase().includes(query)) {
        location.parentNode.style.display = "flex";
      } else {
        location.parentNode.style.display = "none";
      }
    });
  }
});

addUser.addEventListener("click", () => {
  randomUser();
});
