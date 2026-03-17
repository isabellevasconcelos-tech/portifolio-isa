// =============================================
// Blog Listing Page
// =============================================

let blogOffset = 0;
const POSTS_PER_PAGE = 9;

document.addEventListener('DOMContentLoaded', () => {
  loadBlogPosts();
  initLoadMore();
  lucide.createIcons();
});

async function loadBlogPosts() {
  const grid = document.getElementById('blog-grid');
  const emptyState = document.getElementById('blog-empty');

  if (blogOffset === 0) {
    createSkeletonCards('#blog-grid', 3);
  }

  const posts = await getBlogPosts(POSTS_PER_PAGE, blogOffset);

  if (blogOffset === 0) grid.innerHTML = '';

  if (!posts || posts.length === 0) {
    if (blogOffset === 0) {
      grid.classList.add('hidden');
      emptyState.classList.remove('hidden');
    }
    document.getElementById('load-more-container').classList.add('hidden');
    return;
  }

  posts.forEach(post => {
    grid.innerHTML += renderBlogCard(post);
  });

  blogOffset += posts.length;

  // Show/hide load more
  const loadMoreContainer = document.getElementById('load-more-container');
  if (posts.length < POSTS_PER_PAGE) {
    loadMoreContainer.classList.add('hidden');
  } else {
    loadMoreContainer.classList.remove('hidden');
  }

  lucide.createIcons();
}

function renderBlogCard(post) {
  const tagsHTML = (post.tags || []).map(tag =>
    `<span class="badge text-xs">${sanitizeHTML(tag)}</span>`
  ).join('');

  return `
    <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card bg-white rounded-xl shadow-md overflow-hidden block">
      <div class="h-44 overflow-hidden">
        ${post.cover_image_url
          ? `<img src="${sanitizeHTML(post.cover_image_url)}" alt="${sanitizeHTML(post.title)}" class="w-full h-full object-cover">`
          : `<div class="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
               <i data-lucide="file-text" class="w-10 h-10 text-primary/40"></i>
             </div>`
        }
      </div>
      <div class="p-5">
        <div class="flex flex-wrap gap-1.5 mb-2">${tagsHTML}</div>
        <h2 class="font-heading font-bold text-lg mb-2 text-gray-800 line-clamp-2">${sanitizeHTML(post.title)}</h2>
        ${post.excerpt ? `<p class="text-gray-500 text-sm mb-3 line-clamp-2">${sanitizeHTML(post.excerpt)}</p>` : ''}
        <p class="text-xs text-gray-400">${formatDate(post.published_at)}</p>
      </div>
    </a>
  `;
}

function initLoadMore() {
  const btn = document.getElementById('load-more-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Carregando...';
    await loadBlogPosts();
    btn.disabled = false;
    btn.textContent = 'Carregar mais';
  });
}
