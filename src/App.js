import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
//import XMLParser from 'react-xml-parser';
import TuuliKomponentti from './komponentit/TuuliKomponentti'

const apibase =   'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=Helsinki&parameters=WindDirection' 
//https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=pieks%C3%A4m%C3%A4ki&&parameters=WindDirection,WindSpeedMS


function App() {  
  
  const [data, setTuntiData] = useState([]);
  const [paivays, setPaivaysData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        //https://stackoverflow.com/questions/68565542/javascript-date-now-utc-in-yyyy-mm-dd-hhmmss-format
        const paivamaara = new Date();
        paivamaara.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' });
        const vuosi = paivamaara.getFullYear();
        const kuukausi = String(paivamaara.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const paiva = String(paivamaara.getDate()).padStart(2, '0');
        const tunti = String(paivamaara.getHours()).padStart(2, '0');
        const paivays = vuosi + "-" + kuukausi + "-" + paiva + "T" + tunti + ":00:00Z"
        setPaivaysData(paivays);
        let api = apibase+"&starttime="+paivays;

        const result = await axios.get(api, {
          headers: {
            'Access-Control-Allow-Origin': true,
          },
        });

        var poissuljettavat_yön_ajat = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00"];

        let data = [];

        /* > 270 && <90 */
        let parser = new DOMParser();
        let parsedxml = parser.parseFromString(result.data, "text/xml");
        parsedxml.querySelectorAll('MeasurementTVP').forEach((measurementTVPObjektit) => {
            let value = measurementTVPObjektit.querySelector('value').textContent;
            let time = measurementTVPObjektit.querySelector('time').textContent;

            var kokonainenaika = time.split(/T/);
            var kellonaika = kokonainenaika[1].split(/:/);
            var kellonaika0 = kellonaika[0];
            var kellonaika1 = kellonaika[1];
            var uusiaika = kellonaika0 + ":" + kellonaika1;
            console.log(uusiaika + " " + poissuljettavat_yön_ajat.indexOf(uusiaika))
            if (poissuljettavat_yön_ajat.indexOf(uusiaika) < 0) {
             
              data.push({uusiaika, value});
             }
         });
        setTuntiData(data);
      };
     fetchData();
    }, []);  

    return (
          <span align="center">
              <h1>Stillbit!</h1>
              <p>{paivays}</p>
              <div>    
                  <TuuliKomponentti data={data} />
              </div>     
          </span>
    );
  };

export default App;
