const baseUrl = "http://localhost:3000"; // backend URL

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.querySelector('.menu-toggle');
const closeSidebar = document.querySelector('.close-sidebar');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const historyLink = document.getElementById('historyLink');
const signupPrompt = document.getElementById('signupPrompt');


// Auth Elements
const userInfo = document.querySelector('.user-info');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const signupUsername = document.getElementById('signupUsername');
const signupPassword = document.getElementById('signupPassword');

// URL Shortener Elements
const longUrlInput = document.getElementById('longUrl');
const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');
const shortenedUrlLink = document.getElementById('shortenedUrl');
const copyBtn = document.getElementById('copyBtn');
const redirectBtn = document.getElementById('redirectBtn');

// History Elements
const historyList = document.getElementById('historyList');
const historyPage = document.getElementById('history-page');

// Toast Element
const toast = document.getElementById('toast');

let token = localStorage.getItem('token');
let currentUser = null;

// Initialize the app
function init() {
    setupEventListeners();
    checkAuth();
    showPage('home');
}

// Setup all event listeners
function setupEventListeners() {
    // Sidebar toggle
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            toggleSidebar();
        });
    });

    // Auth
    loginBtn.addEventListener('click', login);
    signupBtn.addEventListener('click', signup);
    logoutBtn.addEventListener('click', logout);

    // URL Shortener
    shortenBtn.addEventListener('click', shortenUrl);
    copyBtn.addEventListener('click', copyToClipboard);
    redirectBtn.addEventListener('click', redirectToUrl);

    // Allow form submission with Enter key
    [loginUsername, loginPassword, signupUsername, signupPassword, longUrlInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (input === longUrlInput) shortenUrl();
                else if (input === loginUsername || input === loginPassword) login();
                else if (input === signupUsername || input === signupPassword) signup();
            }
        });
    });
}

// Toggle sidebar visibility
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Show specific page
function showPage(pageName) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    // If showing history page and user is logged in, fetch URLs
    if (pageName === 'history' && token) {
        fetchUserUrls();
    }
}

// Check authentication status
// function checkAuth() {
//     if (token) {
//         try {
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             currentUser = {
//                 id: payload.userId,
//                 username: payload.username
//             };

//             // Update UI for logged in user
//             document.querySelector('.auth-forms').classList.add('hidden');
//             userInfo.classList.remove('hidden');
//             usernameDisplay.textContent = currentUser.username;
//             historyLink.classList.remove('hidden');

//             // Immediately fetch user's URLs if on history page
//             if (historyPage.classList.contains('active')) {
//                 fetchUserUrls();
//             }
//         } catch (e) {
//             console.error('Invalid token', e);
//             logout();
//         }
//     } else {
//         // Update UI for logged out user
//         document.querySelector('.auth-forms').classList.remove('hidden');
//         userInfo.classList.add('hidden');
//         historyLink.classList.add('hidden');
//         currentUser = null;
//     }
// }

function checkAuth() {
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUser = {
                id: payload.userId,
                username: payload.username
            };

            // 👇 FIX: Update UI for logged-in user
            document.querySelector('.auth-forms').classList.add('hidden');
            userInfo.classList.remove('hidden');
            usernameDisplay.textContent = currentUser.username || 'User'; // Fix display
            historyLink.classList.remove('hidden');

            // 👇 Hide the signup prompt
            signupPrompt?.classList.add('hidden');

            // Immediately fetch user's URLs if on history page
            if (historyPage.classList.contains('active')) {
                fetchUserUrls();
            }
        } catch (e) {
            console.error('Invalid token', e);
            logout();
        }
    } else {
        // 👇 Update UI for logged-out user
        document.querySelector('.auth-forms').classList.remove('hidden');
        userInfo.classList.add('hidden');
        historyLink.classList.add('hidden');
        currentUser = null;

        // 👇 Show the signup prompt
        signupPrompt?.classList.remove('hidden');
    }
}


// Show toast notification
function showToast(message, type = 'default', duration = 3000) {
    toast.textContent = message;
    toast.className = 'toast';

    if (type !== 'default') {
        toast.classList.add(type);
    }

    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, duration);
}

// Login function
async function login() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        showToast('Please enter both username and password', 'error');
        return;
    }

    try {
        const response = await axios.post(`${baseUrl}/auth/login`, { username, password });
        token = response.data.token;
        localStorage.setItem('token', token);

        showToast('Login successful!', 'success');
        loginUsername.value = '';
        loginPassword.value = '';

        checkAuth();
        showPage('history'); // Redirect to history page after login
    } catch (error) {
        console.error(error);
        showToast(error.response?.data?.message || 'Login failed', 'error');
    }
}

// Signup function
async function signup() {
    const username = signupUsername.value.trim();
    const password = signupPassword.value.trim();

    if (!username || !password) {
        showToast('Please enter both username and password', 'error');
        return;
    }

    try {
        const response = await axios.post(`${baseUrl}/auth/signup`, { username, password });
        token = response.data.token;
        localStorage.setItem('token', token);

        showToast('Account created successfully!', 'success');
        signupUsername.value = '';
        signupPassword.value = '';

        checkAuth();
        showPage('history'); // Redirect to history page after signup
    } catch (error) {
        console.error(error);
        showToast(error.response?.data?.message || 'Signup failed', 'error');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    token = null;
    showToast('Logged out successfully', 'success');
    checkAuth();
    showPage('home'); // Redirect to home page after logout
    location.reload(); // Reload to reset state
}

// Shorten URL function
async function shortenUrl() {
    const longUrl = longUrlInput.value.trim();
    if (!longUrl) {
        showToast('Please enter a valid URL', 'error');
        return;
    }

    try {
        const config = token ? {
            headers: { Authorization: `Bearer ${token}` }
        } : {};

        showToast('Shortening URL...');

        const response = await axios.post(`${baseUrl}/shorten`, { longUrl }, config);
        const { shortUrl } = response.data;

        shortenedUrlLink.href = shortUrl;
        shortenedUrlLink.textContent = shortUrl;
        resultDiv.classList.remove("hidden");

        showToast('URL shortened successfully!', 'success');
        longUrlInput.value = '';

        // If user is logged in, update their URL list
        if (token) {
            fetchUserUrls();
        }
    } catch (error) {
        console.error(error);
        showToast(error.response?.data?.message || 'Error shortening URL', 'error');
    }
}

// Copy to clipboard function
function copyToClipboard() {
    const url = shortenedUrlLink.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch((err) => {
        console.error(err);
        showToast('Failed to copy URL', 'error');
    });
}

// Redirect to the long URL
function redirectToUrl() {
    const url = shortenedUrlLink.href;
    window.open(url, "_blank");
}

// Fetch user's URLs
async function fetchUserUrls() {
    if (!token) return;

    try {
        const response = await axios.get(`${baseUrl}/user/urls`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        displayHistory(response.data);
    } catch (error) {
        console.error('Failed to fetch URLs', error);
        showToast('Failed to load your URLs', 'error');
    }
}

// Display history
function displayHistory(urls) {
    if (!urls || urls.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link"></i>
                <p>No URLs found</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = urls.map(url => `
        <div class="history-item">
            <div class="history-item-content">
                <a href="${url.shortUrl}" target="_blank">${url.shortUrl}</a>
                <p>${url.longUrl}</p>
                <small>Created: ${new Date(url.date).toLocaleString()}</small>
            </div>
            <button class="btn btn-secondary" onclick="copyUrlToClipboard('${url.shortUrl}')">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    `).join('');
}

// Copy URL to clipboard (used in history items)
window.copyUrlToClipboard = function (url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch((err) => {
        console.error(err);
        showToast('Failed to copy URL', 'error');
    });
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);