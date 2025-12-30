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
      break;
      
    case 'speaking':
      const speakingTitle = document.getElementById('speakingTitle').value.trim();
      const location = document.getElementById('speakingLocation').value.trim();
      const date = document.getElementById('speakingDate').value.trim();
      const speakingDesc = document.getElementById('speakingDescription').value.trim();
      if (!speakingTitle || !location || !date || !speakingDesc) {
        showAlert('speakingFormAlert', 'Title, Location, Date, and Description are required!', 'error');
        return null;
      }
      data.title = speakingTitle;
      data.location = location;
      data.date = date;
      data.description = speakingDesc;
      data.image = document.getElementById('speakingImage').value.trim();
      
      // Get links
      const linkInputs = document.querySelectorAll('.speaking-link-input');
      data.links = Array.from(linkInputs)
        .map(input => input.value.trim())
        .filter(link => link.length > 0);
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
      
      itemsHTML += `
        <div class="post-item" id="item-${item.id}">
          <div class="post-item-header">
            <div class="post-info">
              <h3>${status} ${item.title || 'Untitled'}</h3>
              <div class="post-meta">
                <span>📅 ${date}</span>
                ${item.published ? '<span style="color: #27ae60;">Published</span>' : '<span style="color: #f39c12;">Draft</span>'}
              </div>
            </div>
            <div class="post-actions">
              <button class="btn-small btn-edit" onclick="editItem('${category}', '${item.id}')">Edit</button>
              <button class="btn-small btn-delete" onclick="deleteItem('${category}', '${item.id}', '${escapedTitle}')">Delete</button>
              ${!item.published ? `<button class="btn-small btn-publish" onclick="publishItem('${category}', '${item.id}')">Publish</button>` : `<button class="btn-small" style="background: #f39c12; color: white;" onclick="unpublishItem('${category}', '${item.id}')">Unpublish</button>`}
            </div>
          </div>
        </div>
      `;
    });
    
    listElement.innerHTML = itemsHTML;
  } catch (error) {
    console.error('Load error:', error);
    listElement.innerHTML = `<div class="alert alert-error">Error loading items: ${getErrorMessage(error)}</div>`;
  }
}

// Edit item
window.editItem = async function(category, itemId) {
  editingItemId = itemId;
  currentCategory = category;
  
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
    
    // Fill form
    fillForm(category, item);
    switchTab(category, 'new');
  } catch (error) {
    console.error('Edit error:', error);
    showAlert(category + 'Alert', getErrorMessage(error), 'error');
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
      document.getElementById('trainingPublished').checked = item.published || false;
      break;
      
    case 'speaking':
      document.getElementById('speakingTitle').value = item.title || '';
      document.getElementById('speakingLocation').value = item.location || '';
      document.getElementById('speakingDate').value = item.date || '';
      document.getElementById('speakingDescription').value = item.description || '';
      document.getElementById('speakingImage').value = item.image || '';
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
window.addLink = function(value = '') {
  const container = document.getElementById('speakingLinksContainer');
  const linkGroup = document.createElement('div');
  linkGroup.className = 'link-input-group';
  linkGroup.innerHTML = `
    <input type="url" class="speaking-link-input" placeholder="https://example.com/link" value="${value}">
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
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    const html = result.value;
    
    // Convert HTML to plain text (or keep HTML if you want formatting)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Set content in textarea
    const contentField = document.getElementById(category + 'Content');
    if (contentField) {
      contentField.value = textContent;
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

function getErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An error occurred';
}

