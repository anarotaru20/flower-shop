const supabase = require("../config/db");

async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}

module.exports = {
  getAllCategories,
};