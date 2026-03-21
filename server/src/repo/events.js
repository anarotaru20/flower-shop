const supabase = require("../config/db");

async function getEventsByUserId(userId) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      user_id,
      beneficiary_id,
      event_type,
      event_date,
      reminder_days_before,
      notes,
      created_at,
      beneficiaries (
        id,
        name,
        relationship
      )
    `)
    .eq("user_id", userId)
    .order("event_date", { ascending: true });

  if (error) throw error;

  return data;
}

async function createEvent(payload) {
  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select(`
      id,
      user_id,
      beneficiary_id,
      event_type,
      event_date,
      reminder_days_before,
      notes,
      created_at
    `)
    .single();

  if (error) throw error;

  return data;
}

async function deleteEventById(id, userId) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;

  return true;
}

module.exports = {
  getEventsByUserId,
  createEvent,
  deleteEventById,
};