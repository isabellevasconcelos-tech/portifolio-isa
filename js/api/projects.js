// =============================================
// Projects API
// =============================================

async function getProjects() {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data;
}

async function getFeaturedProjects() {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
  return data;
}

async function createProject(projectData) {
  const { data, error } = await supabaseClient
    .from('projects')
    .insert([projectData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateProject(id, projectData) {
  const { data, error } = await supabaseClient
    .from('projects')
    .update({ ...projectData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function deleteProject(id) {
  const { error } = await supabaseClient
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
