
// Simple CRUD Blog using localStorage
(() => {
  const STORAGE_KEY = 'simple-crud-blog.posts.v1';

  // DOM elements
  const postsListEl = document.getElementById('posts-list');
  const noPostsEl = document.getElementById('no-posts');
  const newPostBtn = document.getElementById('new-post-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const formSection = document.getElementById('form-section');
  const listSection = document.getElementById('list-section');
  const viewSection = document.getElementById('view-section');
  const postForm = document.getElementById('post-form');
  const formTitle = document.getElementById('form-title');
  const postIdInput = document.getElementById('post-id');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const cancelBtn = document.getElementById('cancel-btn');
  const searchInput = document.getElementById('search');
  const viewTitle = document.getElementById('view-title');
  const viewDates = document.getElementById('view-dates');
  const viewContent = document.getElementById('view-content');
  const editBtn = document.getElementById('edit-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const backBtn = document.getElementById('back-btn');

  let posts = [];

  // Utilities
  function savePosts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }
  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      posts = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse posts from storage', e);
      posts = [];
    }
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  }
  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }
  function excerpt(text, n = 140) {
    return text.length > n ? text.slice(0, n).trim() + '…' : text;
  }

  // Renderers
  function renderList(filter = '') {
    postsListEl.innerHTML = '';
    const normalizedFilter = filter.trim().toLowerCase();
    const filtered = posts
      .slice()
      .sort((a,b) => b.updatedAt - a.updatedAt)
      .filter(p => {
        if (!normalizedFilter) return true;
        return (
          p.title.toLowerCase().includes(normalizedFilter) ||
          p.content.toLowerCase().includes(normalizedFilter)
        );
      });

    if (filtered.length === 0) {
      noPostsEl.style.display = 'block';
    } else {
      noPostsEl.style.display = 'none';
      filtered.forEach(p => {
        const li = document.createElement('li');
        li.className = 'post-item';
        li.innerHTML = `
          <div class="left">
            <h3 class="post-title">${escapeHtml(p.title)}</h3>
            <p class="post-excerpt">${escapeHtml(excerpt(p.content, 180))}</p>
            <small class="muted">Updated: ${formatDate(p.updatedAt)}</small>
          </div>
          <div class="post-controls">
            <button data-action="view" data-id="${p.id}">View</button>
            <button data-action="edit" data-id="${p.id}" class="secondary">Edit</button>
            <button data-action="delete" data-id="${p.id}" class="danger">Delete</button>
          </div>
        `;
        postsListEl.appendChild(li);
      });
    }
  }

  // Escaping to avoid injecting HTML in titles/content
  function escapeHtml(str = '') {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // Views
  function showForm(mode = 'new', post = null) {
    viewSection.classList.add('hidden');
    listSection.classList.add('hidden');
    formSection.classList.remove('hidden');

    if (mode === 'edit' && post) {
      formTitle.textContent = 'Edit Post';
      postIdInput.value = post.id;
      titleInput.value = post.title;
      contentInput.value = post.content;
    } else {
      formTitle.textContent = 'New Post';
      postIdInput.value = '';
      titleInput.value = '';
      contentInput.value = '';
    }
    titleInput.focus();
  }

  function showList() {
    formSection.classList.add('hidden');
    viewSection.classList.add('hidden');
    listSection.classList.remove('hidden');
  }

  function showPost(post) {
    formSection.classList.add('hidden');
    listSection.classList.add('hidden');
    viewSection.classList.remove('hidden');

    viewTitle.textContent = post.title;
    viewDates.textContent = `Created: ${formatDate(post.createdAt)} • Updated: ${formatDate(post.updatedAt)}`;
    viewContent.textContent = post.content;
    // attach the post id to buttons for actions
    editBtn.dataset.id = post.id;
    deleteBtn.dataset.id = post.id;
  }

  // Actions
  function createPost(title, content) {
    const now = Date.now();
    const post = {
      id: uid(),
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now
    };
    posts.push(post);
    savePosts();
    renderList(searchInput.value);
    showList();
  }

  function updatePost(id, title, content) {
    const p = posts.find(x => x.id === id);
    if (!p) return false;
    p.title = title.trim();
    p.content = content.trim();
    p.updatedAt = Date.now();
    savePosts();
    renderList(searchInput.value);
    return true;
  }

  function removePost(id) {
    const idx = posts.findIndex(x => x.id === id);
    if (idx === -1) return false;
    posts.splice(idx, 1);
    savePosts();
    renderList(searchInput.value);
    showList();
    return true;
  }

  function getPost(id) {
    return posts.find(x => x.id === id) || null;
  }

  // Event wiring
  document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    renderList();

    newPostBtn.addEventListener('click', () => showForm('new'));
    cancelBtn.addEventListener('click', () => showList());
    clearAllBtn.addEventListener('click', () => {
      if (!confirm('Remove all posts permanently?')) return;
      posts = [];
      savePosts();
      renderList();
    });

    postForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const id = postIdInput.value;
      const title = titleInput.value;
      const content = contentInput.value;
      if (!title.trim() || !content.trim()) {
        alert('Please provide title and content.');
        return;
      }
      if (id) {
        updatePost(id, title, content);
      } else {
        createPost(title, content);
      }
      postForm.reset();
    });

    postsListEl.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (!action || !id) return;

      if (action === 'view') {
        const post = getPost(id);
        if (post) showPost(post);
      } else if (action === 'edit') {
        const post = getPost(id);
        if (post) showForm('edit', post);
      } else if (action === 'delete') {
        if (confirm('Delete this post?')) {
          removePost(id);
        }
      }
    });

    // view actions
    editBtn.addEventListener('click', () => {
      const id = editBtn.dataset.id;
      const post = getPost(id);
      if (post) showForm('edit', post);
    });
    deleteBtn.addEventListener('click', () => {
      const id = deleteBtn.dataset.id;
      if (confirm('Delete this post?')) {
        removePost(id);
      }
    });
    backBtn.addEventListener('click', showList);

    // search
    let searchDebounce;
    searchInput.addEventListener('input', (ev) => {
      clearTimeout(searchDebounce);
      const v = ev.target.value;
      searchDebounce = setTimeout(() => {
        renderList(v);
      }, 180);
    });
  });

  // Expose small API for console (optional)
  window.blog = {
    create: createPost,
    update: updatePost,
    remove: removePost,
    all: () => posts.slice()
  };
})();
