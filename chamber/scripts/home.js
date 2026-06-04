'use strict';

/* ===========================
   WEATHER
=========================== */

const API_KEY = '47d913b19be86078ac3cf9f19504b4ed';
const LAT = 5.6037;
const LON = -0.1870;

async function getWeather() {
    const weatherContainer = document.querySelector('#weather-container');

    try {
        const currentURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentURL),
            fetch(forecastURL)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather data unavailable');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);

    } catch (error) {
        console.error(error);

        weatherContainer.innerHTML = `
            <div class="weather-error">
                Weather information is currently unavailable.
            </div>
        `;
    }
}

function displayWeather(current, forecast) {

    const weatherContainer =
        document.querySelector('#weather-container');

    const forecastDays = [
        forecast.list[8],
        forecast.list[16],
        forecast.list[24]
    ];

    const iconCode = current.weather[0].icon;
    const iconURL =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherContainer.innerHTML = `
        <div class="weather-card">

            <div class="weather-current">

                <div class="weather-icon-wrap">
                    <img
                        src="${iconURL}"
                        alt="${current.weather[0].description}"
                        width="80"
                        height="80">
                </div>

                <div>
                    <div class="weather-now-temp">
                        ${Math.round(current.main.temp)}°C
                    </div>

                    <div class="weather-now-desc">
                        ${current.weather[0].description}
                    </div>

                    <div class="weather-now-meta">
                        <span>Humidity: ${current.main.humidity}%</span>
                        <span>Wind: ${Math.round(current.wind.speed)} m/s</span>
                    </div>
                </div>

            </div>

            <div class="weather-forecast">

                ${forecastDays.map(day => `
                    <div class="forecast-day">

                        <span class="f-label">
                            ${new Date(day.dt_txt).toLocaleDateString(
        'en-US',
        { weekday: 'short' }
    )}
                        </span>

                        <span class="f-temp">
                            ${Math.round(day.main.temp)}°C
                        </span>

                    </div>
                `).join('')}

            </div>

        </div>
    `;
}

/* ===========================
   MEMBER SPOTLIGHTS
=========================== */

async function loadSpotlights() {

    try {

        const response =
            await fetch('data/members.json');

        if (!response.ok) {
            throw new Error('Member data unavailable');
        }

        const data = await response.json();

        const qualifiedMembers =
            data.members.filter(member =>
                member.membership === 'Gold' ||
                member.membership === 'Silver'
            );

        qualifiedMembers.sort(() => Math.random() - 0.5);

        const selectedMembers =
            qualifiedMembers.slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {

        console.error(error);

        document.querySelector('#spotlights-container').innerHTML =
            '<p>Unable to load member spotlights.</p>';
    }
}

function displaySpotlights(members) {

    const container =
        document.querySelector('#spotlights-container');

    container.innerHTML = '';

    members.forEach(member => {

        const badgeClass =
            member.membership === 'Gold'
                ? 'badge-gold'
                : 'badge-silver';

        const cardClass =
            member.membership === 'Gold'
                ? 'spotlight-card'
                : 'spotlight-card silver-card';

        const card =
            document.createElement('article');

        card.className = cardClass;

        card.innerHTML = `
            <div class="spotlight-header">

                <div class="spotlight-logo">
                    <img
                        src="images/${member.image}"
                        alt="${member.name} logo"
                        loading="lazy"
                        width="56"
                        height="56">
                </div>

                <div>
                    <h3 class="spotlight-name">
                        ${member.name}
                    </h3>

                    <p class="card-tagline">
                        ${member.tagline}
                    </p>
                </div>

            </div>

            <div class="spotlight-info">

                <div class="spotlight-row">
                    <span class="icon">📞</span>
                    <span>${member.phone}</span>
                </div>

                <div class="spotlight-row">
                    <span class="icon">📍</span>
                    <span>${member.address}</span>
                </div>

                <div class="spotlight-row">
                    <span class="icon">🌐</span>

                    <a href="${member.website}"
                       target="_blank"
                       rel="noopener noreferrer">
                       Website
                    </a>
                </div>

            </div>

            <div class="spotlight-footer">

                <span class="spotlight-label">
                    Featured Member
                </span>

                <span class="membership-badge ${badgeClass}">
                    ${member.membership}
                </span>

            </div>
        `;

        container.appendChild(card);
    });
}

/* ===========================
   INITIALIZE
=========================== */

document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    loadSpotlights();
});