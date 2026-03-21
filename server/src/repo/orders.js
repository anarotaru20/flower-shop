const supabase = require("../config/db");

async function createOrder(user_id, items) {
  const productIds = items.map((i) => i.product_id);

  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  if (prodError) throw prodError;

  let total = 0;

  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) throw new Error("Product not found");

    const price = product.price;
    const quantity = item.quantity || 1;

    total += price * quantity;

    return {
      product_id: product.id,
      quantity,
      price,
    };
  });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{ user_id, total }])
    .select()
    .single();

  if (orderError) throw orderError;

  const itemsToInsert = orderItems.map((i) => ({
    order_id: order.id,
    ...i,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;

  return { order, total };
}

async function getOrders(user_id) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (*)
      )
    `,
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

module.exports = { createOrder, getOrders };
