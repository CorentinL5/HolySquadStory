// Function to format a date according to the selected language
function formatDate(date, lang = "en-US") {
    const jsDate = new Date(date);
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric' };

    // Format the date (day, month, year)
    const formattedDate = jsDate.toLocaleDateString(lang, dateOptions);

    // Check if the time is midnight
    const isMidnight = jsDate.getHours() === 0 && jsDate.getMinutes() === 0;

    // Format the time if it's not midnight
    const formattedTime = !isMidnight ? jsDate.toLocaleTimeString(lang, timeOptions) : null;

    return { date: formattedDate, time: formattedTime };
}

// Function to create or update an event
function createOrUpdateEvent(event, index, language) {
    const HolySquadStory = document.getElementById('HolySquadStory');
    const eventYear = new Date(event.date).getFullYear();
    const { date: eventDate, time: eventTime } = formatDate(event.date, language);

    // Select the color of the event
    const color = holyEventsColors[event.event] || holyEventsColors["Other"];

    // Check if the year already exists in the timeline
    let timelineYear = document.getElementById(`year-${eventYear}`);
    if (!timelineYear) {
        timelineYear = document.createElement('div');
        timelineYear.id = `year-${eventYear}`;
        timelineYear.className = 'timeline-year';
        timelineYear.innerHTML = `<h2>${eventYear}</h2>`;
        HolySquadStory.appendChild(timelineYear);
    }

    // Check if a section for the same date exists already
    let dateContainer = timelineYear.querySelector(`[data-date='${eventDate}']`);
    if (!dateContainer) {
        dateContainer = document.createElement('div');
        dateContainer.className = 'date-container';
        dateContainer.setAttribute('data-date', eventDate);

        const dateHeader = document.createElement('div');
        dateHeader.className = 'date-header';
        dateHeader.textContent = eventDate;

        dateContainer.appendChild(dateHeader);
        timelineYear.appendChild(dateContainer);
    }

    // Check if the event element already exists, otherwise create it
    let eventElement = dateContainer.querySelector(`[data-index='${index}']`);
    if (!eventElement) {
        eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.setAttribute('data-index', index);
        eventElement.style.borderLeft = `5px solid ${color}`; // Apply event color
    } else {
        // Clear existing content (in case we're updating an existing event)
        eventElement.innerHTML = '';
    }

    // Add the event header (title and time)
    const header = document.createElement('div');
    header.className = 'event-header';

    const title = document.createElement('h3');
    title.className = 'event-title';
    title.textContent = event.title;

    // Add time if it exists
    if (eventTime) {
        const timeElement = document.createElement('span');
        timeElement.className = 'event-time';
        timeElement.textContent = eventTime;
        header.appendChild(timeElement);
    }

    header.appendChild(title);
    eventElement.appendChild(header);

    // Add description if it exists
    if (event.description) {
        const description = document.createElement('p');
        description.className = 'event-description';
        description.innerHTML = event.description;
        eventElement.appendChild(description);
    }

    // Add image if it exists
    if (event.image) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'event-image';

        const image = document.createElement('img');
        image.src = event.image;
        image.alt = event.title;

        imageDiv.appendChild(image);
        eventElement.appendChild(imageDiv);
    }

    // Add links if they exist
    if (event.links.length > 0) {
        const linksDiv = document.createElement('div');
        linksDiv.className = 'event-links';

        event.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.textContent = link.item;
            linkElement.target = '_blank';
            linksDiv.appendChild(linkElement);
        });

        eventElement.appendChild(linksDiv);
    }

    // Append the event to the date container
    if (!dateContainer.contains(eventElement)) {
        dateContainer.appendChild(eventElement);
    }
}

// Function to load and update events dynamically based on language
function loadEvents(language) {
    fetch(`json/lang-${language}.json`)
        .then(response => response.json())
        .then(data => {
            // Clear existing events before reloading
            const HolySquadStory = document.getElementById('HolySquadStory');
            HolySquadStory.innerHTML = '';

            // Sort the events by date
            data["events"].sort((a, b) => new Date(a.date) - new Date(b.date));

            // Create or update the sorted events
            data["events"].forEach((event, index) => createOrUpdateEvent(event, index, language));
            console.log('Events loaded and sorted');
        })
        .catch(error => console.error('Error loading events:', error));
}


// Event colors for different categories
const holyEventsColors = {
    "HolySquadStory": "#C1ADE6",
    "HolySquad": "#FDD600",
    "HolyEnergy": "#FE3183",
    "HolyIcedTea": "#A97BD4",
    "HolyHydration": "#01C5FE",
    "Other": "#646464"
};
