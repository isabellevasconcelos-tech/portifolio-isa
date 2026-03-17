// =============================================
// Supabase Storage Utilities
// =============================================

async function uploadImage(file, folder = 'images') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabaseClient.storage
    .from('portfolio')
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  return getPublicUrl(data.path);
}

function getPublicUrl(path) {
  const { data } = supabaseClient.storage
    .from('portfolio')
    .getPublicUrl(path);
  return data.publicUrl;
}

async function deleteImage(path) {
  const { error } = await supabaseClient.storage
    .from('portfolio')
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    return false;
  }
  return true;
}
