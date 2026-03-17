// =============================================
// Blog API
// =============================================

async function getBlogPosts(limit = 10, offset = 0) {
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, tags, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  return data;
}

async function getBlogPostBySlug(slug) {
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  return data;
}

async function getAllBlogPosts() {
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }
  return data;
}

async function createBlogPost(postData) {
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .insert([postData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateBlogPost(id, postData) {
  const { data, error } = await supabaseClient
    .from('blog_posts')
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function deleteBlogPost(id) {
  const { error } = await supabaseClient
    .from('blog_posts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
