import React, { useState, useEffect } from 'react'
import { 
  getAllProjectLikes, 
  getProjectLikesByProjectId, 
  getUserLikeHistory,
  getProjectStats,
  generateUserId,
  ProjectLike,
  ProjectStats
} from '../lib/localStorage'

interface FirebaseDebugProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const FirebaseDebug: React.FC<FirebaseDebugProps> = ({ isVisible: externalVisible, onClose }) => {
  const [allLikes, setAllLikes] = useState<ProjectLike[]>([])
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([])
  const [currentUserId] = useState(() => generateUserId())
  const [userLikes, setUserLikes] = useState<ProjectLike[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [projectLikes, setProjectLikes] = useState<ProjectLike[]>([])
  const [internalVisible, setInternalVisible] = useState(true)
  
  // External visibility kontrolü
  const isVisible = externalVisible !== undefined ? externalVisible : internalVisible

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      // Load all likes
      const likes = await getAllProjectLikes()
      setAllLikes(likes)

      // Load current user's likes
      const userLikesData = await getUserLikeHistory(currentUserId)
      setUserLikes(userLikesData)

      // Load project stats for all projects (only active projects)
      const projectIds = ['kişisel-portfolio', 'workshop-tracker']
      const statsPromises = projectIds.map(id => getProjectStats(id))
      const stats = await Promise.all(statsPromises)
      setProjectStats(stats.filter(Boolean) as ProjectStats[])
    } catch (error) {
      console.error('Error loading debug data:', error)
    }
  }

  const loadProjectLikes = async (projectId: string) => {
    if (!projectId) return
    
    try {
      const likes = await getProjectLikesByProjectId(projectId)
      setProjectLikes(likes)
    } catch (error) {
      console.error('Error loading project likes:', error)
    }
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return dateObj.toLocaleString()
    } catch (e) {
      return 'N/A'
    }
  }

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md max-h-96 overflow-y-auto text-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-green-400">💾 LocalStorage Debug Panel</h3>
        <button
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              setInternalVisible(false);
            }
          }}
          className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
          title="Kapat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-3">
        <p className="text-yellow-400">Current User ID:</p>
        <p className="break-all text-xs">{currentUserId}</p>
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-blue-400">📊 Project Stats:</h4>
        {projectStats.map(stat => (
          <div key={stat.projectId} className="ml-2">
            <span className="text-purple-400">{stat.projectId}:</span> 
            <span className="ml-1">{stat.totalLikes} likes ({stat.uniqueLikers} unique)</span>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-blue-400">👤 Your Likes:</h4>
        {userLikes.length === 0 ? (
          <p className="text-gray-400">No likes yet</p>
        ) : (
          userLikes.map(like => (
            <div key={like.id} className="ml-2">
              <span className="text-purple-400">{like.projectId}:</span>
              <span className={`ml-1 ${like.liked ? 'text-green-400' : 'text-red-400'}`}>
                {like.liked ? '❤️ Liked' : '👎 Disliked'}
              </span>
              <span className="text-gray-400 ml-1">({formatDate(like.createdAt)})</span>
            </div>
          ))
        )}
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-blue-400">🔍 Project Details:</h4>
        <select 
          value={selectedProjectId} 
          onChange={(e) => {
            setSelectedProjectId(e.target.value)
            loadProjectLikes(e.target.value)
          }}
          className="w-full bg-gray-800 text-white p-1 rounded text-xs mb-2"
        >
          <option value="">Select Project</option>
          <option value="kişisel-portfolio">Kişisel Portfolio</option>
          <option value="workshop-tracker">Workshop Tracker</option>
        </select>
        
        {projectLikes.length > 0 && (
          <div className="max-h-32 overflow-y-auto">
            {projectLikes.map(like => (
              <div key={like.id} className="ml-2 text-xs">
                <span className="text-purple-400">User:</span> {like.userId.slice(0, 8)}...
                <span className={`ml-1 ${like.liked ? 'text-green-400' : 'text-red-400'}`}>
                  {like.liked ? '❤️' : '👎'}
                </span>
                <span className="text-gray-400 ml-1">({formatDate(like.createdAt)})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-blue-400">📈 Total Likes: {allLikes.length}</h4>
        <p className="text-gray-400 text-xs">
          Unique Users: {new Set(allLikes.map(like => like.userId)).size}
        </p>
      </div>

      <button 
        onClick={loadAllData}
        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
      >
        🔄 Refresh
      </button>
    </div>
  )
}

export default FirebaseDebug
