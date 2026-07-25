// configure the different 'pages', given that is an SPA
const routes = {
    '/': { // home page
        title: 'Home',
        content: `

            <h1 class="title">Digital U</h1>
            <h2 class="title">You. Digitised.</h2>

            <div class='buttonDiv'>
                <button type="button" onclick="navigate('/register/')" class="transparent" id="startButton">Get Started</button>
            </div>
            
            <div class="wrapper index">
                <p>Your one stop shop for networking and connectivity.</p>
                <form id="userSearchForm">
                    <div class="inputBox index">
                        <input type="text" name="search" id="search" placeholder="Search for user..." autocomplete="off">
                    </div>
                    <button type="submit" class="btn">Search</button>
                </form>
                <div id="searchResults" class="searchResults" aria-live="polite"></div>
            </div>
        `
    },
    '/register/': { // register
        title: 'Register',
        content: `
            <div class="wrapper">
                <h1>Register</h1>
                <form>
                    <div class="inputBox">
                        <input type="email" placeholder="Email" id="email" name="email" required>
                    </div>
                    <div class="inputBox">
                        <input type="password" id="password" name="password" placeholder="Password" required>
                    </div>
                    <div class="inputBox">
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>
                    </div>

                    <button type="submit" id="submitButton" class="btn">Register</button>

                    <div class="registerLink">
                        <p>Already have an account? <a href="/login/">Login</a></p>
                    </div>
                </form>
            </div>
        `
    },
    '/login/': { //login
        title: 'Login',
        content: `
            <div class="wrapper">
                <h1>Login</h1>
                <form>
                    <div class="inputBox">
                        <input type="email" placeholder="Email" id="email" name="email" required>
                    </div>
                    <div class="inputBox">
                        <input type="password" placeholder="Password" id="password" name="password" required>
                    </div>

                    <button type="submit" class="btn" id="submitButton">Login</button>

                    <div class="registerLink">
                        <p>Don't have an account? <a href="/register/">Register</a></p>
                    </div>
                </form>
            </div>
        `
    },
    '/user/': { //public profile
        title: 'Profile',
        content: `
            <div class="wrapper">
                <h1 id="publicProfileTitle">Profile</h1>
                <div id="publicProfileBody"></div>
            </div>
        `
    },
    '/profile/': { //profile (edit)
        title: 'Profile',
        content: `
            <div class="wrapper index">
                <h1>Profile</h1>
                <p>Setup your profile. Only put in what you want to show. Only the inputs outlined in red are required.</p>
                <form id="profileForm">
                    <div class="inputBox profileInput">
                        <label for="profileName">Display Name</label>
                        <input type="text" name="profileName" placeholder="Display name" id="profileName" required>
                    </div>
                    <div class="inputBox profileInput">
                        <label for="profileUsername">Username</label>
                        <input type="text" name="profileUsername" placeholder="Username" id="profileUsername" required>
                    </div>
                    <div class="inputBox profileInput">
                        <label for="profilePhone">Phone Number</label>
                        <input type="tel" name="profilePhone" placeholder="Phone Number" pattern="[0-9]{10}" id="profilePhone">
                    </div>
                    <div class="inputBox profileInput">
                        <label for="displayEmail">Display Email</label>
                        <input type="email" placeholder="Display Email" id="displayEmail" name="displayEmail">
                    </div>
                    <div class="inputBox profileInput">
                        <label for="websiteName">Website Name</label>
                        <input type="text" placeholder="Website Name" id="websiteName" name="websiteName">
                    </div>
                    <div class="inputBox profileInput">
                        <label for="displayWebsite">Website Link</label>
                        <input type="text" placeholder="Website Link" id="displayWebsite" name="displayWebsite">
                    </div>
                    <div class="inputBox profileInput">
                        <label for="displayLinkedin">LinkedIn</label>
                        <input type="text" placeholder="LinkedIn" id="displayLinkedin" name="displayLinkedin">
                    </div>
                    <div class="inputBox profileInput">
                        <label for="displayInstagram">Instagram</label>
                        <input type="text" placeholder="Instagram" id="displayInstagram" name="displayInstagram">
                    </div>
                    <div class="inputBox profileInput">
                        <label for="displayFacebook">Facebook</label>
                        <input type="text" placeholder="Facebook" id="displayFacebook" name="displayFacebook">
                    </div>
                    <div class="inputBox profileInput">
                        <label for="displaySlack">Slack</label>
                        <input type="text" placeholder="Slack" id="displaySlack" name="displaySlack">
                    </div>
                    <button type="submit" class="btn" id="updateProfileSubmit">Save</button>
                    <button type="button" class="btn hidden" id="viewPublicProfile">View Public Profile</button>
                </form>
            </div>
        `
    }
};

// return supabase client if it exists
function getSupabaseClient() {
    return window.supabase || null;
}

// gets username from url path and clean it, normalise it
function extractUsernameFromPath(pathname) {
    const rawPath = (pathname || window.location.pathname || '/').split('?')[0].split('#')[0];
    const cleaned = rawPath.replace(/^\/index\.html/i, '') || '/';
    const normalised = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    const parts = normalised.replace(/\/+$/g, '').split('/').filter(Boolean);

    // only /user/<name> paths have a username, anything else has none
    if (parts[0] !== 'user' || !parts[1]) {
        return '';
    }

    // decode any url encoding and lowercase so lookups are consistent
    return decodeURIComponent(parts[1]).toLowerCase();
}

// escape special characters for safety
function escapeHtml(value) {
    // replace & first so the other replacements dont get double escaped
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Creates url for public profiles
function buildProfileLink(label, value) {
    const rawValue = String(value || '').trim();
    // strip a leading @ so handles like @user still build a clean link
    const cleanValue = rawValue.replace(/^@/, '');

    // nothing to link to if the field is empty
    if (!cleanValue) {
        return null;
    }
    // specific cases for how different 'chips' will be shown
    if (label === 'Email') {
        return `mailto:${cleanValue}`;
    }

    if (label === 'Phone') {
        return `tel:${cleanValue}`;
    }

    if (label === 'Website') {
        return /^https?:\/\//i.test(cleanValue) ? cleanValue : `https://${cleanValue}`;
    }

    if (label === 'LinkedIn') {
        return /^https?:\/\//i.test(cleanValue) ? cleanValue : `https://www.linkedin.com/in/${cleanValue}`;
    }

    if (label === 'Instagram') {
        return /^https?:\/\//i.test(cleanValue) ? cleanValue : `https://www.instagram.com/${cleanValue}`;
    }

    if (label === 'Facebook') {
        return /^https?:\/\//i.test(cleanValue) ? cleanValue : `https://www.facebook.com/${cleanValue}`;
    }

    return null;
}

// icons for the profile page
const prof_icons= {
    Phone: 'phone.png',
    Email: 'email.png',
    Website: 'website.png',
    LinkedIn: 'linkedin.png',
    Instagram: 'instagram.png',
    Facebook: 'facebook.png',
    Slack: 'slack.png',
};

// return html for the chip label (profile) -> icon and name
function profileChipLabel(label) {
    const icon = prof_icons[label];
    if (icon) {
        return '<span class="profileChipLabel"><img class="profileChipIcon" src="/static/images/' +
            icon + '" alt="' + escapeHtml(label) + '"></span>';
    }
    return '<span class="profileChipLabel">' + escapeHtml(label) + '</span>';
}

// render the public profile into the DOM
function renderPublicProfile(profile) {
    const body = document.getElementById('publicProfileBody');
    const title = document.getElementById('publicProfileTitle');

    // bail if the profile page isn't on screen
    if (!body) {
        return;
    }

    // no profile passed in means the username didnt match anyone
    if (!profile) {
        if (title) {
            title.textContent = 'Profile not found';
        }

        body.innerHTML = '<p>No user matched that username.</p>';
        return;
    }

    // prefer the display name, fall back to username then a generic title
    if (title) {
        title.textContent = profile.display_name || profile.username || 'Profile';
    }

    // build a chip for each contact detail, then join them into one block
    const rows = [
        ['Phone', profile.phone],
        ['Email', profile.display_email],
        ['Website', profile.website_name],
        ['LinkedIn', profile.linkedin],
        ['Instagram', profile.instagram],
        ['Facebook', profile.facebook],
        ['Slack', profile.slack],
    ]
        // drop any detail the user left blank
        .filter(([, value]) => value)
        .map(([label, value]) => {
            const displayValue = escapeHtml(String(value).trim());

            // website is special: label shows the name but the link uses the url field
            if (label === 'Website') {
                const websiteHref = buildProfileLink('Website', profile.website);

                if (websiteHref) {
                    return '<a class="profileChip" href="' + escapeHtml(websiteHref) + '" target="_blank" rel="noopener noreferrer">' +
                        profileChipLabel(label) +
                        '<span class="profileChipValue">' + displayValue + '</span>' +
                    '</a>';
                }

                return '<div class="profileChip">' +
                    profileChipLabel(label) +
                    '<span class="profileChipValue">' + displayValue + '</span>' +
                '</div>';
            }

            const href = buildProfileLink(label, value);

            // no link for this one, so show it as plain text instead of an anchor
            if (!href) {
                return '<div class="profileChip">' +
                    profileChipLabel(label) +
                    '<span class="profileChipValue">' + displayValue + '</span>' +
                '</div>';
            }

            return '<a class="profileChip" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">' +
                profileChipLabel(label) +
                '<span class="profileChipValue">' + displayValue + '</span>' +
            '</a>';
        })
        .join('');

    // show the chips, or a fallback message if they filled nothing in
    body.innerHTML = rows ? '<div class="profileChips">' + rows + '</div>' : '<p>No profile details available.</p>';
}

// load profile from Supabase and render
async function loadPublicProfile(pathname) {
    const username = extractUsernameFromPath(pathname);
    const app = document.getElementById('app');
    const supabase = getSupabaseClient();

    // nowhere to render into, so stop here
    if (!app) {
        return;
    }

    // placeholder in case of slow connection whilst it loads
    app.innerHTML = `
        <div class="wrapper">
            <h1 id="publicProfileTitle">Profile</h1>
            <div id="publicProfileBody"><p>Loading profile...</p></div>
        </div>
    `;

    document.title = `${username || 'Profile'} | Digital U`;

    // no username in the url means theres nothing to look up
    if (!username) {
        renderPublicProfile(null);
        return;
    }

    // tell the user when the backend isnt wired up
    if (!supabase) {
        const body = document.getElementById('publicProfileBody');
        const title = document.getElementById('publicProfileTitle');

        if (title) {
            title.textContent = 'Profile unavailable';
        }

        if (body) {
            body.innerHTML = '<p>Supabase is not configured.</p>';
        }

        return;
    }

    // Query 'profiles' table for user and retrieve data
    const { data, error } = await supabase
        .from('profiles')
        .select('display_name, username, phone, display_email, linkedin, website_name, website, instagram, facebook, slack')
        .eq('username', username)
        .maybeSingle();

    // query failed, so log it and show a friendly error instead
    if (error) {
        console.error(error);
        renderPublicProfile(null);
        const body = document.getElementById('publicProfileBody');

        if (body) {
            body.innerHTML = '<p>Unable to load this profile.</p>';
        }

        return;
    }

    // data is null here if no row matched, renderPublicProfile handles that
    renderPublicProfile(data);
}

// Search for usernames in Supabase
async function searchUsers(query) {
    const supabase = getSupabaseClient();

    // check for backend
    if (!supabase) {
        return [];
    }

    // tidy the query so the search is case insensitive
    const trimmed = query.trim().toLowerCase();

    // empty search returns nothing rather than every user
    if (!trimmed) {
        return [];
    }

    // strips of special chars
    const safe = trimmed.replace(/[,()"%_\\]/g, '');

    // returns if no value left
    if (!safe) {
        return [];
    }

    // prefix match on username/display name, cap at 8 so the dropdown stays short
    const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name')
        .or(`username.ilike.${safe}%,display_name.ilike.${safe}%`)
        .order('username', { ascending: true })
        .limit(8);

    if (error) {
        console.error(error);
        return [];
    }

    return data || [];
}

// Render search results on home page
function renderSearchResults(results) {
    const container = document.getElementById('searchResults');

    // nowhere to show results
    if (!container) {
        return;
    }

    // hint the user when nothing matched their query
    if (!results.length) {
        container.innerHTML = '<p class="searchHint">No matching user yet.</p>';
        return;
    }

    // one clickable button per matching user
    container.innerHTML = results.map((result) => `
        <button type="button" class="searchResult" data-username="${escapeHtml(result.username)}">
            <strong>${escapeHtml(result.username)}</strong>
            ${result.display_name ? `<span>${escapeHtml(result.display_name)}</span>` : ''}
        </button>
    `).join('');
}

// Initialise home page search
function initHomeSearch() {
    const searchInput = document.getElementById('search');
    const searchForm = document.getElementById('userSearchForm');

    // search form isn't on this page, nothing to set up
    if (!searchInput || !searchForm) {
        return;
    }

    // stops the form binding its listeners twice on repeat visits
    if (searchForm.dataset.bound === 'true') {
        return;
    }

    // mark it as bound so the guard above works next time
    searchForm.dataset.bound = 'true';

    // tracks the latest query so we can ignore out of date results
    let activeQuery = '';

    const handleSearch = async () => {
        const query = searchInput.value.trim();
        activeQuery = query;

        if (!query) {
            renderSearchResults([]);
            return;
        }

        const results = await searchUsers(query);

        // a newer keystroke already fired, so drop this stale result
        if (activeQuery !== query) {
            return;
        }

        renderSearchResults(results);
    };

    // search as the user types and when they focus the box
    searchInput.oninput = handleSearch;
    searchInput.onfocus = handleSearch;
    searchForm.onsubmit = async (event) => {
        // stop the form doing a full page reload
        event.preventDefault();

        const results = await searchUsers(searchInput.value);
        renderSearchResults(results);

        // exactly one match, so jump straight to that profile
        if (results.length === 1) {
            navigate(`/user/${encodeURIComponent(results[0].username)}`);
        }
    };

    // one listener on the container handles clicks for every result button
    document.getElementById('searchResults')?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-username]');

        // clicked somewhere that isn't a result
        if (!button) {
            return;
        }

        const username = button.getAttribute('data-username');

        // open the clicked user's public profile
        if (username) {
            navigate(`/user/${encodeURIComponent(username)}`);
        }
    });
}

// make /index.html and / the same thing by normalising the path
function normalisePath(pathname) {
    const params = new URLSearchParams(window.location.search);
    // ?p=/route lets a redirect pass the intended path through
    const routeParam = params.get('p');
    const fromParam = routeParam ? routeParam.split('?')[0].split('#')[0] : '';
    // strip any query string and hash off the path
    const rawPath = (pathname || fromParam || window.location.pathname || '/').split('?')[0].split('#')[0];

    // treat the root and index.html as the home route
    if (!rawPath || rawPath === '/' || rawPath === '/index.html') {
        return '/';
    }

    const path = rawPath.replace(/^\/index\.html/i, '') || '/';
    // make sure the path starts with a slash
    const prefixedPath = path.startsWith('/') ? path : `/${path}`;
    // drop any trailing slashes so we can add exactly one back
    const trimmed = prefixedPath.replace(/\/+$/g, '').replace(/\/$/, '');

    // return the path with a single trailing slash to match the routes keys
    return trimmed ? `${trimmed}/` : '/';
}

// render route into app container
async function renderRoute(pathname) {
    const username = extractUsernameFromPath(pathname);
    const app = document.getElementById('app');

    // a /user/ path loads a live profile instead of a static route
    if (username) {
        await loadPublicProfile(pathname);
        document.dispatchEvent(new Event('route:rendered'));
        return;
    }

    // look up the route, fall back to home if the path is unknown
    const route = routes[normalisePath(pathname)] || routes['/'];

    if (app) {
        app.innerHTML = route.content;
    }

    document.title = `${route.title} | Digital U`;
    // let other listeners know the page just changed
    document.dispatchEvent(new Event('route:rendered'));
}

// Navigate to new route by updating browser history
function navigate(pathname) {
    const normalised = normalisePath(pathname);
    // update the address bar without reloading the page
    window.history.pushState({}, '', normalised);
    renderRoute(normalised);
}

// Handle clicks on navigation links
document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-route]');

    // clicked something that isn't an internal route link
    if (!link) {
        return;
    }

    const targetPath = link.getAttribute('href') || '/';

    // Skips handling for these cases -> browser will handle it normally
    if (targetPath.startsWith('http') || targetPath.startsWith('mailto:') || targetPath.startsWith('#')) {
        return;
    }

    event.preventDefault();
    navigate(targetPath);
});

// Handles browser back/forward nav
window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
});

// initial page load
document.addEventListener('DOMContentLoaded', () => {
    renderRoute(window.location.pathname);
});

// grab the home nav button and its label text
const homeNav = document.getElementById('homeNav');
const navText = document.getElementById('navText');

// Toggle nav text on hover, only if both elements exist
if (homeNav && navText) {
    homeNav.addEventListener('mouseenter', () => {
        navText.classList.add('show');
    });

    homeNav.addEventListener('mouseleave', () => {
        navText.classList.remove('show');
    });
}

// Reinitialise the search form when returning to the home page after navigation
document.addEventListener('route:rendered', () => {
    if (normalisePath(window.location.pathname) === '/') {
        initHomeSearch();
    }
});