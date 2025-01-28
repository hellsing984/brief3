  // JavaScript to toggle the menu
  const burgerButton = document.getElementById('burgerButton');
  const menu = document.getElementById('menu');

  burgerButton.addEventListener('click', () => {
    menu.classList.toggle('open');
  });