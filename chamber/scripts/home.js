/**
 * Accra Chamber of Commerce — home.js
 * Fixed weather API logic, improved fetch handling,
 * cleaner path resolution, and safer rendering.
 */

'use strict';

/* ── CONFIG ── */
const LAT = 5.6037;
const LON = -0.1870;

/* Replace with your real OpenWeatherMap key */
const OWM_KEY = '47d913b19be86078ac3cf9f19504b4ed';

const MEMBERS_URL = './data/members.json';


const MEMBERS_URL = `${SCRIPT_DIR}data/members.json`;

/* ── WEATHER ICONS ── */
const WEATHER_ICONS = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '⛅',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️',
};

/* ── BUSINESS ICONS ── */
const BIZ_ICONS = ['🏺', '💻', '💰', '🍽️', '🚢', '☀️', '📚', '👩‍🍳'];

/* ── MEMBERSHIP ── */
const MEMBERSHIP = {
    3: { label: 'Gold', cls: 'badge-gold' },
    2: { label: 'Silver', cls: 'badge-silver' },
    1: { label: 'Member', cls: 'badge-member' },
};

/* ─────────────────────────────
   WEATHER
───────────────────────────── */
async function loadWeather() {
    const curEl = document.getElementById('weather-current');
    const foreEl = document.getElementById('weather-forecast');

    if (!curEl) return;

    curEl.innerHTML = `
    <div class="weather-loading">
      Loading weather...
    </div>
  `;

    /* Demo fallback */
    if (!OWM_KEY || OWM_KEY === '47d913b19be86078ac3cf9f19504b4ed') {
        renderDemoWeather(curEl, foreEl);
        return;
    }

    try {
        const currentURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${OWM_KEY}`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&cnt=24&appid=${OWM_KEY}`;

        const currentResponse = await fetch(currentURL);
        const forecastResponse = await fetch(forecastURL);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather API request failed');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        renderCurrentWeather(curEl, currentData);
        renderForecast(foreEl, forecastData);

    } catch (error) {
        console.error('Weather API error:', error);
        renderDemoWeather(curEl, foreEl);
    }
}

function renderCurrentWeather(el, data) {
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const wind = Math.round(data.wind.speed * 3.6);

    const icon =
        WEATHER_ICONS[data.weather[0].icon] || '🌡️';

    const desc = data.weather[0].description;

    el.innerHTML = `
    <div class="weather-icon-wrap">${icon}</div>

    <div>
      <div class="weather-now-temp">${temp}°C</div>

      <div class="weather-now-desc">
        ${esc(desc)}
      </div>

      <div class="weather-now-meta">
        <span>Feels like ${feels}°C</span>
        <span>💧 ${humidity}%</span>
        <span>💨 ${wind} km/h</span>
      </div>
    </div>
  `;
}

function renderForecast(el, data) {
    if (!el || !data.list) return;

    const today = new Date().toDateString();
    const forecastDays = {};

    for (const item of data.list) {
        const dateKey =
            new Date(item.dt * 1000).toDateString();

        if (dateKey === today) continue;

        if (
            !forecastDays[dateKey] &&
            Object.keys(forecastDays).length < 3
        ) {
            forecastDays[dateKey] = item;
        }
    }

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    el.innerHTML = Object.values(forecastDays)
        .map(item => {
            const date = new Date(item.dt * 1000);

            const icon =
                WEATHER_ICONS[item.weather[0].icon] || '🌡️';

            return `
        <div class="forecast-day">
          <span class="f-label">
            ${DAYS[date.getDay()]}
          </span>

          <span class="f-icon">${icon}</span>

          <span class="f-temp">
            ${Math.round(item.main.temp_max)}°
          </span>

          <span class="f-lo">
            ${Math.round(item.main.temp_min)}°
          </span>
        </div>
      `;
        })
        .join('');
}

/* ─────────────────────────────
   DEMO WEATHER
───────────────────────────── */
function renderDemoWeather(curEl, foreEl) {
    curEl.innerHTML = `
    <div class="weather-icon-wrap">⛅</div>

    <div>
      <div class="weather-now-temp">31°C</div>

      <div class="weather-now-desc">
        Partly cloudy
      </div>

      <div class="weather-now-meta">
        <span>Feels like 35°C</span>
        <span>💧 78%</span>
        <span>💨 18 km/h</span>
      </div>
    </div>
  `;

    if (!foreEl) return;

    const today = new Date();

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const demoForecast = [
        { icon: '🌦️', hi: 30, lo: 24 },
        { icon: '⛅', hi: 32, lo: 25 },
        { icon: '☀️', hi: 34, lo: 26 },
    ];

    foreEl.innerHTML = demoForecast
        .map((item, index) => {
            const date = new Date(today);

            date.setDate(today.getDate() + index + 1);

            return `
        <div class="forecast-day">
          <span class="f-label">
            ${DAYS[date.getDay()]}
          </span>

          <span class="f-icon">${item.icon}</span>

          <span class="f-temp">${item.hi}°</span>

          <span class="f-lo">${item.lo}°</span>
        </div>
      `;
        })
        .join('');
}

/* ─────────────────────────────
   SPOTLIGHTS
───────────────────────────── */
async function loadSpotlights() {
    const container =
        document.getElementById('spotlights-container');

    if (!container) return;

    try {
        const response = await fetch(MEMBERS_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const eligible = data.members.filter(
            member => member.membership >= 2
        );

        if (!eligible.length) {
            throw new Error('No spotlight members found');
        }

        eligible.sort(() => Math.random() - 0.5);

        const selected = eligible.slice(0, 3);

        container.innerHTML = selected
            .map((member, index) =>
                buildSpotlight(member, index)
            )
            .join('');

    } catch (error) {
        console.error('Spotlight error:', error);

        container.innerHTML = `
      <p class="weather-error">
        ⚠️ Member spotlights unavailable.
      </p>
    `;
    }
}

function buildSpotlight(member, index) {
    const membership =
        MEMBERSHIP[member.membership] || MEMBERSHIP[1];

    const icon =
        BIZ_ICONS[index % BIZ_ICONS.length];

    let hostname = member.website;

    try {
        hostname = new URL(member.website).hostname;
    } catch {
        hostname = member.website;
    }

    return `
    <article class="spotlight-card">
      <div class="spotlight-header">
        <div class="spotlight-logo">
          ${icon}
        </div>

        <div>
          <h3 class="spotlight-name">
            ${esc(member.name)}
          </h3>

          <span class="membership-badge ${membership.cls}">
            ${membership.label} Member
          </span>
        </div>
      </div>

      <div class="spotlight-info">

        <div class="spotlight-row">
          <a href="tel:${esc(member.phone)}">
            ${esc(member.phone)}
          </a>
        </div>

        <div class="spotlight-row">
          ${esc(member.address)}
        </div>

        <div class="spotlight-row">
          <a
            href="${esc(member.website)}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit ${esc(member.name)} website"
          >
            ${esc(hostname)}
          </a>
        </div>

      </div>
    </article>
  `;
}

/* ─────────────────────────────
   MOBILE NAV
───────────────────────────── */
function initNav() {
    const toggle =
        document.getElementById('menu-toggle');

    const nav =
        document.getElementById('main-nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');

        toggle.setAttribute(
            'aria-expanded',
            String(isOpen)
        );
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');

            toggle.setAttribute(
                'aria-expanded',
                'false'
            );
        });
    });
}

/* ─────────────────────────────
   FOOTER
───────────────────────────── */
function setFooterDates() {
    const yearEl =
        document.getElementById('copyright-year');

    const modEl =
        document.getElementById('last-modified');

    if (yearEl) {
        yearEl.textContent =
            new Date().getFullYear();
    }

    if (modEl) {
        const modifiedDate =
            new Date(document.lastModified);

        modEl.textContent =
            modifiedDate.toLocaleDateString(
                'en-GH',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
            );
    }
}

/* ─────────────────────────────
   ESCAPE HTML
───────────────────────────── */
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ─────────────────────────────
   INIT
───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    setFooterDates();
    loadWeather();
    loadSpotlights();
});