import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Landing = () => {
  const [name, setName] = useState('tc');
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
        fetch('http://localhost:8000/api/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: 'user1',
            action: "start"
          })
        })
          .then(response => response.json())
        if (name === 'bs') {
            window.location.href = '/bs';
        } else if (name === 'me') {
            window.location.href = '/me';
        } else if (name === 'tc') {
            window.location.href = '/tc';
        } else if (name === 'fc') {
            window.location.href = '/fc';
        } else {
            alert('Invalid name');
        }
    } else {
      alert('Please agree to the conditions before proceeding.');
    }
  };

  return (
    <Container>
      <h1>Welcome to the Experiment</h1>
      <p>The experiment tend to explore the effect of moral engagement on accountability when brainstorming with LLM</p>
      <p>In this experiment, you will have 6 minutes to brainstorming with AI with a specific question</p>
      <p>Brainstorming rules: bs/me/tc/fc</p>
      <Form onSubmit={handleSubmit}>
        <label>
          Number:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <br />
        
        <label>
          <input type="checkbox" checked={agreed} onChange={handleAgreeChange} />
          I agree to the conditions.
        </label>
        <h3>
          The timer will start to count right after clicking "Start Experiment"
        </h3>
        <br />
        <Button type="submit">Start Experiment</Button>
      </Form>
    </Container>
  );
};

export default Landing;
