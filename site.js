document.querySelectorAll('.nav-toggle').forEach((button) => {
  const nav = button.parentElement.querySelector('.nav');
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// Preselect the service when a visitor comes from a service-specific Get a Quote button.
const project = new URLSearchParams(window.location.search).get('project');
const projectOptions = {
  'ride-ready': 'ride-ready',
  'adventure-tourism': 'adventure-tourism'
};
if (projectOptions[project]) {
  const option = document.querySelector(`input[name="Interested In"][data-project="${projectOptions[project]}"]`);
  if (option) option.checked = true;
}
