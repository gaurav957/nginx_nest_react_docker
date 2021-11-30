import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  function getRequest() {
    const axios = require("axios");

    // Make a request for a user with a given ID
    axios.get("http://localhost:80/api").then(function (response) {
      // handle success
      console.log(response.data);
    });
  }

  useEffect(() => {
    // Update the document title using the browser API
    getRequest();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
