import './App.css';
import React, { useState }/* ,{ useEffect, useState }*/ from 'react';
import MyD3Component from './MyD3Component';
import data from './output_file.json'

function App() {
  const filterData = (_data, region = currentRegion) => {
    try{
      return _data.filter(x => x.field[0]['#text'] === region)
    }
    catch{
     
    }
  }

  const [currentRegion, setCurrentRegion] = useState('Canada');
  const [tempVal, setTempVal] = useState('Canada');
  const [filteredData, setFilteredData] = useState(filterData(data.record))  

  

  const handleChange = (e) => {
    setTempVal(e.target.value)
  }

  const changeCountry = () => {
    tempVal ? setCurrentRegion(tempVal) : setCurrentRegion('World')
    setFilteredData(filterData(data.record, tempVal))
  }
  
  return (
    <div key={currentRegion} className="App">
      <input value={tempVal} onChange={handleChange}/>
      <button onClick={changeCountry}>Change Country</button>
      <MyD3Component  data={filteredData} currentRegion={currentRegion}/>
    </div>
  );
}

export default App;
