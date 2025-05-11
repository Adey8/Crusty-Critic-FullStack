export default function adminSidebar() {
    return `
    <style>
      .sidebar {
        width: 200px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px 0;
        min-height: 400px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      }
      .sidebar button {
        display: block;
        width: 100%;
        background: none;
        border: none;
        text-align: left;
        padding: 12px 24px;
        font-size: 16px;
        cursor: pointer;
        color: #333;
        border-radius: 0;
        transition: background 0.2s;
      }
      .sidebar button:hover, .sidebar button.active {
        background-color: #F8E0A1;
        font-weight: bold;
      }
    </style>
    <div class="sidebar">
        <button onclick="window.location.href='adminpage.html'">Dashboard</button>
        <button onclick="window.location.href='adminUsers.html'">Manage Users</button>
        <button onclick="window.location.href='adminReviews.html'">Manage Reviews</button>
        <button onclick="window.location.href='adminPolls.html'">Manage Polls</button>
        <button onclick="window.location.href='adminChallenges.html'">Manage Challenges</button>
    </div>
    `;
}
