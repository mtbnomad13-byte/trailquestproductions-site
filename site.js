// Keep one canonical hostname so links and form submissions use one consistent site URL.
if (window.location.hostname === 'www.trailquestproductions.com') {
  const target = `https://trailquestproductions.com${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(target);
}

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

// Submit the contact form through FormSubmit's official AJAX endpoint so visitors never
// leave Trail Quest Productions for a FormSubmit-branded success or CAPTCHA page.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('.contact-submit');
  const status = contactForm.querySelector('.form-status');
  const originalButtonText = submitButton ? submitButton.textContent : '';

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Preserve normal browser validation for required fields/email/phone inputs.
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    if (status) {
      status.textContent = '';
      status.classList.remove('error');
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    try {
      const formData = new FormData(contactForm);
      const payload = {};
      for (const [key, value] of formData.entries()) payload[key] = value;

      const endpoint = contactForm.dataset.ajaxEndpoint;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let result = {};
      try { result = await response.json(); } catch (_) {}

      const accepted = response.ok && (result.success === true || result.success === 'true' || result.success === undefined);
      if (!accepted) {
        const message = result.message || 'We could not send your message. Please try again.';
        throw new Error(message);
      }

      window.location.assign('thanks.html');
    } catch (error) {
      if (status) {
        status.textContent = 'Your message did not send. Please try again, or email MTBNomad13@gmail.com.';
        status.classList.add('error');
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
      console.error('Contact form submission failed:', error);
    }
  });
}

// Every portfolio video starts as a clean poster image with one uniform YouTube-style red play button.
// The actual YouTube iframe is created only after the visitor clicks, keeping YouTube's title/channel/Watch-on-YouTube chrome off the poster state.
document.querySelectorAll('.video-card[data-video-id]').forEach((card) => {
  card.addEventListener('click', (event) => {
    event.preventDefault();

    const thumb = card.querySelector('.video-thumb');
    const videoId = card.dataset.videoId;
    if (!thumb || !videoId || thumb.classList.contains('is-playing')) return;

    thumb.classList.add('is-playing');
    card.classList.add('video-playing');
    card.setAttribute('aria-label', 'Video playing');

    const iframe = document.createElement('iframe');
    iframe.className = 'video-embed';
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&playsinline=1&controls=1&iv_load_policy=3`;
    iframe.title = card.querySelector('h3')?.textContent?.trim() || 'Trail Quest Productions video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;

    thumb.style.backgroundImage = 'none';
    thumb.appendChild(iframe);
  });
});
