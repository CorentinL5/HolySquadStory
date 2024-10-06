let currentLanguage = localStorage.getItem('language') || 'en'; // Default language is English

// Function to load the language file and update the content
function loadLanguage(language) {
    const langFile = `json/lang-${language}.json`;

    fetch(langFile)
        .then(response => response.json())
        .then(translations => {
            // Update static site content
            document.querySelector('[data-translate="header"]').textContent = translations.header;
            document.querySelector('[data-translate="githubProject"]').textContent = translations.githubProject;

            // Update event titles and descriptions using data-index
            document.querySelectorAll('.event').forEach(eventElement => {
                const eventIndex = eventElement.getAttribute('data-index'); // Using data-index
                const eventTranslation = translations.events[eventIndex];
                if (eventTranslation) {
                    eventElement.querySelector('.event-title').textContent = eventTranslation.title;
                    eventElement.querySelector('.event-description').innerHTML = eventTranslation.description;
                }
            });

            console.log(`Language switched to: ${language}`);
        })
        .catch(error => console.error('Error loading language file:', error));

    localStorage.setItem('language', language); // Save the selected language
}

function LoadAllLanguages(language) {
    loadLanguage(language);
    loadEvents(language);
    // Update .active class for the selected language
    document.getElementById('switchLanguage').querySelectorAll('button').forEach((element) => {
        element.className = "";
        if (element.getAttribute('data-lang') === currentLanguage) {
            element.className = "active";
        }
    });
}

// Function to handle language switching
function switchLanguage(language) {
    if (language !== currentLanguage) {
        currentLanguage = language;
        LoadAllLanguages(language);
    }
}

// Function to check if a file exists
function checkIfFileExists(url) {
    return fetch(url, { method: 'HEAD' })  // Use HEAD to only fetch headers
        .then(response => response.ok)  // Return true if the status is 200-299
        .catch(() => false);  // Return false if there's an error or file doesn't exist
}


function createSwitchLanguageButtons() {
    const switchLanguageElement = document.getElementById('switchLanguage');

    const languages = ['en', 'fr', 'de'];  // Add any other languages if needed

    languages.forEach(language => {
        const fileUrl = `json/lang-${language}.json`;  // Dynamically build the file URL

        checkIfFileExists(fileUrl).then(exists => {
            if (exists) {
                console.log(`${fileUrl} exists!`);

                // Create a button for each available language
                const button = document.createElement('button');
                button.innerHTML = `<img src="assets/flags/flag-${language}.svg" alt="${language} Flag">`;
                button.setAttribute('data-lang', language);
                button.className = language === currentLanguage ? 'active' : '';  // Add .active class to the current language

                // Add a click event to switch the language when the button is clicked
                button.addEventListener('click', () => switchLanguage(language));

                // Append the button to the switch language container
                switchLanguageElement.appendChild(button);
            } else {
                console.log(`${fileUrl} does not exist.`);
            }
        }).catch(error => {
            console.error(`Error checking if ${fileUrl} exists:`, error);
        });
    });
}

// Initial load of the language when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    createSwitchLanguageButtons();
    LoadAllLanguages(currentLanguage);
});

