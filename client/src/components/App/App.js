import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import StartPage from "../StartPage/StartPage";
import GamePage from "../GamePage/GamePage";

function App() {
  return (
    <Router>
      <Route path="/" exact component={StartPage} />
      <Route path="/game" exact component={GamePage} />
    </Router>
  );
}

export default App;
