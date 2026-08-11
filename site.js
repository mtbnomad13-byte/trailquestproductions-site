document.querySelectorAll('.nav-toggle').forEach((button) => {
  const nav = button.parentElement.querySelector('.nav');
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});
