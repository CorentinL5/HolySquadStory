// Function to format a date
function formatDate(date, lang = "en-US") {
    const jsDate = new Date(date);
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric' };

    // Formate la date (jour, mois, année)
    const formattedDate = jsDate.toLocaleDateString(lang, dateOptions);

    // Vérifie si l'heure est 00:00
    const isMidnight = jsDate.getHours() === 0 && jsDate.getMinutes() === 0;

    // Si ce n'est pas minuit, formate l'heure
    const formattedTime = !isMidnight ? jsDate.toLocaleTimeString(lang, timeOptions) : null;

    return { date: formattedDate, time: formattedTime };
}

// Function to create an event
function createEvent(event) {
    if (event.title && event.date.match(dateRegex)) {
        const HolySquadStory = document.getElementById('HolySquadStory');
        const eventYear = new Date(event.date).getFullYear();
        const { date: eventDate, time: eventTime } = formatDate(event.date);

        // Sélectionner la couleur de l'événement
        const color = holyEventsColors[event.event] || holyEventsColors["Other"];

        // Cherche si l'année existe déjà dans la timeline
        let timelineYear = document.getElementById(`year-${eventYear}`);
        if (!timelineYear) {
            timelineYear = document.createElement('div');
            timelineYear.id = `year-${eventYear}`;
            timelineYear.className = 'timeline-year';
            timelineYear.innerHTML = `<h2>${eventYear}</h2>`;
            HolySquadStory.appendChild(timelineYear);
        }

        // Cherche si une section pour la même date existe déjà
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

        // Création du conteneur pour l'événement
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.style.borderLeft = `5px solid ${color}`; // Appliquer la couleur de l'événement

        // Ajout de l'en-tête de l'événement (titre)
        const header = document.createElement('div');
        header.className = 'event-header';

        const title = document.createElement('h3');
        title.className = 'event-title';
        title.textContent = event.title;

        // Ajout de l'heure si elle existe
        if (eventTime) {
            const timeElement = document.createElement('span');
            timeElement.className = 'event-time';
            timeElement.textContent = eventTime;
            header.appendChild(timeElement);
        }

        header.appendChild(title);
        eventElement.appendChild(header);

        // Ajout de la description si elle existe
        if (event.description) {
            const description = document.createElement('p');
            description.className = 'event-description';
            description.innerHTML = event.description;
            eventElement.appendChild(description);
        }

        // Ajout de l'image si elle existe
        if (event.image) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'event-image';

            const image = document.createElement('img');
            image.src = event.image;
            image.alt = event.title;

            imageDiv.appendChild(image);
            eventElement.appendChild(imageDiv);
        }

        // Ajout du lien si disponible
        if (event.links.length > 0) {
            const linksDiv = document.createElement('div');
            linksDiv.className = 'event-links';

            event.links.forEach(link => {
                console.log(link);
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.title;
                linkElement.target = '_blank';
                linksDiv.appendChild(linkElement);
            });

            eventElement.appendChild(linksDiv);
        }

        // Ajoute l'événement au conteneur de la date correspondante
        dateContainer.appendChild(eventElement);
    }
}


const dateRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/;
const holyEventsColors = {
    "HolySquadStory" : "#C1ADE6",
    "HolySquad": "#FDD600",
    "HolyEnergy": "#FE3183",
    "HolyIcedTea": "#A97BD4",
    "HolyHydration": "#01C5FE",
    "Other": "#646464"
};

// Load events from JSON file
fetch('json/events.json')
    .then(response => response.json())
    .then(data => {
        // Trier les événements par date
        data.sort((a, b) => {
            // Extraire les dates et heures et les convertir en objets Date
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB; // Comparer les dates
        });

        // Créer les événements triés
        data.forEach(event => createEvent(event));
        console.log('Events loaded and sorted');
    })
    .catch(error => console.error('Error loading events:', error));
