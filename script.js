  // JavaScript to toggle the menu
  const burgerButton = document.getElementById('burger-button');
  const sidebar = document.querySelector('.sidebar');

  burgerButton.addEventListener('click', () => {
    sidebar.classList.toggle('burger-active');
  });