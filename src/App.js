/* global chrome */
import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [times, setTimes] = useState({});
  const [goals, setGoals] = useState({}); 
  const [goalInput, setGoalInput] = useState(''); 

  const handleGoalChange = (e) => {
    setGoalInput(e.target.value); 
  };

  const handleGoalSubmit = () => {
    const domain = window.location.hostname; 
    setGoals((prevGoals) => ({
      ...prevGoals,
      [domain]: goalInput, 
    }));
    setGoalInput(''); 
  };

  const formatTime = (ms) => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    let formattedTime = `${seconds}s`;
    if (minutes > 0) { formattedTime = `${minutes}m ${formattedTime}` }
    if (hours > 0) { formattedTime = `${hours}h ${formattedTime}` }
    return formattedTime;
  };

  useEffect(() => {
    const fetchTimes = () => {
      chrome.runtime.sendMessage({ type: 'getTimes' }, (response) => {
        setTimes(response);
      });
    };

    fetchTimes();
    const intervalId = setInterval(fetchTimes, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Time Tracker</h1>
        <h2>Set Daily Goals</h2>
        <input
          type="number"
          value={goalInput}
          onChange={handleGoalChange}
          placeholder="Enter goal in minutes"
        />
        <button onClick={handleGoalSubmit}>Set Goal</button>
        <h3>Current Goals:</h3>
        <ul>
          {Object.entries(goals).map(([domain, goal]) => (
            <li key={domain}>
              <span>{domain}: {goal} minutes</span>
            </li>
          ))}
        </ul>
        <ul>
          {Object.entries(times).map(([domain, time]) => (
            <li key={domain}>
              <span>{domain}</span>
              <span>{formatTime(time)}</span>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
