import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "bootstrap-icons/font/bootstrap-icons.css";

import TuuliKomponentti from './komponentit/TuuliKomponentti'
//https://codesandbox.io/p/sandbox/react-bootstrap-pagination-example-tpgtb?file=%2Fsrc%2FApp.js%3A22%2C13
const apibase =   'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=Helsinki&parameters=WindDirection' 
//https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=pieks%C3%A4m%C3%A4ki&&parameters=WindDirection,WindSpeedMS


export default function App() {  

  const [säädata_1, setTuntiData1] = useState([]);
  const [säädata_2, setTuntiData2] = useState([]);
  const [säädata_3, setTuntiData3] = useState([]);
  const [paivays, setPaivaysData] = useState([]);

  const [state, setState] = useState({
    data: [],
    limit: 5,
    activePage: 1
  });  

    useEffect(() => {

      const paivamaara = new Date();
      paivamaara.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' });
      const vuosi = paivamaara.getFullYear();
      const kuukausi = String(paivamaara.getMonth() + 1).padStart(2, '0'); // Month is 0-based
      const paiva = String(paivamaara.getDate()).padStart(2, '0');
      const tunti = String(paivamaara.getHours()).padStart(2, '0');
      const paivays = vuosi + "-" + kuukausi + "-" + paiva + "T" + tunti + ":00:00Z"
      axios
      .get((apibase+"&starttime="+paivays)).then((result) => {

        var poissuljettavat_yön_ajat = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00"];

        let parser = new DOMParser();
        let parsedxml = parser.parseFromString(result.data, "text/xml");
        var lkm=0;
        parsedxml.querySelectorAll('MeasurementTVP').forEach((measurementTVPObjektit) => {
            let value = measurementTVPObjektit.querySelector('value').textContent;
            let time = measurementTVPObjektit.querySelector('time').textContent;

            var kokonainenaika = time.split(/T/);
            var kellonaika = kokonainenaika[1].split(/:/);
            var kellonaika0 = kellonaika[0];
            var kellonaika1 = kellonaika[1];
            var uusiaika = kellonaika0 + ":" + kellonaika1;
            var ensimmainenaamu = false;
            if (poissuljettavat_yön_ajat.indexOf(uusiaika) < 0) {  
              lkm++;
              if (lkm < 20) {
                säädata_1.push({uusiaika, value});
              } else if (lkm >= 20 && lkm < 50) {
                säädata_2.push({uusiaika, value});
              } else  if (lkm >= 50){
                säädata_3.push({uusiaika, value});
              }            
             }
         });
         setState({data: säädata_1});
         //setState((prev) => ({
         // ...prev,
         // data: säädata_1
        //}));                    
      })
      .catch((error) => console.log(error));
      }, [state.limit]);

      const handlePageChange = (pageNumber) => {
        if (pageNumber == 1) {
          setState((prev) => ({
            ...prev,
            data: säädata_1
          }));
        state.activePage = 1;
        } else if (pageNumber == 2) {
          setState((prev) => ({
            ...prev,
            data: säädata_2
          }));
        state.activePage = 2;
        } else {
          setState((prev) => ({
            ...prev,
            data: säädata_3
          }));
          state.activePage = 3;
        }
      };

    return (
      <React.Fragment>
        <span align="center">
        <Pagination className="px-5">
              <Pagination.Item
                onClick={() => handlePageChange(1)}
                key={1}
                active={1 === state.activePage}
              >
              {1}
              </Pagination.Item>

              <Pagination.Item
                onClick={() => handlePageChange(2)}
                key={2}
                active={2 === state.activePage}
              >
              {2}
              </Pagination.Item>

              <Pagination.Item
                onClick={() => handlePageChange(3)}
                key={3}
                active={3 === state.activePage}
              >
              {3}
              </Pagination.Item>
        </Pagination>
        <TuuliKomponentti data={state.data} />
        </span>
    </React.Fragment>
    );
  };
