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
const apibase =   'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=Pieksämäki&parameters=WindDirection' 


export default function App() {  

  
  const [saadata_1, setTuntiData1] = useState([]);
  const [saadata_2, setTuntiData2] = useState([]);
  const [saadata_3, setTuntiData3] = useState([]);

  const [state, setState] = useState({
    data: [],
    limit: 5,
    activePage: 1,
    saadata1: [],
    saadata2: [],
    saadata3: []
    //jostain syystä funktion sisällä nämä näkyy sitten katoaa kun piirtäminen alkaa
  });  

  useEffect(() => {

    const paivamaara = new Date();
    paivamaara.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' });
    const vuosi = paivamaara.getFullYear();
    const kuukausi = String(paivamaara.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const paiva = String(paivamaara.getDate()).padStart(2, '0');
    const tunti = String(paivamaara.getHours()).padStart(2, '0');
    const paivays = vuosi + "-" + kuukausi + "-" + paiva + "T" + tunti + ":00:00Z"

    //useita axios requesteja tapahtuu, joten estetään se
    if(state.data.length <= 0) {
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

          var huomenna = 0;
          var paivamaarateksti = '';
          if(state.saadata1.length <= 20) {

            if (poissuljettavat_yön_ajat.indexOf(uusiaika) < 0) {  
              lkm++;
              
              //päätellään milloin pitää piirtää huomisteksti
              if(uusiaika == '07:00' && huomenna == 0) {
                const viikonpaiva = ["Sunnuntai","Maanantai","Tiistai","Keskiviikko","Torstai","Perjantai","Lauantai"];
                const paiva = new Date(kokonainenaika[0]);
                paivamaarateksti = viikonpaiva[paiva.getDay()];
                //paivamaarateksti = kokonainenaika[0];
                huomenna = 1;
              }
              if (lkm <= 20) {
                setState({saadata1: state.saadata1.push({uusiaika, paivamaarateksti, value})});
                setState({data: state.data.push({uusiaika, paivamaarateksti, value})});              
              } else if (lkm > 20 && lkm <= 40) {
                setState({saadata2: state.saadata2.push({uusiaika, paivamaarateksti, value})});
              } else  if (lkm > 40){
                setState({saadata3: state.saadata3.push({uusiaika, paivamaarateksti, value})});      
              }            
            }
            paivamaarateksti = '';
          }
        });
        // ei näin setState({data: state.saadata_1});
        setState((prev) => ({
          ...prev,
          data: state.saadata1
        }));

        setTuntiData1(state.saadata1);
        setTuntiData2(state.saadata2);
        setTuntiData3(state.saadata3);
                
      })
      .catch((error) => console.log(error));
    }
  }, [state.data]);

    const handlePageChange = (pageNumber) => {
      if (pageNumber == 1) {
        setState((prev) => ({
          ...prev,
          data: saadata_1
        }));
      state.activePage = 1;
      } else if (pageNumber == 2) {
        setState((prev) => ({
          ...prev,
          data: saadata_2
        }));
      state.activePage = 2;
      } else {
        setState((prev) => ({
          ...prev,
          data: saadata_3
        }));
        state.activePage = 3;
      }
    };

    return (
    <div>
      <div class="p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3"  align="center">   
        <Container>
          <Row>
            <Col md="9">
              <div align="center">           
              <b>Stillbits </b>kertoo Villa Metsälammen tyyneyden tuulen suunnan mukaan tunneittain    <br /> 
              </div>          
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="9">
              <Pagination className="justify-content-center">

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
            </Col>
          </Row>
        </Container>
      </div>
      <TuuliKomponentti data={state.data} />
    </div>
  );
};
