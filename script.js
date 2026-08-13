
// ── DARK / LIGHT MODE TOGGLE ──
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (theme === 'light') {
    themeIcon.className = 'fas fa-moon';
    themeToggle.title = 'Switch to Dark Mode';
  } else {
    themeIcon.className = 'fas fa-sun';
    themeToggle.title = 'Switch to Light Mode';
  }
}

// Load saved theme or default dark
applyTheme(localStorage.getItem('theme') || 'dark');

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

const cvdToggle = document.getElementById('cvd-toggle');
const cvdModes = [
  { id: 'off', label: 'Color-blind friendly mode: Off' },
  { id: 'friendly', label: 'Color-blind friendly palette (high contrast)' },
  { id: 'deuteranopia', label: 'Deuteranopia palette (green-weak)' },
  { id: 'protanopia', label: 'Protanopia palette (red-weak)' },
  { id: 'tritanopia', label: 'Tritanopia palette (blue-yellow)' }
];

function applyCvd(modeId) {
  const mode = cvdModes.find(m => m.id === modeId) || cvdModes[0];
  if (mode.id === 'off') html.removeAttribute('data-cvd');
  else html.setAttribute('data-cvd', mode.id);
  localStorage.setItem('cvd', mode.id);
  if (cvdToggle) cvdToggle.title = mode.label;
}

applyCvd(localStorage.getItem('cvd') || 'off');
if (cvdToggle) {
  cvdToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-cvd') || 'off';
    const next = cvdModes[(cvdModes.findIndex(m => m.id === current) + 1) % cvdModes.length];
    applyCvd(next.id);
  });
}

// ── NAVBAR SCROLL + ACTIVE LINK ──
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 90) current = sec.id; });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});
navLinks.forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinksContainer.classList.remove('open');
}));

// ── TYPED ROLE (IT Consultant first, then Cloud & DevOps Enthusiast) ──
const roles = ['IT Consultant', 'Cloud & DevOps Enthusiast'];
let ri = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed-role');
const prefixEl = document.querySelector('.role-prefix');

function updatePrefix() {
  const firstChar = roles[ri][0].toLowerCase();
  const vowels = ['a','e','i','o','u'];
  prefixEl.textContent = vowels.includes(firstChar) ? "I'm an " : "I'm a ";
}

updatePrefix();
typedEl.textContent = roles[0];
ci = roles[0].length;
del = true;

function typeRole() {
  const cur = roles[ri];
  if (!del) {
    typedEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(typeRole, 2200); return; }
  } else {
    typedEl.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; updatePrefix(); }
  }
  setTimeout(typeRole, del ? 55 : 95);
}
setTimeout(typeRole, 1800);

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (!target) return;
  if (parseInt(el.textContent, 10) === target) return;
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count === target) clearInterval(t);
  }, 40);
}
const statEls = document.querySelectorAll('.stat-num');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      cObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
statEls.forEach(el => cObs.observe(el));
setTimeout(() => {
  statEls.forEach(el => {
    if (el.textContent === '0') el.textContent = el.getAttribute('data-target') || '0';
  });
}, 2000);

// ── SKILL CARD STAGGER REVEAL ──
const skObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); skObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.skill-card').forEach(el => skObs.observe(el));

// ── SCROLL ENTRANCE ANIMATION ──
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }
  });
}, { threshold: 0.06 });
document.querySelectorAll('.timeline-card, .project-card, .cert-card, .edu-card, .contact-item').forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObs.observe(el);
});

// ── BACK TO TOP ──
document.getElementById('back-to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── CONTACT FORM (EmailJS) ──
// To activate real email delivery:
// 1. Sign up free at https://www.emailjs.com
// 2. Create a service (Gmail) → get Service ID
// 3. Create a template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
//    Set "To Email" in template to: gauravkashikar25@gmail.com
// 4. Get your Public Key from Account → API Keys
// 5. Replace YOUR_PUBLIC_KEY in index.html, YOUR_SERVICE_ID and YOUR_TEMPLATE_ID below

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  const btn = this.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  const params = {
    from_name:  document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    subject:    document.getElementById('subject').value,
    message:    document.getElementById('message').value,
    to_email:   'gauravkashikar25@gmail.com'
  };

  if (typeof emailjs === 'undefined' || !emailjs.send) {
    const body = encodeURIComponent(params.message + '\n\nFrom: ' + params.from_name + ' <' + params.from_email + '>');
    window.location.href = 'mailto:gauravkashikar25@gmail.com?subject=' + encodeURIComponent(params.subject) + '&body=' + body;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    return;
  }

  emailjs.send('service_1hxa10f', 'template_iriub3k', params)
    .then(() => {
      status.textContent = '✅ Message sent! I\'ll get back to you soon.';
      status.style.color = '#34d399';
      this.reset();
    })
    .catch((err) => {
      status.textContent = '❌ Failed to send. Please email me directly at gauravkashikar25@gmail.com';
      status.style.color = '#f43f5e';
      console.error('EmailJS error:', err);
    })
    .finally(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      setTimeout(() => { status.textContent = ''; }, 5000);
    });
});

// ── INTERACTIVE TERMINAL PROMPT ┎
const terminalForm = document.getElementById('terminal-form');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
let terminalHistory = [];
let historyIndex = -1;

const terminalCommands = {
  help: [
    'Available commands:',
    'help           - Show available commands',
    'skills         - See top technical skills',
    'about          - Learn more about me',
    'experience     - Jump to the Experience section',
    'projects       - Jump to the Projects section',
    'education      - Jump to the Education section',
    'certifications - Jump to the Certifications section',
    'contact        - Jump to the Contact section',
    'resume         - Open the resume PDF',
    'clear          - Clear this terminal'
  ],
  skills: ['AWS · Docker · Kubernetes · Terraform · Jenkins · Python · Linux'],
  about: ['IT Consultant focused on Cloud, DevOps, and intelligent IT solutions in real-world IT projects.'],
  experience: ['Scrolls to the Experience section.'],
  projects: ['Scrolls to the Projects section.'],
  education: ['Scrolls to the Education section.'],
  certifications: ['Scrolls to the Certifications section.'],
  contact: ['Opening contact section...', 'You can also email me at gauravkashikar25@gmail.com'],
  resume: ['Opening resume...']
};

function appendTerminalLine(text, extraClass = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${extraClass}`.trim();
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function executeTerminalCommand(command) {
  if (command === 'clear') {
    terminalOutput.innerHTML = '<div class="terminal-line terminal-welcome">Type help to explore.</div>';
    return;
  }

  const response = terminalCommands[command];
  if (!response) {
    appendTerminalLine(`Unknown command: ${command}`, 'terminal-error');
    appendTerminalLine('Type help to see available commands.');
    return;
  }

  response.forEach(line => appendTerminalLine(line));

  if (command === 'contact') {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }
  if (command === 'skills') {
    document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
  }
  if (command === 'about') {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  }
  if (command === 'experience') {
    document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
  }
  if (command === 'projects') {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  }
  if (command === 'education') {
    document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
  }
  if (command === 'certifications') {
    document.getElementById('certifications').scrollIntoView({ behavior: 'smooth' });
  }
  if (command === 'resume') {
    window.open('Gaurav_Kashikar_DevOps_Resume.pdf', '_blank');
  }
}

terminalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const rawCommand = terminalInput.value.trim();
  if (!rawCommand) return;

  const command = rawCommand.toLowerCase();
  terminalHistory.push(command);
  historyIndex = terminalHistory.length;

  appendTerminalLine(`$ ${command}`, 'terminal-prompt-line');
  executeTerminalCommand(command);
  terminalInput.value = '';
  terminalInput.focus();
});

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!terminalHistory.length) return;

    historyIndex = Math.max(0, historyIndex - 1);
    if (historyIndex >= 0 && historyIndex < terminalHistory.length) {
      terminalInput.value = terminalHistory[historyIndex];
    } else {
      terminalInput.value = '';
    }
  }
});

// ── FOOTER YEAR ──
document.getElementById('year').textContent = new Date().getFullYear();

