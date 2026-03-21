const supabase = require("../config/db");

async function getProfileById(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      username,
      first_name,
      last_name,
      birth_date,
      address,
      role,
      created_at
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function updateProfileById(id, payload) {
  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .select(
      `
      id,
      email,
      username,
      first_name,
      last_name,
      birth_date,
      address,
      role,
      created_at
    `,
    )
    .maybeSingle();

  if (error) throw error;

  return data;
}

module.exports = {
  getProfileById,
  updateProfileById,
};
