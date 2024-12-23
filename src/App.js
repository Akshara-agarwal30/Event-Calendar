import React, { useState } from "react";
import CalendarGrid from "./components/CalendarGrid";
import "./App.css"; // Ensure this file is created and includes the styles provided below

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="App">
      <div className="calendar-wrapper">
        <CalendarGrid selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
       
      </div>
      <div class="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>
  );
}

export default App;
