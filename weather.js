const key = '1c2029afa33193c1d580c51d43bfbbeb'; 

async function search() {
  const phrase = document.querySelector('input[type="text"]').value;
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
  const data = await response.json();

  const formUl = document.querySelector('form ul');
  if (!formUl) {
    console.error('Could not find form element with a child ul');
    return; // Exit function if element is not found
  }

  formUl.innerHTML = '';  // Clear existing content
  for (let i = 0; i < data.length; i++) {
    const { name, lat, lon, country } = data[i];
    const listItem = document.createElement('li');
    listItem.dataset.lat = lat;  // Set data-lat attribute
    listItem.dataset.lon = lon;  // Set data-lon attribute
    listItem.dataset.name = name;
    const citySpan = document.createElement('span');
    citySpan.textContent = name;
    listItem.appendChild(citySpan);

    const countrySpan = document.createElement('span');
    countrySpan.classList.add('country'); 
    countrySpan.textContent = `   ${country}`;
    listItem.appendChild(countrySpan);

    // Appending the space after city name outside the span
    listItem.appendChild(document.createTextNode(' '));

    formUl.appendChild(listItem);
  }
}

const debouncedSearch = _.debounce(search, 600);

const inputElement = document.querySelector('input[type="text"]');

if (inputElement) {
  inputElement.addEventListener('keyup', debouncedSearch);
} else {
  console.error('Could not find input element with type="text"');
}

async function showWeather(lat, lon, name){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`);
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;
    console.log(lat);
    document.getElementById("city").innerHTML = name;
    document.getElementById("degrees").innerHTML = temp + '&#8457';
    document.getElementById("feelsLikeValue").innerHTML = feelsLike +'<span>&#8457</span>';
    document.getElementById("windValue").innerHTML = wind + '<span>mph</span>';
    document.getElementById("humidityValue").innerHTML = humidity + '<span>%</span>';
    document.getElementById('icon').src =`https://openweathermap.org/img/wn/${icon}@4x.png`
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'block';
}

document.body.addEventListener('click', ev => {
    const clickedElement = ev.target;
    // Check if clicked element is an `<li>` element
    if (!clickedElement.closest('li')) {
        return;
    }
  
    const listItem = clickedElement.closest('li');
    const { lat, lon, name } = listItem.dataset;
    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);
    localStorage.setItem('name', name);
    if (!lat) {
      return; 
    }
    showWeather(lat, lon, name);
});

document.getElementById('change').addEventListener('click', () =>{
    document.getElementById('weather').style.display = 'none';
    document.querySelector('form').style.display = 'block';
});

document.body.onload = () => {
    if (localStorage.getItem('lat')){
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');
        showWeather(lat, lon, name);
    }
}