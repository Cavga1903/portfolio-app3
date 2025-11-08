import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBcoAieQ_rOryEo424wWd8cqh6tLWVY544",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "myportfolio-586ac.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "myportfolio-586ac",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "myportfolio-586ac.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "583297253491",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:583297253491:web:aa2d9aedb3922b4799aa06"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Project likes interface
export interface ProjectLike {
  id: string
  projectId: string
  userId: string
  liked: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProjectStats {
  projectId: string
  totalLikes: number
  uniqueLikers: number
  lastUpdated: Date
}

// Generate unique user ID (persistent per browser)
export const generateUserId = (): string => {
  const STORAGE_KEY = 'portfolio_user_id'
  
  // Safari uyumluluğu için localStorage kontrolü
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    // SSR veya localStorage yoksa geçici ID oluştur
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return `temp_user_${randomId}`
  }
  
  // Check if user ID already exists in localStorage
  let userId: string | null = null
  
  try {
    userId = localStorage.getItem(STORAGE_KEY)
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
      localStorage.setItem(STORAGE_KEY, userId)
    } catch (e) {
      // localStorage erişim hatası - session-based ID kullanılacak
      console.warn('localStorage setItem failed, ID will not persist:', e)
    }
  }
  
  return userId
}

// Get project likes
export const getProjectLikes = async (projectId: string): Promise<ProjectLike[]> => {
  try {
    const likesRef = collection(db, 'projectLikes')
    const q = query(likesRef, where('projectId', '==', projectId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProjectLike))
  } catch (error) {
    console.error('Error fetching project likes:', error)
    return []
  }
}

// Get project stats
export const getProjectStats = async (projectId: string): Promise<ProjectStats | null> => {
  try {
    const statsRef = doc(db, 'projectStats', projectId)
    const statsSnap = await getDoc(statsRef)
    
    if (statsSnap.exists()) {
      return {
        projectId,
        ...statsSnap.data()
      } as ProjectStats
    }
    
    return null
  } catch (error) {
    console.error('Error fetching project stats:', error)
    return null
  }
}

// Toggle project like
export const toggleProjectLike = async (projectId: string, userId: string): Promise<ProjectLike | null> => {
  try {
    const likesRef = collection(db, 'projectLikes')
    const userLikeQuery = query(likesRef, where('projectId', '==', projectId), where('userId', '==', userId))
    const querySnapshot = await getDocs(userLikeQuery)
    
    if (!querySnapshot.empty) {
      // User already has a like record, toggle it
      const existingLike = querySnapshot.docs[0]
      const currentLiked = existingLike.data().liked
      
      await updateDoc(existingLike.ref, {
        liked: !currentLiked,
        updatedAt: new Date()
      })
      
      // Update project stats
      await updateProjectStats(projectId)
      
      return {
        id: existingLike.id,
        projectId,
        userId,
        liked: !currentLiked,
        createdAt: existingLike.data().createdAt,
        updatedAt: new Date()
      }
    } else {
      // Create new like record
      const newLikeRef = doc(likesRef)
      const newLike = {
        projectId,
        userId,
        liked: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(newLikeRef, newLike)
      
      // Update project stats
      await updateProjectStats(projectId)
      
      return {
        id: newLikeRef.id,
        ...newLike
      }
    }
  } catch (error) {
    console.error('Error toggling project like:', error)
    return null
  }
}

// Update project stats
export const updateProjectStats = async (projectId: string): Promise<void> => {
  try {
    const statsRef = doc(db, 'projectStats', projectId)
    
    // Get total likes count
    const likesRef = collection(db, 'projectLikes')
    const likedQuery = query(likesRef, where('projectId', '==', projectId), where('liked', '==', true))
    const likedSnapshot = await getDocs(likedQuery)
    
    // Get unique likers count
    const uniqueUserIds = new Set()
    likedSnapshot.docs.forEach(doc => {
      uniqueUserIds.add(doc.data().userId)
    })
    
    const totalLikes = likedSnapshot.size
    const uniqueLikers = uniqueUserIds.size
    
    // Update or create stats document
    await setDoc(statsRef, {
      projectId,
      totalLikes,
      uniqueLikers,
      lastUpdated: new Date()
    }, { merge: true })
    
  } catch (error) {
    console.error('Error updating project stats:', error)
  }
}

// Initialize project stats for all projects
export const initializeProjectStats = async (projectIds: string[]): Promise<void> => {
  try {
    for (const projectId of projectIds) {
      const statsRef = doc(db, 'projectStats', projectId)
      const statsSnap = await getDoc(statsRef)
      
      if (!statsSnap.exists()) {
        await setDoc(statsRef, {
          projectId,
          totalLikes: 0,
          uniqueLikers: 0,
          lastUpdated: new Date()
        })
      }
    }
  } catch (error) {
    console.error('Error initializing project stats:', error)
  }
}

// Get all project likes for admin view
export const getAllProjectLikes = async (): Promise<ProjectLike[]> => {
  try {
    const likesRef = collection(db, 'projectLikes')
    const querySnapshot = await getDocs(likesRef)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProjectLike))
  } catch (error) {
    console.error('Error fetching all project likes:', error)
    return []
  }
}

// Get likes by project ID for admin view
export const getProjectLikesByProjectId = async (projectId: string): Promise<ProjectLike[]> => {
  try {
    const likesRef = collection(db, 'projectLikes')
    const q = query(likesRef, where('projectId', '==', projectId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProjectLike))
  } catch (error) {
    console.error('Error fetching project likes by project ID:', error)
    return []
  }
}

// Get user's like history
export const getUserLikeHistory = async (userId: string): Promise<ProjectLike[]> => {
  try {
    const likesRef = collection(db, 'projectLikes')
    const q = query(likesRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProjectLike))
  } catch (error) {
    console.error('Error fetching user like history:', error)
    return []
  }
}
