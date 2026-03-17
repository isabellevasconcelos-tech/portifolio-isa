// =============================================
// Skills API
// =============================================

async function getSkills() {
  const { data, error } = await supabaseClient
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
  return data;
}

function groupSkillsByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const category = skill.category || 'Outros';
    if (!groups[category]) groups[category] = [];
    groups[category].push(skill);
    return groups;
  }, {});
}

async function createSkill(skillData) {
  const { data, error } = await supabaseClient
    .from('skills')
    .insert([skillData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateSkill(id, skillData) {
  const { data, error } = await supabaseClient
    .from('skills')
    .update(skillData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function deleteSkill(id) {
  const { error } = await supabaseClient
    .from('skills')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
