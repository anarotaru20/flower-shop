const supabase = require('../config/db')

function getMonthLabels() {
  return ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec']
}

function getYearRange(year) {
  const start = `${year}-01-01T00:00:00.000Z`
  const end = `${year + 1}-01-01T00:00:00.000Z`
  return { start, end }
}

async function getTotalProducts() {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  if (error) throw error

  return count || 0
}

async function getTotalOrders() {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  if (error) throw error

  return count || 0
}

async function getTotalRevenue() {
  const { data, error } = await supabase
    .from('orders')
    .select('total, status')

  if (error) throw error

  const totalRevenue = (data || []).reduce((sum, order) => {
    if (order.status === 'cancelled') return sum
    return sum + Number(order.total || 0)
  }, 0)

  return totalRevenue
}

async function getRecentOrders(limit = 5) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_name, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data || []
}

async function getOrdersByMonth(year = new Date().getFullYear()) {
  const { start, end } = getYearRange(Number(year))

  const { data, error } = await supabase
    .from('orders')
    .select('created_at')
    .gte('created_at', start)
    .lt('created_at', end)
    .order('created_at', { ascending: true })

  if (error) throw error

  const months = Array(12).fill(0)

  for (const order of data || []) {
    const monthIndex = new Date(order.created_at).getUTCMonth()
    months[monthIndex] += 1
  }

  return {
    year: Number(year),
    labels: getMonthLabels(),
    data: months,
  }
}

async function getRevenueByMonth(year = new Date().getFullYear()) {
  const { start, end } = getYearRange(Number(year))

  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total, status')
    .gte('created_at', start)
    .lt('created_at', end)
    .order('created_at', { ascending: true })

  if (error) throw error

  const months = Array(12).fill(0)

  for (const order of data || []) {
    if (order.status === 'cancelled') continue
    const monthIndex = new Date(order.created_at).getUTCMonth()
    months[monthIndex] += Number(order.total || 0)
  }

  return {
    year: Number(year),
    labels: getMonthLabels(),
    data: months,
  }
}

async function getOverview() {
  const [totalProducts, totalOrders, totalRevenue, recentOrders] = await Promise.all([
    getTotalProducts(),
    getTotalOrders(),
    getTotalRevenue(),
    getRecentOrders(),
  ])

  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
  }
}

module.exports = {
  getTotalProducts,
  getTotalOrders,
  getTotalRevenue,
  getRecentOrders,
  getOrdersByMonth,
  getRevenueByMonth,
  getOverview,
}