import React, { Component } from "react";
import "antd/dist/antd.css";
import PeopleList from "./PeopleList";
import Header from "./Header";

const { app } = window.require("electron").remote;

class App extends Component {
  render() {
    return (
      <div style={{ padding: 16 }}>
        <Header></Header>
        <PeopleList></PeopleList>
      </div>
    );
  }
}

export default App;
