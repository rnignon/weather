function loadPage () {
    let section = document.querySelector('section');
    let region = document.querySelector('#region');
    let form = document.querySelector('#weather-form');
    let button = document.querySelector('#weather-submit');

    loadData();

    button.addEventListener('click', (e) => {
        e.preventDefault();
        loadData (form.search.value);
        form.search.value = '';
    });
}
function loadData(region = 'Seoul') {
    let weather = document.querySelector('#weather-region');
    let info = document.querySelector('#weather-info');
    weather.innerHTML = '';
    info.innerHTML = '';

    getData(region).then(data => {
        let info_text = document.createElement('div');
        let time = document.createElement('div');
        let condition = document.createElement('div');
        let temp = document.createElement('div');
        let temp_button = document.createElement('button');

        info_text.id = 'weather-info-text';
        time.id = 'weather-time';
        condition.id = 'weather-condition';
        temp.id = 'weather-temp';
        temp_button.id = 'weather-temp-button';

        console.log(data);
        weather.innerHTML = `<h1>${data.location.name}</h1><p>in ${data.location.country}</p>`;
        time.innerHTML = `<h3>Time</h3><p>${data.location.localtime}</p>`;
        condition.innerHTML = `<h3>Condition</h3><p>${data.current.condition.text}</p>`;
        temp.innerHTML = `<h3>Temperature</h3><p>${data.current.temp_c}°C</p>`;
        temp_button.textContent = 'C';

        temp_button.addEventListener('click', (e) => {
            if (temp_button.textContent === 'C') {
                temp_button.textContent = 'F';
                temp.innerHTML = `<h3>Temperature</h3><p>${data.current.temp_f}°F</p>`;
            }
            else {
                temp_button.textContent = 'C';
                temp.innerHTML = `<h3>Temperature</h3><p>${data.current.temp_c}°C</p>`;
            }
        });

        info_text.append(time, condition, temp, temp_button);
        getImg(data.current.condition.text).then(img => {
            info.append(img, info_text);
        });
    })
}
async function getData (region) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=5465012c5e514fe392c64156232305&q=${region}`, {mode: 'cors'});
    if (!response.ok) {
        let info = document.querySelector('#weather-info');
        info.innerHTML = `<h1>City ${region} not found</h1>`;
        throw new Error(`City ${region} not found`);
    }

    // const data = convertData(await response.json());
    const data = await response.json();
    console.log(`getData() : ${data}`);
    return data;
}

async function getImg (keyword) {
    let gif = document.createElement('img');
    gif.id = 'weather-gif';
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=XRfobMTZ5vPVTZLwIIioh3bAxZyVE3UC&s=${keyword} landscape`, {mode: 'cors'});
    const imgData = await response.json();
    gif.src = imgData.data.images.original.url;
    return gif;
}

loadPage();