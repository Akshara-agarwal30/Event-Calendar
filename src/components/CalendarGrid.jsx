import React, { useState, useEffect } from "react";
import "./CalendarGrid.css";

const CalendarGrid = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("calendarEvents");
    return storedEvents ? JSON.parse(storedEvents) : {};
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const generateCalendar = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const tempDays = [];
    for (let i = 0; i < startDay; i++) {
      tempDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      tempDays.push(new Date(date.getFullYear(), date.getMonth(), day));
    }
    setDays(tempDays);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const openModal = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
    setErrorMessage("");
  };
  const isWeekend = (day) => {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };
  const checkForOverlappingEvents = (newEvent) => {
    const dateKey = selectedDay.toDateString();
    const existingEvents = events[dateKey] || [];

    for (let event of existingEvents) {
      if (
        (newEvent.startTime >= event.startTime &&
          newEvent.startTime < event.endTime) ||
        (newEvent.endTime > event.startTime &&
          newEvent.endTime <= event.endTime) ||
        (newEvent.startTime <= event.startTime &&
          newEvent.endTime >= event.endTime)
      ) {
        return true;
      }
    }
    return false;
  };

  const addEvent = (eventDetails) => {
    if (checkForOverlappingEvents(eventDetails)) {
      setErrorMessage("Error: This event overlaps with an existing event.");
      return;
    }

    const dateKey = selectedDay.toDateString();
    setEvents((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventDetails],
    }));
    closeModal();
  };

  const deleteEvent = (index) => {
    const dateKey = selectedDay.toDateString();
    setEvents((prev) => {
      const updatedEvents = [...(prev[dateKey] || [])];
      updatedEvents.splice(index, 1);
      return { ...prev, [dateKey]: updatedEvents };
    });
  };

  const handleDropEvent = (eventIndex, targetDay) => {
    const sourceDayKey = selectedDay.toDateString();
    const targetDayKey = targetDay.toDateString();

    setEvents((prev) => {
      const sourceEvents = [...prev[sourceDayKey]];
      const targetEvents = [...(prev[targetDayKey] || [])];

      const [movedEvent] = sourceEvents.splice(eventIndex, 1);
      targetEvents.push(movedEvent);

      return {
        ...prev,
        [sourceDayKey]: sourceEvents,
        [targetDayKey]: targetEvents,
      };
    });
  };
// Function to export events as JSON
const exportEventsAsJSON = () => {
  const eventsForMonth = {};
  for (const [dateKey, eventList] of Object.entries(events)) {
    const eventDate = new Date(dateKey);
    
    if (eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear()) {
      eventsForMonth[dateKey] = eventList;
    }
  }
  
  const jsonBlob = new Blob([JSON.stringify(eventsForMonth, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(jsonBlob);
  link.download = `events_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.json`;
  link.click();
};

const exportEventsAsCSV = () => {
  let csvContent = "Date, Event Name, Start Time, End Time, Description, Type\n";

  for (const [dateKey, eventList] of Object.entries(events)) {
    const eventDate = new Date(dateKey);
    
    if (eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear()) {
      eventList.forEach((event) => {
        const row = `${eventDate.toDateString()}, ${event.eventName}, ${event.startTime}, ${event.endTime}, ${event.description}, ${event.type}`;
        csvContent += row + "\n";
      });
    }
  }

  const csvBlob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(csvBlob);
  link.download = `events_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.csv`;
  link.click();
};


 
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePreviousMonth}>Previous</button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {" "}
          {currentDate.getFullYear()}
        </h2>
        <button className="nav-btn" onClick={handleNextMonth}>Next</button>
      </div>
     
      <div className="calendar-grid">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <div key={day} className="calendar-day-label">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              day
              ? day.toDateString() === new Date().toDateString()
              ? "today"
              : isWeekend(day)
              ? "weekend"
              : "weekday"
            : ""
            }`}
            onClick={() => day && openModal(day)}
          >
            {day ? day.getDate() : ""}
          </div>
        ))}
      </div>
      <div className="export-buttons">
    <button onClick={exportEventsAsJSON}>Export as JSON</button>
    <button onClick={exportEventsAsCSV}>Export as CSV</button>
  </div>
      {showModal && selectedDay && (
        <EventModal
          day={selectedDay}
          events={events[selectedDay.toDateString()] || []}
          onClose={closeModal}
          onAddEvent={addEvent}
          onDeleteEvent={deleteEvent}
          onDropEvent={handleDropEvent}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

const EventModal = ({
  day,
  events,
  onClose,
  onAddEvent,
  onDeleteEvent,
  onDropEvent,
  errorMessage,
}) => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("meeting");

  const eventColors = {
    meeting: "#4caf50",
    birthday: "#2196f3",
    holiday: "#ff5722",
  };

  const handleAdd = () => {
    if (eventName.trim()) {
      onAddEvent({ eventName, startTime, endTime, description, type: eventType });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Events for {day.toDateString()}</h3>
        <ul>
          {events.length > 0 ? (
            events.map((event, index) => (
              <li
                key={index}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("eventIndex", index)}
                onDrop={(e) => {
                  const eventIndex = e.dataTransfer.getData("eventIndex");
                  onDropEvent(eventIndex, day);
                }}
                onDragOver={(e) => e.preventDefault()}
                style={{ backgroundColor: eventColors[event.type] || "#ffffff" }}
              >
                <strong>{event.eventName}</strong>
                {event.startTime && ` (${event.startTime} - ${event.endTime})`}
                <p>{event.description}</p>
                <button onClick={() => onDeleteEvent(index)}>Delete</button>
              </li>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </ul>
        <h4>Add a New Event</h4>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <label>
          Event Name:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <label>
          Event Type:
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="meeting">Meeting</option>
            <option value="birthday">Birthday</option>
            <option value="holiday">Holiday</option>
          </select>
        </label>
        <button onClick={handleAdd}>Add Event</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CalendarGrid;
