const supabase = require("../config/db");

async function getBeneficiariesByUserId(userId) {
  const { data, error } = await supabase
    .from("beneficiaries")
    .select(`
      id,
      user_id,
      name,
      relationship,
      preferred_colors,
      preferred_style,
      preferred_product_type,
      budget_min,
      budget_max,
      notes,
      created_at
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

async function createBeneficiary(payload) {
  const { data, error } = await supabase
    .from("beneficiaries")
    .insert(payload)
    .select(`
      id,
      user_id,
      name,
      relationship,
      preferred_colors,
      preferred_style,
      preferred_product_type,
      budget_min,
      budget_max,
      notes,
      created_at
    `)
    .single();

  if (error) throw error;

  return data;
}

async function updateBeneficiaryById(id, userId, payload) {
  const { data, error } = await supabase
    .from("beneficiaries")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select(`
      id,
      user_id,
      name,
      relationship,
      preferred_colors,
      preferred_style,
      preferred_product_type,
      budget_min,
      budget_max,
      notes,
      created_at
    `)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function deleteBeneficiaryById(id, userId) {
  const { error } = await supabase
    .from("beneficiaries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;

  return true;
}

module.exports = {
  getBeneficiariesByUserId,
  createBeneficiary,
  updateBeneficiaryById,
  deleteBeneficiaryById,
};