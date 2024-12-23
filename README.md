# Dynamic Event Calendar Application

# Summary of Features

This Dynamic Event Calendar Application allows users to manage their events in a calendar interface. The app includes the following features:

**Calendar View**:

- Display the current month's calendar with all days properly aligned.
- Users can navigate between months using "Previous" and "Next" buttons.

**Event Management**:

- Add, edit, and delete events for each day.
- Each event includes:
  - Event name
  - Start time and end time
  - Optional description
- Prevents overlapping events by checking time conflicts.

**Event List**:

- Display a list of events for the selected day in a modal.

**Data Persistence**:

- Events are stored in localStorage, ensuring they persist across page refreshes.

**UI**:

- Clean and modern user interface using shadcn for UI components.
- The calendar grid clearly separates weekends and weekdays.
- Highlights the current day and selected day.

**Complex Logic**:

- Handles automatic month transitions (e.g., from Jan 31 to Feb 1).
- Allows event filtering by keyword.

**Bonus Features**:

- Drag-and-drop functionality for easy addition and reschedule of events.
- Color coding for different event types (meeting, birthday, holiday).
- Export event list for the specific month in JSON or CSV format.

# Instructions to Run the App Locally

1. Clone the repository to your local machine:
   git clone https://github.com/your-username/your-repository-name.git

2. Navigate into the project directory:
   cd your-repository-name
3. Install the necessary dependencies:
   npm install

4. Start the development server:
   npm start
   This will open the app in your default web browser. You can now access the app at http://localhost:3000.

# Link to Deployed App

You can access the deployed version of the app at the following link:
https://akshara-agarwal30.github.io/Event-Calendar/

# Technologies Used

React.js
LocalStorage for data persistence
shadcn for UI components
JavaScript, CSS

# Project Setup

This project is set up with React.js and uses functional components with hooks. It does not rely on external libraries for calendar logic and implements features such as event management, month navigation, and data persistence using localStorage.












