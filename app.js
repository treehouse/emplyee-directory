const addUser = document.getElementById("addUser");
const userList = document.getElementById("userList");

async function randomUser() {
  const response = await fetch("https://randomuser.me/api/?lego");
  const data = await response.json();
}

addUser.addEventListener("click", () => {
  randomUser();
});
