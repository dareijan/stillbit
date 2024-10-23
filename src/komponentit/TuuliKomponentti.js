import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const TuuliKomponentti = ({ data }) => {
    const rows = data.map(item => Object.values(item));
    return (
      <Container>
          {rows.map((row, index) => (
            <Row> 
                {row.map((cell, index) => 
                <Col>
                    {cell}
                </Col>
              )}
          </Row>
          ))}
      </Container>
    );
  };
  
  export default TuuliKomponentti;