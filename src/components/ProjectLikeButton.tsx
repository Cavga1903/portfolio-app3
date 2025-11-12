import React, { useState, useEffect } from 'react'
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { 
  toggleProjectLike, 
  getProjectStats, 
  generateUserId,
  updateProjectStats,
  getProjectLikes,
  ProjectStats
} from '../lib/localStorage'

interface ProjectLikeButtonProps {
  projectId: string
  projectTitle: string
  className?: string
}

// Google Analytics gtag type definition
type GtagFunction = (
  command: string,
  targetId: string,
  config?: Record<string, string | number>
) => void

interface WindowWithGtag {
  gtag?: GtagFunction
}

const ProjectLikeButton: React.FC<ProjectLikeButtonProps> = ({ 
  projectId, 
  projectTitle, 
  className = '' 
}) => {
  const { t } = useTranslation()
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [userId] = useState(() => {
    // Generate user ID once and store it
    return generateUserId()
  })

  // Load initial like status and stats
  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        // Check if user liked this project
        const userLikes = await getProjectLikes(projectId)
        const userLike = userLikes.find(like => like.userId === userId)
        
        setIsLiked(userLike?.liked === true)
        setIsDisliked(userLike?.liked === false)

        // Load project stats
        const projectStats = await getProjectStats(projectId)
        setStats(projectStats)
      } catch (error) {
        console.error('Error loading like status:', error)
      }
    }

    loadLikeStatus()
  }, [projectId, userId])

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    
    try {
      const result = await toggleProjectLike(projectId, userId)
      
      if (result) {
        setIsLiked(result.liked)
        setIsDisliked(false) // Reset dislike when liking
        
        // Update stats after like/unlike
        await updateProjectStats(projectId)
        
        // Reload stats
        const updatedStats = await getProjectStats(projectId)
        setStats(updatedStats)

        // Analytics tracking (optional - can be removed)
        // if (typeof window !== 'undefined') {
        //   const windowWithGtag = window as unknown as WindowWithGtag
        //   if (windowWithGtag.gtag) {
        //     windowWithGtag.gtag('event', 'project_like', {
        //       project_title: projectTitle,
        //       project_id: projectId,
        //       like_status: result.liked ? 'liked' : 'unliked',
        //       total_likes: updatedStats?.totalLikes || 0
        //     })
        //   }
        // }

        // Show toast notification
        showToast(result.liked ? t('projectLike.liked') : t('projectLike.unliked'))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      showToast(t('projectLike.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDislike = async () => {
    if (isLoading) return

    setIsLoading(true)
    
    try {
      // If already disliked, remove the dislike
      if (isDisliked) {
        const result = await toggleProjectLike(projectId, userId)
        if (result) {
          setIsDisliked(false)
          setIsLiked(false)
          showToast(t('projectLike.dislikeRemoved'))
        }
      } else {
        // Create dislike (set liked to false)
        const result = await toggleProjectLike(projectId, userId)
        if (result) {
          setIsDisliked(true)
          setIsLiked(false)
          showToast(t('projectLike.disliked'))
        }
      }
      
      // Update stats
      await updateProjectStats(projectId)
      const updatedStats = await getProjectStats(projectId)
      setStats(updatedStats)

      // Analytics tracking (optional - can be removed)
      // if (typeof window !== 'undefined') {
      //   const windowWithGtag = window as unknown as WindowWithGtag
      //   if (windowWithGtag.gtag) {
      //     windowWithGtag.gtag('event', 'project_dislike', {
      //       project_title: projectTitle,
      //       project_id: projectId,
      //       dislike_status: isDisliked ? 'removed' : 'disliked'
      //     })
      //   }
      // }
    } catch (error) {
      console.error('Error toggling dislike:', error)
      showToast(t('projectLike.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const showToast = (message: string) => {
    // Simple toast implementation
    const toast = document.createElement('div')
    toast.textContent = message
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateY(-20px)'
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 2000)
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all duration-200 shadow-lg z-10 ${
          isLiked 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-white/90 text-gray-800 hover:bg-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
        aria-label={isLiked ? t('projectLike.unlike') : t('projectLike.like')}
      >
        <FaThumbsUp className={`w-4 h-4 ${isLiked ? 'text-white' : 'text-gray-800'}`} />
      </button>
      
      <button
        onClick={handleDislike}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all duration-200 shadow-lg z-10 ${
          isDisliked 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-white/90 text-gray-800 hover:bg-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
        aria-label={isDisliked ? t('projectLike.removeDislike') : t('projectLike.dislike')}
      >
        <FaThumbsDown className={`w-4 h-4 ${isDisliked ? 'text-white' : 'text-gray-800'}`} />
      </button>
      
      {stats && (
        <div className="text-xs text-white/80 text-center">
          <span className="font-semibold">{stats.totalLikes}</span>
        </div>
      )}
    </div>
  )
}

export default ProjectLikeButton
