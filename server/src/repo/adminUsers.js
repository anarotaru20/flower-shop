const supabase = require('../config/db')
const supabaseAdmin = require('../config/supabaseAdmin')

function mapAuthUsers(authUsers) {
  const map = new Map()

  for (const user of authUsers || []) {
    map.set(user.id, {
      id: user.id,
      email: user.email || null,
      created_at: user.created_at || null,
    })
  }

  return map
}

function buildFullName(profile) {
  return [profile.first_name, profile.last_name].filter(Boolean).join(' ') || null
}

async function getAllAdminUsers() {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, role, created_at')

  if (profilesError) {
    throw new Error(profilesError.message)
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (authError) {
    throw new Error(authError.message)
  }

  const authUsersMap = mapAuthUsers(authData?.users || [])

  const users = (profiles || []).map((profile) => {
    const authUser = authUsersMap.get(profile.id)

    return {
      id: profile.id,
      email: authUser?.email || profile.email || null,
      full_name: buildFullName(profile),
      role: profile.role || 'customer',
      created_at: authUser?.created_at || profile.created_at || null,
    }
  })

  users.sort((a, b) => {
    const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
    const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
    return bDate - aDate
  })

  return users
}

async function getAdminUserById(userId) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, role, created_at')
    .eq('id', userId)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  const { data: authUserData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)

  if (authError) {
    throw new Error(authError.message)
  }

  const authUser = authUserData?.user

  return {
    id: profile.id,
    email: authUser?.email || profile.email || null,
    full_name: buildFullName(profile),
    role: profile.role || 'customer',
    created_at: authUser?.created_at || profile.created_at || null,
  }
}

async function updateAdminUserRole(userId, role) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select('id, email, first_name, last_name, role, created_at')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const { data: authUserData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)

  if (authError) {
    throw new Error(authError.message)
  }

  const authUser = authUserData?.user

  return {
    id: data.id,
    email: authUser?.email || data.email || null,
    full_name: buildFullName(data),
    role: data.role || 'customer',
    created_at: authUser?.created_at || data.created_at || null,
  }
}

module.exports = {
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUserRole,
}