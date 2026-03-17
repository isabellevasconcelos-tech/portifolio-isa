// =============================================
// Profile API
// =============================================

async function getProfile() {
  const { data, error } = await supabaseClient
    .from('profile')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

async function updateProfile(profileData) {
  const { data: existing } = await supabaseClient
    .from('profile')
    .select('id')
    .single();

  if (existing) {
    const { data, error } = await supabaseClient
      .from('profile')
      .update({ ...profileData, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabaseClient
      .from('profile')
      .insert([profileData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
