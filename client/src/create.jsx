import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function Create() {
  const [task, setTask] = useState('');

  const handleAdding = () => {
    axios.post("http://localhost:3001/add", { task: task })
      .then(result => {
        location.reload();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="create_form">
      <input
        type="text"
        placeholder="Enter Your Text"
        onChange={(event) => setTask(event.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          border: 'none',
          borderBottom: '2px solid #333',
          outline: 'none',
          marginBottom: '20px',
          fontSize: '16px',
        }}
      />
      <button
        type="button"
        onClick={handleAdding}
        style={{
          padding: '12px 24px',
          backgroundColor: '#76a1ce',
          color: 'white',
          cursor: 'pointer',
          border: 'none',
          borderRadius: '5px',
          transition: 'background-color 0.3s ease',
          fontSize: '16px',
        }}
      >
        Add
      </button>
    </div>
  );
}

export default Create;
