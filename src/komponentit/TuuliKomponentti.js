import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "bootstrap-icons/font/bootstrap-icons.css";


const TuuliKomponentti = ({ data }) => {
    const rows = data.map(item => Object.values(item));

    //    let taulukko =  Object.values({data}); //= Array.from(data);

    // Col md="9"> 
    // Container className="container text-center"
    // Container fluid="lg"
    // Row  className="row jsustify-content-center"

    return (
      <span class="border border-primary">
      <Container>

          {rows.map((row, index1) => (
            <Row>
                {row.map((cell, index) => 
                  <Col md="9">
                    <span align="center">



                      {cell=='07:00'? <hr class="hr-text-aamu" data-content="07:00" data-bs-theme="blue"></hr> : ""}

                      {index==1? cell :"" }
                      <h2>
                      {cell=='12:00'? <hr class="hr-text" data-content="12:00"></hr> : ""}
                
                      {cell=='18:00'? <hr class="hr-text" data-content="18:00"></hr> : ""}

                      {index==2 && (cell>=90 && cell<=270 ) ? <i class="bi bi-cloud-fog2-fill harmaa" title={cell}></i>:""}

                      {index==2 && ((cell<120 && cell>90) || (cell>270 && cell<300)) ? <i class="bi bi-cloud-haze harmaa" title={cell}></i>:""}

                      {index==2 && (cell<90 || cell>300 ) ? <i class="bi bi-cloud-check harmaa" title={cell}></i>:""}    

                    </h2>
                    </span>

                  </Col>
              )}
          </Row>
          ))}
      </Container>
      </span>

    );
  };
  
  export default TuuliKomponentti;