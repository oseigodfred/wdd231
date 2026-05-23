/**
 * Accra Chamber of Commerce — home.js
 * - OpenWeatherMap weather + 3-day forecast
 * - Random Gold/Silver member spotlights
 * - Mobile nav
 * - Footer dates
 */

'use strict';

/* =============================================
   CONFIG
   ============================================= */
// Accra, Ghana coordinates
const LAT  = 5.6037;
const LON  = -0.1870;
const CITY = 'Accra';

// ⚠️  Replace with your own free key from openweathermap.org
const OWM_KEY = '7410541168338b7e6442fb916d1df184';

const MEMBERS_URL = 'data/members.json';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

const BIZ_ICONS = ['🏺', '💻', '💰', '🍽️', '🚢', '☀️', '📚', '👩‍🍳'];

const MEMBERSHIP_LABELS = {
  3: { label: 'Gold',   cls: 'badge-gold',   icon: '🥇' },
  2: { label: 'Silver', cls: 'badge-silver', icon: '🥈' },
  1: { label: 'Member', cls: 'badge-member', icon: '🏅' },
};

/* =============================================
   WEATHER
   ============================================= */
async function loadWeather() {
  const currentEl  = document.getElementById('weather-current');
  const forecastEl = document.getElementById('weather-forecast');
  
  if (!currentEl) return;

  // Show loading
  currentEl.innerHTML = `<div class="weather-loading">Loading weather…</div>`;

  // If no real key, use demo data
  if (!OWM_KEY || OWM_KEY === 'PASTE_YOUR_OWM_API_KEY_HERE') {
    renderDemoWeather(currentEl, forecastEl);
    return;
  }

  try {
    // Current weather + 5-day forecast
    const [curRes, foreRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${OWM_KEY}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&cnt=24&appid=${OWM_KEY}`)
    ]);

    if (!curRes.ok) throw new Error(`Weather API error ${curRes.status}`);

    const cur  = await curRes.json();
    const fore = await foreRes.json();

    renderCurrentWeather(currentEl, cur);
    renderForecast(forecastEl, fore);

  } catch (err) {
    console.error('Weather load failed:', err);
    currentEl.innerHTML = `<div class="weather-error">⚠️ Weather data unavailable.</div>`;
    renderDemoWeather(null, forecastEl);
  }
}

function renderCurrentWeather(el, data) {
  const temp      = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity  = data.main.humidity;
  const desc      = capitalizeFirst(data.weather[0].description);
  const icon      = WEATHER_ICONS[data.weather[0].icon] || '🌡️';
  const wind      = Math.round(data.wind.speed * 3.6); // m/s → km/h

  el.innerHTML = `
    <div class="weather-icon-wrap">${icon}</div>
    <div>
      <div class="weather-now-temp">${temp}°C</div>
      <div class="weather-now-desc">${desc}</div>
      <div class="weather-now-meta">
        <span>Feels like ${feelsLike}°C</span>
        <span>💧 ${humidity}%</span>
        <span>💨 ${wind} km/h</span>
      </div>
    </div>`;
}

function renderForecast(el, data) {
  if (!el || !data || !data.list) return;

  // Pick one reading per future day (around noon: 12:00)
  const days = {};
  const today = new Date().toDateString();

  for (const item of data.list) {
    const date = new Date(item.dt * 1000);
    const key  = date.toDateString();
    
    if (key === today) continue;
    
    // Prefer readings around noon
    const hour = date.getHours();
    if (!days[key] && hour >= 11 && hour <= 14) {
      days[key] = item;
    } else if (!days[key]) {
      days[key] = item;
    }
    
    if (Object.keys(days).length >= 3) break;
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  el.innerHTML = Object.values(days).map(item => {
    const d    = new Date(item.dt * 1000);
    const hi   = Math.round(item.main.temp_max);
    const lo   = Math.round(item.main.temp_min);
    const icon = WEATHER_ICONS[item.weather[0].icon] || '🌡️';
    
    return `
      <div class="forecast-day">
        <span class="f-label">${dayNames[d.getDay()]}</span>
        <span class="f-icon">${icon}</span>
        <span class="f-temp">${hi}°</span>
        <span class="f-lo">${lo}°</span>
      </div>`;
  }).join('');
}

function renderDemoWeather(curEl, foreEl) {
  // Realistic Accra demo data
  if (curEl) {
    curEl.innerHTML = `
      <div class="weather-icon-wrap">⛅</div>
      <div>
        <div class="weather-now-temp">31°C</div>
        <div class="weather-now-desc">Partly cloudy</div>
        <div class="weather-now-meta">
          <span>Feels like 35°C</span>
          <span>💧 78%</span>
          <span>💨 18 km/h</span>
        </div>
      </div>`;
  }
  
  if (foreEl) {
    const days = [
      { label: 'Tomorrow', icon: '🌦️', hi: 30, lo: 24 },
      { label: 'Wed',      icon: '⛅',  hi: 32, lo: 25 },
      { label: 'Thu',      icon: '☀️',  hi: 34, lo: 26 },
    ];
    
    foreEl.innerHTML = days.map(d => `
      <div class="forecast-day">
        <span class="f-label">${d.label}</span>
        <span class="f-icon">${d.icon}</span>
        <span class="f-temp">${d.hi}°</span>
        <span class="f-lo">${d.lo}°</span>
      </div>`).join('');
  }
}

/* =============================================
   SPOTLIGHTS
   ============================================= */
async function loadSpotlights() {
  const container = document.getElementById('spotlights-container');
  if (!container) return;

  container.innerHTML = `<div class="loading-state">Loading spotlights…</div>`;

  try {
    const res = await fetch(MEMBERS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    const members = Array.isArray(data) ? data : data.members || [];

    // Filter Gold (3) and Silver (2)
    const eligible = members.filter(m => m.membership >= 2);

    if (!eligible.length) {
      container.innerHTML = `<p class="weather-error">No qualified members found.</p>`;
      return;
    }

    // Shuffle and pick 2-3
    const shuffled = eligible.sort(() => Math.random() - 0.5);
    const picks    = shuffled.slice(0, 3);

    container.innerHTML = picks.map((m, i) => buildSpotlight(m, i)).join('');

  } catch (err) {
    console.error('Spotlights error:', err);
    container.innerHTML = `<p class="weather-error">⚠️ Spotlights unavailable.</p>`;
  }
}

function buildSpotlight(m, i) {
  const mem      = MEMBERSHIP_LABELS[m.membership] || MEMBERSHIP_LABELS[1];
  const icon     = BIZ_ICONS[i % BIZ_ICONS.length];
  const isSilver = m.membership === 2;
  const host     = getHostname(m.website);

  return `
    <article class="spotlight-card${isSilver ? ' silver-card' : ''}" role="listitem">
      <div class="spotlight-header">
        <div class="spotlight-logo" aria-hidden="true">${icon}</div>
        <div>
          <h3 class="spotlight-name">${escHtml(m.name)}</h3>
          <span class="membership-badge ${mem.cls}" title="${mem.label} Member">
            ${mem.icon} ${mem.label}
          </span>
        </div>
      </div>
      <div class="spotlight-info">
        <div class="spotlight-row">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5s1 3 5 5l.613-1.723a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <a href="tel:${escHtml(m.phone)}">${escHtml(m.phone)}</a>
        </div>
        <div class="spotlight-row">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <circle cx="12" cy="11" r="3"/>
          </svg>
          <span>${escHtml(m.address)}</span>
        </div>
        <div class="spotlight-row">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
          </svg>
          <a href="${escHtml(m.website)}" target="_blank" rel="noopener noreferrer">
            ${escHtml(host)}
          </a>
        </div>
      </div>
      <div class="spotlight-footer">
        <span class="spotlight-label">Featured Member</span>
      </div>
    </article>`;
}

/* =============================================
   MOBILE NAV
   ============================================= */
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

/* =============================================
   FOOTER DATES
   ============================================= */
function setFooterDates() {
  const yearEl = document.getElementById('copyright-year');
  const modEl  = document.getElementById('last-modified');
  
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  
  if (modEl) {
    const d = new Date(document.lastModified);
    modEl.textContent = d.toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/* =============================================
   UTILITIES
   ============================================= */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getHostname(url) {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setFooterDates();
  loadWeather();
  loadSpotlights();
});