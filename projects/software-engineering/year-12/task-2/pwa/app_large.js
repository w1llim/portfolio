//login form
const loginFormEl = document.getElementsByTagName("form")[0];
const loginButton = document.getElementById("submitLoginButton");
const registerButton = document.getElementById("registerButton");
const logoutButton = document.getElementById("logoutButton");
const usernameInputEl = document.getElementById("username");
const passwordInputEl = document.getElementById("password");
const loginDiv = document.getElementById("loginDiv");
const mainApp = document.getElementById("mainappDiv");
const LOGIN_KEY =  "login";

// create constants for the session form and the form controls
const newSessionFormEl = document.getElementsByTagName("form")[1];
const dateInputEl = document.getElementById("date");
const descriptionInputEL = document.getElementById("description");
const startTimeInputEl = document.getElementById("start-time");
const endTimeInputEl = document.getElementById("end-time");
const STORAGE_KEY = "learner-hours";
const pastSessionContainer = document.getElementById("past-sessions");
const submitButton = document.getElementById("submitButton");

//search elements
const searchFormEl = document.getElementById("searchForm");
const searchDateInputEl = document.getElementById("searchDate");
const searchStartTimeInputEl = document.getElementById("searchStartTime");
const searchEndTimeInputEl = document.getElementById("searchEndTime");
const searchDescInputEl = document.getElementById("searchDescription");
const toggleSearchButton = document.getElementById("toggleSearchButton");
const searchContainer = document.getElementById("searchContainer");

//filter
const filterFormEl = document.getElementById("filterForm");
const filterType = document.getElementById("filterType");
const filterDate = document.getElementById("filterDate");
const filterStartTime = document.getElementById("filterStartTime");
const filterEndTime = document.getElementById("filterEndTime"); 
const filterOrder = document.getElementById("filterOrder");
const filterAscending = document.getElementById("ascending");
const filterDescending = document.getElementById("descending");
const filterButton = document.getElementById("filterButton");

//filter values
let filterTypeValue = null;
let filterOrderValue = null;

var editing = null; //tracks editing state
var editingSession = null; //stores session being edited

//limits max number of sessions at a time (lazy loading)
let sessionsShown = 10;

//login JS

//tracks whether user is logged in or not
let userloggedIn = false;

//hashing function for password
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  //specifies hash used (SHA-256) and hashes it
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

//check password function for login (compares hashed input password with stored hashed password)
async function checkPassword(inputPassword, storedHash) {
  let inputHash = await hashPassword(inputPassword);
  console.log("input hash: " + inputHash); //debugging
  if (inputHash === storedHash) {
    return true;
  } else  {
    return false;
  }
}

//runs upon page load, checks if user is registered
//only allows 1 registration
document.addEventListener("DOMContentLoaded", () => {
  //use to delete logins for testing purposes
  //localStorage.removeItem(LOGIN_KEY);
  console.log("page loaded"); //debugging
  if (checkIfRegistered()) {
    console.log("user registered") //debugging
    registerButton.classList.add("hidden");
    showNotification("Welcome back!");
  } else {
    console.log("user not registered") //debugging
    loginButton.classList.add("hidden");
    showNotification("No users registered. Please register to start tracking your learning hours.");
  }
});

function checkIfRegistered() {
  const storedData = localStorage.getItem(LOGIN_KEY);
  if (storedData) {
    console.log("in stored data."); //debugging
    return true;
  }
  return false;
}


//check credentials for login
async function checkCredentials(username, password) {
  const storedData = localStorage.getItem(LOGIN_KEY);
  if (storedData) {
    const userData = JSON.parse(storedData);
    if (username === userData.username && await checkPassword(password, userData.password)) {
      //login success
      console.log("credentials correct"); //debugging
      console.log("stored username: " + userData.username); //debugging
      console.log("stored password hash: " + userData.password); //debugging
      console.log("input username: " + username); //debugging
      console.log("input password: " + password); //debugging
      return true;
    } else {
      //login failed
      console.log("credentials incorrect"); //debugging
      return false;
    } 
  } else {
    //no users
    //may be redundant with checkIfRegistered function, but serves as a backup to prevent login if no users registered
    showNotification("No users registered. Please register first.");
    return false;
  }
}

function checkPasswordStrength(password) {
  //checks if password is at least 8 characters, contains a number, an uppercase letter, and a lowercase letter
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return regex.test(password); //returns true if all requirements are met, false otherwise
}

//register a login
async function registerLogin(username, password) {
  if (!checkPasswordStrength(password)) {
    showNotification("Password must be at least 8 characters long and include a number, an uppercase letter, and a lowercase letter.");
    return false;
  }
  let hashedPassword = await hashPassword(password);
  const userData = {
    username: username,
    password: hashedPassword
  };
  localStorage.setItem(LOGIN_KEY, JSON.stringify(userData));
  userloggedIn = true;
  console.log("User registered successfully"); //debugging
  showNotification("User registered successfully!");
  await checkCredentials(username, password);
  registerButton.classList.add("hidden");
  loginButton.classList.remove("hidden");
  loginDiv.classList.add('hidden');
  mainApp.classList.remove('hidden');
  renderPastSessions();
  loginFormEl.reset();
}

//when register button clicked
registerButton.onclick = async () => {
  const username = usernameInputEl.value;
  const password = passwordInputEl.value;
  if (username && password) {
    await registerLogin(username, password);
    usernameInputEl.value = '';
    passwordInputEl.value = '';
  } else {
    showNotification("Please enter username and password.");
    return;
  }
};

//logout
logoutButton.onclick = () => {
  loginFormEl.reset();
  userloggedIn = false;
  //remove all logins upon logout (debugging)
  //localStorage.removeItem(LOGIN_KEY);
  loginDiv.classList.remove('hidden');
  mainApp.classList.add('hidden');
  showNotification("Logged out successfully.");
};

//login event listener
loginButton.onclick = async () => {
  //event.preventDefault();
  const inputUsername = usernameInputEl.value;
  const inputPassword = passwordInputEl.value;

  if (!inputUsername || !inputPassword) {
    showNotification("Please enter username and password.");
    return;
  }

  //check credentials
  if (await checkCredentials(inputUsername, inputPassword)) {
    //login successful
    userloggedIn = true;
    loginDiv.classList.add('hidden');
    console.log("Login successful"); //debugging
    mainApp.classList.remove('hidden');
    loginFormEl.reset(); //reset login form
    newSessionFormEl.reset(); //resets form in case user had inputted data before logging in
    renderPastSessions(); //renders sessions upon login
  } else {
    showNotification("Invalid username or password.");
    return;
  }
};





//mainapp JS

//sanitisation function to prevent XSS attacks
function sanitiseInput(input) {
  return DOMPurify.sanitize(input);
}

//displays a message to users ie session added
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000); //disappears after 3 seconds
}

newSessionFormEl.addEventListener("reset", () => {
  editing = false;
  editingSession = null;
  submitButton.textContent = "Add Session";
});

// Listen to form submissions.
newSessionFormEl.addEventListener("submit", (event) => {
  //checks if editing or submitting new session
  if (!editing) {
    const checkSubmit = window.confirm("Are you sure you want to submit this session?"); //confirmation pop up for submitting session
    if (!checkSubmit) {
      return;
    }
  }
  
  // console.log('You have clicked on the button.')
  // Prevent the form from submitting to the server
  // since everything is client-side.
  event.preventDefault();

  // Get the start and end dates, and description from the form.
  const date = dateInputEl.value;
  const desc = sanitiseInput(descriptionInputEL.value); //sanitises description input to prevent XSS attacks

  //checks if description is empty after sanitisation
  if (!desc.trim()) { //removes whitespace and checks if description is empty
    showNotification("Description is invalid or empty after sanitisation. Please enter valid text.");
    return;
  }

  const startTime = startTimeInputEl.value;
  const endTime = endTimeInputEl.value;

  // Check if the date is invalid
  if (checkDateInvalid(date)) {
    // If the date is invalid, exit.
    return;
  }

  // Check if the times are invalid
  if (checkTimesInvalid(startTime, endTime, date)) {
    // If the times are invalid, exit.
    return;
  }

  if (editing) { //if editing is true
    const confirmEdit = window.confirm("Are you sure you want to edit this session?"); //confirmation pop up for editing session
    if (!confirmEdit) {
      return;
    } else {
      deleteSession(editingSession.date, editingSession.startTime, editingSession.endTime, editingSession.desc); //deletes old session
      editing = null; //resets editing state
      submitButton.textContent = "Add Session"; //resets button text
    }
  }

  // Store the new session in our client-side storage.
  storeNewSession(date, startTime, endTime, desc);

  // Refresh the UI.
  renderPastSessions();

  // Reset the form.
  newSessionFormEl.reset();
});

function checkDateInvalid(date) {
  // Check that date is not null.
  if (!date) {
    // as date is invalid, we return true
    return true;
  }

  //checks if date is in future
  const today = new Date(); //gets todays date
  today.setHours(0, 0, 0, 0); //sets time to 00:00 to compare only date
  const inputDate = new Date(date); //gets input date as date object
  if (inputDate > today) {
    showNotification("Future dates are not allowed.");
    return true;
  }

  // else
  return false;
}

function checkTimesInvalid(startTime, endTime, date) {

  const sessions = getAllStoredSessions();
  //checks if times overlap with existing session on the same day
  for (const session of sessions) {
    if (session.date === date) { //only checks sessions on the same day
      //skip the session being edited to allow changes
      if (editing && session.date === editingSession.date && session.startTime === editingSession.startTime 
        && session.endTime === editingSession.endTime && session.desc === editingSession.desc) {
        continue;
      }
      //checks if the new session overlaps with the existing session
      if (startTime === session.startTime && endTime === session.endTime) {
        showNotification("Session already exists with the same start and end time.");
        return true;
      }
      //checks if new sesh starts before existing sesh ends, and if new sesh ends after exising sesh starts
      if (startTime < session.endTime && endTime > session.startTime) { 
        showNotification("Time overlaps with existing session.");
        return true;
      }
    }
  }
  // Check that end time is after start time and neither is null.
  
  if (!startTime || !endTime || startTime > endTime) {
    showNotification("Time is invalid");
    // as times are invalid, we return true
    return true;
  }
  // else
  return false;
}

function storeNewSession(date, startTime, endTime, desc) {
  // Get data from storage.
  const sessions = getAllStoredSessions();

  // Add the new session object to the end of the array of session objects.
  sessions.push({ date, startTime, endTime, desc });

  // Sort the array so that sessions are ordered by date, from newest
  // to oldest.
  sessions.sort((a, b) => {
    //declare constants for the date of session a and b
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    //if dates are different
    if (dateA -dateB !== 0) {
      //sort by date with newest first
      return dateB - dateA;
    }

    //if dates are the same (ie multiple sessions in a day)
    //sort by time
    return a.startTime.localeCompare(b.startTime); // "HH:MM" strings compare correctly alphabetically

  });



  // Store the updated array back in the storage.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

  //alert user of successful addition of session
  showNotification("Session added successfully!");
}

function getAllStoredSessions() {
  // Get the string of session data from localStorage
  const data = window.localStorage.getItem(STORAGE_KEY);

  // If no sessions were stored, default to an empty array
  // otherwise, return the stored data as parsed JSON
  const sessions = data ? JSON.parse(data) : [];

  return sessions;
}

function renderLazySessions() {
    const allSessions = getAllStoredSessions();
    //only take a slice of the array to reduce no. of sesh
    const visibleSessions = allSessions.slice(0, sessionsShown);
    
    renderPastSessions(visibleSessions);
    
    //adds a button to load more if there are more sessions left
    if (sessionsShown < allSessions.length) {
        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.onclick = () => {
            sessionsShown += 10;
            renderLazySessions();
        };
        pastSessionContainer.appendChild(loadMoreBtn);
    }
}

function renderPastSessions(filteredSessions) {

  //checks if user is logged in
  //if user is not logged in, exit function to prevent rendering sessions
  if (!userloggedIn) {
    return;
  }

  if (filteredSessions) { //checks if filteredSessions has a value (ie search function has been used)
    sessions = filteredSessions;
  } else {
    // get the parsed string of sessions, or an empty array.
    sessions = getAllStoredSessions();

    //sort all sessions
    sessions.sort((a, b) => {
      //declare constants for the date of session a and b
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      //if dates are different
      if (dateA -dateB !== 0) {
        //sort by date with newest first
        return dateB - dateA;
      }

      //if dates are the same (ie multiple sessions in a day)
      //sort by time
      return a.startTime.localeCompare(b.startTime); //"HH:MM" strings compare correctly alphabetically

    });
  }
  

  // Clear the list of past sessions, since we're going to re-render it.
  pastSessionContainer.textContent = "";

  // exit if there are no sessions
  if (sessions.length === 0) {
    console.log("no sessions to render"); //debugging
    return;
  }

  const pastSessionHeader = document.createElement("h2");
  pastSessionHeader.textContent = "Past sessions";

  const totalHoursContainer = document.createElement("div");
  totalHoursContainer.id = "totalHoursContainer";
  const totalHoursText = document.createElement("p");
  totalSessions = getAllStoredSessions(); //makes it so that total hours reflects all sessions even when search filters are applied
  const total = calculateTotalHours(totalSessions);
  totalHoursText.textContent = `Total Hours: ${total.hours}h ${total.minutes}m`;

  const pastSessionList = document.createElement("ul");

  // Loop over all sessions and render them.
  sessions.forEach((session) => {
         
    const sessionEl = document.createElement("li");
    sessionEl.innerHTML = `${formatDate(session.date)} from ${formatTime(session.startTime)} to ${formatTime(session.endTime)} <br>${sanitiseInput(session.desc)}`;

    //time spent on session
    const sessionTime = document.createElement("p");
    const sessionDuration = calculateSessionHours(session.startTime, session.endTime);
    if (sessionDuration.hours === 0) {
      sessionTime.textContent = `${sessionDuration.minutes} mins`;
    } else if (sessionDuration.minutes === 0) {
      sessionTime.textContent = `${sessionDuration.hours} hr`;
    } else {
      sessionTime.textContent = `${sessionDuration.hours}h ${sessionDuration.minutes}m`;
    }
    sessionTime.id = "sessionTimePara";
    

    //Buttons container to hold the edit and delete buttons for each session
    const buttonContainer = document.createElement("div");
    buttonContainer.id="buttonContainer";

    //appends session time to buttonContainer
    buttonContainer.appendChild(sessionTime);

    //creates edit and delete buttons for each session

    //edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function() {
      //call the editSession function with the session data
      editSession(session.date, session.startTime, session.endTime, session.desc);
    });
    
    //delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      //call the deleteSession function with the session data
      const confirmDelete = window.confirm("Are you sure you want to delete this session? This action cannot be undone."); //confirmation pop up for deleting session
      if (!confirmDelete) {
        return;
      } else {
        deleteSession(session.date, session.startTime, session.endTime, session.desc);
        showNotification("Session deleted successfully");
      }
    });

    //appends edit and delete buttons to each session
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    //appends button container to sessionEl
    sessionEl.appendChild(buttonContainer)

    //appends sessionEl to pastSessionList
    pastSessionList.appendChild(sessionEl);


  });

  //appends header, total hours, and list of sessions to pastSessionContainer
  pastSessionContainer.appendChild(pastSessionHeader);
  pastSessionContainer.appendChild(pastSessionList);
  totalHoursContainer.appendChild(totalHoursText);
  pastSessionHeader.appendChild(totalHoursContainer);
}

//edit session
function editSession(date, startTime, endTime, desc) {

  submitButton.textContent = "Confirm"; //change button text to show editing

  renderPastSessions(); //rerender sessions to show the editing highlight
  document.getElementById("date").value = date;
  document.getElementById("start-time").value = startTime;
  document.getElementById("end-time").value = endTime;
  document.getElementById("description").value = desc;
  desc = sanitiseInput(desc); //sanitises description to prevent XSS attacks

  //checks if description is empty after sanitisation
  if (!desc.trim()) { //removes whitespace and checks if description is empty
    showNotification("Description is invalid or empty after sanitisation. Please enter valid text.");
    //newSessionFormEl.reset();
    return;
  }

  editing = true;

  editingSession = {date, startTime, endTime, desc}; //saves old session data
}




//delete session
function deleteSession(date, startTime, endTime, desc) {
  const sessions = getAllStoredSessions();
  // searches for exact session in sessions array upon clicking the delete button
  // requires exact match of date, start time, end time, and description to delete the session
  const index = sessions.findIndex(session => session.date === date && session.startTime === startTime && session.endTime === endTime && session.desc === desc);
  if (index !== -1) {
    sessions.splice(index, 1); //removes the session from the sessions array
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); //updates local storage
    renderPastSessions(); //rerenders the past sessions to reflect the deletion
  }
}  

function formatDate(dateString) {
  // Stored input dates are in yyyy-mm-dd, so format directly to avoid locale/timezone issues.
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  // Fallback for unexpected date values.
  return dateString;

}

function formatTime(timeString) {
  // Change from 24-hour to 12-hour format

  // Separate hour and minutes from timeString
  const [hour, minute] = timeString.split(':');

  // Convert hour from string to integer
  intHour= parseInt(hour);

  // Determine if AM or PM
  period = "AM";
  if (intHour >= 12) {
    if (intHour > 12) {
      intHour -= 12;
    }
    period = "PM";
  }
 
  // Display 0 hours as 12 AM
  if (intHour == 0) {
    intHour = 12;
  }

  // Format 12 hour time string
  const formattedTime = intHour + ":" + minute + " " + period;

  return formattedTime;
}


renderPastSessions();


//toggle search
function toggleSearch() {
  searchFormEl.reset();
  renderPastSessions();
  if (searchContainer.classList.contains("hidden")) {
    toggleSearchButton.textContent = "Close Search";
  } else {
    toggleSearchButton.textContent = "Open Search";
  }
  searchContainer.classList.toggle("hidden");
}


toggleSearchButton.onclick = toggleSearch;


//check criteria function
function checkMatch(session, criteria) {
  //checks if the user has inputted in search criteria (skips if statement if empty), then if that is true it checks if session data matches criteria

  if (criteria.date && session.date !== criteria.date) {
    return false;
  }
  if (criteria.startTime && session.startTime !== criteria.startTime) {
    return false;
  }
  if (criteria.endTime && session.endTime !== criteria.endTime) {
    return false;
  }
  if (criteria.desc && !session.desc.includes(criteria.desc)) {
    console.log('hereindesc') //debugging
    return false;
  }
  
  return true;
}


//search function
function search() {
  visibleSessions = 10; //resets number to 10 seshs
  const searchCriteria = {};

  //checks if user has inputted search criteria
  //if true it adds the criteria
  if (searchDateInputEl.value) {
    searchCriteria.date = searchDateInputEl.value;
  }
  if (searchStartTimeInputEl.value) {
    searchCriteria.startTime = searchStartTimeInputEl.value;
  }
  if (searchEndTimeInputEl.value) {
    searchCriteria.endTime = searchEndTimeInputEl.value;
  }
  if (searchDescInputEl.value) {
    searchCriteria.desc = sanitiseInput(searchDescInputEl.value);
  }
  console.log(searchCriteria); //debugging
  const sessions = getAllStoredSessions();
  const filteredSessions = sessions.filter(session => checkMatch(session, searchCriteria));

  renderPastSessions(filteredSessions);

}

//clear all function
function clearAll() {
  const confirm = window.confirm("Are you sure you want to clear all sessions? This will also clear your current session. This action cannot be undone.");
  if (confirm) {
    //clear all stored sessions
    newSessionFormEl.reset();
    localStorage.removeItem(STORAGE_KEY);
    //rerender the past sessions to reflect the deletion
    renderPastSessions([]);
  } else {
    return;
  }
  
}

clearAllButton.onclick = clearAll;

filterType.onchange = (event) => {
  filterTypeValue = filterType.value;
  console.log(filterTypeValue) // debugging
}

//filters 

filterOrder.onchange = (event) => {
  filterOrderValue = filterOrder.value;
  console.log(filterOrderValue); //debugging
}

function filter() {
  sessions = getAllStoredSessions();
  visibleSessions = 10; //resets number to 10 seshs

  //validates values
  if (filterTypeValue === null || filterOrderValue === null || filterTypeValue === "filterTypeSelect" 
    || filterOrderValue === "filterOrderSelect") {
    console.log('filters incomplete')  //debugging
    showNotification("Filters are missing!")
    return
  }

  //sorting
  sessions.sort((a, b) => {
    let valueA, valueB;

    //Determine which option to sort by
    if (filterTypeValue === "filterDate") {
      valueA = new Date(a.date);
      valueB = new Date(b.date);
    } else if (filterTypeValue === "filterStartTime") {
      valueA = a.startTime;
      valueB = b.startTime;
    } else if (filterTypeValue === "filterEndTime") {
      valueA = a.endTime;
      valueB = b.endTime;
    }

    //primary sort
    if (valueA > valueB) {
      return filterOrderValue === "ascending" ? 1 : -1;
    } else if (valueA < valueB) {
      return filterOrderValue === "ascending" ? -1 : 1;
    }

    //secondary sort if primary values are the same (eg multiple sessions in a day when sorting by date)
    if (filterOrderValue === "ascending") {
      return a.startTime.localeCompare(b.startTime);
    } else {
      return b.startTime.localeCompare(a.startTime);
    }
    
  });
  renderPastSessions(sessions);
}

filterButton.onclick = filter;

searchFormEl.addEventListener("reset", (event) => {
  filterTypeValue = null;
  filterOrderValue = null;
  renderPastSessions();
});

function calculateTotalHours(sessions) {
  let totalMinutes = 0;

  //each session split into hours, mins, then added together
  sessions.forEach(session => {
    totalMinutes += calculateSessionHours(session.startTime, session.endTime).hours * 60 + calculateSessionHours(session.startTime, session.endTime).minutes;
  });

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
}

function calculateSessionHours(starttime, endtime) {
  let sessionMinutes = 0;

  const [startH, startM] = starttime.split(':').map(Number);
  const [endH, endM] = endtime.split(':').map(Number);

  const startTotal = (startH * 60) + startM;
  const endTotal = (endH * 60) + endM;

    if (endTotal > startTotal) {
      sessionMinutes += (endTotal - startTotal);
    }

  return {
    hours: Math.floor(sessionMinutes / 60),
    minutes: sessionMinutes % 60
  };
}