/**
 * LocalStorage-based storage for project likes
 * Completely independent - no external services required
 */

export interface ProjectLike {
  id: string
  projectId: string
  userId: string
  liked: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectStats {
  projectId: string
  totalLikes: number
  uniqueLikers: number
  lastUpdated: string
}

const STORAGE_KEY_LIKES = 'portfolio_project_likes'
const STORAGE_KEY_USER_ID = 'portfolio_user_id'

// Generate unique user ID (persistent per browser)
export const generateUserId = (): string => {
  // Safari uyumluluğu için localStorage kontrolü
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    // SSR veya localStorage yoksa geçici ID oluştur
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return `temp_user_${randomId}`
  }
  
  // Check if user ID already exists in localStorage
  let userId: string | null = null
  
  try {
    userId = localStorage.getItem(STORAGE_KEY_USER_ID)
  } catch (e) {
    // localStorage erişim hatası (Safari private mode, ITP gibi)
    console.warn('localStorage getItem failed, using session-based ID:', e)
  }
  
  if (!userId) {
    // Generate new unique ID based on browser fingerprint
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    const language = typeof navigator !== 'undefined' ? navigator.language : 'en'
    const platform = typeof navigator !== 'undefined' ? navigator.platform : 'unknown'
    const screenResolution = typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '0x0'
    const timezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
    
    // Create a more stable fingerprint
    const fingerprint = `${userAgent}-${language}-${platform}-${screenResolution}-${timezone}`
    
    // Generate hash from fingerprint
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Add random component for uniqueness
    const randomComponent = Math.random().toString(36).substring(2, 8)
    userId = `user_${Math.abs(hash).toString(36)}_${randomComponent}`
    
    // Store in localStorage for persistence (Safari uyumluluğu için try-catch)
    try {
      localStorage.setItem(STORAGE_KEY_USER_ID, userId)
    } catch (e) {
      // localStorage erişim hatası - session-based ID kullanılacak
      console.warn('localStorage setItem failed, ID will not persist:', e)
    }
  }
  
  return userId
}

// Get all likes from localStorage
const getAllLikes = (): ProjectLike[] => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return []
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LIKES)
    if (!stored) return []
    return JSON.parse(stored) as ProjectLike[]
  } catch (e) {
    console.warn('Error reading likes from localStorage:', e)
    return []
  }
}

// Save likes to localStorage
const saveLikes = (likes: ProjectLike[]): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likes))
  } catch (e) {
    console.warn('Error saving likes to localStorage:', e)
  }
}

// Get project likes
export const getProjectLikes = async (projectId: string): Promise<ProjectLike[]> => {
  const allLikes = getAllLikes()
  return allLikes.filter(like => like.projectId === projectId)
}

// Get project stats
export const getProjectStats = async (projectId: string): Promise<ProjectStats | null> => {
  const allLikes = getAllLikes()
  const projectLikes = allLikes.filter(like => like.projectId === projectId && like.liked === true)
  
  const uniqueUserIds = new Set(projectLikes.map(like => like.userId))
  
  return {
    projectId,
    totalLikes: projectLikes.length,
    uniqueLikers: uniqueUserIds.size,
    lastUpdated: new Date().toISOString()
  }
}

// Toggle project like
export const toggleProjectLike = async (projectId: string, userId: string): Promise<ProjectLike | null> => {
  const allLikes = getAllLikes()
  const existingLikeIndex = allLikes.findIndex(
    like => like.projectId === projectId && like.userId === userId
  )
  
  const now = new Date().toISOString()
  
  if (existingLikeIndex !== -1) {
    // User already has a like record, toggle it
    const existingLike = allLikes[existingLikeIndex]
    const updatedLike: ProjectLike = {
      ...existingLike,
      liked: !existingLike.liked,
      updatedAt: now
    }
    
    allLikes[existingLikeIndex] = updatedLike
    saveLikes(allLikes)
    
    return updatedLike
  } else {
    // Create new like record
    const newLike: ProjectLike = {
      id: `like_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      projectId,
      userId,
      liked: true,
      createdAt: now,
      updatedAt: now
    }
    
    allLikes.push(newLike)
    saveLikes(allLikes)
    
    return newLike
  }
}

// Update project stats (for compatibility, but stats are calculated on-the-fly)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateProjectStats = async (_projectId: string): Promise<void> => {
  // Stats are calculated on-the-fly from likes, no need to store separately
  // This function is kept for API compatibility
}

// Initialize project stats (for compatibility)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeProjectStats = async (_projectIds: string[]): Promise<void> => {
  // Stats are calculated on-the-fly, no initialization needed
  // This function is kept for API compatibility
}

// Get all project likes for admin view
export const getAllProjectLikes = async (): Promise<ProjectLike[]> => {
  return getAllLikes()
}

// Get likes by project ID for admin view
export const getProjectLikesByProjectId = async (projectId: string): Promise<ProjectLike[]> => {
  return getProjectLikes(projectId)
}

// Get user's like history
export const getUserLikeHistory = async (userId: string): Promise<ProjectLike[]> => {
  const allLikes = getAllLikes()
  return allLikes.filter(like => like.userId === userId)
}

