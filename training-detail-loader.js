// Training Detail Page Loader
// Loads a specific training by ID from Firebase or localStorage

// Markdown to HTML renderer (same as content-loader.js)
function formatMarkdownContent(content) {
  if (!content) return '';
  
  let text = content;
  
  // First, handle alignment tags [left], [center], [right] - must come very early
  text = text.replace(/\[left\]\s*([\s\S]*?)\s*\[\/left\]/g, '<div style="text-align: left;">$1</div>');
  text = text.replace(/\[center\]\s*([\s\S]*?)\s*\[\/center\]/g, '<div style="text-align: center;">$1</div>');
  text = text.replace(/\[right\]\s*([\s\S]*?)\s*\[\/right\]/g, '<div style="text-align: right;">$1</div>');
  
  // Handle headers (##, ###, etc.) - after alignment
  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Handle links [text](url) - before other formatting
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Handle bold **text** - must come before italic to avoid conflicts
  text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  
  // IMPORTANT: Remove blank lines between list items BEFORE converting to HTML
  // This prevents blank lines from appearing in the rendered output
  // For numbered lists: remove ALL blank lines between "1. item" lines (repeat until no more matches)
  let prevText = '';
  while (text !== prevText) {
    prevText = text;
    text = text.replace(/(^\d+\. .+)\s*\n\s*\n+\s*(^\d+\. .+)/gm, '$1\n$2');
  }
  // For bullet lists: remove ALL blank lines between "- item" lines (repeat until no more matches)
  prevText = '';
  while (text !== prevText) {
    prevText = text;
    text = text.replace(/(^[-•*] .+)\s*\n\s*\n+\s*(^[-•*] .+)/gm, '$1\n$2');
  }
  
  // Handle numbered lists (1. item) - before bullet lists
  text = text.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
  
  // Handle bullet lists (-, *, •)
  text = text.replace(/^[-•*] (.+)$/gm, function(match, content) {
    if (match.includes('<li>')) return match;
    return '<li>' + content + '</li>';
  });
  
  // Wrap consecutive <li> items (separated by single newlines only)
  // Process numbered lists (ol)
  text = text.replace(/(<li>.*?<\/li>(?:\s*\n\s*<li>.*?<\/li>)+)/gs, function(match) {
    if (match.includes('<ol>') || match.includes('<ul>')) return match;
    // Remove ALL newlines and whitespace between list items
    // This ensures no blank lines appear in the rendered output
    let cleanMatch = match.replace(/<\/li>\s*\n+\s*<li>/g, '</li><li>');
    // Remove any leading/trailing whitespace
    cleanMatch = cleanMatch.trim();
    return '<ul>' + cleanMatch + '</ul>';
  });
  
  // Handle italic *text* - process line by line
  text = text.split('\n').map(line => {
    if (/^<|^#|\d+\.|^[-•*] /.test(line.trim())) return line;
    return line.replace(/\*([^*\n<]+?)\*/g, '<em>$1</em>');
  }).join('\n');
  
  // Split into paragraphs (double newlines), but don't split inside <ul> or <ol> tags
  // First, temporarily mark list blocks
  const listPlaceholders = [];
  let listIndex = 0;
  text = text.replace(/(<(ul|ol)>[\s\S]*?<\/\2>)/g, function(match) {
    const placeholder = `__LIST_PLACEHOLDER_${listIndex}__`;
    listPlaceholders[listIndex] = match;
    listIndex++;
    return placeholder;
  });
  
  // Now split into paragraphs
  let paragraphs = text.split(/\n\s*\n+/);
  
  // Restore list placeholders
  paragraphs = paragraphs.map(para => {
    listPlaceholders.forEach((list, index) => {
      para = para.replace(`__LIST_PLACEHOLDER_${index}__`, list);
    });
    return para;
  });
  
  // Process each paragraph
  let result = paragraphs.map(para => {
    para = para.trim();
    if (!para) return '';
    
    // Skip if it's already a block element
    if (/^<(h[1-6]|ul|ol|div)/.test(para)) {
      if (para.includes('style="text-align:')) {
        para = para.replace(/\n/g, '<br>');
      }
      return para;
    }
    
    // Convert single newlines to <br> within paragraphs
    para = para.replace(/\n/g, '<br>');
    
    // Wrap in <p> tag
    return '<p style="text-align: left;">' + para + '</p>';
  }).filter(p => p.length > 0).join('\n');
  
  return result;
}

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
    
    // Content - render markdown
    if (training.content) {
      // Check if content is already HTML or markdown
      const isHtmlContent = /<[a-z][\s\S]*>/i.test(training.content);
      const formattedContent = isHtmlContent ? training.content : formatMarkdownContent(training.content);
      document.getElementById('detailContent').innerHTML = formattedContent;
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




