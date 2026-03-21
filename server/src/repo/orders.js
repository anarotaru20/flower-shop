const supabase = require("../config/db");

async function createOrder(userId, payload) {
  const { customer_name, phone, shipping_address, payment_method, items } =
    payload;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items provided");
  }

  const productIds = items.map((item) => item.product_id);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .in("id", productIds);

  if (productsError) throw productsError;

  let subtotal = 0;
  const taxRate = 0.19;

  const orderItemsToInsert = items.map((item) => {
    const product = products.find((p) => p.id === item.product_id);

    if (!product) {
      throw new Error(`Product not found: ${item.product_id}`);
    }

    const quantity = Number(item.quantity) || 1;

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (product.stock < quantity) {
      throw new Error(`Not enough stock for product: ${product.name}`);
    }

    const unitPrice = Number(product.price);
    subtotal += unitPrice * quantity;

    return {
      product_id: product.id,
      product_name: product.name,
      quantity,
      price: unitPrice,
    };
  });

  const tax_amount = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax_amount).toFixed(2));
  const invoice_number = `INV-${Date.now()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      customer_name,
      phone,
      shipping_address,
      payment_method,
      status: "pending",
      payment_status: "unpaid",
      subtotal,
      tax_amount,
      total,
      invoice_number,
    })
    .select(
      `
      id,
      user_id,
      customer_name,
      phone,
      shipping_address,
      payment_method,
      status,
      payment_status,
      subtotal,
      tax_amount,
      total,
      invoice_number,
      stripe_payment_intent_id,
      paid_at,
      created_at
    `,
    )
    .single();

  if (orderError) throw orderError;

  const itemsWithOrderId = orderItemsToInsert.map((item) => ({
    order_id: order.id,
    ...item,
  }));

  const { data: orderItems, error: orderItemsError } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId).select(`
      id,
      order_id,
      product_id,
      product_name,
      quantity,
      price,
      created_at
    `);

  if (orderItemsError) throw orderItemsError;

  return {
    ...order,
    order_items: orderItems,
  };
}

async function getOrdersByUserId(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      user_id,
      customer_name,
      phone,
      shipping_address,
      payment_method,
      status,
      payment_status,
      subtotal,
      tax_amount,
      total,
      invoice_number,
      stripe_payment_intent_id,
      paid_at,
      created_at,
      order_items (
        id,
        order_id,
        product_id,
        product_name,
        quantity,
        price,
        created_at,
        products (
          id,
          name,
          slug,
          price,
          image_url
        )
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

async function cancelOrder(orderId, userId) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

module.exports = {
  createOrder,
  getOrdersByUserId,
  cancelOrder,
};
