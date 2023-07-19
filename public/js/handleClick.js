const avatars = document.querySelectorAll(".avatar-img");
const radioInputs = document.querySelectorAll('input[type="radio"]');

function handleAvatarClick(event) {
  const clickedAvatar = event.target;
  const avatarName = clickedAvatar.dataset.avatarName;

  // Remove 'selected' class from all avatars
  avatars.forEach((avatar) => {
    avatar.classList.remove("selected");
  });

  // Add 'selected' class to the clicked avatar
  clickedAvatar.classList.add("selected");

  // Check the corresponding radio input
  radioInputs.forEach((input) => {
    if (input.id === avatarName) {
      input.checked = true;
    }
  });
}

avatars.forEach((avatar) => {
  avatar.addEventListener("click", handleAvatarClick);
});

module.exports = handleAvatarClick;
