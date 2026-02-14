// Global State
let cart = [];
let categories = [];
let currentCategoryId = null;

// API Base URL
const API_BASE = 'https://openapi.programming-hero.com/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

// Load Categories from API
async function loadCategories() {
    try {
        showCategorySpinner(true);
        
        console.log('Fetching categories from:', `${API_BASE}/categories`);
        const response = await fetch(`${API_BASE}/categories`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Categories response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories data received:', data);
        
        // Check if data exists and has the right structure
        if (data && data.data && Array.isArray(data.data)) {
            categories = data.data;
            displayCategories();
            // Load all trees initially
            loadAllTrees();
        } else {
            console.error('Invalid data structure:', data);
            throw new Error('Invalid data structure received from API');
        }
        
    } catch (error) {
        console.error('Error loading categories:', error);
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = `
            <div style="padding: 1rem; text-align: center;">
                <p style="color: #d63031; margin-bottom: 1rem; font-size: 0.9rem;">Failed to load categories</p>
                <button onclick="loadCategories()" style="background: var(--secondary-green); color: white; padding: 0.6rem 1rem; border: none; border-radius: 20px; cursor: pointer; font-size: 0.85rem;">
                    Retry
                </button>
            </div>
        `;
    }
}

// Display Categories
function displayCategories() {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';
    
    // Add "All Trees" button
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.textContent = 'All Trees';
    allBtn.onclick = () => {
        loadAllTrees();
        setActiveCategory(allBtn);
    };
    container.appendChild(allBtn);
    
    // Add category buttons
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category.name;
        btn.onclick = () => {
            loadTreesByCategory(category.id);
            setActiveCategory(btn);
        };
        container.appendChild(btn);
    });
}

// Show/Hide Category Spinner
function showCategorySpinner(show) {
    const container = document.getElementById('categoriesContainer');
    if (show) {
        container.innerHTML = '<div class="spinner active"></div>';
    }
}

// Load All Trees
async function loadAllTrees() {
    currentCategoryId = null;
    showSpinner(true);
    
    try {
        console.log('Fetching all plants from:', `${API_BASE}/plants`);
        const response = await fetch(`${API_BASE}/plants`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Plants response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('All trees data received:', data);
        
        if (data && data.data && Array.isArray(data.data)) {
            displayTrees(data.data);
        } else {
            console.error('Invalid data structure:', data);
            throw new Error('Invalid data structure');
        }
    } catch (error) {
        console.error('Error loading trees:', error);
        showError('Failed to load trees. Please check your internet connection and try again.');
    } finally {
        showSpinner(false);
    }
}

// Load Trees by Category
async function loadTreesByCategory(categoryId) {
    currentCategoryId = categoryId;
    showSpinner(true);
    
    try {
        console.log('Fetching category trees from:', `${API_BASE}/category/${categoryId}`);
        const response = await fetch(`${API_BASE}/category/${categoryId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Category response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Category ${categoryId} data received:`, data);
        
        if (data && data.data && Array.isArray(data.data)) {
            displayTrees(data.data);
        } else {
            console.error('Invalid data structure:', data);
            displayTrees([]);
        }
    } catch (error) {
        console.error('Error loading trees by category:', error);
        showError('Failed to load trees for this category. Please try again.');
    } finally {
        showSpinner(false);
    }
}

// Display Trees in Grid
function displayTrees(trees) {
    const grid = document.getElementById('treesGrid');
    
    if (!trees || trees.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1 / -1; padding: 3rem;">No trees found in this category</p>';
        return;
    }
    
    grid.innerHTML = trees.map(tree => {
        const price = tree.price || 500;
        const imageSrc = tree.image || 'https://via.placeholder.com/400x300/c8e6d9/2d8659?text=Tree';
        const description = tree.description || 'A beautiful tree for your garden.';
        const truncatedDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;
        
        return `
            <div class="tree-card">
                <img src="${imageSrc}" 
                     alt="${tree.name}" 
                     class="tree-image"
                     onerror="this.src='https://via.placeholder.com/400x300/c8e6d9/2d8659?text=Tree'">
                <div class="tree-info">
                    <div class="tree-category">${tree.category || 'Fruit Tree'}</div>
                    <h3 class="tree-name" onclick="showTreeDetails(${tree.id})">${tree.name}</h3>
                    <p class="tree-description">${truncatedDesc}</p>
                    <div class="tree-price">৳${price.toLocaleString()}</div>
                    <button class="btn-add-cart" onclick="addToCart(${tree.id}, '${tree.name.replace(/'/g, "\\'")}', ${price})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Show Tree Details in Modal
async function showTreeDetails(treeId) {
    const modal = document.getElementById('treeModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = '<div class="spinner active" style="margin: 2rem auto;"></div>';
    modal.classList.add('active');
    
    try {
        console.log('Fetching tree details from:', `${API_BASE}/plant/${treeId}`);
        const response = await fetch(`${API_BASE}/plant/${treeId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Tree details response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Tree details received:', result);
        
        const tree = result.data;
        
        if (!tree) {
            throw new Error('No tree data found');
        }
        
        const price = tree.price || 500;
        const imageSrc = tree.image || 'https://via.placeholder.com/600x300/c8e6d9/2d8659?text=Tree';
        const description = tree.description || 'A beautiful tree for your garden.';
        const benefits = tree.benefits || 'Provides oxygen, improves air quality, and supports wildlife.';
        const conditions = tree.conditions || 'Grows well in various climates with moderate watering.';
        
        content.innerHTML = `
            <img src="${imageSrc}" 
                 alt="${tree.name}" 
                 class="modal-image"
                 onerror="this.src='https://via.placeholder.com/600x300/c8e6d9/2d8659?text=Tree'">
            <div class="tree-category">${tree.category || 'Fruit Tree'}</div>
            <h2 class="modal-title">${tree.name}</h2>
            <div class="modal-detail">
                <strong>Description:</strong>
                <p>${description}</p>
            </div>
            <div class="modal-detail">
                <strong>Benefits:</strong>
                <p>${benefits}</p>
            </div>
            <div class="modal-detail">
                <strong>Best Conditions:</strong>
                <p>${conditions}</p>
            </div>
            <div class="tree-price" style="margin-bottom: 1rem;">৳${price.toLocaleString()}</div>
            <button class="btn-add-cart" onclick="addToCart(${tree.id}, '${tree.name.replace(/'/g, "\\'")}', ${price}); closeModal();">
                Add to Cart
            </button>
        `;
    } catch (error) {
        console.error('Error loading tree details:', error);
        content.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #d63031; margin-bottom: 1rem;">Failed to load tree details.</p>
                <button onclick="closeModal()" style="background: var(--secondary-green); color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 25px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
    }
}

// Close Modal
function closeModal() {
    document.getElementById('treeModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('treeModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add to Cart
function addToCart(id, name, price) {
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        alert(`${name} is already in your cart!`);
        return;
    }
    
    cart.push({ id, name, price });
    updateCart();
    
    // Show feedback on button
    const buttons = document.querySelectorAll('.btn-add-cart');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Add to Cart') && 
            btn.getAttribute('onclick').includes(`addToCart(${id},`)) {
            const originalText = btn.textContent;
            const originalBg = btn.style.background;
            btn.textContent = '✓ Added!';
            btn.style.background = '#27ae60';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = originalBg;
            }, 1500);
        }
    });
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalAmount.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">৳${item.price.toLocaleString()}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove from cart">×</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalAmount.textContent = total.toLocaleString();
}

// Set Active Category Button
function setActiveCategory(activeBtn) {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Show/Hide Trees Spinner
function showSpinner(show) {
    const spinner = document.getElementById('treesSpinner');
    const grid = document.getElementById('treesGrid');
    
    if (show) {
        spinner.classList.add('active');
        grid.innerHTML = '';
    } else {
        spinner.classList.remove('active');
    }
}

// Show Error Message
function showError(message) {
    const grid = document.getElementById('treesGrid');
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="color: #d63031; font-size: 1.1rem; margin-bottom: 1rem;">${message}</p>
            <button onclick="location.reload()" style="background: var(--secondary-green); color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">
                Reload Page
            </button>
        </div>
    `;
}

// Handle Donation Form Submission
function handleDonation(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // You can add actual form submission logic here
    alert('Thank you for your donation! Together we can make the Earth greener! 🌱');
    form.reset();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
