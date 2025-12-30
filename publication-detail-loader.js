// Publication Detail Page Loader
// Loads a specific publication by ID from Firebase or localStorage

document.addEventListener('DOMContentLoaded', () => {
  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const publicationId = urlParams.get('id');
  
  if (!publicationId) {
    showError('No publication ID provided');
    return;
  }
  
  loadPublicationDetail(publicationId);
});

async function loadPublicationDetail(publicationId) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('content');
  
  try {
    let publication = null;
    
    // Check if we're in demo mode (db is null/undefined or has placeholder values)
    const useDemoMode = typeof db === 'undefined' || db === null || 
                       (typeof firebaseConfig !== 'undefined' && 
                        (firebaseConfig.apiKey === 'YOUR_API_KEY' || firebaseConfig.projectId === 'YOUR_PROJECT_ID'));
    
    if (useDemoMode) {
      console.log('Loading publication from localStorage (demo mode)');
      const storageKey = 'demoPublications';
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      publication = items.find(item => item.id === publicationId);
    } else {
      console.log('Loading publication from Firebase');
      const collection = typeof PUBLICATIONS_COLLECTION !== 'undefined' ? PUBLICATIONS_COLLECTION : 'publications';
      const doc = await db.collection(collection).doc(publicationId).get();
      if (doc.exists) {
        publication = { id: doc.id, ...doc.data() };
      }
    }
    
    if (!publication) {
      showError('Publication not found');
      return;
    }
    
    // Display publication
    document.getElementById('detailTitle').textContent = publication.title || 'Publication';
    
    // Format date
    let dateStr = '';
    if (publication.date) {
      try {
        const dateObj = new Date(publication.date);
        if (!isNaN(dateObj.getTime())) {
          dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else {
          dateStr = publication.date;
        }
      } catch (e) {
        dateStr = publication.date;
      }
    }
    
    // Meta info with category
    const metaEl = document.getElementById('detailMeta');
    if (dateStr) {
      metaEl.innerHTML = dateStr;
      if (publication.category) {
        metaEl.innerHTML += `<span class="detail-category">${publication.category}</span>`;
      }
    } else if (publication.category) {
      metaEl.innerHTML = `<span class="detail-category">${publication.category}</span>`;
    }
    
    // Image
    if (publication.image) {
      const imgEl = document.getElementById('detailImage');
      imgEl.src = publication.image;
      imgEl.alt = publication.title || 'Publication';
      imgEl.style.display = 'block';
    }
    
    // Description (excerpt)
    if (publication.excerpt) {
      document.getElementById('detailDescription').textContent = publication.excerpt;
    } else {
      document.getElementById('detailDescription').style.display = 'none';
    }
    
    // Content
    if (publication.content) {
      document.getElementById('detailContent').textContent = publication.content;
    } else {
      document.getElementById('detailContent').style.display = 'none';
    }
    
    // Update page title
    document.title = (publication.title || 'Publication') + ' - Sibel Ibram';
    
    // Show content, hide loading
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    
  } catch (error) {
    console.error('Error loading publication:', error);
    showError('Error loading publication details');
  }
}

function showError(message) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').querySelector('p').textContent = message;
}
