import React, { useState, useEffect, useRef} from 'react';
import { useLocation } from 'react-router-dom';

import ContentEditable from 'react-contenteditable'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function App() {
  const location = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [savedValues, setSavedValues] = useState([]);
  const [timer, setTimer] = useState(360);
  const [randomNumberSaved, setRandomNumberSaved] = useState([]); // Add state for saved random number
  const [checkNumber, setCheckNumber]  = useState("0")
  const handleChange = (event, index) => {
    setSavedValues(savedValues.map((item, i) => i === index ? event.target.value : item));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    if(location.pathname == "/fc"){
      handleInpiration()
    }
    setSavedValues([...savedValues, inputValue]);
    setInputValue('');
  };

  const handleDelete = (index) => {
    const newSavedValues = [...savedValues];
    newSavedValues.splice(index, 1);
    setSavedValues(newSavedValues);
  };

  const handleAdd = (index) => {
    //add random number to saved values
    setSavedValues([...savedValues, randomNumberSaved[index]]);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleInpiration = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    // setRandomNumberSaved([...randomNumberSaved, randomNum.toString() ]);
    // call backend to get idea
    // post request with existing ideas
    fetch('http://localhost:8000/api/idea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: 'user1',
        ideas: savedValues.toString()
      })
    })
      .then(response => response.json())
      .then(json => setRandomNumberSaved([...randomNumberSaved,  json.message.content]))
      .catch(error => console.error(error));

  };

  const handleSubmit = () => {
    fetch('http://localhost:8000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: 'user1',
        ideas: savedValues.toString()
      })
    })
      .then(response => response.json())
      .then(
        json => {
          setCheckNumber(json.result)
        }
      )
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleSubmit()
    }
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      {checkNumber !== "0" ? 
        <Container>
          <h2>Thanks for joining this experiment</h2>
          <h3>You number for verification is: {checkNumber} </h3>
          <h3>Please fill in qualtrics and do following survey on qualtrics!</h3>
        </Container>:
        <Container>
          <br />
          <Row>
            <h2>Let's Brainstorming!</h2>
          </Row>
          <br />
          <Row>
            <Col>
              <h3>Question:</h3>
            </Col>
            <Col style={{display:'flex', justifyContent:'right'}}>
              <h3>Timer: {formatTime(timer)}</h3>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h4>How could college help the society improve sustainability?</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control size="lg" type="text" placeholder="Type ideas here and press enter to add into below..." 
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </Col>
          </Row>
          <br />
          {location.pathname == "/me" && 
          <Row>
            <Col>
              <Alert variant="danger">
              Note: Please use AI-generated ideas as  stimulus for your own idea generation. Overreliance on AI suggestions may lead to constrained creativity!
              </Alert>
            </Col>
          </Row>
          }
          <Row>
            <Col>
              <Row>
                <h3>My ideas:</h3>
              </Row>
              <br />
              {savedValues.map((value, index) => (
                <ListGroup key={index}>
                  <ListGroup.Item>
                    <Row className="align-items-center">
                      <Col>
                        <ContentEditable  style={{width:480 }} html={value}  onChange={event => handleChange(event, index)} />
                      </Col>
                      <Col xs={1} style={{display:'flex', justifyContent:'right'}}>
                        <Button variant="danger"  onClick={() => handleDelete(index)}>Delete</Button>
                      </Col>
                    </Row>
                    {(location.pathname == "/tc" && randomNumberSaved.includes(value)) && 
                    <Row>
                      <Col>
                        <text className="fw-light">
                          This idea is copied from AI, clicked to modify
                        </text>
                      </Col>
                    </Row>
                    }
                  </ListGroup.Item>
                </ListGroup>
              ))}
            </Col>
            <Col>
              <Row>
                <Col>
                  <h3>AI's Ideas:</h3>
                </Col>
                <Col style={{display:'flex', justifyContent:'right'}}>
                  <Button variant="success" onClick={handleInpiration}>Generate idea</Button> {/* Add button for adding random number to saved values */}
                </Col>

              </Row>
              <br />
                {randomNumberSaved.map((value, index) => (
                  <ListGroup key={index}>
                    <ListGroup.Item>
                      <Row className="align-items-center">
                        <Col style={{width:480 }}>
                            {value}
                        </Col>
                        <Col xs={1} style={{display:'flex', justifyContent:'right'}}>
                          <Button onClick={() => handleAdd(index)}>Add</Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                ))}
            </Col>
          </Row>
          <br />
          <Row>
            { (location.pathname == "/tc" && savedValues.length > 0) && 
              <Alert  >
                {
                  (savedValues.filter((value) => (randomNumberSaved.includes(value))).length / savedValues.length * 100 ).toFixed(2)
                } % of your ideas is directly copy from AI
              </Alert>
            }
          </Row>
          <Row>
            <Button variant="primary" size="lg" block onClick={handleSubmit}>
              Submit
            </Button>
          </Row>
        </Container>
      }
    </Container>
  );
}

export default App;
