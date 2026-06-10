// ===== SHARED FUNCTIONS =====

// Dark mode toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const body = document.body;
  const themeIcon = themeToggle.querySelector('i');

  const isLight = localStorage.getItem('theme') === 'light';
  if (isLight) {
    body.classList.add('light-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    body.classList.remove('light-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'light');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Scroll effects
function initScrollEffects() {
  const logo = document.getElementById('floatingLogo');
  const navbar = document.getElementById('floatingNav');
  if (!logo || !navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      logo.classList.add('logo-fade', 'logo-shrink');
    } else {
      logo.classList.remove('logo-fade', 'logo-shrink');
    }
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastScroll = currentScroll;
  });
}

// Hamburger menu
function initHamburger() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navContainer = document.querySelector('.floating-nav');
  if (!hamburger || !navContainer) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navContainer.classList.toggle('mobile-nav-open');
  });

  document.addEventListener('click', (e) => {
    if (!navContainer.contains(e.target)) {
      navContainer.classList.remove('mobile-nav-open');
    }
  });
}

// Smooth scrolling
function initSmoothScroll() {
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').substring(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        document.querySelector('.floating-nav')?.classList.remove('mobile-nav-open');
      }
    });
  });
}

// Modals
function initModals() {
  document.querySelectorAll('[data-modal-target]').forEach(element => {
    element.addEventListener('click', (e) => {
      const targetId = element.getAttribute('data-modal-target');
      const modal = new bootstrap.Modal(document.getElementById(targetId));
      modal.show();
    });
  });
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.checkValidity()) {
        alert('Inquiry sent (demo).');
        form.reset();
      } else {
        form.reportValidity();
      }
    });
  }
}

// ===== TICKET BOOKING =====
function initTicketForm() {
  const form = document.getElementById('ticketForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const qty = document.getElementById('ticketQty').value;
    const cat = document.getElementById('ticketCategory').value;
    const name = document.getElementById('parentName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const isParticipant = document.getElementById('participantCheck')?.checked || false;
    const discountCode = document.getElementById('discountCode')?.value || '';

    let discountApplied = false;
    if (isParticipant && discountCode.trim() !== '') {
      discountApplied = true;
    }

    const bookingData = { qty, cat, name, phone, email, discountApplied };
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));

    window.location.href = 'payment.html';
  });
}

// ===== PAYMENT PAGE =====
function initPayment() {
  const bookingData = JSON.parse(sessionStorage.getItem('pendingBooking'));
  if (!bookingData) {
    window.location.href = 'registration.html';
    return;
  }

  const summaryDiv = document.getElementById('paymentSummary');
  if (summaryDiv) {
    let html = `<p><strong>Category:</strong> ${bookingData.cat}</p>`;
    html += `<p><strong>Quantity:</strong> ${bookingData.qty}</p>`;
    html += `<p><strong>Name:</strong> ${bookingData.name}</p>`;
    html += `<p><strong>Phone:</strong> ${bookingData.phone}</p>`;
    html += `<p><strong>Email:</strong> ${bookingData.email}</p>`;
    if (bookingData.discountApplied) {
      html += `<p class="text-success">✨ Participant discount applied!</p>`;
    } else {
      html += `<p>No discount applied.</p>`;
    }
    const basePrice = 500;
    const total = bookingData.qty * basePrice * (bookingData.discountApplied ? 0.8 : 1);
    html += `<p><strong>Total: ₹${total}</strong> (mock price)</p>`;
    summaryDiv.innerHTML = html;
  }

  const payBtn = document.getElementById('payNowBtn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const ticketId = `TBSKLN-2026-${randomNum}`;
      const ticketData = {
        ticketId,
        cat: bookingData.cat,
        qty: bookingData.qty,
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        discountApplied: bookingData.discountApplied,
        date: new Date().toLocaleString()
      };

      let ticketsByPhone = JSON.parse(localStorage.getItem(`tickets_${bookingData.phone}`)) || [];
      ticketsByPhone.push(ticketData);
      localStorage.setItem(`tickets_${bookingData.phone}`, JSON.stringify(ticketsByPhone));
      localStorage.setItem('lastTicket', JSON.stringify(ticketData));
      sessionStorage.removeItem('pendingBooking');

      window.location.href = 'ticket.html';
    });
  }

  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      sessionStorage.removeItem('pendingBooking');
      window.location.href = 'registration.html';
    });
  }
}

// ===== TICKET DISPLAY PAGE =====
function initTicketDisplay() {
  const ticketData = JSON.parse(localStorage.getItem('lastTicket'));
  if (!ticketData) {
    document.getElementById('ticketDisplay').innerHTML = '<p class="text-center">No ticket found. Please book a ticket first.</p>';
    return;
  }

  document.getElementById('displayTicketId').textContent = ticketData.ticketId;
  document.getElementById('displayCategory').textContent = `${ticketData.cat} (${ticketData.qty} ticket${ticketData.qty>1?'s':''})`;
  document.getElementById('displayName').textContent = ticketData.name;
  document.getElementById('displayPhone').textContent = ticketData.phone;
  document.getElementById('displayEmail').textContent = ticketData.email;
  if (ticketData.discountApplied) {
    document.getElementById('displayDiscount').innerHTML = '<span class="badge bg-success">Discount Applied</span>';
  }

  document.getElementById('downloadTicketBtn').addEventListener('click', () => {
    alert('Ticket PDF download simulated. Ticket ID: ' + ticketData.ticketId);
  });
}

// ===== ORGANIZING PAGE LOGIN =====
function initOrganizingLogin() {
  const loginForm = document.getElementById('organizingLoginForm');
  if (!loginForm) return;
  const loginCard = document.getElementById('loginCard');
  const memberList = document.getElementById('memberList');
  const logoutBtn = document.getElementById('logoutBtn');

  const validUsername = 'organizer';
  const validPassword = 'team2026';

  if (localStorage.getItem('organizingLoggedIn') === 'true') {
    showMembers();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username === validUsername && password === validPassword) {
      localStorage.setItem('organizingLoggedIn', 'true');
      showMembers();
    } else {
      alert('Invalid credentials. Use organizer / team2026');
    }
  });

  function showMembers() {
    loginCard.style.display = 'none';
    memberList.style.display = 'block';
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('organizingLoggedIn');
    memberList.style.display = 'none';
    loginCard.style.display = 'block';
    loginForm.reset();
  });
}

// ===== PARENT LOGIN =====
function initParentLogin() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  const loginCard = document.getElementById('loginCard');
  const dashboard = document.getElementById('dashboard');
  const logoutBtn = document.getElementById('logoutBtn');

  const studentDB = {
    '101:1234567890': { name: 'Aarav Sharma', event: 'Vivacé (Solo Vocal)', timing: '12 Mar 2026, 2:00 PM', costume: 'Formal black & white', seat: 'A-24', facultyCoordinator: 'Ms. Sunita Rao', studentCoordinator: 'Kavya Iyer' },
    '102:9876543210': { name: 'Anaya Gupta', event: 'Abhinaya (Drama)', timing: '13 Mar 2026, 11:00 AM', costume: 'Traditional attire', seat: 'B-12', facultyCoordinator: 'Mr. Rajesh Khanna', studentCoordinator: 'Arjun Nair' },
    '103:5555555555': { name: 'Rohan Mehta', event: 'Kalakriti (Art)', timing: '12-14 Mar 2026', costume: 'Casual / smocks', seat: 'C-05', facultyCoordinator: 'Ms. Meera Desai', studentCoordinator: 'Priya Sharma' }
  };

  if (localStorage.getItem('parentLoggedIn') === 'true') {
    showParentDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roll = document.getElementById('rollNumber').value.trim();
    const phone = document.getElementById('parentPhone').value.trim();
    const password = document.getElementById('password') ? document.getElementById('password').value.trim() : '';
    const key = `${roll}:${phone}`;
    const studentData = studentDB[key];

    if (studentData) {
      localStorage.setItem('parentLoggedIn', 'true');
      localStorage.setItem('studentData', JSON.stringify(studentData));
      showParentDashboard();
    } else {
      alert('Invalid roll number or phone. Try:\nRoll 101 / Phone 1234567890\nRoll 102 / Phone 9876543210\nRoll 103 / Phone 5555555555');
    }
  });

  function showParentDashboard() {
    loginCard.style.display = 'none';
    dashboard.style.display = 'block';
    const data = JSON.parse(localStorage.getItem('studentData') || '{}');
    document.getElementById('studentName').textContent = data.name || '';
    document.getElementById('eventName').textContent = data.event || '';
    document.getElementById('eventTime').textContent = data.timing || '';
    document.getElementById('costume').textContent = data.costume || '';
    document.getElementById('seat').textContent = data.seat || '';
    document.getElementById('facultyCoord').textContent = data.facultyCoordinator || 'TBA';
    document.getElementById('studentCoord').textContent = data.studentCoordinator || 'TBA';
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('parentLoggedIn');
    localStorage.removeItem('studentData');
    dashboard.style.display = 'none';
    loginCard.style.display = 'block';
    loginForm.reset();
  });
}

// ===== COMMITTEE LOGIN =====
function initCommitteeLogin() {
  const loginForm = document.getElementById('committeeLoginForm');
  if (!loginForm) return;
  const loginCard = document.getElementById('loginCard');
  const dashboard = document.getElementById('dashboard');
  const logoutBtn = document.getElementById('logoutBtn');

  const validUsername = 'committee';
  const validPassword = 'fest2026';

  if (localStorage.getItem('committeeLoggedIn') === 'true') {
    showCommitteeDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username === validUsername && password === validPassword) {
      localStorage.setItem('committeeLoggedIn', 'true');
      showCommitteeDashboard();
    } else {
      alert('Invalid credentials. Use committee / fest2026');
    }
  });

  function showCommitteeDashboard() {
    loginCard.style.display = 'none';
    dashboard.style.display = 'block';
    document.getElementById('totalReg').textContent = '245';
    document.getElementById('totalTickets').textContent = '389';
    document.getElementById('eventCounts').textContent = 'Vivacé: 112, Abhinaya: 78, Kalakriti: 55';

    let events = JSON.parse(localStorage.getItem('committeeEvents')) || [
      { name: 'Vivacé', date: '12 Mar', registrations: 112 },
      { name: 'Abhinaya', date: '13 Mar', registrations: 78 },
      { name: 'Kalakriti', date: '12-14 Mar', registrations: 55 }
    ];
    renderEventList(events);
  }

  function renderEventList(events) {
    const tbody = document.querySelector('#eventsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    events.forEach((ev, index) => {
      const row = tbody.insertRow();
      row.innerHTML = `<td>${ev.name}</td><td>${ev.date}</td><td>${ev.registrations}</td>
        <td><button class="btn btn-sm btn-outline-light edit-event" data-index="${index}">Edit</button>
        <button class="btn btn-sm btn-outline-light delete-event" data-index="${index}">Delete</button></td>`;
    });

    document.querySelectorAll('.edit-event').forEach(btn => {
      btn.addEventListener('click', () => alert('Edit event (demo)'));
    });
    document.querySelectorAll('.delete-event').forEach(btn => {
      btn.addEventListener('click', () => alert('Delete event (demo)'));
    });
  }

  document.getElementById('addEventBtn')?.addEventListener('click', () => {
    alert('Add event form would appear (demo).');
  });
  document.getElementById('approveBtn')?.addEventListener('click', () => {
    alert('Registrations approved (demo).');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('committeeLoggedIn');
    dashboard.style.display = 'none';
    loginCard.style.display = 'block';
    loginForm.reset();
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollEffects();
  initHamburger();
  initSmoothScroll();
  initModals();
  initContactForm();
  initOrganizingLogin();
  initParentLogin();
  initCommitteeLogin();

  if (document.getElementById('ticketForm')) {
    initTicketForm();
  }
  if (document.getElementById('paymentSummary')) {
    initPayment();
  }
  if (document.getElementById('ticketDisplay')) {
    initTicketDisplay();
  }
});