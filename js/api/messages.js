// =============================================
// Messages API (Contact Form)
// =============================================

async function sendMessage(messageData) {
  const { data, error } = await supabaseClient
    .from('messages')
    .insert([messageData]);

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  return data;
}

async function getMessages() {
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data;
}

async function markMessageRead(id) {
  const { error } = await supabaseClient
    .from('messages')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
}

async function deleteMessage(id) {
  const { error } = await supabaseClient
    .from('messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

async function getUnreadCount() {
  const { count, error } = await supabaseClient
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) return 0;
  return count;
}
