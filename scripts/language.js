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
        element.className="";
        if (element.getAttribute('data-lang') === currentLanguage) {
            element.className="active";
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

function createSwitchLanguageButtons() {
    const switchLanguageElement = document.getElementById('switchLanguage');

    const languages = ['en'];


    languages.forEach(language => {
        const button = document.createElement('button');
        button.innerHTML = `<img src="assets/flags/flag-${language}.svg" alt="${language} Flag">`
        button.setAttribute('data-lang', language);
        button.addEventListener('click', () => switchLanguage(language));
        switchLanguageElement.appendChild(button);
    });
}


// Initial load of the language when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    createSwitchLanguageButtons();
    LoadAllLanguages(currentLanguage);
});

