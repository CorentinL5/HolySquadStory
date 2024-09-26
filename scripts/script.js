function formatDate(date) {
  // Convertir la date en objet Date
  const jsDate = new Date(date);

  // Vérifier si l'heure est 00:00
  const isMidnight = jsDate.getHours() === 0 && jsDate.getMinutes() === 0;

  // Définir les options pour le formatage de la date
  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  // Ajouter l'heure aux options seulement si ce n'est pas minuit
  if (!isMidnight) {
    dateOptions.hour = 'numeric';
    dateOptions.minute = 'numeric';
  }

  // Formatter la date en utilisant les options
  return jsDate.toLocaleString('fr-BE', dateOptions);
}

// Fonction pour créer un événement dans la timeline
function createEvent(event) {
    if (event.title && event.date.match(dateRegex)) {

        const eventElement = document.createElement('li');
        if (event.title === "<hr>") {
            eventElement.style.textAlign = "center";
            eventElement.style.fontSize = "2.5em";
            const year = new Date(event.date).getFullYear();
            eventElement.innerHTML = `<b>${year}</b><hr>`;
            eventElement.id = year;
        } else {
            const direction = document.createElement('div');
            if (side === "r") {
                side = "l";
            } else {
                side = "r";
            }
            direction.className = 'direction-' + side;

            const flagWrapper = document.createElement('div');
            flagWrapper.className = 'flag-wrapper';

            const hexa = document.createElement('span');
            hexa.className = 'hexa';
            flagWrapper.appendChild(hexa);

            const flag = document.createElement('span');
            flag.className = 'flag';
            flag.textContent = event.title;
            flagWrapper.appendChild(flag);

            const timeWrapper = document.createElement('span');
            timeWrapper.className = 'time-wrapper';

            const time = document.createElement('span');
            time.className = 'time';
            time.textContent = formatDate(event.date);
            timeWrapper.appendChild(time);
            flagWrapper.appendChild(timeWrapper);
            direction.appendChild(flagWrapper);

            if (event.description) {
                let desc;
                if (event.link) {
                    desc = document.createElement('a');
                    desc.href = event.link
                    desc.target = '_blank';
                    desc.rel = 'noopener noreferrer';
                } else {
                    desc = document.createElement('p');
                }
                desc.className = 'desc';
                desc.innerHTML = event.description;
                if (event.image) {
                    desc.innerHTML += "<br>";
                    const img = document.createElement('img');
                    img.src = event.image;
                    img.alt = event.title;
                    desc.appendChild(img);
                }
                direction.appendChild(desc);
            }
            eventElement.appendChild(direction);
        }





        document.getElementById('timeline').appendChild(eventElement);
    }
}

const dateRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/;
let side = "r";
// Charger les événements depuis le JSON
fetch('events.json')
    .then(response => response.json())
    .then(data => {
        // Trier les événements par date
        data.sort((a, b) => {
            // Extraire les dates et heures et les convertir en objets Date
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            console.log(dateA, dateB);
            return dateA - dateB; // Comparer les dates
        });

        // Créer les événements triés
        data.forEach(event => createEvent(event));
        console.log('Events loaded and sorted');
    })
    .catch(error => console.error('Error loading events:', error));