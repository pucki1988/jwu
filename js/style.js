document.addEventListener("DOMContentLoaded", () => {
    // JSON-Konfiguration laden
    fetch('config/config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Config konnte nicht geladen werden: ${response.statusText}`);
            }
            return response.json();
        })
        .then(config => {
            initSite(config);
        })
        .catch(error => console.error('Fehler beim Laden der Config:', error));
});


function initSite(config) {
    // Seitentitel setzen
    //document.title = config.siteTitle || "Website";

    // Theme anwenden
    //document.body.style.setProperty('--primary-color', config.theme.primaryColor);
    //document.body.style.setProperty('--secondary-color', config.theme.secondaryColor);

    // Optional Titel im Header
    //const header = document.querySelector('header h1');
    //if (header) header.textContent = config.siteTitle;

    // Kandidaten laden, falls aktiviert
    if (config.content.showKandidaten) {
        loadKandidaten(config.content.kandidatenCSV,config.content.kandidatenTitle,config.content.kandidatenImageBasePath);
    }

    // Vorstand laden, falls aktiviert
    if (config.content.showVorstand) {
        loadVorstand(config.content.vorstandCSV,config.content.vorstandImageBasePath);
    }

    if (config.meinungen && Array.isArray(config.meinungen)) {
        renderMeinungen(config.meinungen);
    }

    // Footer-Text einfügen
    //const footer = document.querySelector('footer');
    //if (footer) footer.textContent = config.footerText;
}


function parseCSV(csv, delimiter = ';') {
    const [headerLine, ...lines] = csv.trim().split('\n');
    const headers = headerLine.split(delimiter);
    return lines.map(line => {
        const values = line.split(delimiter);
        return headers.reduce((obj, key, i) => {
            obj[key.trim()] = values[i]?.trim() ?? '';
            return obj;
        }, {});
    });
}

function createHTMLRowCandidate(kandidat, imageBasePath) {
    return `
    <div class="pure-u-1 pure-u-sm-1-2 pure-u-lg-1-3 pure-u-xl-1-4 l-box kandidat pb-2">
        <div class="kandidat-content">
            <img src="${imageBasePath}${decodeURIComponent(kandidat.image)}" alt="${kandidat.name}"/>
            <span class="listenplatz">${kandidat.list_place}</span>
            <div class="kandidat-info">
                <div class="kandidat-info-inner">
                    <h4>${kandidat.name}</h4><br>
                    <span>${kandidat.job}</span><br>
                    <span>Jahrgang: ${kandidat.year_of_birth}</span><br>
                    <span>${kandidat.city}</span>
                </div>
            </div>
        </div>
    </div>`;
}


function createHTMLRowVorstand(vorstand,imageBasePath) {
    return `
    <div class="pure-u-1 pure-u-sm-1-2 pure-u-lg-1-3 pure-u-xl-1-4 l-box kandidat pb-2">
        <div class="kandidat-content">
            <img src="${imageBasePath}${decodeURIComponent(vorstand.image)}" alt="${vorstand.name}"/>
            <div class="kandidat-info">
                <div class="kandidat-info-inner">
                    <h4>${vorstand.position}</h4><br>
                    <span>${vorstand.name}</span><br>
                </div>
            </div>
        </div>
    </div>`;
}


function loadKandidaten(csvPath,title,imageBasePath) {
    fetch(csvPath)
        .then(res => res.text())
        .then(csvText => {
        const kandidaten = parseCSV(csvText);
        document.getElementById('kandidaten').innerHTML = '<h3>'+title+'</h3><div class="pure-g kandidaten">' +
            kandidaten.map(k => createHTMLRowCandidate(k, imageBasePath)).join('') + '</div><div class="pure-u-1 pure-u-sm-1 pure-u-lg-2-3 pure-u-xl-1 l-box kandidat pb-2"><div class="kandidat-content"><h4 class="no-kandidat"><a href="https://www.jwu-frg.de/" target="_blank">JWU Freyung Grafenau</a></h4></div></div>';
        })
        .catch(err => console.error('Fehler beim Laden der Kandidaten:', err));
}

function loadVorstand(csvPath,imageBasePath) {
    fetch(csvPath)
        .then(res => res.text())
        .then(csvText => {
        const vorstandschaft = parseCSV(csvText);
        document.getElementById('vorstand').innerHTML = '<h3>Die Vorstandschaft</h3><div class="pure-g kandidaten">' +
        vorstandschaft.map(v => createHTMLRowVorstand(v, imageBasePath)).join('') + '</div>';
        })
        .catch(err => console.error('Fehler beim Laden der Vorstandschaft', err));
}

function renderMeinungen(meinungen) {
    const container = document.getElementById('meinungen');
    if (!container) return;

    container.innerHTML = meinungen
        .map((text, i) => `<span class="meinung" id="meinung${i + 1}">${text}</span>`)
        .join('\n');
}