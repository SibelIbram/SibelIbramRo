// Content Loader for Sibel Ibram Website
// Loads Trainings, Speaking, and Publications from Firebase

// This file should be included AFTER firebase-config.js in index.html
// Make sure to use the same Firebase config as admin

// Collection names (use the ones from firebase-config.js if available, otherwise define them)
// Note: These should already be defined in firebase-config.js
// If not, we'll use these fallback values
const TRAININGS_COLLECTION_NAME = typeof TRAININGS_COLLECTION !== 'undefined' ? TRAININGS_COLLECTION : 'trainings';
const SPEAKING_COLLECTION_NAME = typeof SPEAKING_COLLECTION !== 'undefined' ? SPEAKING_COLLECTION : 'speaking';
const PUBLICATIONS_COLLECTION_NAME = typeof PUBLICATIONS_COLLECTION !== 'undefined' ? PUBLICATIONS_COLLECTION : 'publications';

let contentLoaded = false;

// Initialize content loading
document.addEventListener('DOMContentLoaded', () => {
  console.log('Content loader initialized');
  console.log('Firebase available:', typeof firebase !== 'undefined');
  console.log('DB type:', typeof db);
  console.log('DB value:', db);
  console.log('FirebaseConfig available:', typeof firebaseConfig !== 'undefined');
  if (typeof firebaseConfig !== 'undefined') {
    console.log('FirebaseConfig apiKey:', firebaseConfig.apiKey);
    console.log('FirebaseConfig projectId:', firebaseConfig.projectId);
  }
  
  // Wait a bit for Firebase to initialize
  setTimeout(() => {
    // Check if Firebase is properly configured
    let useDemoMode = false;
    
    // Check if db is null or undefined (means Firebase not initialized)
    if (typeof db === 'undefined' || db === null) {
      console.log('Firebase not configured (db is null/undefined) - using demo mode (localStorage)');
      useDemoMode = true;
    } else if (typeof firebaseConfig !== 'undefined') {
      if (firebaseConfig.apiKey === 'YOUR_API_KEY' || firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
        console.log('Firebase config has placeholder values - using demo mode (localStorage)');
        useDemoMode = true;
      }
    }
    
    console.log('Using demo mode:', useDemoMode);
    
    if (useDemoMode) {
      console.log('Demo mode: Loading content from localStorage (same as admin demo mode)');
      // Load from localStorage (demo mode)
      loadTrainingsDemo();
      loadSpeakingDemo();
      loadPublicationsDemo();
    } else {
      console.log('Firebase mode: Loading content from Firebase');
      // Load from Firebase
      loadTrainings();
      loadSpeaking();
      loadPublications();
    }
  }, 100);
});

// Clear default/placeholder content
function clearDefaultContent() {
  const trainingsContainer = document.getElementById('trainings-grid');
  if (trainingsContainer) {
    // Remove default training cards but keep container
    const defaultCards = trainingsContainer.querySelectorAll('.training-card');
    defaultCards.forEach(card => card.remove());
  }
  
  const speakingContainer = document.getElementById('speaking-list');
  if (speakingContainer) {
    // Clear any default content
    const defaultItems = speakingContainer.querySelectorAll('.speaking-item');
    defaultItems.forEach(item => item.remove());
  }
  
  const publicationsContainer = document.querySelector('.publications-list');
  if (publicationsContainer) {
    // Remove default publication cards but keep container
    const defaultCards = publicationsContainer.querySelectorAll('.publication-card');
    defaultCards.forEach(card => card.remove());
  }
}

// Load Trainings
async function loadTrainings() {
  const container = document.getElementById('trainings-grid');
  if (!container) {
    console.warn('Trainings container not found');
    return;
  }
  
  // Check if Firebase is available
  if (typeof db === 'undefined') {
    console.warn('Firebase not configured - clearing default content');
    clearDefaultContent();
    return;
  }
  
  try {
    console.log('Loading trainings from Firebase...');
    
    // Clear default content first
    const defaultCards = container.querySelectorAll('.training-card');
    defaultCards.forEach(card => card.remove());
    
    let query = db.collection(TRAININGS_COLLECTION_NAME).where('published', '==', true);
    
    // Try to order by createdAt, but handle if index doesn't exist
    try {
      query = query.orderBy('createdAt', 'desc');
    } catch (e) {
      console.warn('Could not order trainings by createdAt, using default order');
    }
    
    const snapshot = await query.get();
    console.log(`Found ${snapshot.size} published training(s)`);
    
    if (snapshot.empty) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No trainings available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const item = doc.data();
      console.log('Loading training:', item.title);
      
      // Format date
      let dateStr = '';
      if (item.date) {
        try {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          } else {
            dateStr = item.date;
          }
        } catch (e) {
          dateStr = item.date;
        }
      }
      
      html += `
        <div class="training-card">
          <div class="training-image">
            <img src="${item.image || 'images/training-placeholder.jpg'}" alt="${item.title || 'Training'}">
          </div>
          <div class="training-content">
            <h2>${item.title || 'Training'}</h2>
            ${dateStr ? `<p class="training-date" style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">${dateStr}</p>` : ''}
            <p>${item.description || ''}</p>
            ${item.content ? `<a href="training-detail.html?id=${doc.id}" class="btn-primary" data-i18n="trainings-read-more">Read More →</a>` : ''}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    contentLoaded = true;
    console.log('Trainings loaded successfully');
  } catch (error) {
    console.error('Error loading trainings:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #e74c3c;">Error loading trainings. Please check console for details.</p>';
  }
}

// Load Speaking Events
async function loadSpeaking() {
  const container = document.getElementById('speaking-list');
  if (!container) {
    console.warn('Speaking container not found');
    return;
  }
  
  // Check if Firebase is available
  if (typeof db === 'undefined') {
    console.warn('Firebase not configured - clearing default content');
    clearDefaultContent();
    return;
  }
  
  try {
    console.log('Loading speaking events from Firebase...');
    
    // Clear any default content
    container.innerHTML = '';
    
    let query = db.collection(SPEAKING_COLLECTION_NAME).where('published', '==', true);
    
    // Try to order by createdAt, but handle if index doesn't exist
    try {
      query = query.orderBy('createdAt', 'desc');
    } catch (e) {
      console.warn('Could not order speaking by createdAt, using default order');
    }
    
    const snapshot = await query.get();
    console.log(`Found ${snapshot.size} published speaking event(s)`);
    
    if (snapshot.empty) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No speaking events yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const item = doc.data();
      console.log('Loading speaking event:', item.title);
      const dateLabel = document.querySelector('[data-i18n="speaking-date-label"]')?.textContent || 'Date:';
      const moreInfoLabel = document.querySelector('[data-i18n="speaking-more-info"]')?.textContent || 'More information in the links below:';
      
      let linksHTML = '';
      if (item.links && item.links.length > 0) {
        linksHTML = `<p class="speaking-links"><span data-i18n="speaking-more-info">${moreInfoLabel}</span><br>`;
        item.links.forEach((link, index) => {
          linksHTML += `<a href="${link}" target="_blank" rel="noopener noreferrer">LinkedIn Link ${index + 1}</a><br>`;
        });
        linksHTML += '</p>';
      }
      
      html += `
        <div class="speaking-item">
          <div class="speaking-image">
            <img src="${item.image || 'images/speaking-placeholder.jpg'}" alt="${item.title || 'Speaking Event'}">
          </div>
          <div class="speaking-details">
            <h2>${item.title || 'Event'}</h2>
            <p class="speaking-location">${item.location || ''}</p>
            <p class="speaking-date"><span data-i18n="speaking-date-label">${dateLabel}</span> ${item.date || ''}</p>
            <p class="speaking-description">${item.description || ''}</p>
            ${linksHTML}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    contentLoaded = true;
    console.log('Speaking events loaded successfully');
  } catch (error) {
    console.error('Error loading speaking events:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #e74c3c;">Error loading speaking events. Please check console for details.</p>';
  }
}

// Load Publications
async function loadPublications() {
  const container = document.querySelector('.publications-list');
  if (!container) {
    console.warn('Publications container not found');
    return;
  }
  
  // Check if Firebase is available
  if (typeof db === 'undefined') {
    console.warn('Firebase not configured - clearing default content');
    clearDefaultContent();
    return;
  }
  
  try {
    console.log('Loading publications from Firebase...');
    
    // Clear default content first
    const defaultCards = container.querySelectorAll('.publication-card');
    defaultCards.forEach(card => card.remove());
    
    let query = db.collection(PUBLICATIONS_COLLECTION_NAME).where('published', '==', true);
    
    // Try to order by createdAt, but handle if index doesn't exist
    try {
      query = query.orderBy('createdAt', 'desc');
    } catch (e) {
      console.warn('Could not order publications by createdAt, using default order');
    }
    
    const snapshot = await query.get();
    console.log(`Found ${snapshot.size} published publication(s)`);
    
    if (snapshot.empty) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No publications available yet.</p>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const item = doc.data();
      console.log('Loading publication:', item.title);
      const readMoreLabel = document.querySelector('[data-i18n="publications-read-more"]')?.textContent || 'Read More →';
      
      // Format date
      let dateStr = '';
      if (item.date) {
        try {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          } else {
            dateStr = item.date;
          }
        } catch (e) {
          dateStr = item.date;
        }
      }
      
      html += `
        <article class="publication-card">
          <div class="publication-image">
            <img src="${item.image || 'images/publication-placeholder.jpg'}" alt="${item.title || 'Publication'}">
          </div>
          <div class="publication-content">
            <div class="publication-meta">
              <span class="publication-date">${dateStr}</span>
              ${item.category ? `<span class="publication-category">${item.category}</span>` : ''}
            </div>
            <h2 class="publication-title">${item.title || 'Publication'}</h2>
            <p class="publication-excerpt">${item.excerpt || ''}</p>
            ${item.content ? `<a href="publication-detail.html?id=${doc.id}" class="read-more" data-i18n="publications-read-more">${readMoreLabel}</a>` : ''}
          </div>
        </article>
      `;
    });
    
    container.innerHTML = html;
    contentLoaded = true;
    console.log('Publications loaded successfully');
  } catch (error) {
    console.error('Error loading publications:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #e74c3c;">Error loading publications. Please check console for details.</p>';
  }
}

// DEMO MODE: Load Trainings from localStorage
function loadTrainingsDemo() {
  const container = document.getElementById('trainings-grid');
  if (!container) {
    console.warn('Trainings container not found');
    return;
  }
  
  try {
    console.log('Loading trainings from localStorage (demo mode)...');
    
    // Clear default content first
    const defaultCards = container.querySelectorAll('.training-card');
    defaultCards.forEach(card => card.remove());
    
    const storageKey = 'demoTrainings';
    const rawData = localStorage.getItem(storageKey);
    console.log('Raw localStorage data for trainings:', rawData);
    const items = JSON.parse(rawData || '[]');
    console.log('Parsed items:', items);
    console.log('Total items:', items.length);
    
    // Check published status - handle both boolean true and string "true"
    const publishedItems = items.filter(item => {
      const isPublished = item.published === true || item.published === 'true';
      console.log(`Item "${item.title}": published=${item.published} (type: ${typeof item.published}), isPublished=${isPublished}`);
      return isPublished;
    });
    console.log('Published items:', publishedItems);
    
    console.log(`Found ${publishedItems.length} published training(s) in demo mode`);
    
    if (publishedItems.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No trainings available yet. Create one in the admin panel!</p>';
      return;
    }
    
    // Sort by createdAt descending
    publishedItems.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    let html = '';
    publishedItems.forEach(item => {
      console.log('Loading training:', item.title);
      
      // Format date
      let dateStr = '';
      if (item.date) {
        try {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          } else {
            dateStr = item.date;
          }
        } catch (e) {
          dateStr = item.date;
        }
      }
      
      html += `
        <div class="training-card">
          <div class="training-image">
            <img src="${item.image || 'images/training-placeholder.jpg'}" alt="${item.title || 'Training'}">
          </div>
          <div class="training-content">
            <h2>${item.title || 'Training'}</h2>
            ${dateStr ? `<p class="training-date" style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">${dateStr}</p>` : ''}
            <p>${item.description || ''}</p>
            ${item.content ? `<a href="training-detail.html?id=${item.id}" class="btn-primary" data-i18n="trainings-read-more">Read More →</a>` : ''}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    console.log('Trainings loaded successfully from demo mode');
  } catch (error) {
    console.error('Error loading trainings from demo mode:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #e74c3c;">Error loading trainings. Please check console for details.</p>';
  }
}

// DEMO MODE: Load Speaking Events from localStorage
function loadSpeakingDemo() {
  const container = document.getElementById('speaking-list');
  if (!container) {
    console.warn('Speaking container not found');
    return;
  }
  
  try {
    console.log('Loading speaking events from localStorage (demo mode)...');
    
    // Clear any default content
    container.innerHTML = '';
    
    const storageKey = 'demoSpeaking';
    const rawData = localStorage.getItem(storageKey);
    console.log('Raw localStorage data for speaking:', rawData);
    const items = JSON.parse(rawData || '[]');
    console.log('Parsed items:', items);
    console.log('Total items:', items.length);
    
    // Check published status - handle both boolean true and string "true"
    const publishedItems = items.filter(item => {
      const isPublished = item.published === true || item.published === 'true';
      console.log(`Item "${item.title}": published=${item.published} (type: ${typeof item.published}), isPublished=${isPublished}`);
      return isPublished;
    });
    console.log('Published items:', publishedItems);
    
    console.log(`Found ${publishedItems.length} published speaking event(s) in demo mode`);
    
    if (publishedItems.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No speaking events yet. Create one in the admin panel!</p>';
      return;
    }
    
    // Sort by createdAt descending
    publishedItems.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    let html = '';
    publishedItems.forEach(item => {
      console.log('Loading speaking event:', item.title);
      const dateLabel = document.querySelector('[data-i18n="speaking-date-label"]')?.textContent || 'Date:';
      const moreInfoLabel = document.querySelector('[data-i18n="speaking-more-info"]')?.textContent || 'More information in the links below:';
      
      let linksHTML = '';
      if (item.links && item.links.length > 0) {
        linksHTML = `<p class="speaking-links"><span data-i18n="speaking-more-info">${moreInfoLabel}</span><br>`;
        item.links.forEach((link, index) => {
          linksHTML += `<a href="${link}" target="_blank" rel="noopener noreferrer">LinkedIn Link ${index + 1}</a><br>`;
        });
        linksHTML += '</p>';
      }
      
      html += `
        <div class="speaking-item">
          <div class="speaking-image">
            <img src="${item.image || 'images/speaking-placeholder.jpg'}" alt="${item.title || 'Speaking Event'}">
          </div>
          <div class="speaking-details">
            <h2>${item.title || 'Event'}</h2>
            <p class="speaking-location">${item.location || ''}</p>
            <p class="speaking-date"><span data-i18n="speaking-date-label">${dateLabel}</span> ${item.date || ''}</p>
            <p class="speaking-description">${item.description || ''}</p>
            ${linksHTML}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    console.log('Speaking events loaded successfully from demo mode');
  } catch (error) {
    console.error('Error loading speaking events from demo mode:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #e74c3c;">Error loading speaking events. Please check console for details.</p>';
  }
}

// DEMO MODE: Load Publications from localStorage
function loadPublicationsDemo() {
  const container = document.querySelector('.publications-list');
  if (!container) {
    console.warn('Publications container not found');
    return;
  }
  
  try {
    console.log('Loading publications from localStorage (demo mode)...');
    
    // Clear default content first
    const defaultCards = container.querySelectorAll('.publication-card');
    defaultCards.forEach(card => card.remove());
    
    const storageKey = 'demoPublications';
    const rawData = localStorage.getItem(storageKey);
    console.log('Raw localStorage data for publications:', rawData);
    const items = JSON.parse(rawData || '[]');
    console.log('Parsed items:', items);
    console.log('Total items:', items.length);
    
    // Check published status - handle both boolean true and string "true"
    const publishedItems = items.filter(item => {
      const isPublished = item.published === true || item.published === 'true';
      console.log(`Item "${item.title}": published=${item.published} (type: ${typeof item.published}), isPublished=${isPublished}`);
      return isPublished;
    });
    console.log('Published items:', publishedItems);
    
    console.log(`Found ${publishedItems.length} published publication(s) in demo mode`);
    
    if (publishedItems.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No publications available yet. Create one in the admin panel!</p>';
      return;
    }
    
    // Sort by createdAt descending
    publishedItems.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    let html = '';
    publishedItems.forEach(item => {
      console.log('Loading publication:', item.title);
      const readMoreLabel = document.querySelector('[data-i18n="publications-read-more"]')?.textContent || 'Read More →';
      
      // Format date
      let dateStr = '';
      if (item.date) {
        try {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          } else {
            dateStr = item.date;
          }
        } catch (e) {
          dateStr = item.date;
        }
      }
      
      html += `
        <article class="publication-card">
          <div class="publication-image">
            <img src="${item.image || 'images/publication-placeholder.jpg'}" alt="${item.title || 'Publication'}">
          </div>
          <div class="publication-content">
            <div class="publication-meta">
              <span class="publication-date">${dateStr}</span>
              ${item.category ? `<span class="publication-category">${item.category}</span>` : ''}
            </div>
            <h2 class="publication-title">${item.title || 'Publication'}</h2>
            <p class="publication-excerpt">${item.excerpt || ''}</p>
            ${item.content ? `<a href="publication-detail.html?id=${item.id}" class="read-more" data-i18n="publications-read-more">${readMoreLabel}</a>` : ''}
          </div>
        </article>
      `;
    });
    
    container.innerHTML = html;
    console.log('Publications loaded successfully from demo mode');
  } catch (error) {
    console.error('Error loading publications from demo mode:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #e74c3c;">Error loading publications. Please check console for details.</p>';
  }
}

// Manual reload function for testing (can be called from console)
window.reloadContent = function() {
  console.log('Manual content reload triggered');
  if (typeof db === 'undefined' || db === null) {
    console.log('Reloading in demo mode');
    loadTrainingsDemo();
    loadSpeakingDemo();
    loadPublicationsDemo();
  } else {
    console.log('Reloading from Firebase');
    loadTrainings();
    loadSpeaking();
    loadPublications();
  }
};

