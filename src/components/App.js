import React, { useState } from "react";
import "antd/dist/antd.css";
import PeopleList from "./PeopleList";
import Header from "./Header";
import Admin from "./Admin";

const { app } = window.require("electron").remote;

export const SelectedDateContext = React.createContext({ selectedDate: null, setSelectedDate: () => {} });

const App = () => {
  const [activeWindow, setActiveWindow] = useState("normal");
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <SelectedDateContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      <div style={{ padding: 16 }}>
        <Header activeWindow={activeWindow} to={target => setActiveWindow(target)}></Header>
        {activeWindow === "normal" && <PeopleList></PeopleList>}
        {activeWindow === "admin" && <Admin></Admin>}
      </div>
    </SelectedDateContext.Provider>
  );
};

export default App;
