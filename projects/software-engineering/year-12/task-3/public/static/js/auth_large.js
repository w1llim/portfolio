import supabase from "./supabaseClient.js";

// every profile field: how it maps to a db column, the matching input id,
// whether its required, and how to clean the value before saving
const PROFILE_FIELDS = [
  {
    key: "display_name",
    id: "profileName",
    required: true,
    transform: (v) => v.trim(),
  },
  {
    key: "username",
    id: "profileUsername",
    required: true,
    transform: (v) => v.trim().toLowerCase(),
  },
  { key: "phone", id: "profilePhone" },
  { key: "display_email", id: "displayEmail" },
  { key: "website_name", id: "websiteName" },
  { key: "linkedin", id: "displayLinkedin" },
  { key: "website", id: "displayWebsite" },
  { key: "instagram", id: "displayInstagram" },
  { key: "facebook", id: "displayFacebook" },
  { key: "slack", id: "displaySlack" },
];

// comma separated column list for supabase selects, built from the fields above
const PROFILE_COLUMNS = PROFILE_FIELDS.map((field) => field.key).join(", ");

// the username as it currently exists in the database, so the public profile
// button never links to a username that hasnt been saved yet
let savedUsername = "";

// show a small popup message, then hide it again after a delay
function showToast(message, time) {
  const toast = document.getElementById("toast");
  // no toast element on the page, nothing to show
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.remove("hidden");
  // hide it again after the given time, defaults to 3 seconds
  setTimeout(() => {
    toast.classList.add("hidden");
  }, time || 3000);
}

// Returns true when the backend is available, otherwise warns the user
function requireSupabase() {
  if (!supabase) {
    showToast(
      "Supabase is not configured. Add your URL and anon key to the page script.",
    );
    return false;
  }
  return true;
}

// Resolves the current user, or null (showing the relevant message) when not signed in.
async function requireUser(loginMessage) {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  // AuthSessionMissingError just means nobody is signed in, which is a normal
  // state rather than a fault, so it is handled as "please log in" below
  if (authError && authError.name !== "AuthSessionMissingError") {
    console.error(authError);
    showToast("Unable to read the current session.");
    return null;
  }

  const user = authData?.user;
  // no user means nobody is signed in, so nudge them to log in
  if (!user) {
    showToast(loginMessage);
    return null;
  }

  return user;
}

// grab the profile form plus every field input in one object
function getProfileInputs() {
  const inputs = {
    form: document.getElementById("profileForm"),
    submitButton: document.getElementById("updateProfileSubmit"),
    viewButton: document.getElementById("viewPublicProfile"),
  };

  // add each field's input element keyed by its id
  for (const field of PROFILE_FIELDS) {
    inputs[field.id] = document.getElementById(field.id);
  }

  return inputs;
}

// only offer the public profile button once theres a saved profile to link to
function setViewButtonVisible(visible) {
  const viewButton = document.getElementById("viewPublicProfile");

  // not on the profile page, so theres no button to toggle
  if (!viewButton) {
    return;
  }

  viewButton.classList.toggle("hidden", !visible);
}

// fill the form inputs from a saved profile (or blanks if none)
function setProfileValues(values) {
  const inputs = getProfileInputs();

  // remember what the database currently holds, blank if theres no profile yet
  savedUsername = values?.username || "";

  // show the button only when theres something saved to view
  setViewButtonVisible(!!savedUsername);

  for (const field of PROFILE_FIELDS) {
    const input = inputs[field.id];
    if (input) {
      // use the saved value, falling back to empty if it's missing
      input.value = values?.[field.key] || "";
    }
  }
}

// load the signed in user's saved profile and drop it into the form
async function loadProfileForm() {
  const inputs = getProfileInputs();

  // not on the profile page, so nothing to load
  if (!inputs.form) {
    return;
  }

  // need the backend to fetch anything
  if (!requireSupabase()) {
    return;
  }

  // must be logged in to load their own profile
  const user = await requireUser("Please log in before editing your profile.");
  if (!user) {
    return;
  }

  // grab this user's row from the profiles table
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    showToast("Unable to load your profile.");
    return;
  }

  setProfileValues(profile);
}

// save the form back to the database when the user hits save
async function saveProfile(event) {
  // stop the form doing a full page reload
  event.preventDefault();

  const inputs = getProfileInputs();

  if (!requireSupabase()) {
    return;
  }

  const user = await requireUser("Please log in before saving your profile.");
  if (!user) {
    return;
  }

  // start the row with who owns it and when it was last touched
  const payload = {
    user_id: user.id,
    updated_at: new Date().toISOString(),
  };

  // clean each field's value and add it to the payload
  for (const field of PROFILE_FIELDS) {
    const transform = field.transform || ((v) => v.trim());
    const value = transform(inputs[field.id]?.value || "");
    // required fields save as empty string, optional ones save as null when blank
    payload[field.key] = field.required ? value || "" : value || null;
  }

  // block the save if a required field was left empty
  const missingRequired = PROFILE_FIELDS.some(
    (field) => field.required && !payload[field.key],
  );
  if (missingRequired) {
    showToast("Display name and username are required.");
    return;
  }

  // disable the button so it cant be double clicked mid save
  if (inputs.submitButton) {
    inputs.submitButton.disabled = true;
  }

  // insert or update this users row (matched on user_id)
  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" });

  // reenable the button now the request is done
  if (inputs.submitButton) {
    inputs.submitButton.disabled = false;
  }

  if (error) {
    console.error(error);
    showToast(error.message);
    return;
  }

  // gets new saved username
  savedUsername = payload.username;

  // theres now a saved profile to view, so reveal the button
  setViewButtonVisible(true);

  showToast("Profile saved successfully.");
}

// wire up the profile forms submit and load its current values
function initProfileForm() {
  const inputs = getProfileInputs();

  // form or save button missing, so theres nothing to hook up
  if (!inputs.form || !inputs.submitButton) {
    return;
  }

  // this form is already wired up, so dont bind it again and dont reload it.
  // initSupabaseAuth runs on both DOMContentLoaded and route:rendered, so
  // without this guard the reload below would wipe whatever the user has typed
  if (inputs.form.dataset.bound === "true") {
    return;
  }

  // mark it as bound so the guard above works next time
  inputs.form.dataset.bound = "true";

  inputs.form.onsubmit = saveProfile;

  // the button is only shown once a profile is saved, and it always uses the
  // saved username, so it cant send the user to a profile that doesnt exist
  if (inputs.viewButton) {
    inputs.viewButton.onclick = () => {
      // nothing saved yet, so theres no public profile to look at
      if (!savedUsername) {
        return;
      }

      navigate(`/user/${encodeURIComponent(savedUsername)}`);
    };
  }

  loadProfileForm();
}

// Changes Navbar based on if user is logged in or not
function setAuthNavState(isLoggedIn) {
  const loginNav = document.getElementById("loginNav");
  const registerNav = document.getElementById("registerNav");
  const startButton = document.getElementById("startButton");

  // logged in, goes to the profile, otherwise to login
  if (loginNav) {
    loginNav.textContent = isLoggedIn ? "Profile" : "Login";
    loginNav.setAttribute("href", isLoggedIn ? "/profile/" : "/login/");
  }

  // the register link doubles as a logout button once signed in
  if (registerNav) {
    if (isLoggedIn) {
      registerNav.textContent = "Logout";
      registerNav.removeAttribute("href");
      registerNav.onclick = async (event) => {
        event.preventDefault();
        await logOut();
      };
    } else {
      // signed out, change back to register
      registerNav.textContent = "Register";
      registerNav.setAttribute("href", "/register/");
      registerNav.onclick = null;
    }
  }

  // the home hero button points at the profile or the sign up flow
  if (startButton) {
    startButton.textContent = isLoggedIn ? "View Profile" : "Get Started";
    startButton.setAttribute(
      "onclick",
      isLoggedIn ? "navigate('/profile/')" : "navigate('/register/')",
    );
  }
}

// sync the navbar then connect whichever form is on screen
async function initSupabaseAuth() {
  const loggedIn = await checkLogin();
  setAuthNavState(loggedIn);

  // on the profile page, hand off to the profile form setup instead
  if (document.getElementById("profileForm")) {
    initProfileForm();
    return;
  }

  // no submit button means not on a login or register page
  const submitButton = document.getElementById("submitButton");
  if (!submitButton) {
    return;
  }
  // check supabase
  if (!requireSupabase()) {
    return;
  }

  const confirmPassword = document.getElementById("confirmPassword");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // a confirm password box only exists on the register page
  if (confirmPassword) {
    // guard against firing the sign up twice on quick clicks
    let isSubmitting = false;

    submitButton.onclick = async (event) => {
      event.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;
      submitButton.disabled = true;

      const emailValue = emailInput?.value?.trim();
      const passwordValue = passwordInput?.value;
      const confirmPasswordValue = confirmPassword?.value;

      // every field has to be filled in
      if (!emailValue || !passwordValue || !confirmPasswordValue) {
        showToast("Please complete all fields.");
        isSubmitting = false;
        submitButton.disabled = false;
        return;
      }

      // the two passwords have to match before we sign up
      if (passwordValue !== confirmPasswordValue) {
        showToast("Passwords do not match.");
        isSubmitting = false;
        submitButton.disabled = false;
        return;
      }

      // create the account with supabase auth
      const { error } = await supabase.auth.signUp({
        email: emailValue,
        password: passwordValue,
        options: {
          data: {},
          emailRedirectTo: window.location.origin,
        },
      });

      // sign up failed, so re-enable the form and show why
      if (error) {
        showToast(error.message);
        console.error(error);
        isSubmitting = false;
        submitButton.disabled = false;
        return;
      }

      // account made, send them to their profile shortly after
      showToast("Registration successful. Redirecting...");
      setTimeout(() => {
        window.location.href = "/profile/";
      }, 800);
    };
  } else {
    // no confirm box, so this is the login page
    submitButton.onclick = async (event) => {
      event.preventDefault();

      const inputEmail = emailInput?.value?.trim();
      const inputPassword = passwordInput?.value;

      // both fields are needed to attempt a login
      if (!inputEmail || !inputPassword) {
        showToast("Please enter email and password.");
        return;
      }

      // hand the credentials to supabase to sign in
      const { error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });

      if (error) {
        showToast(error.message);
        console.error(error);
        return;
      }

      // logged in, update the navbar and head to the profile
      setAuthNavState(true);
      showToast("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/profile/";
      }, 1000);
    };
  }
}

// Checks if user is logged in or not
async function checkLogin() {
  if (!supabase) return false; // safety check to see if backend is connected

  // getSession reads the locally stored session and returns null when there
  // isn't one. getUser() was used here previously, but it throws
  // AuthSessionMissingError for signed out visitors, which logged a red error
  // to the console on every route render even though being signed out is normal
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
    return false;
  }

  // true only if a session actually came back
  return !!data?.session;
}

// Logout
async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    showToast("Failed to sign out.");
    console.error(error);
    return;
  }
  // reset the navbar to signed out and send to home
  setAuthNavState(false);
  showToast("Logged Out.");
  window.location.href = "/";
}

// run on first load and again whenever the SPA renders a new route
document.addEventListener("DOMContentLoaded", initSupabaseAuth);
document.addEventListener("route:rendered", initSupabaseAuth);
