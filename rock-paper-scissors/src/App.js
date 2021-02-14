import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
export class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <SignIn />
          </Route>
          <Route path="/home/:room/:name">
            <Home />
          </Route>
          <Route path="/game/:room/:name">
            <Game />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
