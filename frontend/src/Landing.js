import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Landing = () => {
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAgreeChange = (e) => {
    setAgreed(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreed) {
        // set the url to the next page of the experiment
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: name,
            time: 0,
            action: "start"
          })
        })
          .then(response => response.json())
        // if name start with BSID-1
        if (name.startsWith('BSID-1')) {
            window.location.href = `/bs?id=${name}`;
        } else if (name.startsWith('BSID-2')) {
            window.location.href = `/me?id=${name}`;
        } else if (name.startsWith('BSID-3')) {
            window.location.href = `/tc?id=${name}`;
        } else if (name.startsWith('BSID-4')) {
            window.location.href = `/fc?id=${name}`;
        } else {
            alert('Invalid ID');
        }
    } else {
      alert('Please agree to the conditions before proceeding.');
    }
  };

  return (
    <Container>
      <br />
      <div>
        <h3>Welcome to the Experiment!</h3>
      </div>
      <br />
      <Card>
        <Card.Body>
          This is a experimental website to test the effect of different user interface on brainstorming with AI. 
          <br />
          In the next page, you will be asked to brainstorm with AI on a specific question for six minutes.
          <br />
          Please make sure you have a stable internet connection and a quiet environment to proceed.
          <br />
          <br />
          During the experiment, please do not refresh the page or close the browser or leave the website in the whole session.
          <br />
          Kindly follow below brainstorming rules and try your best to brainstorm with AI.
          <br />
          <li>
          Rule 1: Focus on Quantity
          </li>
          <li>
          Rule 2: Welcome Wild Ideas
          </li>
          <li>
          Rule 3: Combine and Improve Ideas
          </li>
          <br />
            In the next page, you are going to see button-  
            <Button variant="success" >Generate ideas</Button>
            -and you can get inspiration by clicking the button to get ideas from AI. 
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Please paste you Survey ID from Qualtrics</Form.Label>
              <Form.Control type="Survey ID" placeholder="BSID-XXXXX" onChange={handleNameChange}/>
            </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="I agree to try my best to brainstorming with AI" onChange={handleAgreeChange}/>
          </Form.Group>

          </Form>
        <Button type="submit" onClick={handleSubmit}>Start Brainstorming</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Landing;
