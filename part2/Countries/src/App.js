import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
  return ( 
  <div>
    filter shown with <input value={props.filter} onChange={props.onFilterChange} />
  </div>
  );
};

const CountryPage = (props) => (
  <div>
    <h1>{props.name}</h1>
    <div>capital {props.capital}</div>
    <div>area {props.area}</div>
    <h2>languages:</h2>
    <ul>
    {Object.keys(props.languages).map(key => <li key={props.languages[key]}>{props.languages[key]}</li>)}
    </ul>
    <img src={props.flag} />
    {props.weather.hasOwnProperty('name') ? <>
    <h1>Weather in {props.capital}</h1>
    <div>temperature {(props.weather.main.temp-273).toFixed(2)} Celsius</div>
    <img src={`http://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`} />
    <div>wind {props.weather.wind.speed} m/s</div>
    </> : ''}
  </div>
  );
const Country = (props) => <div key={props.name}>{props.name} <button onClick={() => props.onClick(props.name)}>show</button></div>;
const Countries = (props) => props.countries.map(country => <Country name={country.name.common} key={country.name.common} onClick={props.onClick} />);



const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState('');
  const [weather, setWeather] = useState({});

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, []);
  const onFilterChange = (event) => setNewFilter(event.target.value);

  const filteredCountries = countries.filter(country => country.name.common.indexOf(newFilter) !== -1);
  if (filteredCountries.length > 10) {
    return (
      <div>
        <h2>find countries</h2>
        <Filter filter={newFilter} onFilterChange={onFilterChange} />
        <div>too many matches, specify another filter</div>
      </div>
    );
  }
  if (filteredCountries.length === 1) {
    let country = filteredCountries[0];
    let capitalWeather = {};
    if(!weather.hasOwnProperty(country.capital[0])) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(country.capital[0])}&appid=${process.env.REACT_APP_WEATHER_MAP_API_KEY}`)
        .then(response => {
          setWeather(Object.assign({}, weather, { [country.capital[0]]: response.data}));
        });
        weather[country.capital[0]] = {};
    } else {
      capitalWeather = weather[country.capital[0]];
    }

    return (
    <div>
      <h2>find countries</h2>
      <Filter filter={newFilter} onFilterChange={onFilterChange} />
      <CountryPage name={country.name.common} flag={country.flags.png} capital={country.capital[0]} area={country.area} languages={country.languages} weather={capitalWeather} />
    </div>
    );
  }
  return (
    <div>
      <h2>find countries</h2>
      <Filter filter={newFilter} onFilterChange={onFilterChange} />
      <Countries countries={filteredCountries} onClick={setNewFilter} />
    </div>
  )
}

export default App
