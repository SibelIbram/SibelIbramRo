// Admin App for Sibel Ibram Website
// Handles authentication and content management for Trainings, Speaking, and Publications

let currentUser = null;
let editingItemId = null;
let currentCategory = 'trainings';
let demoMode = false;

// DEMO MODE - For local testing without Firebase
const DEMO_EMAIL = 'demo@test.com';
const DEMO_PASSWORD = 'demo123';

// Check authentication state on load
if (typeof auth !== 'undefined' && auth !== null) {
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      if (user.email === DEMO_EMAIL) {
        demoMode = true;
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
          userEmailElement.textContent = user.email + ' (DEMO MODE)';
        }
      } else {
        demoMode = false;
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
          userEmailElement.textContent = user.email;
        }
      }
      showDashboard();
      loadItems(currentCategory);
    } else {
      showLogin();
    }
  });
} else {
  console.log('Firebase not configured - Demo mode available');
  console.log('You can login with: demo@test.com / demo123');
  showLogin();
}

// Login form handler
function setupLoginHandler() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) {
    console.error('Login form not found!');
    // Retry after a short delay
    setTimeout(setupLoginHandler, 100);
    return;
  }
  
  // Remove any existing listeners by cloning the form
  const newForm = loginForm.cloneNode(true);
  loginForm.parentNode.replaceChild(newForm, loginForm);
  
  // Add the event listener to the new form
  newForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Demo email match:', email === DEMO_EMAIL);
    console.log('Demo password match:', password === DEMO_PASSWORD);
    
    // Check for demo mode login
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      console.log('Demo mode login detected');
      demoMode = true;
      currentUser = { email: DEMO_EMAIL, uid: 'demo-user' };
      showAlert('loginAlert', '⚠️ Demo mode activated! Posts will be saved to browser only.', 'error');
      setTimeout(() => {
        showDashboard();
        loadItems(currentCategory);
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
          userEmailElement.textContent = email + ' (DEMO - Browser Only)';
        }
      }, 1500);
      return;
    }
    
    // Regular Firebase login
    if (typeof auth === 'undefined' || !auth) {
      showAlert('loginAlert', '⚠️ Firebase not configured. Use demo@test.com / demo123 for local testing.', 'error');
      return;
    }
    
    try {
      await auth.signInWithEmailAndPassword(email, password);
      showAlert('loginAlert', 'Login successful!', 'success');
    } catch (error) {
      console.error('Login error:', error);
      showAlert('loginAlert', getErrorMessage(error), 'error');
    }
  });
  
  console.log('Login handler attached successfully');
}

// Setup login handler when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLoginHandler);
} else {
  setupLoginHandler();
}

// Switch between categories (exposed globally)
window.switchCategory = function(category, clickedElement) {
  currentCategory = category;
  editingItemId = null;
  
  // Update nav buttons
  document.querySelectorAll('.admin-nav button').forEach(btn => {
    btn.classList.remove('active');
  });
  if (clickedElement) {
    clickedElement.classList.add('active');
  } else if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }
  
  // Show/hide tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.getElementById(category + 'Tab').classList.add('active');
  document.getElementById(category + 'ListTab').classList.add('active');
  
  // Reset forms
  resetForms();
  
  // Ensure form handlers are attached
  setupFormHandlers();
  
  // Load items
  loadItems(category);
};

// Switch between list and new/edit tabs (exposed globally)
window.switchTab = function(category, tab) {
  const listTab = document.getElementById(category + 'ListTab');
  const newTab = document.getElementById(category + 'NewTab');
  const categoryTabs = document.querySelectorAll(`#${category}Tab .category-tab`);
  
  categoryTabs.forEach(btn => btn.classList.remove('active'));
  
  if (tab === 'list') {
    listTab.classList.add('active');
    newTab.classList.remove('active');
    if (categoryTabs[0]) categoryTabs[0].classList.add('active');
    loadItems(category);
  } else {
    listTab.classList.remove('active');
    newTab.classList.add('active');
    if (categoryTabs[1]) categoryTabs[1].classList.add('active');
    resetForm(category);
    // Ensure form handlers are attached when showing the form
    setupFormHandlers();
  }
};

// Form handlers - use event delegation to handle forms that might be in hidden tabs
function setupFormHandlers() {
  const trainingsForm = document.getElementById('trainingsForm');
  const speakingForm = document.getElementById('speakingForm');
  const publicationsForm = document.getElementById('publicationsForm');
  
  if (trainingsForm && !trainingsForm.dataset.handlerAttached) {
    trainingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Trainings form submitted');
      await saveItem('trainings');
    });
    trainingsForm.dataset.handlerAttached = 'true';
  }
  
  if (speakingForm && !speakingForm.dataset.handlerAttached) {
    speakingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Speaking form submitted');
      await saveItem('speaking');
    });
    speakingForm.dataset.handlerAttached = 'true';
  }
  
  if (publicationsForm && !publicationsForm.dataset.handlerAttached) {
    publicationsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Publications form submitted');
      await saveItem('publications');
    });
    publicationsForm.dataset.handlerAttached = 'true';
  }
}

// Setup form handlers when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFormHandlers);
} else {
  setupFormHandlers();
}

// Save item (create or update)
async function saveItem(category, publishImmediately = false) {
  console.log('Saving item for category:', category);
  const itemData = getFormData(category);
  
  if (!itemData) {
    console.error('Validation failed');
    return; // Validation failed
  }
  
  // Override published status if publishImmediately is true
  if (publishImmediately) {
    itemData.published = true;
  }
  
  itemData.updatedAt = new Date().toISOString();
  
  try {
    if (demoMode) {
      await saveItemDemo(category, itemData);
    } else {
      if (typeof db === 'undefined') {
        throw new Error('Firebase not initialized. Check firebase-config.js');
      }
      await saveItemFirebase(category, itemData);
    }
    
    const message = itemData.published 
      ? 'Item saved and published successfully!'
      : 'Item saved successfully!';
    showAlert(category + 'FormAlert', message, 'success');
    resetForm(category);
    switchTab(category, 'list');
    loadItems(category);
  } catch (error) {
    console.error('Save error:', error);
    showAlert(category + 'FormAlert', 'Error: ' + getErrorMessage(error), 'error');
  }
}

// Publish and save item (exposed globally)
window.publishAndSave = async function(category) {
  console.log('Publish and Save called for:', category);
  await saveItem(category, true);
};

// Get form data based on category
function getFormData(category) {
  const idField = document.getElementById(category.slice(0, -1) + 'Id');
  const id = idField ? idField.value : null;
  
  const publishedCheckbox = document.getElementById(category.slice(0, -1) + 'Published');
  const published = publishedCheckbox ? publishedCheckbox.checked : false;
  
  console.log('Form data - published checkbox checked:', published);
  console.log('Form data - published checkbox element:', publishedCheckbox);
  
  let data = {
    id: id || null,
    published: published, // Ensure it's a boolean
    createdAt: id ? undefined : new Date().toISOString()
  };
  
  console.log('Form data object:', data);
  
  switch(category) {
    case 'trainings':
      const title = document.getElementById('trainingTitle').value.trim();
      const description = document.getElementById('trainingDescription').value.trim();
      if (!title || !description) {
        showAlert('trainingsFormAlert', 'Title and Description are required!', 'error');
        return null;
      }
      data.title = title;
      data.description = description;
      data.content = document.getElementById('trainingContent').value.trim();
      data.image = document.getElementById('trainingImage').value.trim();
      data.date = document.getElementById('trainingDate').value.trim();
      data.language = document.getElementById('trainingLanguage').value || 'en';
      break;
      
    case 'speaking':
      const speakingTitle = document.getElementById('speakingTitle').value.trim();
      const location = document.getElementById('speakingLocation').value.trim();
      const date = document.getElementById('speakingDate').value; // Date input returns YYYY-MM-DD format
      const speakingShortDesc = document.getElementById('speakingShortDescription').value.trim();
      const speakingDesc = document.getElementById('speakingDescription').value.trim();
      if (!speakingTitle || !location || !date || !speakingDesc) {
        showAlert('speakingFormAlert', 'Title, Location, Date, and Full Description are required!', 'error');
        return null;
      }
      data.title = speakingTitle;
      data.location = location;
      data.date = date; // Store as YYYY-MM-DD format
      data.shortDescription = speakingShortDesc;
      data.description = speakingDesc;
      data.image = document.getElementById('speakingImage').value.trim();
      
      // Get links - collect both text and URL
      const linkGroups = document.querySelectorAll('#speakingLinksContainer .link-input-group');
      data.links = [];
      linkGroups.forEach(group => {
        const textInput = group.querySelector('.speaking-link-text');
        const urlInput = group.querySelector('.speaking-link-url');
        if (textInput && urlInput) {
          const text = textInput.value.trim();
          let url = urlInput.value.trim();
          if (url) {
            // Normalize URL - add https:// if missing
            if (!url.match(/^https?:\/\//i)) {
              url = 'https://' + url;
            }
            data.links.push({
              text: text || url, // Use URL as text if no text provided
              url: url
            });
          }
        }
      });
      data.language = document.getElementById('speakingLanguage').value || 'en';
      break;
      
    case 'publications':
      const pubTitle = document.getElementById('publicationTitle').value.trim();
      const pubDate = document.getElementById('publicationDate').value;
      const excerpt = document.getElementById('publicationExcerpt').value.trim();
      if (!pubTitle || !pubDate || !excerpt) {
        showAlert('publicationsFormAlert', 'Title, Date, and Excerpt are required!', 'error');
        return null;
      }
      data.title = pubTitle;
      data.date = pubDate;
      data.category = document.getElementById('publicationCategory').value.trim();
      data.excerpt = excerpt;
      data.content = document.getElementById('publicationContent').value.trim();
      data.image = document.getElementById('publicationImage').value.trim();
      data.readMore = document.getElementById('publicationReadMore').value.trim();
      data.language = document.getElementById('publicationLanguage').value || 'en';
      break;
  }
  
  return data;
}

// Save to demo mode (localStorage)
async function saveItemDemo(category, itemData) {
  const storageKey = `demo${category.charAt(0).toUpperCase() + category.slice(1)}`;
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  if (itemData.id) {
    // Update existing
    const index = items.findIndex(item => item.id === itemData.id);
    if (index !== -1) {
      items[index] = { ...items[index], ...itemData };
    }
  } else {
    // Create new
    itemData.id = 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    items.push(itemData);
  }
  
  localStorage.setItem(storageKey, JSON.stringify(items));
}

// Save to Firebase
async function saveItemFirebase(category, itemData) {
  // Check if user is authenticated
  if (!currentUser && auth) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated. Please log in again.');
    }
    currentUser = user;
  }
  
  if (!db) {
    throw new Error('Firebase Firestore not initialized. Check firebase-config.js');
  }
  
  const collection = getCollectionName(category);
  console.log('Saving to Firebase collection:', collection, 'Data:', itemData);
  
  try {
    if (itemData.id && itemData.id !== '') {
      // Update existing
      const { id, ...updateData } = itemData;
      delete updateData.createdAt; // Don't update createdAt on edit
      console.log('Updating document:', id, updateData);
      await db.collection(collection).doc(id).update(updateData);
      console.log('Document updated successfully');
    } else {
      // Create new
      const { id, ...newData } = itemData;
      console.log('Creating new document:', newData);
      const docRef = await db.collection(collection).add(newData);
      itemData.id = docRef.id;
      console.log('Created with ID:', docRef.id);
    }
  } catch (error) {
    console.error('Firebase save error:', error);
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Check Firestore security rules and ensure you are authenticated.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore is temporarily unavailable. Please try again.');
    } else {
      throw new Error(`Save failed: ${error.message || 'Unknown error'}`);
    }
  }
}

// Load items
async function loadItems(category) {
  const listElement = document.getElementById(category + 'List');
  if (!listElement) return;
  
  listElement.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading...</p></div>';
  
  try {
    let items = [];
    
    if (demoMode) {
      const storageKey = `demo${category.charAt(0).toUpperCase() + category.slice(1)}`;
      items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } else {
      if (typeof db === 'undefined' || !db) {
        listElement.innerHTML = '<div class="alert alert-error">Firebase not configured. Using demo mode or check firebase-config.js</div>';
        return;
      }
      
      // Check if user is authenticated
      if (!currentUser && auth) {
        const user = auth.currentUser;
        if (!user) {
          listElement.innerHTML = '<div class="alert alert-error">Not authenticated. Please log in again.</div>';
          showLogin();
          return;
        }
        currentUser = user;
      }
      
      const collection = getCollectionName(category);
      
      // Try to query with orderBy first, fallback to simple query if index doesn't exist
      try {
        let query = db.collection(collection).orderBy('createdAt', 'desc');
        const snapshot = await query.get();
        items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (orderByError) {
        console.warn('orderBy query failed, trying without orderBy:', orderByError);
        // Fallback: get all documents without ordering
        try {
          const snapshot = await db.collection(collection).get();
          items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort manually by createdAt if available
          items.sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          throw fallbackError;
        }
      }
    }
    
    if (items.length === 0) {
      listElement.innerHTML = `<p style="text-align: center; padding: 2rem; color: #666;">No items yet. Create your first ${category.slice(0, -1)}!</p>`;
      return;
    }
    
    let itemsHTML = '';
    items.forEach(item => {
      const status = item.published ? '✅' : '📝';
      const escapedTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      let date = 'Draft';
      
      if (item.createdAt) {
        try {
          const dateObj = new Date(item.createdAt);
          if (!isNaN(dateObj.getTime())) {
            date = dateObj.toLocaleDateString();
          }
        } catch (e) {}
      }
      
      const language = item.language || 'en';
      const langLabel = language === 'ro' ? '<span style="background: #3498db; color: white; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem; margin-left: 0.5rem;">RO</span>' : '<span style="background: #2ecc71; color: white; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem; margin-left: 0.5rem;">EN</span>';
      
      itemsHTML += `
        <div class="post-item" id="item-${item.id}">
          <div class="post-item-header">
            <div class="post-info">
              <h3>${status} ${item.title || 'Untitled'}${langLabel}</h3>
              <div class="post-meta">
                <span>📅 ${date}</span>
                ${item.published ? '<span style="color: #27ae60;">Published</span>' : '<span style="color: #f39c12;">Draft</span>'}
              </div>
            </div>
            <div class="post-actions">
              <button class="btn-small btn-edit" onclick="toggleEditItem('${category}', '${item.id}')">Edit</button>
              <button class="btn-small btn-delete" onclick="deleteItem('${category}', '${item.id}', '${escapedTitle}')">Delete</button>
              ${!item.published ? `<button class="btn-small btn-publish" onclick="publishItem('${category}', '${item.id}')">Publish</button>` : `<button class="btn-small" style="background: #f39c12; color: white;" onclick="unpublishItem('${category}', '${item.id}')">Unpublish</button>`}
            </div>
          </div>
          ${generateInlineEditForm(category, item.id, item)}
        </div>
      `;
    });
    
    listElement.innerHTML = itemsHTML;
  } catch (error) {
    console.error('Load error:', error);
    listElement.innerHTML = `<div class="alert alert-error">Error loading items: ${getErrorMessage(error)}</div>`;
  }
}

// Generate inline edit form HTML
function generateInlineEditForm(category, itemId, item) {
  const escapedItemId = itemId.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  
  if (category === 'trainings') {
    return `
      <div class="post-edit-form" id="edit-form-${escapedItemId}">
        <h4 style="margin-top: 0; color: #2c3e50; margin-bottom: 1rem;">Edit Training</h4>
        <div class="form-group">
          <label>Language <span style="color: red;">*</span></label>
          <select id="edit-language-${escapedItemId}" class="edit-field">
            <option value="en" ${(item.language || 'en') === 'en' ? 'selected' : ''}>English</option>
            <option value="ro" ${(item.language || 'en') === 'ro' ? 'selected' : ''}>Romanian</option>
          </select>
        </div>
        <div class="form-group">
          <label>Title <span style="color: red;">*</span></label>
          <input type="text" id="edit-title-${escapedItemId}" class="edit-field" placeholder="Training title" value="${(item.title || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="edit-description-${escapedItemId}" class="edit-field" placeholder="Short description">${(item.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
        <div class="form-group">
          <label>Content</label>
          <div class="editor-toolbar">
            <button type="button" class="editor-btn" onclick="formatTextInline('bold', 'edit-content-${escapedItemId}')" title="Bold"><strong>B</strong></button>
            <button type="button" class="editor-btn" onclick="formatTextInline('italic', 'edit-content-${escapedItemId}')" title="Italic"><em>I</em></button>
            <button type="button" class="editor-btn" onclick="formatTextInline('insertUnorderedList', 'edit-content-${escapedItemId}')" title="Bullet List">• List</button>
            <button type="button" class="editor-btn" onclick="formatTextInline('insertOrderedList', 'edit-content-${escapedItemId}')" title="Numbered List">1. List</button>
            <button type="button" class="editor-btn" onclick="insertLinkInline('edit-content-${escapedItemId}')" title="Insert Link">🔗 Link</button>
            <div style="margin-left: 1rem; padding-left: 1rem; border-left: 2px solid #ddd; display: inline-flex; gap: 0.3rem;">
              <button type="button" class="editor-btn" onclick="setAlignmentInline('left', 'edit-content-${escapedItemId}')" title="Align Left" style="font-size: 1.1rem;">⬅</button>
              <button type="button" class="editor-btn" onclick="setAlignmentInline('center', 'edit-content-${escapedItemId}')" title="Align Center" style="font-size: 1.1rem;">↔</button>
              <button type="button" class="editor-btn" onclick="setAlignmentInline('right', 'edit-content-${escapedItemId}')" title="Align Right" style="font-size: 1.1rem;">➡</button>
            </div>
          </div>
          <textarea id="edit-content-${escapedItemId}" class="edit-field" placeholder="Full content" style="min-height: 200px;">${(item.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="url" id="edit-image-${escapedItemId}" class="edit-field" placeholder="https://example.com/image.jpg" value="${(item.image || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="edit-date-${escapedItemId}" class="edit-field" value="${item.date || ''}">
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="edit-published-${escapedItemId}" class="edit-field" ${item.published ? 'checked' : ''}>
            Publish immediately
          </label>
        </div>
        <div class="post-edit-actions">
          <button class="btn-small btn-edit" onclick="saveInlineEdit('${category}', '${escapedItemId}')">Save Changes</button>
          <button class="btn-small btn-delete" onclick="toggleEditItem('${category}', '${escapedItemId}')">Cancel</button>
        </div>
      </div>
    `;
  } else if (category === 'speaking') {
    let linksHTML = '';
    if (item.links && item.links.length > 0) {
      linksHTML = item.links.map((link, idx) => 
        `<div class="link-input-group"><input type="text" id="edit-link-text-${escapedItemId}-${idx}" class="edit-field" placeholder="Link text" value="${(link.text || '').replace(/"/g, '&quot;')}"><input type="url" id="edit-link-url-${escapedItemId}-${idx}" class="edit-field" placeholder="URL" value="${(link.url || '').replace(/"/g, '&quot;')}"><button type="button" class="btn-small btn-delete" onclick="removeInlineLink('${escapedItemId}', ${idx})">Remove</button></div>`
      ).join('');
    } else {
      linksHTML = `<div class="link-input-group"><input type="text" id="edit-link-text-${escapedItemId}-0" class="edit-field" placeholder="Link text"><input type="url" id="edit-link-url-${escapedItemId}-0" class="edit-field" placeholder="URL"></div>`;
    }
    
    return `
      <div class="post-edit-form" id="edit-form-${escapedItemId}">
        <h4 style="margin-top: 0; color: #2c3e50; margin-bottom: 1rem;">Edit Speaking Event</h4>
        <div class="form-group">
          <label>Language <span style="color: red;">*</span></label>
          <select id="edit-language-${escapedItemId}" class="edit-field">
            <option value="en" ${(item.language || 'en') === 'en' ? 'selected' : ''}>English</option>
            <option value="ro" ${(item.language || 'en') === 'ro' ? 'selected' : ''}>Romanian</option>
          </select>
        </div>
        <div class="form-group">
          <label>Title <span style="color: red;">*</span></label>
          <input type="text" id="edit-title-${escapedItemId}" class="edit-field" placeholder="Event title" value="${(item.title || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" id="edit-location-${escapedItemId}" class="edit-field" placeholder="Location" value="${(item.location || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="edit-date-${escapedItemId}" class="edit-field" value="${item.date && item.date.match(/^\d{4}-\d{2}-\d{2}$/) ? item.date : (() => { const today = new Date(); return today.toISOString().split('T')[0]; })()}">
        </div>
        <div class="form-group">
          <label>Short Description (for main page)</label>
          <textarea id="edit-short-description-${escapedItemId}" class="edit-field" placeholder="Brief description shown on the main page" rows="3">${(item.shortDescription || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
        <div class="form-group">
          <label>Full Description (for Read More page) <span style="color: red;">*</span></label>
          <div class="editor-toolbar">
            <button type="button" class="editor-btn" onclick="formatTextInline('bold', 'edit-description-${escapedItemId}')" title="Bold"><strong>B</strong></button>
            <button type="button" class="editor-btn" onclick="formatTextInline('italic', 'edit-description-${escapedItemId}')" title="Italic"><em>I</em></button>
            <button type="button" class="editor-btn" onclick="formatTextInline('insertUnorderedList', 'edit-description-${escapedItemId}')" title="Bullet List">• List</button>
            <button type="button" class="editor-btn" onclick="formatTextInline('insertOrderedList', 'edit-description-${escapedItemId}')" title="Numbered List">1. List</button>
            <button type="button" class="editor-btn" onclick="insertLinkInline('edit-description-${escapedItemId}')" title="Insert Link">🔗 Link</button>
            <div style="margin-left: 1rem; padding-left: 1rem; border-left: 2px solid #ddd; display: inline-flex; gap: 0.3rem;">
              <button type="button" class="editor-btn" onclick="setAlignmentInline('left', 'edit-description-${escapedItemId}')" title="Align Left" style="font-size: 1.1rem;">⬅</button>
              <button type="button" class="editor-btn" onclick="setAlignmentInline('center', 'edit-description-${escapedItemId}')" title="Align Center" style="font-size: 1.1rem;">↔</button>
              <button type="button" class="editor-btn" onclick="setAlignmentInline('right', 'edit-description-${escapedItemId}')" title="Align Right" style="font-size: 1.1rem;">➡</button>
            </div>
          </div>
          <textarea id="edit-description-${escapedItemId}" class="edit-field" placeholder="Description" style="min-height: 150px;">${(item.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
        <div class="form-group">
          <label>Links</label>
          <div id="edit-links-container-${escapedItemId}">${linksHTML}</div>
          <button type="button" class="btn-small" onclick="addInlineLink('${escapedItemId}')" style="margin-top: 0.5rem;">+ Add Link</button>
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="url" id="edit-image-${escapedItemId}" class="edit-field" placeholder="https://example.com/image.jpg" value="${(item.image || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="edit-published-${escapedItemId}" class="edit-field" ${item.published ? 'checked' : ''}>
            Publish immediately
          </label>
        </div>
        <div class="post-edit-actions">
          <button class="btn-small btn-edit" onclick="saveInlineEdit('${category}', '${escapedItemId}')">Save Changes</button>
          <button class="btn-small btn-delete" onclick="toggleEditItem('${category}', '${escapedItemId}')">Cancel</button>
        </div>
      </div>
    `;
  } else if (category === 'publications') {
    return `
      <div class="post-edit-form" id="edit-form-${escapedItemId}">
        <h4 style="margin-top: 0; color: #2c3e50; margin-bottom: 1rem;">Edit Publication</h4>
        <div class="form-group">
          <label>Language <span style="color: red;">*</span></label>
          <select id="edit-language-${escapedItemId}" class="edit-field">
            <option value="en" ${(item.language || 'en') === 'en' ? 'selected' : ''}>English</option>
            <option value="ro" ${(item.language || 'en') === 'ro' ? 'selected' : ''}>Romanian</option>
          </select>
        </div>
        <div class="form-group">
          <label>Title <span style="color: red;">*</span></label>
          <input type="text" id="edit-title-${escapedItemId}" class="edit-field" placeholder="Publication title" value="${(item.title || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="text" id="edit-date-${escapedItemId}" class="edit-field" placeholder="Date" value="${(item.date || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="edit-category-${escapedItemId}" class="edit-field">
            <option value="article" ${item.category === 'article' ? 'selected' : ''}>Article</option>
            <option value="book" ${item.category === 'book' ? 'selected' : ''}>Book</option>
            <option value="paper" ${item.category === 'paper' ? 'selected' : ''}>Paper</option>
          </select>
        </div>
        <div class="form-group">
          <label>Excerpt</label>
          <textarea id="edit-excerpt-${escapedItemId}" class="edit-field" placeholder="Short excerpt">${(item.excerpt || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
        <div class="form-group">
          <label>Content</label>
          <div class="editor-toolbar">
            <button type="button" class="editor-btn" onclick="formatTextInline('bold', 'edit-content-${escapedItemId}')" title="Bold"><strong>B</strong></button>
            <button type="button" class="editor-btn" onclick="formatTextInline('italic', 'edit-content-${escapedItemId}')" title="Italic"><em>I</em></button>
            <button type="button" class="editor-btn" onclick="formatTextInline('insertUnorderedList', 'edit-content-${escapedItemId}')" title="Bullet List">• List</button>
            <button type="button" class="editor-btn" onclick="formatTextInline('insertOrderedList', 'edit-content-${escapedItemId}')" title="Numbered List">1. List</button>
            <button type="button" class="editor-btn" onclick="insertLinkInline('edit-content-${escapedItemId}')" title="Insert Link">🔗 Link</button>
            <div style="margin-left: 1rem; padding-left: 1rem; border-left: 2px solid #ddd; display: inline-flex; gap: 0.3rem;">
              <button type="button" class="editor-btn" onclick="setAlignmentInline('left', 'edit-content-${escapedItemId}')" title="Align Left" style="font-size: 1.1rem;">⬅</button>
              <button type="button" class="editor-btn" onclick="setAlignmentInline('center', 'edit-content-${escapedItemId}')" title="Align Center" style="font-size: 1.1rem;">↔</button>
              <button type="button" class="editor-btn" onclick="setAlignmentInline('right', 'edit-content-${escapedItemId}')" title="Align Right" style="font-size: 1.1rem;">➡</button>
            </div>
          </div>
          <textarea id="edit-content-${escapedItemId}" class="edit-field" placeholder="Full content" style="min-height: 200px;">${(item.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="url" id="edit-image-${escapedItemId}" class="edit-field" placeholder="https://example.com/image.jpg" value="${(item.image || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>Read More URL</label>
          <input type="url" id="edit-readmore-${escapedItemId}" class="edit-field" placeholder="https://example.com" value="${(item.readMore || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="edit-published-${escapedItemId}" class="edit-field" ${item.published ? 'checked' : ''}>
            Publish immediately
          </label>
        </div>
        <div class="post-edit-actions">
          <button class="btn-small btn-edit" onclick="saveInlineEdit('${category}', '${escapedItemId}')">Save Changes</button>
          <button class="btn-small btn-delete" onclick="toggleEditItem('${category}', '${escapedItemId}')">Cancel</button>
        </div>
      </div>
    `;
  }
  return '';
}

// Toggle inline edit form
window.toggleEditItem = async function(category, itemId) {
  const editForm = document.getElementById(`edit-form-${itemId}`);
  if (!editForm) {
    showAlert(category + 'Alert', 'Edit form not found!', 'error');
    return;
  }
  
  // If form is already visible, hide it
  if (editForm.classList.contains('active')) {
    editForm.classList.remove('active');
    return;
  }
  
  // Hide all other edit forms
  document.querySelectorAll('.post-edit-form').forEach(form => {
    form.classList.remove('active');
  });
  
  // Load item data and fill form
  try {
    let item;
    
    if (demoMode) {
      const storageKey = `demo${category.charAt(0).toUpperCase() + category.slice(1)}`;
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      item = items.find(i => i.id === itemId);
    } else {
      const collection = getCollectionName(category);
      const doc = await db.collection(collection).doc(itemId).get();
      if (doc.exists) {
        item = { id: doc.id, ...doc.data() };
      }
    }
    
    if (!item) {
      showAlert(category + 'Alert', 'Item not found!', 'error');
      return;
    }
    
    // Fill inline edit form fields
    fillInlineEditForm(category, itemId, item);
    
    // Show the form
    editForm.classList.add('active');
    
    // Scroll to the form
    editForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error('Edit error:', error);
    showAlert(category + 'Alert', getErrorMessage(error), 'error');
  }
};

// Fill inline edit form with item data
function fillInlineEditForm(category, itemId, item) {
  document.getElementById(`edit-title-${itemId}`).value = item.title || '';
  document.getElementById(`edit-published-${itemId}`).checked = item.published || false;
  
  if (category === 'trainings') {
    document.getElementById(`edit-description-${itemId}`).value = item.description || '';
    document.getElementById(`edit-content-${itemId}`).value = item.content || '';
    document.getElementById(`edit-image-${itemId}`).value = item.image || '';
    document.getElementById(`edit-date-${itemId}`).value = item.date || '';
    const langSelect = document.getElementById(`edit-language-${itemId}`);
    if (langSelect) langSelect.value = item.language || 'en';
  } else if (category === 'speaking') {
    document.getElementById(`edit-location-${itemId}`).value = item.location || '';
    // Handle date: if it's a string (old format), use default date (today), otherwise use the date value
    let speakingEditDateValue = '';
    if (item.date) {
      // Check if it's already in YYYY-MM-DD format (date input format)
      if (item.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        speakingEditDateValue = item.date;
      } else {
        // It's an old string date, use default (today's date)
        const today = new Date();
        speakingEditDateValue = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
    } else {
      // No date, use default (today's date)
      const today = new Date();
      speakingEditDateValue = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    document.getElementById(`edit-date-${itemId}`).value = speakingEditDateValue;
    const shortDescField = document.getElementById(`edit-short-description-${itemId}`);
    if (shortDescField) shortDescField.value = item.shortDescription || '';
    document.getElementById(`edit-description-${itemId}`).value = item.description || '';
    document.getElementById(`edit-image-${itemId}`).value = item.image || '';
    const langSelect = document.getElementById(`edit-language-${itemId}`);
    if (langSelect) langSelect.value = item.language || 'en';
    // Handle links
    const linksContainer = document.getElementById(`edit-links-container-${itemId}`);
    linksContainer.innerHTML = '';
    if (item.links && item.links.length > 0) {
      item.links.forEach((link, idx) => {
        addInlineLinkInput(itemId, idx, link);
      });
    } else {
      addInlineLinkInput(itemId, 0);
    }
  } else if (category === 'publications') {
    document.getElementById(`edit-date-${itemId}`).value = item.date || '';
    document.getElementById(`edit-category-${itemId}`).value = item.category || '';
    document.getElementById(`edit-excerpt-${itemId}`).value = item.excerpt || '';
    document.getElementById(`edit-content-${itemId}`).value = item.content || '';
    document.getElementById(`edit-image-${itemId}`).value = item.image || '';
    document.getElementById(`edit-readmore-${itemId}`).value = item.readMore || '';
    const langSelect = document.getElementById(`edit-language-${itemId}`);
    if (langSelect) langSelect.value = item.language || 'en';
  }
}

// Save inline edit
window.saveInlineEdit = async function(category, itemId) {
  try {
    let itemData = {};
    
    if (category === 'trainings') {
      itemData = {
        title: document.getElementById(`edit-title-${itemId}`).value.trim(),
        description: document.getElementById(`edit-description-${itemId}`).value.trim(),
        content: document.getElementById(`edit-content-${itemId}`).value.trim(),
        image: document.getElementById(`edit-image-${itemId}`).value.trim(),
        date: document.getElementById(`edit-date-${itemId}`).value.trim(),
        language: document.getElementById(`edit-language-${itemId}`).value || 'en',
        published: document.getElementById(`edit-published-${itemId}`).checked
      };
    } else if (category === 'speaking') {
      const links = [];
      const linksContainer = document.getElementById(`edit-links-container-${itemId}`);
      const linkGroups = linksContainer.querySelectorAll('.link-input-group');
      linkGroups.forEach(group => {
        const textInput = group.querySelector('input[type="text"]');
        const urlInput = group.querySelector('input[type="url"]');
        if (textInput && urlInput) {
          const text = textInput.value.trim();
          let url = urlInput.value.trim();
          if (url) {
            // Normalize URL - add https:// if missing
            if (!url.match(/^https?:\/\//i)) {
              url = 'https://' + url;
            }
            links.push({ 
              text: text || url, // Use URL as text if no text provided
              url: url 
            });
          }
        }
      });
      
      itemData = {
        title: document.getElementById(`edit-title-${itemId}`).value.trim(),
        location: document.getElementById(`edit-location-${itemId}`).value.trim(),
        date: document.getElementById(`edit-date-${itemId}`).value, // Date input returns YYYY-MM-DD format
        shortDescription: document.getElementById(`edit-short-description-${itemId}`).value.trim(),
        description: document.getElementById(`edit-description-${itemId}`).value.trim(),
        image: document.getElementById(`edit-image-${itemId}`).value.trim(),
        links: links,
        language: document.getElementById(`edit-language-${itemId}`).value || 'en',
        published: document.getElementById(`edit-published-${itemId}`).checked
      };
    } else if (category === 'publications') {
      itemData = {
        title: document.getElementById(`edit-title-${itemId}`).value.trim(),
        date: document.getElementById(`edit-date-${itemId}`).value.trim(),
        category: document.getElementById(`edit-category-${itemId}`).value,
        excerpt: document.getElementById(`edit-excerpt-${itemId}`).value.trim(),
        content: document.getElementById(`edit-content-${itemId}`).value.trim(),
        image: document.getElementById(`edit-image-${itemId}`).value.trim(),
        readMore: document.getElementById(`edit-readmore-${itemId}`).value.trim(),
        language: document.getElementById(`edit-language-${itemId}`).value || 'en',
        published: document.getElementById(`edit-published-${itemId}`).checked
      };
    }
    
    // Validate required fields
    if (!itemData.title || itemData.title.length < 3) {
      showAlert(category + 'Alert', 'Title must be at least 3 characters!', 'error');
      return;
    }
    
    // Save to Firebase or localStorage
    if (demoMode) {
      const storageKey = `demo${category.charAt(0).toUpperCase() + category.slice(1)}`;
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const itemIndex = items.findIndex(i => i.id === itemId);
      if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], ...itemData };
        localStorage.setItem(storageKey, JSON.stringify(items));
      }
    } else {
      const collection = getCollectionName(category);
      await db.collection(collection).doc(itemId).update(itemData);
    }
    
    // Hide edit form and reload
    document.getElementById(`edit-form-${itemId}`).classList.remove('active');
    showAlert(category + 'Alert', 'Item updated successfully!', 'success');
    loadItems(category);
  } catch (error) {
    console.error('Save error:', error);
    showAlert(category + 'Alert', 'Error saving: ' + getErrorMessage(error), 'error');
  }
};

// Helper functions for inline links
window.addInlineLink = function(itemId) {
  const container = document.getElementById(`edit-links-container-${itemId}`);
  const linkGroups = container.querySelectorAll('.link-input-group');
  const nextIndex = linkGroups.length;
  addInlineLinkInput(itemId, nextIndex);
};

function addInlineLinkInput(itemId, index, link = null) {
  const container = document.getElementById(`edit-links-container-${itemId}`);
  const div = document.createElement('div');
  div.className = 'link-input-group';
  div.innerHTML = `
    <input type="text" id="edit-link-text-${itemId}-${index}" class="edit-field" placeholder="Link text" value="${link ? (link.text || '').replace(/"/g, '&quot;') : ''}">
    <input type="url" id="edit-link-url-${itemId}-${index}" class="edit-field" placeholder="URL" value="${link ? (link.url || '').replace(/"/g, '&quot;') : ''}">
    <button type="button" class="btn-small btn-delete" onclick="removeInlineLink('${itemId}', ${index})">Remove</button>
  `;
  container.appendChild(div);
}

window.removeInlineLink = function(itemId, index) {
  const container = document.getElementById(`edit-links-container-${itemId}`);
  const linkGroups = container.querySelectorAll('.link-input-group');
  if (linkGroups[index]) {
    linkGroups[index].remove();
  }
};

// Fill form with item data
function fillForm(category, item) {
  const idField = document.getElementById(category.slice(0, -1) + 'Id');
  if (idField) idField.value = item.id;
  
  switch(category) {
    case 'trainings':
      document.getElementById('trainingTitle').value = item.title || '';
      document.getElementById('trainingDescription').value = item.description || '';
      document.getElementById('trainingContent').value = item.content || '';
      document.getElementById('trainingImage').value = item.image || '';
      document.getElementById('trainingDate').value = item.date || '';
      document.getElementById('trainingLanguage').value = item.language || 'en';
      document.getElementById('trainingPublished').checked = item.published || false;
      break;
      
    case 'speaking':
      document.getElementById('speakingTitle').value = item.title || '';
      document.getElementById('speakingLocation').value = item.location || '';
      // Handle date: if it's a string (old format), use default date (today), otherwise use the date value
      let speakingDateValue = '';
      if (item.date) {
        // Check if it's already in YYYY-MM-DD format (date input format)
        if (item.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          speakingDateValue = item.date;
        } else {
          // It's an old string date, use default (today's date)
          const today = new Date();
          speakingDateValue = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
      } else {
        // No date, use default (today's date)
        const today = new Date();
        speakingDateValue = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
      document.getElementById('speakingDate').value = speakingDateValue;
      document.getElementById('speakingShortDescription').value = item.shortDescription || '';
      document.getElementById('speakingDescription').value = item.description || '';
      document.getElementById('speakingImage').value = item.image || '';
      document.getElementById('speakingLanguage').value = item.language || 'en';
      document.getElementById('speakingPublished').checked = item.published || false;
      
      // Clear and populate links
      const linksContainer = document.getElementById('speakingLinksContainer');
      linksContainer.innerHTML = '';
      if (item.links && item.links.length > 0) {
        item.links.forEach(link => {
          addLink(link);
        });
      } else {
        addLink();
      }
      break;
      
    case 'publications':
      document.getElementById('publicationTitle').value = item.title || '';
      document.getElementById('publicationDate').value = item.date || '';
      document.getElementById('publicationCategory').value = item.category || '';
      document.getElementById('publicationExcerpt').value = item.excerpt || '';
      document.getElementById('publicationContent').value = item.content || '';
      document.getElementById('publicationImage').value = item.image || '';
      document.getElementById('publicationReadMore').value = item.readMore || '';
      document.getElementById('publicationLanguage').value = item.language || 'en';
      document.getElementById('publicationPublished').checked = item.published || false;
      break;
  }
}

// Delete item (exposed globally)
window.deleteItem = async function(category, itemId, itemTitle) {
  if (!confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
    return;
  }
  
  try {
    if (demoMode) {
      const storageKey = `demo${category.charAt(0).toUpperCase() + category.slice(1)}`;
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = items.filter(item => item.id !== itemId);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
    } else {
      // Check authentication
      if (!currentUser && auth) {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Not authenticated. Please log in again.');
        }
        currentUser = user;
      }
      
      if (!db) {
        throw new Error('Firebase Firestore not initialized.');
      }
      
      const collection = getCollectionName(category);
      await db.collection(collection).doc(itemId).delete();
    }
    
    showAlert(category + 'Alert', 'Item deleted successfully!', 'success');
    loadItems(category);
  } catch (error) {
    console.error('Delete error:', error);
    const errorMsg = error.code === 'permission-denied' 
      ? 'Permission denied. Check Firestore security rules.'
      : getErrorMessage(error);
    showAlert(category + 'Alert', 'Delete failed: ' + errorMsg, 'error');
  }
}

// Publish/Unpublish item (exposed globally)
window.publishItem = async function(category, itemId) {
  await updatePublishStatus(category, itemId, true);
};

window.unpublishItem = async function(category, itemId) {
  await updatePublishStatus(category, itemId, false);
};

async function updatePublishStatus(category, itemId, published) {
  try {
    if (demoMode) {
      const storageKey = `demo${category.charAt(0).toUpperCase() + category.slice(1)}`;
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const item = items.find(i => i.id === itemId);
      if (item) {
        item.published = published;
        localStorage.setItem(storageKey, JSON.stringify(items));
      }
    } else {
      // Check authentication
      if (!currentUser && auth) {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Not authenticated. Please log in again.');
        }
        currentUser = user;
      }
      
      if (!db) {
        throw new Error('Firebase Firestore not initialized.');
      }
      
      const collection = getCollectionName(category);
      await db.collection(collection).doc(itemId).update({ published });
    }
    
    showAlert(category + 'Alert', `Item ${published ? 'published' : 'unpublished'} successfully!`, 'success');
    loadItems(category);
  } catch (error) {
    console.error('Publish error:', error);
    const errorMsg = error.code === 'permission-denied' 
      ? 'Permission denied. Check Firestore security rules.'
      : getErrorMessage(error);
    showAlert(category + 'Alert', `${published ? 'Publish' : 'Unpublish'} failed: ` + errorMsg, 'error');
  }
}

// Helper functions
function getCollectionName(category) {
  const collections = {
    'trainings': TRAININGS_COLLECTION,
    'speaking': SPEAKING_COLLECTION,
    'publications': PUBLICATIONS_COLLECTION
  };
  return collections[category] || category;
}

function resetForm(category) {
  editingItemId = null;
  const form = document.getElementById(category + 'Form');
  if (form) form.reset();
  
  const idField = document.getElementById(category.slice(0, -1) + 'Id');
  if (idField) idField.value = '';
  
  // Reset speaking links
  if (category === 'speaking') {
    const linksContainer = document.getElementById('speakingLinksContainer');
    linksContainer.innerHTML = '';
    addLink();
  }
  
  // Reset docx status
  const docxStatus = document.getElementById(category + 'DocxStatus');
  if (docxStatus) {
    docxStatus.textContent = '';
  }
  
  // Reset image upload status
  const imageStatus = document.getElementById(category + 'ImageStatus');
  if (imageStatus) {
    imageStatus.textContent = '';
  }
  
  // Reset image upload input
  const imageUpload = document.getElementById(category + 'ImageUpload');
  if (imageUpload) {
    imageUpload.value = '';
  }
}

function resetForms() {
  resetForm('trainings');
  resetForm('speaking');
  resetForm('publications');
}

window.cancelEdit = function(category) {
  resetForm(category);
  switchTab(category, 'list');
}

// Speaking links management
window.addLink = function(link = null) {
  const container = document.getElementById('speakingLinksContainer');
  const linkGroup = document.createElement('div');
  linkGroup.className = 'link-input-group';
  const textValue = link && typeof link === 'object' ? (link.text || '') : '';
  const urlValue = link && typeof link === 'object' ? (link.url || '') : (typeof link === 'string' ? link : '');
  linkGroup.innerHTML = `
    <input type="text" class="speaking-link-text" placeholder="Link text (e.g., View on LinkedIn)" value="${textValue.replace(/"/g, '&quot;')}" style="flex: 1;">
    <input type="url" class="speaking-link-url" placeholder="https://example.com/link" value="${urlValue.replace(/"/g, '&quot;')}" style="flex: 1;">
    <button type="button" onclick="removeLink(this)" class="btn-small btn-delete">Remove</button>
  `;
  container.appendChild(linkGroup);
}

window.removeLink = function(button) {
  button.parentElement.remove();
}

// .docx file upload handler
async function handleDocxUpload(event, category) {
  const file = event.target.files[0];
  if (!file) return;
  
  const statusElement = document.getElementById(category + 'DocxStatus');
  statusElement.textContent = 'Processing...';
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
      ]
    });
    const html = result.value;
    
    // Convert HTML to markdown format (preserves formatting)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Function to convert HTML to markdown
    function htmlToMarkdown(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }
      
      const tagName = node.tagName.toLowerCase();
      const children = Array.from(node.childNodes).map(htmlToMarkdown).join('');
      
      switch(tagName) {
        case 'h1':
          return '\n\n# ' + children.trim() + '\n\n';
        case 'h2':
          return '\n\n## ' + children.trim() + '\n\n';
        case 'h3':
          return '\n\n### ' + children.trim() + '\n\n';
        case 'h4':
          return '\n\n#### ' + children.trim() + '\n\n';
        case 'h5':
          return '\n\n##### ' + children.trim() + '\n\n';
        case 'h6':
          return '\n\n###### ' + children.trim() + '\n\n';
        case 'p':
          return children.trim() + '\n\n';
        case 'br':
          return '\n';
        case 'strong':
        case 'b':
          return '**' + children.trim() + '**';
        case 'em':
        case 'i':
          return '*' + children.trim() + '*';
        case 'ul':
          const ulItems = Array.from(node.querySelectorAll('li')).map(li => {
            const liContent = Array.from(li.childNodes).map(htmlToMarkdown).join('').trim();
            return '- ' + liContent;
          }).join('\n');
          return '\n' + ulItems + '\n\n';
        case 'ol':
          const olItems = Array.from(node.querySelectorAll('li')).map((li, index) => {
            const liContent = Array.from(li.childNodes).map(htmlToMarkdown).join('').trim();
            return (index + 1) + '. ' + liContent;
          }).join('\n');
          return '\n' + olItems + '\n\n';
        case 'li':
          return children;
        case 'a':
          const href = node.getAttribute('href') || '';
          const linkText = children.trim() || href;
          return '[' + linkText + '](' + href + ')';
        case 'div':
          const style = node.getAttribute('style') || '';
          if (style.includes('text-align: center')) {
            return '\n[center]' + children.trim() + '[/center]\n\n';
          } else if (style.includes('text-align: right')) {
            return '\n[right]' + children.trim() + '[/right]\n\n';
          } else if (style.includes('text-align: left')) {
            return '\n[left]' + children.trim() + '[/left]\n\n';
          }
          return children;
        default:
          return children;
      }
    }
    
    // Convert all nodes to markdown
    let markdown = Array.from(tempDiv.childNodes).map(htmlToMarkdown).join('');
    
    // Clean up excessive newlines (more than 2 consecutive)
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();
    
    // Set content in textarea
    // For speaking category, use 'speakingDescription' instead of 'speakingContent'
    const fieldName = category === 'speaking' ? 'speakingDescription' : (category + 'Content');
    const contentField = document.getElementById(fieldName);
    if (contentField) {
      const existingContent = contentField.value.trim();
      if (existingContent) {
        if (confirm('Content field already has text. Replace it with the imported content?')) {
          contentField.value = markdown;
        } else {
          contentField.value = existingContent + '\n\n' + markdown;
        }
      } else {
        contentField.value = markdown;
      }
    }
    
    statusElement.textContent = '✅ File processed successfully!';
    statusElement.style.color = '#27ae60';
  } catch (error) {
    console.error('Docx processing error:', error);
    statusElement.textContent = '❌ Error processing file';
    statusElement.style.color = '#e74c3c';
  }
}

// Image upload handler - supports Firebase Storage and base64 fallback
window.handleImageUpload = async function(event, category) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    const statusElement = document.getElementById(category + 'ImageStatus');
    statusElement.textContent = '❌ Please select an image file';
    statusElement.style.color = '#e74c3c';
    return;
  }
  
  // Validate file size (max 5MB for base64, 10MB for Firebase Storage)
  const maxSizeBase64 = 5 * 1024 * 1024; // 5MB
  const maxSizeStorage = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSizeStorage) {
    const statusElement = document.getElementById(category + 'ImageStatus');
    statusElement.textContent = '❌ Image too large (max 10MB)';
    statusElement.style.color = '#e74c3c';
    return;
  }
  
  const statusElement = document.getElementById(category + 'ImageStatus');
  const imageUrlField = document.getElementById(category + 'Image');
  
  statusElement.textContent = 'Uploading...';
  statusElement.style.color = '#666';
  
  try {
    let imageUrl = '';
    
    // Check if Firebase Storage is available
    if (typeof storage !== 'undefined' && storage !== null && firebaseInitialized) {
      // Use Firebase Storage
      console.log('Uploading to Firebase Storage...');
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${category}/${timestamp}_${file.name}`;
      const storageRef = storage.ref().child(fileName);
      
      // Upload file
      const snapshot = await storageRef.put(file);
      imageUrl = await snapshot.ref.getDownloadURL();
      
      statusElement.textContent = '✅ Uploaded to Firebase Storage';
      statusElement.style.color = '#27ae60';
      console.log('Image uploaded to Firebase Storage:', imageUrl);
      
    } else {
      // Fallback to base64 encoding (for demo mode or when Storage is not available)
      console.log('Using base64 encoding (demo mode)...');
      
      if (file.size > maxSizeBase64) {
        statusElement.textContent = '⚠️ Image too large for demo mode (max 5MB). Use Firebase Storage for larger images.';
        statusElement.style.color = '#f39c12';
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64String = e.target.result;
        imageUrlField.value = base64String;
        statusElement.textContent = '✅ Image converted to base64 (demo mode)';
        statusElement.style.color = '#27ae60';
        console.log('Image converted to base64');
      };
      reader.onerror = function() {
        statusElement.textContent = '❌ Error reading file';
        statusElement.style.color = '#e74c3c';
      };
      reader.readAsDataURL(file);
      return; // Exit early, base64 conversion is async
    }
    
    // Set the URL in the input field
    if (imageUrl) {
      imageUrlField.value = imageUrl;
    }
    
  } catch (error) {
    console.error('Image upload error:', error);
    statusElement.textContent = '❌ Upload failed: ' + (error.message || 'Unknown error');
    statusElement.style.color = '#e74c3c';
    
    // If Firebase Storage fails, try base64 as fallback
    if (file.size <= maxSizeBase64) {
      console.log('Firebase Storage failed, trying base64 fallback...');
      try {
        const reader = new FileReader();
        reader.onload = function(e) {
          const base64String = e.target.result;
          imageUrlField.value = base64String;
          statusElement.textContent = '⚠️ Using base64 (Storage failed)';
          statusElement.style.color = '#f39c12';
        };
        reader.readAsDataURL(file);
      } catch (base64Error) {
        console.error('Base64 conversion also failed:', base64Error);
      }
    }
  }
};

// Utility functions
function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminDashboard').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
}

window.logout = function() {
  if (auth && !demoMode) {
    auth.signOut();
  }
  currentUser = null;
  demoMode = false;
  showLogin();
  resetForms();
}

function showAlert(elementId, message, type) {
  const alertElement = document.getElementById(elementId);
  if (!alertElement) return;
  
  alertElement.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => {
    alertElement.innerHTML = '';
  }, 5000);
}

// Text formatting functions for inline editors
window.formatTextInline = function(command, textareaId) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  
  if (!selectedText) {
    const helpMessages = {
      'bold': 'Please select the text you want to make bold first.',
      'italic': 'Please select the text you want to make italic first.',
      'insertUnorderedList': 'Please select the text you want to convert to a bullet list first.',
      'insertOrderedList': 'Please select the text you want to convert to a numbered list first.'
    };
    const message = helpMessages[command] || 'Please select text first to apply formatting.';
    showAlert('trainingsAlert', `💡 ${message}`, 'info');
    showAlert('speakingAlert', `💡 ${message}`, 'info');
    showAlert('publicationsAlert', `💡 ${message}`, 'info');
    textarea.focus();
    return;
  }
  
  let formattedText = '';
  switch(command) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'insertUnorderedList':
      const lines = selectedText.split('\n').filter(line => line.trim());
      formattedText = '\n' + lines.map(line => `- ${line.trim()}`).join('\n') + '\n';
      break;
    case 'insertOrderedList':
      const numberedLines = selectedText.split('\n').filter(line => line.trim());
      formattedText = '\n' + numberedLines.map((line, index) => `${index + 1}. ${line.trim()}`).join('\n') + '\n';
      break;
    default:
      return;
  }
  
  textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
  textarea.focus();
  const newCursorPos = start + formattedText.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
};

window.insertLinkInline = function(textareaId) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  
  const url = prompt('Enter URL:', 'https://');
  if (!url) return;
  
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
    if (confirm('URL should start with http:// or https://. Add https:// automatically?')) {
      const finalUrl = 'https://' + url;
      const linkText = selectedText || url;
      const markdown = `[${linkText}](${finalUrl})`;
      textarea.value = textarea.value.substring(0, start) + markdown + textarea.value.substring(end);
      textarea.focus();
      const newCursorPos = start + markdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      return;
    } else {
      return;
    }
  }
  
  const linkText = selectedText || 'link text';
  const markdown = `[${linkText}](${url})`;
  textarea.value = textarea.value.substring(0, start) + markdown + textarea.value.substring(end);
  textarea.focus();
  const newCursorPos = start + markdown.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
};

window.setAlignmentInline = function(align, textareaId) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const fullText = textarea.value;
  
  if (start !== end) {
    const selectedText = fullText.substring(start, end);
    const beforeText = fullText.substring(0, start);
    const afterText = fullText.substring(end);
    
    const alignTagRegex = /^\[(left|center|right)\](.*?)\[\/\1\]$/s;
    let textToAlign = selectedText;
    let alreadyAligned = false;
    let existingAlign = null;
    
    if (alignTagRegex.test(selectedText.trim())) {
      const match = selectedText.trim().match(alignTagRegex);
      existingAlign = match[1];
      textToAlign = match[2];
      alreadyAligned = true;
    }
    
    if (alreadyAligned && existingAlign === align) {
      const newText = beforeText + textToAlign + afterText;
      textarea.value = newText;
      textarea.setSelectionRange(start, start + textToAlign.length);
    } else {
      const alignedText = `[${align}]${textToAlign}[/${align}]`;
      const newText = beforeText + alignedText + afterText;
      textarea.value = newText;
      textarea.setSelectionRange(start, start + alignedText.length);
    }
  } else {
    let paraStart = fullText.lastIndexOf('\n\n', start - 1);
    if (paraStart === -1) paraStart = 0;
    else paraStart += 2;
    
    let paraEnd = fullText.indexOf('\n\n', end);
    if (paraEnd === -1) paraEnd = fullText.length;
    
    const paraText = fullText.substring(paraStart, paraEnd);
    const beforePara = fullText.substring(0, paraStart);
    const afterPara = fullText.substring(paraEnd);
    
    const alignTagRegex = /^\[(left|center|right)\](.*?)\[\/\1\]$/s;
    let textToAlign = paraText;
    let alreadyAligned = false;
    let existingAlign = null;
    
    if (alignTagRegex.test(paraText.trim())) {
      const match = paraText.trim().match(alignTagRegex);
      existingAlign = match[1];
      textToAlign = match[2];
      alreadyAligned = true;
    }
    
    if (alreadyAligned && existingAlign === align) {
      const newText = beforePara + textToAlign + afterPara;
      textarea.value = newText;
      textarea.setSelectionRange(paraStart, paraStart + textToAlign.length);
    } else {
      const alignedText = `[${align}]${textToAlign}[/${align}]`;
      const newText = beforePara + alignedText + afterPara;
      textarea.value = newText;
      textarea.setSelectionRange(paraStart, paraStart + alignedText.length);
    }
  }
  
  textarea.focus();
};

// Text formatting functions for main form (backward compatibility)
window.formatText = function(command) {
  formatTextInline(command, 'trainingContent');
  formatTextInline(command, 'speakingDescription');
  formatTextInline(command, 'publicationContent');
};

window.insertLink = function() {
  insertLinkInline('trainingContent');
  insertLinkInline('speakingDescription');
  insertLinkInline('publicationContent');
};

window.setAlignment = function(align) {
  setAlignmentInline(align, 'trainingContent');
  setAlignmentInline(align, 'speakingDescription');
  setAlignmentInline(align, 'publicationContent');
};

function getErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An error occurred';
}

