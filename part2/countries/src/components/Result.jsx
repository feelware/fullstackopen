import { useState, useEffect } from "react"
import axios from 'axios'

const apiKey = import.meta.env.VITE_SOME_KEY

const Result = ({ country, only }) => {
    const [visible, setVisible] = useState(only)
    const [weather, setWeather] = useState({})

    useEffect(() => {
        axios
            .get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${country.capital}&aqi=no`)
            // .then(re => console.log(re))
            .then(re => setWeather({
                temp: re.data.current.temp_c,
                condition: re.data.current.condition.text,
                icon: re.data.current.condition.icon,
                wind: Math.round(re.data.current.wind_mph * 0.447 * 100) / 100
            }))
    }, [])

    return (
        <div>
            {
                visible
                ? <div>
                    <h2>{country.name}</h2>
                    <p>capital {country.capital}</p>
                    <h3>languages</h3>
                    <ul>
                        {country.languages.map(lang => <li key={lang}>{lang}</li>)}
                    </ul>
                    <img src={country.flag.src} alt={country.flag.alt} />
                    {
                        weather && 
                        <div>
                            <h2>Weather in {country.capital}</h2>
                            <p>temperature {weather.temp} Celcius</p>
                            <img src={weather.icon} alt={`Flat icon representing weather in ${country.capital}, whose current state is ${weather.condition}`} />
                            <p>wind {weather.wind} m/s</p>
                        </div>
                    }
                </div> 
                : <>{country.name}</>
            }
            {
                !only && 
                <button onClick={() => {setVisible(!visible)}} >
                    {visible ? 'hide' : 'show'}
                </button>
            }
        </div>
    )
}

export default Result