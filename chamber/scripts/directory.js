/**
 * Accra Chamber of Commerce — directory.js
 * Handles: fetch members, grid/list toggle, footer dates
 */

'use strict';

/* ---- Config ---- */
const DATA_URL = 'data/members.json';

const MEMBERSHIP_LABELS = {
  3: { label: 'Gold',   cls: 'badge-gold',   icon: '🥇' },
  2: { label: 'Silver', cls: 'badge-silver', icon: '🥈' },
  1: { label: 'Member', cls: 'badge-member', icon: '🏅' },
};

// Business emoji icons keyed loosely by membership/index for visual variety
const BIZ_ICONS = ['🏺', '💻', '💰', '🍽️', '🚢', '☀️', '📚', '👩‍🍳'];

/* ---- DOM refs ---- */
const container   = document.getElementById('members-container');
const btnGrid     = document.getElementById('btn-grid');
const btnList     = document.getElementById('btn-list');

/* ==============================
   FETCH + RENDER
   ============================== */
async function loadMembers() {
  showLoading();
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { members } = await res.json();
    renderMembers(members);
  } catch (err) {
    showError(err);
  }
}

function renderMembers(members) {
  container.innerHTML = members
    .map((m, i) => buildCard(m, i))
    .join('');
}

function buildCard(m, i) {
  const mem  = MEMBERSHIP_LABELS[m.membership] || MEMBERSHIP_LABELS[1];
  const icon = BIZ_ICONS[i % BIZ_ICONS.length];
  const host = (() => {
    try { return new URL(m.website).hostname; } catch { return m.website; }
  })();

  return `
    <article class="member-card" role="listitem">
      <div class="card-img-wrap" aria-hidden="true">${icon}</div>
      <div class="card-body">
        <div class="card-header">
          <h3 class="card-name">${escHtml(m.name)}</h3>
          <span class="membership-badge ${mem.cls}" title="${mem.label} Member">
            ${mem.icon} ${mem.label}
          </span>
        </div>
        <p class="card-tagline">${escHtml(m.tagline)}</p>
        <div class="card-info">
          <div class="card-info-row">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <circle cx="12" cy="11" r="3"/>
            </svg>
            <span>${escHtml(m.address)}</span>
          </div>
          <div class="card-info-row">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5s1 3 5 5l.613-1.723a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <a href="tel:${escHtml(m.phone)}">${escHtml(m.phone)}</a>
          </div>
          <div class="card-info-row">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
            <a href="${escHtml(m.website)}" target="_blank" rel="noopener noreferrer">${escHtml(host)}</a>
          </div>
        </div>
      </div>
    </article>`;
}

/* ---- UI states ---- */
function showLoading() {
  container.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p>Loading chamber members…</p>
    </div>`;
}

function showError(err) {
  console.error('Failed to load members:', err);
  container.innerHTML = `
    <div class="error-state" role="alert">
      <strong>Unable to load members.</strong>
      <p>Please check your connection and try refreshing the page.</p>
    </div>`;
}

/* ==============================
   VIEW TOGGLE
   ============================== */
function setView(view) {
  container.classList.remove('grid-view', 'list-view');
  container.classList.add(`${view}-view`);
  container.setAttribute('role', 'list');

  btnGrid.classList.toggle('active', view === 'grid');
  btnList.classList.toggle('active', view === 'list');

  btnGrid.setAttribute('aria-pressed', String(view === 'grid'));
  btnList.setAttribute('aria-pressed', String(view === 'list'));

  localStorage.setItem('chamberView', view);
}

btnGrid.addEventListener('click', () => setView('grid'));
btnList.addEventListener('click', () => setView('list'));

/* ==============================
   FOOTER DATES
   ============================== */
function setFooterDates() {
  const yearEl = document.getElementById('copyright-year');
  const modEl  = document.getElementById('last-modified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (modEl) {
    const d = new Date(document.lastModified);
    modEl.textContent = d.toLocaleDateString('en-GH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}

/* ==============================
   MOBILE NAV
   ============================== */
function initNav() {
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- Utility ---- */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

'use strict';

/* ==============================
   WEATHER
   ============================== */

const apiKey = 'YOUR_API_KEY';
const weatherUrl =
  `https://api.openweathermap.org/data/2.5/forecast?q=Accra,GH&units=metric&appid=${apiKey}`;

async function loadWeather() {
  try {
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error('Weather data failed');
    }

    const data = await response.json();

    displayWeather(data);
  } catch (error) {
    console.error(error);
  }
}

function displayWeather(data) {
  const currentTemp = document.getElementById('current-temp');
  const weatherDesc = document.getElementById('weather-desc');
  const forecastList = document.getElementById('forecast-list');

  currentTemp.textContent =
    `${Math.round(data.list[0].main.temp)}°C`;

  weatherDesc.textContent =
    data.list[0].weather[0].description;

  forecastList.innerHTML = '';

  const forecastIndexes = [8, 16, 24];

  forecastIndexes.forEach(index => {
    const item = data.list[index];

    const date = new Date(item.dt_txt);

    const li = document.createElement('li');

    li.innerHTML = `
      <strong>
        ${date.toLocaleDateString('en-GH', { weekday: 'long' })}
      </strong>:
      ${Math.round(item.main.temp)}°C
    `;

    forecastList.appendChild(li);
  });
}

/* ==============================
   MEMBER SPOTLIGHTS
   ============================== */

const spotlightContainer =
  document.getElementById('spotlights-container');

async function loadSpotlights() {
  try {
    const response =
      await fetch('data/members.json');

    if (!response.ok) {
      throw new Error('Members data failed');
    }

    const data = await response.json();

    displaySpotlights(data.members);
  } catch (error) {
    console.error(error);
  }
}

function displaySpotlights(members) {

  const qualifiedMembers = members.filter(member =>
    member.membership === 2 ||
    member.membership === 3
  );

  const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());

  const selected =
    shuffled.slice(0, Math.floor(Math.random() * 2) + 2);

  spotlightContainer.innerHTML = '';

  selected.forEach(member => {

    const level =
      member.membership === 3 ? 'Gold' : 'Silver';

    const card = document.createElement('article');

    card.classList.add('spotlight-card');

    card.innerHTML = `
      <img
        src="${member.image}"
        alt="${member.name} logo"
        loading="lazy"
      >

      <h3>${member.name}</h3>

      <p>${member.address}</p>

      <p>${member.phone}</p>

      <p>
        <a href="${member.website}" target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
      </p>

      <p><strong>${level} Member</strong></p>
    `;

    spotlightContainer.appendChild(card);
  });
}

/* ==============================
   INIT
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

  loadWeather();

  loadSpotlights();
});

/* ==============================
   INIT
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setFooterDates();

  // Restore saved view preference, default to grid
  const savedView = localStorage.getItem('chamberView') || 'grid';
  setView(savedView);

  loadMembers();
});