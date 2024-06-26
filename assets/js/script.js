document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-js-example");
  const showModal = document.getElementById("showModal");
  const closeModalElements = document.querySelectorAll(
    ".modal-background, .delete, .modal-card-foot .button"
  );

  showModal.addEventListener("click", () => {
    modal.classList.add("is-active");
  });

  closeModalElements.forEach((element) => {
    element.addEventListener("click", () => {
      modal.classList.remove("is-active");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.classList.remove("is-active");
    }
  });
});

//event listner for the toggle light mode button
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("modeToggle");
  // Initialize mode based on stored preference or default to dark mode
  if (localStorage.getItem("lightMode") === "true") {
    document.body.classList.add("light-mode");
    toggleButton.textContent = "Toggle Dark Mode";
  } else {
    toggleButton.textContent = "Toggle Light Mode";
  }

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");
    localStorage.setItem("lightMode", isLightMode);
    toggleButton.textContent = isLightMode
      ? "Toggle Dark Mode"
      : "Toggle Light Mode";
  });
});
