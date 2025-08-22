// menu.js
function initializeMenu() {
  // Remove existing menu elements if they exist
  const existingMenu = document.getElementById('dot-menu-container');
  const existingCommentModal = document.getElementById('comment-modal');
  const existingCodeModal = document.getElementById('code-modal');
  
  if (existingMenu) existingMenu.remove();
  if (existingCommentModal) existingCommentModal.remove();
  if (existingCodeModal) existingCodeModal.remove();

fetch('menu.html')
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    // Extract parts separately
    const menuContainer = doc.querySelector('#dot-menu-container');
    const commentModal = doc.querySelector('#comment-modal');
    const codeModal = doc.querySelector('#code-modal');
    // Append to body directly
    document.body.appendChild(menuContainer);
    document.body.appendChild(commentModal);
    document.body.appendChild(codeModal);

    const toggleButton = document.getElementById('menu-toggle');
    const dotsMenu = document.getElementById('dots-menu');

    // Toggle menu
    toggleButton.addEventListener('click', () => {
      const isVisible = dotsMenu.classList.contains('opacity-100');
      dotsMenu.classList.toggle('opacity-100', !isVisible);
      dotsMenu.classList.toggle('pointer-events-auto', !isVisible);
      dotsMenu.classList.toggle('opacity-0', isVisible);
      dotsMenu.classList.toggle('scale-100', !isVisible);
      dotsMenu.classList.toggle('scale-75', isVisible);
    });

    // Highlight current page dot
    const currentPage = document.body.getAttribute('data-page');
    dotsMenu.querySelectorAll('.dot').forEach(dot => {
      if (dot.dataset.page === currentPage) {
        dot.classList.add('bg-pink-500', 'scale-125');
        dot.classList.remove('bg-black');
      }
      dot.addEventListener('mouseenter', () => dot.classList.add('bg-pink-400', 'scale-110'));
      dot.addEventListener('mouseleave', () => {
        if (dot.dataset.page !== currentPage) {
          dot.classList.remove('bg-pink-400', 'scale-110');
        }
      });
    });

    // Comment modal logic
    const leaveCommentBtn = document.getElementById('leave-comment');
    const closeCommentBtn = document.getElementById('close-comment');
    const cancelCommentBtn = document.getElementById('cancel-comment');
    const saveCommentBtn = document.getElementById('save-comment');
    const commentText = document.getElementById('comment-text');

    function openCommentModal() {
      commentModal.classList.remove('opacity-0', 'pointer-events-none');
      commentModal.classList.add('opacity-100', 'pointer-events-auto');
      // Focus on textarea and ensure it's enabled
      setTimeout(() => {
        commentText.focus();
        commentText.disabled = false;
        commentText.readOnly = false;
      }, 100);
    }

    function closeCommentModal() {
      commentModal.classList.add('opacity-0', 'pointer-events-none');
      commentModal.classList.remove('opacity-100', 'pointer-events-auto');
      commentText.value = '';
    }

    // Remove any existing event listeners and add new ones
    if (leaveCommentBtn) {
      leaveCommentBtn.replaceWith(leaveCommentBtn.cloneNode(true));
      document.getElementById('leave-comment').addEventListener('click', openCommentModal);
    }
    if (closeCommentBtn) {
      closeCommentBtn.replaceWith(closeCommentBtn.cloneNode(true));
      document.getElementById('close-comment').addEventListener('click', closeCommentModal);
    }
    if (cancelCommentBtn) {
      cancelCommentBtn.replaceWith(cancelCommentBtn.cloneNode(true));
      document.getElementById('cancel-comment').addEventListener('click', closeCommentModal);
    }
    if (saveCommentBtn) {
      saveCommentBtn.replaceWith(saveCommentBtn.cloneNode(true));
      document.getElementById('save-comment').addEventListener('click', () => {
        const comment = document.getElementById('comment-text').value.trim();
        if (comment) {
          // Get current page dynamically
          const currentPageNow = document.body.getAttribute('data-page') || window.location.pathname.split('/').pop().replace('.html', '') || 'unknown';
          // Store comments in memory instead of localStorage for Claude artifacts
          if (!window.comments) window.comments = [];
          window.comments.push({ page: currentPageNow, text: comment, date: new Date().toISOString() });
          alert('Comment saved!');
          closeCommentModal();
        } else {
          alert('Please enter a comment before saving.');
        }
      });
    }

    // Get Code modal logic
    const getCodeBtn = document.getElementById('get-code');
    const closeCodeBtn = document.getElementById('close-code');
    const closeCodeXBtn = document.getElementById('close-code-x');
    const qrCodeDiv = document.getElementById('qr-code');
    const gitLink = document.getElementById('git-link');

    // Replace with your actual Git repository URL
    const gitRepoUrl = 'https://github.com/AymenTurki0/Aeorobotix_Computer_Vision_App';

    function generateQRCode(text) {
      // Simple QR code generation using QR Server API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
      const img = document.createElement('img');
      img.src = qrUrl;
      img.alt = 'QR Code';
      img.className = 'w-full h-auto rounded';
      return img;
    }

    function openCodeModal() {
      // Clear previous QR code
      qrCodeDiv.innerHTML = '';
      // Generate new QR code
      const qrImg = generateQRCode(gitRepoUrl);
      qrCodeDiv.appendChild(qrImg);
      // Set the git link
      gitLink.href = gitRepoUrl;
      gitLink.textContent = gitRepoUrl;
      // Show modal
      codeModal.classList.remove('opacity-0', 'pointer-events-none');
      codeModal.classList.add('opacity-100', 'pointer-events-auto');
    }

    function closeCodeModal() {
      codeModal.classList.add('opacity-0', 'pointer-events-none');
      codeModal.classList.remove('opacity-100', 'pointer-events-auto');
    }

    getCodeBtn.addEventListener('click', openCodeModal);
    closeCodeBtn.addEventListener('click', closeCodeModal);
    closeCodeXBtn.addEventListener('click', closeCodeModal);

    // Close modal when clicking outside
    codeModal.addEventListener('click', (e) => {
      if (e.target === codeModal) {
        closeCodeModal();
      }
    });
  });
}

// Initialize menu when page loads
document.addEventListener('DOMContentLoaded', initializeMenu);

// Also initialize when page becomes visible (for navigation)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    setTimeout(initializeMenu, 100);
  }
});

// Reinitialize on window focus (backup for page navigation)
window.addEventListener('focus', () => {
  setTimeout(initializeMenu, 100);
});