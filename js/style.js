
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

function createHTMLRow(kandidat) {
    return `
    <div class="pure-u-1 pure-u-sm-1-2 pure-u-lg-1-3 pure-u-xl-1-4 l-box kandidat pb-2">
        <div class="kandidat-content">
            <img src="images/wahl_2020/${decodeURIComponent(kandidat.image)}" alt="${kandidat.name}"/>
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

// Verarbeitung:
fetch('config/kandidaten.csv')
  .then(res => res.text())
  .then(csvText => {
    const kandidaten = parseCSV(csvText);
    document.getElementById('kandidaten').innerHTML =
      kandidaten.map(createHTMLRow).join('');
  });
