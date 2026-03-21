const supabase = require("../config/db");

async function getAllProducts(categorySlug) {
  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      price,
      stock,
      image_url,
      care_instructions,
      category_id,
      categories!inner (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      price,
      stock,
      image_url,
      care_instructions,
      category_id,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  return data;
}

module.exports = {
  getAllProducts,
  getProductBySlug,
};