// =============================================
// Blog Post Page
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  loadPost();
});

async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const loading = document.getElementById('post-loading');
  const content = document.getElementById('post-content');
  const notFound = document.getElementById('post-not-found');

  if (!slug) {
    loading.classList.add('hidden');
    notFound.classList.remove('hidden');
    lucide.createIcons();
    return;
  }

  const post = await getBlogPostBySlug(slug);

  loading.classList.add('hidden');

  if (!post) {
    notFound.classList.remove('hidden');
    lucide.createIcons();
    return;
  }

  // Update page title
  document.title = `${post.title} - Isabela`;

  // Cover image
  const coverContainer = document.getElementById('post-cover');
  if (post.cover_image_url) {
    coverContainer.innerHTML = `
      <img src="${sanitizeHTML(post.cover_image_url)}" alt="${sanitizeHTML(post.title)}"
           class="w-full h-64 md:h-80 object-cover rounded-xl">
    `;
  }

  // Tags
  const tagsContainer = document.getElementById('post-tags');
  tagsContainer.innerHTML = (post.tags || []).map(tag =>
    `<span class="badge">${sanitizeHTML(tag)}</span>`
  ).join('');

  // Title and date
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-date').textContent = formatDate(post.published_at);

  // Body - render Markdown
  const bodyContainer = document.getElementById('post-body');
  if (typeof marked !== 'undefined') {
    bodyContainer.innerHTML = marked.parse(post.content);
  } else {
    bodyContainer.innerHTML = `<p>${sanitizeHTML(post.content).replace(/\n/g, '<br>')}</p>`;
  }

  content.classList.remove('hidden');
  lucide.createIcons();
}
