/// Global state
let isLoggedIn = false;
let currentUser = null;
let isLoginMode = true;
let currentRating = 0;
let comments = [];
let currentGenre = 'all';

// DOM Elements
const loginModal = document.getElementById('loginModal');
const movieDetailModal = document.getElementById('movieDetailModal');
const loginButton = document.getElementById('loginButton');
const userProfile = document.getElementById('userProfile');
const loginForm = document.getElementById('loginForm');
const menuItems = document.querySelectorAll('.menu-list-item');
const toggle = document.querySelector('.toggle');
const toggleBall = document.querySelector('.toggle-ball');
const container = document.querySelector('.container');
const navbarContainer = document.querySelector('.navbar-container');
const sidebar = document.querySelector('.sidebar');
const leftIcons = document.querySelectorAll('.left-menu-icon');
const movieListTitles = document.querySelectorAll('.movie-list-title');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Menu item click handlers for genres
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Get selected genre
            const genre = item.getAttribute('data-genre');
            currentGenre = genre;
            filterByGenre(genre);
        });
    });

    // Dark mode toggle
    if (toggle && toggleBall) {
        // Load saved theme
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'light') {
            applyLightMode();
        }
    }

    // Initialize sidebar search
    initializeSidebarSearch();
    
    // Initialize star rating
    initializeStarRating();
    
    // Load comments
    loadComments();
    
    // Update auth UI
    updateAuthUI();

    // Show all genres by default
    filterByGenre('all');
});

// Genre filtering function
function filterByGenre(genre) {
    const movieListContainers = document.querySelectorAll('.movie-list-container');
    
    movieListContainers.forEach(container => {
        const containerGenre = container.getAttribute('data-genre');
        
        if (genre === 'all' || containerGenre === genre) {
            container.style.display = 'block';
            // Add animation
            container.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
            container.style.display = 'none';
        }
    });

    // Update page title based on genre
    updatePageTitle(genre);
}

// Update page title based on selected genre
function updatePageTitle(genre) {
    const genreNames = {
        'all': 'All Anime',
        'action': 'Action Anime',
        'horror': 'Horror Anime', 
        'comedy': 'Comedy Anime',
        'fantasy': 'Fantasy Anime',
        'romance': 'Romance Anime'
    };
    
    // You can add a title element if needed
    console.log(`Showing: ${genreNames[genre] || 'All Anime'}`);
}

// Navigation functions
function scrollToSection(section) {
    const element = document.getElementById(section);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToCommunity() {
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToAnime() {
    const firstVisibleContainer = document.querySelector('.movie-list-container[style*="block"], .movie-list-container:not([style*="none"])');
    if (firstVisibleContainer) {
        firstVisibleContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Sidebar search functionality
function initializeSidebarSearch() {
    const searchInput = document.getElementById('sidebar-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterAnime(query);
        });
    }
}

function toggleSearch() {
    const searchContainer = document.getElementById('sidebarSearchContainer');
    const searchInput = document.getElementById('sidebar-search');
    
    if (searchContainer.classList.contains('active')) {
        searchContainer.classList.remove('active');
        searchInput.value = '';
        filterAnime(''); // Reset filter
        // Restore genre filter
        filterByGenre(currentGenre);
    } else {
        searchContainer.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }
}

function filterAnime(query) {
    const allMovieItems = document.querySelectorAll('.movie-list-item');
    let hasResults = false;
    
    allMovieItems.forEach(item => {
        const title = item.querySelector('.movie-list-item-title').textContent.toLowerCase();
        const desc = item.querySelector('.movie-list-item-desc').textContent.toLowerCase();
        const container = item.closest('.movie-list-container');
        
        if (title.includes(query) || desc.includes(query) || query === '') {
            item.style.display = 'block';
            if (query !== '') {
                container.style.display = 'block';
                hasResults = true;
            }
        } else {
            item.style.display = 'none';
        }
    });

    // If searching, show all containers that have matching results
    if (query !== '') {
        const containers = document.querySelectorAll('.movie-list-container');
        containers.forEach(container => {
            const visibleItems = container.querySelectorAll('.movie-list-item[style*="block"], .movie-list-item:not([style*="none"])');
            if (visibleItems.length === 0) {
                container.style.display = 'none';
            }
        });
    }
}

// Dark mode functions
function toggleDarkMode() {
    const isActive = container.classList.toggle('active');
    navbarContainer.classList.toggle('active', isActive);
    if (sidebar) sidebar.classList.toggle('active', isActive);
    leftIcons.forEach(icon => icon.classList.toggle('active', isActive));
    toggle.classList.toggle('active', isActive);
    toggleBall.classList.toggle('active', isActive);
    movieListTitles.forEach(title => title.classList.toggle('active', isActive));

    // Save theme preference
    localStorage.setItem('darkMode', isActive ? 'light' : 'dark');
}

function applyLightMode() {
    container.classList.add('active');
    navbarContainer.classList.add('active');
    if (sidebar) sidebar.classList.add('active');
    leftIcons.forEach(icon => icon.classList.add('active'));
    toggle.classList.add('active');
    toggleBall.classList.add('active');
    movieListTitles.forEach(title => title.classList.add('active'));
}

// Authentication functions
function openLoginModal() {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    resetLoginForm();
}

function switchMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('loginTitle');
    const nameGroup = document.getElementById('nameGroup');
    const loginBtn = document.getElementById('loginBtn');
    const switchText = document.getElementById('switchText');
    
    if (isLoginMode) {
        title.textContent = 'Welcome Back';
        nameGroup.style.display = 'none';
        loginBtn.querySelector('.btn-text').textContent = 'Sign In';
        switchText.innerHTML = 'Don\'t have an account? <button class="switch-btn" onclick="switchMode()">Sign Up</button>';
    } else {
        title.textContent = 'Join AnFeeds';
        nameGroup.style.display = 'block';
        loginBtn.querySelector('.btn-text').textContent = 'Create Account';
        switchText.innerHTML = 'Already have an account? <button class="switch-btn" onclick="switchMode()">Sign In</button>';
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.classList.remove('fa-eye');
        passwordToggle.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordToggle.classList.remove('fa-eye-slash');
        passwordToggle.classList.add('fa-eye');
    }
}

function resetLoginForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    if (document.getElementById('fullName')) {
        document.getElementById('fullName').value = '';
    }
    isLoginMode = true;
    switchMode();
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fullName = document.getElementById('fullName') ? document.getElementById('fullName').value : '';
        
        // Show loading
        const btnText = document.querySelector('.btn-text');
        const btnLoader = document.querySelector('.btn-loader');
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        
        // Simulate API call
        setTimeout(() => {
            if (isLoginMode) {
                // Login
                currentUser = {
                    name: 'Otaku Master',
                    email: email,
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
                };
            } else {
                // Sign up
                currentUser = {
                    name: fullName || 'Anime Fan',
                    email: email,
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
                };
            }
            
            isLoggedIn = true;
            updateAuthUI();
            closeLoginModal();
            
            // Reset loading
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            
            // Show success message
            showNotification(isLoginMode ? 'Welcome back, fellow otaku!' : 'Welcome to the anime community!');
        }, 1500);
    });
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    updateAuthUI();
    showNotification('Sayonara! Come back soon!');
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const loginButton = document.getElementById('loginButton');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    
    if (isLoggedIn && currentUser) {
        loginButton.style.display = 'none';
        userProfile.style.display = 'flex';
        userName.textContent = currentUser.name;
        
        // Update profile picture
        const profilePicture = document.querySelector('.profile-picture');
        if (profilePicture) {
            profilePicture.src = currentUser.avatar;
        }
        
        // Update comment form visibility
        updateCommentFormVisibility();
    } else {
        loginButton.style.display = 'flex';
        userProfile.style.display = 'none';
        
        // Update comment form visibility
        updateCommentFormVisibility();
    }
}

// Anime detail functions
function openAnimeDetail(title, image, rating, year, description, episodes, genre) {
    document.getElementById('detailMovieTitle').textContent = title;
    document.getElementById('detailMovieImage').src = image;
    document.getElementById('detailMovieRating').textContent = rating;
    document.getElementById('detailMovieYear').textContent = year;
    document.getElementById('detailMovieDesc').textContent = description;
    document.getElementById('detailEpisodes').textContent = episodes;
    document.getElementById('detailGenre').textContent = genre;

    movieDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load comments for this anime
    loadComments();
}

function closeMovieDetail() {
    movieDetailModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Comments functions
function updateCommentFormVisibility() {
    const commentForm = document.getElementById('commentForm');
    const loginPrompt = document.getElementById('loginPrompt');
    
    if (isLoggedIn) {
        commentForm.style.display = 'flex';
        loginPrompt.style.display = 'none';
        
        // Update user avatar in comment form
        const userAvatar = commentForm.querySelector('.user-avatar img');
        if (userAvatar && currentUser) {
            userAvatar.src = currentUser.avatar;
        }
    } else {
        commentForm.style.display = 'none';
        loginPrompt.style.display = 'block';
    }
}

function initializeStarRating() {
    const stars = document.querySelectorAll('.stars-input i');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            updateStarDisplay();
        });
        
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });
    });
    
    const starsContainer = document.querySelector('.stars-input');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            updateStarDisplay();
        });
    }
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.stars-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateStarDisplay() {
    highlightStars(currentRating);
}

function postComment() {
    const commentText = document.getElementById('commentText').value.trim();
    
    if (!commentText || currentRating === 0) {
        showNotification('Please provide both a rating and review!');
        return;
    }
    
    const newComment = {
        id: Date.now(),
        user: currentUser.name,
        avatar: currentUser.avatar,
        comment: commentText,
        rating: currentRating,
        date: 'Just now',
        likes: 0,
        liked: false
    };
    
    comments.unshift(newComment);
    loadComments();
    
    // Reset form
    document.getElementById('commentText').value = '';
    currentRating = 0;
    updateStarDisplay();
    
    showNotification('Your anime review has been posted! ✨');
}

function cancelComment() {
    document.getElementById('commentText').value = '';
    currentRating = 0;
    updateStarDisplay();
}

function loadComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    
    const starsHtml = Array.from({length: 5}, (_, i) => 
        `<i class="fas fa-star ${i < comment.rating ? '' : 'empty'}"></i>`
    ).join('');
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <div class="comment-avatar">
                <img src="${comment.avatar}" alt="${comment.user}">
            </div>
            <div class="comment-user-info">
                <h4>${comment.user}</h4>
                <div class="comment-rating">
                    ${starsHtml}
                </div>
            </div>
            <div class="comment-date">${comment.date}</div>
        </div>
        <div class="comment-text">${comment.comment}</div>
        <div class="comment-actions">
            <button class="comment-action ${comment.liked ? 'liked' : ''}" onclick="toggleLike(${comment.id})">
                <i class="fas fa-heart"></i>
                <span>${comment.likes}</span>
            </button>
            <button class="comment-action" onclick="shareComment(${comment.id})">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </button>
        </div>
    `;
    
    return commentDiv;
}

function toggleLike(commentId) {
    if (!isLoggedIn) {
        openLoginModal();
        return;
    }
    
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        if (comment.liked) {
            comment.likes--;
            comment.liked = false;
        } else {
            comment.likes++;
            comment.liked = true;
        }
        loadComments();
        
        // Heart animation
        const heartButton = document.querySelector(`button[onclick="toggleLike(${commentId})"]`);
        if (heartButton && comment.liked) {
            heartButton.style.animation = 'pulse 0.3s ease-in-out';
            setTimeout(() => {
                heartButton.style.animation = '';
            }, 300);
        }
    }
}

function shareComment(commentId) {
    showNotification('Anime review link copied to clipboard! 📋');
}

// Utility functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 10002;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('login-modal-overlay')) {
        closeLoginModal();
    }
    if (e.target.classList.contains('movie-detail-overlay')) {
        closeMovieDetail();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (loginModal.classList.contains('active')) {
            closeLoginModal();
        }
        if (movieDetailModal.classList.contains('active')) {
            closeMovieDetail();
        }
    }
    
    // Genre shortcuts
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                filterByGenre('all');
                updateActiveMenuItem('all');
                break;
            case '2':
                e.preventDefault();
                filterByGenre('action');
                updateActiveMenuItem('action');
                break;
            case '3':
                e.preventDefault();
                filterByGenre('horror');
                updateActiveMenuItem('horror');
                break;
            case '4':
                e.preventDefault();
                filterByGenre('comedy');
                updateActiveMenuItem('comedy');
                break;
            case '5':
                e.preventDefault();
                filterByGenre('fantasy');
                updateActiveMenuItem('fantasy');
                break;
            case '6':
                e.preventDefault();
                filterByGenre('romance');
                updateActiveMenuItem('romance');
                break;
        }
    }
});

// Helper function to update active menu item
function updateActiveMenuItem(genre) {
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-genre') === genre) {
            item.classList.add('active');
        }
    });
    currentGenre = genre;
}

// Smooth scrolling for anime lists
document.querySelectorAll('.movie-list').forEach(list => {
    let isDown = false;
    let startX;
    let scrollLeft;

    list.addEventListener('mousedown', (e) => {
        isDown = true;
        list.classList.add('active');
        startX = e.pageX - list.offsetLeft;
        scrollLeft = list.scrollLeft;
    });

    list.addEventListener('mouseleave', () => {
        isDown = false;
        list.classList.remove('active');
    });

    list.addEventListener('mouseup', () => {
        isDown = false;
        list.classList.remove('active');
    });

    list.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - list.offsetLeft;
        const walk = (x - startX) * 2;
        list.scrollLeft = scrollLeft - walk;
    });
});

// Add genre indicator to show current selection
function addGenreIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'genre-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 12px;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: none;
    `;
    document.body.appendChild(indicator);
    
    return indicator;
}

// Show genre indicator when switching
function showGenreIndicator(genre) {
    let indicator = document.getElementById('genre-indicator');
    if (!indicator) {
        indicator = addGenreIndicator();
    }
    
    const genreNames = {
        'all': 'All Genres',
        'action': 'Action',
        'horror': 'Horror', 
        'comedy': 'Comedy',
        'fantasy': 'Fantasy',
        'romance': 'Romance'
    };
    
    indicator.textContent = `Showing: ${genreNames[genre] || 'All Genres'}`;
    indicator.style.display = 'block';
    
    setTimeout(() => {
        indicator.style.display = 'none';
    }, 2000);
}