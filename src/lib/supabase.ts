import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Project likes interface
export interface ProjectLike {
  id: string
  project_id: string
  user_id: string
  liked: boolean
  created_at: string
  updated_at: string
}

export interface ProjectStats {
  project_id: string
  total_likes: number
  unique_likers: number
  last_updated: string
}

// Generate unique user ID (IP + User Agent hash)
export const generateUserId = (): string => {
  const userAgent = navigator.userAgent
  const timestamp = Date.now().toString()
  return btoa(userAgent + timestamp).slice(0, 16)
}

// Get project likes
export const getProjectLikes = async (projectId: string) => {
  const { data, error } = await supabase
    .from('project_likes')
    .select('*')
    .eq('project_id', projectId)
  
  if (error) {
    console.error('Error fetching project likes:', error)
    return []
  }
  
  return data as ProjectLike[]
}

// Get project stats
export const getProjectStats = async (projectId: string) => {
  const { data, error } = await supabase
    .from('project_stats')
    .select('*')
    .eq('project_id', projectId)
    .single()
  
  if (error) {
    console.error('Error fetching project stats:', error)
    return null
  }
  
  return data as ProjectStats
}

// Toggle project like
export const toggleProjectLike = async (projectId: string, userId: string) => {
  // First, check if user already liked this project
  const { data: existingLike, error: fetchError } = await supabase
    .from('project_likes')
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking existing like:', fetchError)
    return null
  }

  if (existingLike) {
    // Toggle existing like
    const { data, error } = await supabase
      .from('project_likes')
      .update({ 
        liked: !existingLike.liked,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingLike.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating like:', error)
      return null
    }

    return data
  } else {
    // Create new like
    const { data, error } = await supabase
      .from('project_likes')
      .insert({
        project_id: projectId,
        user_id: userId,
        liked: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating like:', error)
      return null
    }

    return data
  }
}

// Update project stats
export const updateProjectStats = async (projectId: string) => {
  // Get total likes count
  const { count: totalLikes, error: likesError } = await supabase
    .from('project_likes')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('liked', true)

  if (likesError) {
    console.error('Error counting likes:', likesError)
    return
  }

  // Get unique likers count
  const { count: uniqueLikers, error: likersError } = await supabase
    .from('project_likes')
    .select('user_id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('liked', true)

  if (likersError) {
    console.error('Error counting unique likers:', likersError)
    return
  }

  // Upsert project stats
  const { error: statsError } = await supabase
    .from('project_stats')
    .upsert({
      project_id: projectId,
      total_likes: totalLikes || 0,
      unique_likers: uniqueLikers || 0,
      last_updated: new Date().toISOString()
    })

  if (statsError) {
    console.error('Error updating project stats:', statsError)
  }
}
