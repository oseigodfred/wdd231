/**
 * Accra Chamber of Commerce — directory.js
 * Fully fixed version
 */

'use strict';

/* ── CONFIG ── */
const SCRIPT_DIR = (() => {
    const currentScript = document.currentScript;

    if (currentScript && currentScript.src) {
        return currentScript.src.replace(
            /(js|scripts)\/directory\.js.*$/,
            ''
        );
    }

    return './';
})();

const DATA_URL = `${SCRIPT_DIR}data/members.json`;

const MEMBERSHIP = {
    3: {
        label: 'Gold',
        cls: 'badge-gold',
        icon: '🥇'
    },
    2: {
        label: 'Silver',
        cls: 'badge-silver',
        icon: '🥈'
    },
    1: {
        label: 'Member',
        cls: 'badge-member',
        icon: '🏅'
    }
};

const BIZ_ICONS = [
    '🏺',
    '💻',
    '💰',
    '🍽️',
    '🚢',
    '☀️',
    '📚',
    '👩‍🍳'
];

/* ── DOM ── */
const container =
    document.getElementById('members-container');

const btnGrid =
    document.getElementById('btn-grid');

const btnList =
    document.getElementById('btn-list');

/* ── FETCH + RENDER ── */
async function loadMembers() {

    if (!container) return;

    showLoading();

    try {

        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const data = await response.json();

        if (
            !data.members ||
            !Array.isArray(data.members)
        ) {
            throw new Error(
                'Invalid members data'
            );
        }

        renderMembers(data.members);

    } catch (error) {

        console.error(
            'Members load failed:',
            error
        );

        showError();
    }
}

function renderMembers(members) {

    if (!container) return;

    container.innerHTML = members
        .map((member, index) =>
            buildCard(member, index)
        )
        .join('');
}

function buildCard(member, index) {

    const membership =
        MEMBERSHIP[member.membership] ||
        MEMBERSHIP[1];

    const icon =
        BIZ_ICONS[index % BIZ_ICONS.length];

    let website = member.website || '#';

    if (
        website !== '#' &&
        !website.startsWith('http://') &&
        !website.startsWith('https://')
    ) {
        website = `https://${website}`;
    }

    let hostname = website;

    try {
        hostname = new URL(website).hostname;
    } catch (error) {
        hostname = website;
    }

    return `
    <article class="member-card" role="listitem">

      <div class="card-img-wrap" aria-hidden="true">
        ${icon}
      </div>

      <div class="card-body">

        <div class="card-header">

          <h3 class="card-name">
            ${esc(member.name || 'Business Name')}
          </h3>

          <span class="membership-badge ${membership.cls}">
            ${membership.icon} ${membership.label}
          </span>

        </div>

        <p class="card-tagline">
          ${esc(
        member.tagline ||
        'Local Chamber Member'
    )}
        </p>

        <div class="card-info">

          <div class="card-info-row">
            <span>📍</span>

            <span>
              ${esc(
        member.address ||
        'Address unavailable'
    )}
            </span>
          </div>

          <div class="card-info-row">
            <span>📞</span>

            <a href="tel:${esc(member.phone || '')}">
              ${esc(member.phone || 'No phone')}
            </a>
          </div>

          <div class="card-info-row">
            <span>🌐</span>

            <a
              href="${esc(website)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${esc(hostname)}
            </a>
          </div>

        </div>

      </div>
    </article>
  `;
}

function showLoading() {
  if (!container) return;

  container.innerHTML = `
    <div
      class="loading-state"
      role="status"
      aria-live="polite"
    >
      <div
        class="spinner"
        aria-hidden="true"
      ></div>

      <p>Loading chamber members...</p>
    </div>
  `;
}

function showError() {

    if (!container) return;

    container.innerHTML = `
    <div
      class="error-state"
      role="alert"
    >
      <strong>
        Unable to load members.
      </strong>

      <p>
        Please refresh the page.
      </p>
    </div>
  `;
}

/* ── VIEW TOGGLE ── */
function setView(view) {

    if (!container) return;

    const validView =
        view === 'list'
            ? 'list'
            : 'grid';

    container.classList.remove(
        'grid-view',
        'list-view'
    );

    container.classList.add(
        `${validView}-view`
    );

    container.setAttribute(
        'role',
        'list'
    );

    if (btnGrid) {

        btnGrid.classList.toggle(
            'active',
            validView === 'grid'
        );

        btnGrid.setAttribute(
            'aria-pressed',
            String(validView === 'grid')
        );
    }

    if (btnList) {

        btnList.classList.toggle(
            'active',
            validView === 'list'
        );

        btnList.setAttribute(
            'aria-pressed',
            String(validView === 'list')
        );
    }

    try {
        localStorage.setItem(
            'chamberView',
            validView
        );
    } catch (error) {
        console.warn(
            'Local storage unavailable'
        );
    }
}

/* ── BUTTON EVENTS ── */
if (btnGrid) {

    btnGrid.addEventListener(
        'click',
        () => {
            setView('grid');
        }
    );
}

if (btnList) {

    btnList.addEventListener(
        'click',
        () => {
            setView('list');
        }
    );
}

/* ── FOOTER ── */
function setFooterDates() {

    const yearEl =
        document.getElementById(
            'copyright-year'
        );

    const modEl =
        document.getElementById(
            'last-modified'
        );

    if (yearEl) {
        yearEl.textContent =
            new Date().getFullYear();
    }

    if (modEl) {

        const modified =
            new Date(document.lastModified);

        const validDate =
            !isNaN(modified.getTime());

        modEl.textContent = validDate
            ? modified.toLocaleDateString(
                'en-GH',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }
            )
            : 'Recently updated';
    }
}

/* ── MOBILE NAV ── */
function initNav() {

    const toggle =
        document.getElementById(
            'menu-toggle'
        );

    const nav =
        document.getElementById(
            'main-nav'
        );

    if (!toggle || !nav) return;

    toggle.addEventListener(
        'click',
        () => {

            const open =
                nav.classList.toggle('open');

            toggle.setAttribute(
                'aria-expanded',
                String(open)
            );
        }
    );

    nav.querySelectorAll('a')
        .forEach(link => {

            link.addEventListener(
                'click',
                () => {

                    nav.classList.remove('open');

                    toggle.setAttribute(
                        'aria-expanded',
                        'false'
                    );
                }
            );
        });
}

/* ── UTILITY ── */
function esc(str = '') {

    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ── INIT ── */
document.addEventListener(
    'DOMContentLoaded',
    () => {

        initNav();

        setFooterDates();

        let savedView = 'grid';

        try {

            savedView =
                localStorage.getItem(
                    'chamberView'
                ) || 'grid';

        } catch (error) {

            console.warn(
                'Could not access localStorage'
            );
        }

        setView(savedView);

        loadMembers();
    }
);