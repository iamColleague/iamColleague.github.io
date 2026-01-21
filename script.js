
// Simple interactive behaviors: nav toggle, modal, signup + contact handling, toast
document.addEventListener('DOMContentLoaded', () => {
  // header
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('show');
  });

  // modal (signup)
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const ctaMain = document.getElementById('ctaMain');
  const ctaTop = document.getElementById('ctaTop');

  function showModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    (document.getElementById('signupName') as any)?.focus?.();
  }
  function hideModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  ctaMain?.addEventListener('click', showModal);
  ctaTop?.addEventListener('click', showModal);
  modalClose?.addEventListener('click', hideModal);
  modalBackdrop?.addEventListener('click', hideModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
  });

  // toast
  const toast = document.getElementById('toast');
  let toastTimer = 0;
  function showToast(message = 'Saved') {
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // Signup form
  const signupForm = document.getElementById('signupForm');
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('signupName');
    const emailEl = document.getElementById('signupEmail');

    const name = (nameEl?.value || '').trim();
    const email = (emailEl?.value || '').trim();

    if (!name || !validateEmail(email)) {
      showToast('Please enter a valid name and email');
      return;
    }

    // Store locally as a demo (in real app send to server)
    const subscribers = JSON.parse(localStorage.getItem('novastart.subs') || '[]');
    subscribers.push({ name, email, time: new Date().toISOString() });
    localStorage.setItem('novastart.subs', JSON.stringify(subscribers));

    hideModal();
    showToast('Welcome! Check your email (demo).');
    (signupForm as HTMLFormElement).reset();
  });

  // Pricing buttons open modal and prefill plan (demo)
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const plan = (ev.currentTarget as HTMLElement).getAttribute('data-plan') || '';
      showModal();
      setTimeout(() => {
        const nameInput = document.getElementById('signupName');
        const emailInput = document.getElementById('signupEmail');
        if (emailInput) emailInput.focus();
        // optionally show plan somewhere (not implemented)
        showToast(`Selected plan: ${plan}`);
      }, 250);
    });
  });

  // Contact form (simple local handling)
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    if (!name || !validateEmail(email) || !message) {
      showToast('Please complete all fields with a valid email.');
      return;
    }

    // For demo: store message locally
    const messages = JSON.parse(localStorage.getItem('novastart.messages') || '[]');
    messages.push({ name, email, message, time: new Date().toISOString() });
    localStorage.setItem('novastart.messages', JSON.stringify(messages));

    (contactForm as HTMLFormElement).reset();
    showToast('Message sent (demo).');
  });

  // small helpers
  function validateEmail(email) {
    // simple regex — good enough for demo
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // dynamic footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
