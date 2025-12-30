// Training Detail Page Loader
// Loads a specific training by ID from Firebase or localStorage

document.addEventListener('DOMContentLoaded', () => {
  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const trainingId = urlParams.get('id');
  
  if (!trainingId) {
    showError('No training ID provided');
    return;
  }
  
  loadTrainingDetail(trainingId);
});

async function loadTrainingDetail(trainingId) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('content');
  
  try {
    let training = null;
    
    // Check if we're in demo mode (db is null/undefined or has placeholder values)
    const useDemoMode = typeof db === 'undefined' || db === null || 
                       (typeof firebaseConfig !== 'undefined' && 
                        (firebaseConfig.apiKey === 'YOUR_API_KEY' || firebaseConfig.projectId === 'YOUR_PROJECT_ID'));
    
    if (useDemoMode) {
      console.log('Loading training from localStorage (demo mode)');
      const storageKey = 'demoTrainings';
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      training = items.find(item => item.id === trainingId);
    } else {
      console.log('Loading training from Firebase');
      const collection = typeof TRAININGS_COLLECTION !== 'undefined' ? TRAININGS_COLLECTION : 'trainings';
      const doc = await db.collection(collection).doc(trainingId).get();
      if (doc.exists) {
        training = { id: doc.id, ...doc.data() };
      }
    }
    
    if (!training) {
      showError('Training not found');
      return;
    }
    
    // Display training
    document.getElementById('detailTitle').textContent = training.title || 'Training';
    
    // Format date
    let dateStr = '';
    if (training.date) {
      try {
        const dateObj = new Date(training.date);
        if (!isNaN(dateObj.getTime())) {
          dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else {
          dateStr = training.date;
        }
      } catch (e) {
        dateStr = training.date;
      }
    }
    
    if (dateStr) {
      document.getElementById('detailMeta').textContent = dateStr;
    }
    
    // Image
    if (training.image) {
      const imgEl = document.getElementById('detailImage');
      imgEl.src = training.image;
      imgEl.alt = training.title || 'Training';
      imgEl.style.display = 'block';
    }
    
    // Description
    if (training.description) {
      document.getElementById('detailDescription').textContent = training.description;
    } else {
      document.getElementById('detailDescription').style.display = 'none';
    }
    
    // Content
    if (training.content) {
      document.getElementById('detailContent').textContent = training.content;
    } else {
      document.getElementById('detailContent').style.display = 'none';
    }
    
    // Update page title
    document.title = (training.title || 'Training') + ' - Sibel Ibram';
    
    // Show content, hide loading
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    
  } catch (error) {
    console.error('Error loading training:', error);
    showError('Error loading training details');
  }
}

function showError(message) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').querySelector('p').textContent = message;
}




