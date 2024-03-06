const addUser = document.getElementById("addUser");
const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchInput");
const filterByLocation = document.getElementById("filterByLocation");
const paginationBtns = document.querySelector('.pagination-btns');
const usersPerPage = 7;

function createLi(user){
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

// Create and insert student elements for the selected page
function showPage(page) {

  // empty HTML content to prevent duplicated code
  userList.innerHTML = '';

  // Retrieve and parse localStorage>users
  const usersArray = JSON.parse(localStorage.getItem("users")) || [];

  startIndex = (page * usersPerPage) - usersPerPage;
  endIndex = Math.min(page * usersPerPage, usersArray.length);
  // Iterates through the list array to generate html content
  for (let i=startIndex; i<endIndex; i++) {
    createLi(usersArray[i]);
  }
}

// Add pagination for userList
function addPagination(list) {
  let listArr;
  if (!Array.isArray(list)) {
    listArr = list.querySelectorAll('li');
  } else {
    listArr = list;
  }

  const numBtns = Math.ceil(listArr.length / usersPerPage);

  paginationBtns.innerHTML = '';

  for (let i = 1; i <= numBtns; i++) {
     let html = `
        <li>
           <button type='button'>${i}</button>
        </li>
     `;

     paginationBtns.insertAdjacentHTML('beforeend', html);
  }

  // give 'active' class to first pagination button
  if (paginationBtns.querySelectorAll('li').length > 0 ) {
    document.querySelector('.pagination-btns li button').className = 'active';
  }

  // active class transferred to clicked pagination button
  paginationBtns.addEventListener('click', (e) => {
     if (e.target.tagName === 'BUTTON') {
        document.querySelector('.active').className = '';
        e.target.className = 'active';
        showPage(e.target.textContent);
     }
  })
}

async function randomUser() {
  const response = await fetch("https://randomuser.me/api/?lego");
  const data = await response.json();
  let randomUser = data.results[0];

  // Save the user to local storage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(randomUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Load the user to the page only if <= 7 shown on page
  if (users.length < 7) {
    loadUser(randomUser);
  }

  // update pagination as users are added
  addPagination(users);
}

function loadUser(user) {
  createLi(user)
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

  // empty userList to render new list of 7 people,
  // or however many users.length
  userList.innerHTML = '';
  if (users.length > 0) {
    let i = 0;
    while (i < 7 && i < users.length) {
      loadUser(users[i]);
      i++;
    }
  }

  // update pagination btns
  addPagination(users);
}

window.onload = function () {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.length > 0) {
    let i = 0;
    while (i < 7) {
      loadUser(users[i]);
      i++;
    }
    addPagination(users);
  }
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
