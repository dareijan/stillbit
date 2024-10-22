import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

const api =   'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=pieks%C3%A4m%C3%A4ki'



function App() {
  //const response = fetch(api, {
  //  method: 'GET',
  //  mode: 'no-cors',
  //  headers: {
  //    Authorization: "'Content-Type': 'text/html;Access-Control-Allow-Origin: '*'"
  //  }
  //})
  //console.log("response: " + response);
  
  
  const [hourData, setHourData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const result = await axios.get(api, {
          headers: {
            'Access-Control-Allow-Origin': true,
          },
          })
        //var hours_day_index_start = result.data.indexOf("doubleOrNil")
        let parser = new DOMParser();
        let xml = parser.parseFromString( result.data, "text/xml");
        //xml.querySelectorAll('mts-1-1-WindDirection').forEach((item) => {
        //  console.log(item);
        //});

       //let xml = parser.parseFromString( result.data, "text/xml").querySelector('doubleOrNilReasonTupleList').textContent;
       //let xml = parser.parseFromString( result.data, "text/xml").querySelector('mts-1-1-WindDirection');

       //<wml2:MeasurementTimeseries gml:id="mts-1-1-WindDirection">

        setHourData(result.data);
        // console.log(result.data);
       //  console.log(result);
       console.log(xml);

      };
      fetchData();
    }, []);  

    const parseXMLStream = (xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const items = [];
      xmlDoc.querySelectorAll('item').forEach((item) => {
        items.push({
          id: item.getAttribute('id'),
          name: item.querySelector('name').textContent,
          value: item.querySelector('value').textContent,
        });
      });
      return items;
    };    
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
          {hourData}

      </header>
    </div>
  );
}

export default App;
