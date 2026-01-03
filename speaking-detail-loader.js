// Speaking Detail Page Loader
// Loads a specific speaking engagement by ID from Firebase or localStorage

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

// Function to automatically convert URLs in text to clickable links
function autoLinkUrls(text) {
  if (!text) return text;
  
  // First, temporarily replace existing anchor tags to avoid double-linking
  const anchorPlaceholders = [];
  let placeholderIndex = 0;
  
  // Replace existing <a> tags with placeholders
  text = text.replace(/<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (match, url, linkText) => {
    const placeholder = `__ANCHOR_PLACEHOLDER_${placeholderIndex}__`;
    anchorPlaceholders[placeholderIndex] = match;
    placeholderIndex++;
    return placeholder;
  });
  
  // Regular expression to match URLs (http:// or https://)
  // Matches URLs that are not already part of HTML attributes
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]()]+[^\s<>"{}|\\^`\[\]().,;!?])/gi;
  
  // Replace URLs with clickable links
  text = text.replace(urlRegex, (url) => {
    // Don't convert if it looks like it's part of an HTML attribute
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
  
  // Restore original anchor tags
  anchorPlaceholders.forEach((original, index) => {
    text = text.replace(`__ANCHOR_PLACEHOLDER_${index}__`, original);
  });
  
  return text;
}

document.addEventListener('DOMContentLoaded', () => {
  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const speakingId = urlParams.get('id');
  
  if (!speakingId) {
    showError('No speaking engagement ID provided');
    return;
  }
  
  loadSpeakingDetail(speakingId);
});

async function loadSpeakingDetail(speakingId) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('content');
  
  try {
    let speaking = null;
    
    // Check if we're in demo mode (db is null/undefined or has placeholder values)
    const useDemoMode = typeof db === 'undefined' || db === null || 
                       (typeof firebaseConfig !== 'undefined' && 
                        (firebaseConfig.apiKey === 'YOUR_API_KEY' || firebaseConfig.projectId === 'YOUR_PROJECT_ID'));
    
    if (useDemoMode) {
      console.log('Loading speaking engagement from localStorage (demo mode)');
      const storageKey = 'demoSpeaking';
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      speaking = items.find(item => item.id === speakingId);
    } else {
      console.log('Loading speaking engagement from Firebase');
      const collection = typeof SPEAKING_COLLECTION !== 'undefined' ? SPEAKING_COLLECTION : 'speaking';
      const doc = await db.collection(collection).doc(speakingId).get();
      if (doc.exists) {
        speaking = { id: doc.id, ...doc.data() };
      }
    }
    
    if (!speaking) {
      showError('Speaking engagement not found');
      return;
    }
    
    // Display speaking engagement
    document.getElementById('detailTitle').textContent = speaking.title || 'Speaking Engagement';
    
    // Location
    if (speaking.location) {
      document.getElementById('detailLocation').textContent = speaking.location;
    } else {
      document.getElementById('detailLocation').style.display = 'none';
    }
    
    // Date - format as dd/mm/yyyy (European format)
    let dateStr = '';
    if (speaking.date) {
      // Format date as dd/mm/yyyy
      if (speaking.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // It's in YYYY-MM-DD format (from date input)
        const [year, month, day] = speaking.date.split('-');
        dateStr = `${day}/${month}/${year}`;
      } else {
        // Try to parse as date
        try {
          const dateObj = new Date(speaking.date);
          if (!isNaN(dateObj.getTime())) {
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            dateStr = `${day}/${month}/${year}`;
          } else {
            // If parsing fails, use original value (for old string dates)
            dateStr = speaking.date;
          }
        } catch (e) {
          dateStr = speaking.date;
        }
      }
    }
    
    if (dateStr) {
      const dateLabel = document.querySelector('[data-i18n="speaking-date-label"]')?.textContent || 'Date:';
      document.getElementById('detailDate').innerHTML = `<span data-i18n="speaking-date-label">${dateLabel}</span> ${dateStr}`;
    } else {
      document.getElementById('detailDate').style.display = 'none';
    }
    
    // Image at top - full width, variable height
    if (speaking.image) {
      const imgEl = document.getElementById('detailImage');
      imgEl.src = speaking.image;
      imgEl.alt = speaking.title || 'Speaking Engagement';
      imgEl.style.display = 'block';
    }
    
    // Description - render markdown and auto-link URLs
    if (speaking.description) {
      // Check if content is already HTML or markdown
      const isHtmlContent = /<[a-z][\s\S]*>/i.test(speaking.description);
      let formattedContent = isHtmlContent ? speaking.description : formatMarkdownContent(speaking.description);
      
      // Auto-convert URLs to clickable links (even if not formatted in editor)
      formattedContent = autoLinkUrls(formattedContent);
      
      document.getElementById('detailDescription').innerHTML = formattedContent;
    } else {
      document.getElementById('detailDescription').style.display = 'none';
    }
    
    // Links
    if (speaking.links && speaking.links.length > 0) {
      const linksContainer = document.getElementById('linksContainer');
      linksContainer.innerHTML = '';
      
      speaking.links.forEach((link, index) => {
        // Handle both old format (string) and new format (object with text and url)
        let linkUrl, linkText;
        if (typeof link === 'string') {
          linkUrl = link;
          linkText = `Link ${index + 1}`;
        } else if (link && typeof link === 'object') {
          linkUrl = link.url || '';
          linkText = link.text || linkUrl || `Link ${index + 1}`;
        } else {
          return; // Skip invalid links
        }
        
        // Normalize URL - add https:// if missing
        if (linkUrl && !linkUrl.match(/^https?:\/\//i)) {
          linkUrl = 'https://' + linkUrl;
        }
        
        if (linkUrl) {
          const linkEl = document.createElement('a');
          linkEl.href = linkUrl;
          linkEl.target = '_blank';
          linkEl.rel = 'noopener noreferrer';
          linkEl.textContent = linkText;
          linksContainer.appendChild(linkEl);
        }
      });
      
      document.getElementById('detailLinks').style.display = 'block';
    }
    
    // Update page title
    document.title = (speaking.title || 'Speaking Engagement') + ' - Sibel Ibram';
    
    // Show content, hide loading
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    
  } catch (error) {
    console.error('Error loading speaking engagement:', error);
    showError('Error loading speaking engagement details');
  }
}

function showError(message) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').querySelector('p').textContent = message;
}

