import React, { useState } from "react";
import CalendarGrid from "./components/CalendarGrid";
import "./App.css"; 

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="App">
      <div className="calendar-wrapper">
        <CalendarGrid selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
       
      </div>
      {/*for background animation */}
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
