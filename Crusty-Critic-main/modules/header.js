// Header HTML template
export function getHeaderHTML() {
    return `
    <nav class="nav">
        <div class="nav-left">
            <a href="index.html">Home</a>
            <a href="mainpage.html">Pizza Places</a>
            <a href="dealspage.html">Deals</a>
            <a href="challengespage.html">Challenges</a>
            <a href="reviewpage.html">Write Review</a>
        </div>
        <div class="nav-right">
            <div class="user-info" id="userInfo" style="display: flex;">
                <a href="profilepage.html">
                    <span class="profile-icon" id="profileIcon">S</span>
                </a>
                <span id="usernameDisplay"></span>
                <button onclick="logout()">Logout</button>
            </div>
            <div id="authButtons" style="display: none;">
                <button onclick="window.location.href='loginpage.html'">Log In</button>
                <button onclick="window.location.href='signuppage.html'">Sign Up</button>
            </div>
        </div>
    </nav>
    `;
}

// Header styles
export const headerStyles = `
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: #F8E0A1;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}
.nav-left {
    display: flex;
    gap: 25px;
    align-items: center;
}
.nav-right {
    display: flex;
    gap: 20px;
    align-items: center;
}
.nav a {
    color: #333;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    padding: 8px 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
}
.nav a:hover {
    background-color: rgba(0,0,0,0.1);
    transform: translateY(-2px);
}
.nav button {
    background: none;
    border: none;
    color: #007bff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
}
.nav button:hover {
    background-color: rgba(0,0,0,0.1);
    transform: translateY(-2px);
}
.nav .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}
.nav .user-info .profile-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    transition: transform 0.3s ease;
}
.nav .user-info .profile-icon:hover {
    transform: scale(1.1);
}
.nav .user-info a {
    color: #007bff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
}
`;

// Header initialization function
export function initializeHeader() {
    const userInfo = document.getElementById('userInfo');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const profileIcon = document.getElementById('profileIcon');
    const authButtons = document.getElementById('authButtons');
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
        return;
    }

    // Fetch user profile data from /api/auth/me
    fetch('http://localhost:3000/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .then(user => {
        // Update navigation
        usernameDisplay.textContent = user.username;
        profileIcon.textContent = user.username.charAt(0).toUpperCase();
        userInfo.style.display = 'flex';
        authButtons.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Logout function
export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'loginpage.html';
}
