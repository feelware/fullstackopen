import { useState, useEffect } from 'react'
import axios from 'axios'
import Result from './components/Result'

const App = () => {
  const [data, setData] = useState([])
  const [results, setResults] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(re => setData(re.data.map(country => ({
        name: country.name.common,
        capital: country.capital?.[0],
        area: country.area,
        languages: country.languages ? Object.keys(country.languages).map(key => country.languages[key]) : [],
        flag: {
          src: country.flags.png,
          alt: country.flags.alt
        }
      }))))
  }, [])

  useEffect(() => {
    setResults(data.filter(country => country.name.toLowerCase().includes(value)))
  }, [value])
  
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  if (!data.length) {
    return <div>fetching data...</div>
  }

  return (
    <div>
      find countries<input value={value} onChange={handleChange} />
      {
        results.length > 10
        ? <div>Too many matches, specify another filter</div>
        : results.length !== 1
          ? results.map(country => <Result key={country.name} country={country} />)
          : <Result country={results[0]} only />
      }
    </div>
  )
}

export default App