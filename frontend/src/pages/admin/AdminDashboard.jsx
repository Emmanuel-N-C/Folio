import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '@/api/admin'
import { postsAPI } from '@/api/posts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Trash2, 
  Eye, 
  Shield, 
  Home,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('overview') // 'overview', 'users', 'posts', 'comments'
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null, // 'user', 'post', or 'comment'
    id: null,
    name: '',
    isDeleting: false
  })

  useEffect(() => {
    fetchData()
  }, [activeView])

  const fetchData = async () => {
    setLoading(true)
    try {
      const statsData = await adminAPI.getDashboardStats()
      setStats(statsData)

      if (activeView === 'users' || activeView === 'overview') {
        const usersData = await adminAPI.getAllUsers(0, 50)
        setUsers(usersData.content || [])
      }

      if (activeView === 'posts') {
        const postsData = await postsAPI.getAllPosts(0, 50)
        setPosts(postsData.content || [])
      }

      if (activeView === 'comments') {
        const commentsData = await adminAPI.getAllComments(0, 50)
        setComments(commentsData.content || [])
      }
    } catch (error) {
      console.error('Admin fetch error:', error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId, username) => {
    setDeleteDialog({
      open: true,
      type: 'user',
      id: userId,
      name: username,
      isDeleting: false
    })
  }

  const handleDeletePost = async (postId, postTitle) => {
    setDeleteDialog({
      open: true,
      type: 'post',
      id: postId,
      name: postTitle,
      isDeleting: false
    })
  }

  const handleDeleteComment = async (commentId, commentText) => {
    setDeleteDialog({
      open: true,
      type: 'comment',
      id: commentId,
      name: commentText.substring(0, 50) + (commentText.length > 50 ? '...' : ''),
      isDeleting: false
    })
  }

  const confirmDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, isDeleting: true }))
    
    try {
      if (deleteDialog.type === 'user') {
        await adminAPI.deleteUser(deleteDialog.id)
        setUsers(users.filter(u => u.id !== deleteDialog.id))
        toast({
          title: "User deleted",
          description: `User "${deleteDialog.name}" has been deleted`,
        })
      } else if (deleteDialog.type === 'post') {
        await adminAPI.deleteAnyPost(deleteDialog.id)
        setPosts(posts.filter(p => p.id !== deleteDialog.id))
        toast({
          title: "Post deleted",
          description: `Post "${deleteDialog.name}" has been deleted`,
        })
      } else if (deleteDialog.type === 'comment') {
        await adminAPI.deleteAnyComment(deleteDialog.id)
        setComments(comments.filter(c => c.id !== deleteDialog.id))
        toast({
          title: "Comment deleted",
          description: "Comment has been deleted",
        })
      }
      
      setDeleteDialog({ open: false, type: null, id: null, name: '', isDeleting: false })
      // Refresh stats
      const statsData = await adminAPI.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${deleteDialog.type}`,
        variant: "destructive",
      })
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }))
    }
  }

  if (loading && activeView === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System administration and content management</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/feed')}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Feed
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveView('users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to manage</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveView('posts')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.totalPosts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to manage</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveView('comments')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.totalComments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to manage</p>
          </CardContent>
        </Card>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 border-b pb-4">
        <Button 
          variant={activeView === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </Button>
        <Button 
          variant={activeView === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveView('users')}
        >
          <Users className="h-4 w-4 mr-2" />
          Users Management
        </Button>
        <Button 
          variant={activeView === 'posts' ? 'default' : 'outline'}
          onClick={() => setActiveView('posts')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Posts Management
        </Button>
        <Button 
          variant={activeView === 'comments' ? 'default' : 'outline'}
          onClick={() => setActiveView('comments')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Comments Management
        </Button>
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Welcome to the admin dashboard. Use the buttons above or click on the stat cards to manage users, posts, and comments.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setActiveView('users')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button onClick={() => setActiveView('posts')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Posts
                </Button>
                <Button onClick={() => setActiveView('comments')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Manage Comments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users View */}
      {activeView === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
            <p className="text-sm text-muted-foreground">Manage user accounts</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            ) : (
              <div className="space-y-2">
                {users.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt={user.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-primary">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {user.postsCount || 0} posts
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/profile/${user.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {user.username !== 'admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Posts View */}
      {activeView === 'posts' && (
        <Card>
          <CardHeader>
            <CardTitle>All Posts ({posts.length})</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage all posts. Posts with red badges may break the application.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No posts found</p>
            ) : (
              <div className="space-y-3">
                {posts.map(post => {
                  const hasMedia = post.liveDemoUrl || (post.screenshotUrls && post.screenshotUrls.length > 0)
                  
                  return (
                    <div 
                      key={post.id}
                      className={`flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors ${!hasMedia ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20' : ''}`}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {post.userProfileImageUrl ? (
                              <img 
                                src={post.userProfileImageUrl} 
                                alt={post.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="font-bold text-primary text-sm">
                                {post.username?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{post.username}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(post.createdAt)}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg mt-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.description}
                            </p>
                            
                            {/* Media Status */}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {post.liveDemoUrl && (
                                <Badge variant="secondary" className="text-xs">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Live Demo
                                </Badge>
                              )}
                              {post.screenshotUrls && post.screenshotUrls.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {post.screenshotUrls.length} Screenshot{post.screenshotUrls.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                              {!hasMedia && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  No Media - May Break App
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>❤️ {post.likesCount || 0}</span>
                              <span>💬 {post.commentsCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/posts/${post.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id, post.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comments View */}
      {activeView === 'comments' && (
        <Card>
          <CardHeader>
            <CardTitle>All Comments ({comments.length})</CardTitle>
            <p className="text-sm text-muted-foreground">Manage all comments across all posts</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No comments found</p>
            ) : (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div 
                    key={comment.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {comment.userProfileImageUrl ? (
                            <img 
                              src={comment.userProfileImageUrl} 
                              alt={comment.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="font-bold text-primary text-xs">
                              {comment.username?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{comment.username}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            on post: <span className="font-medium">{comment.postTitle || 'Unknown Post'}</span>
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm pl-11">{comment.content}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id, comment.content)}
                      className="ml-4 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteDialog.type === 'user' ? 'User' : deleteDialog.type === 'post' ? 'Post' : 'Comment'}`}
        description={
          deleteDialog.type === 'user' 
            ? "This will permanently delete the user and all their posts, comments, and likes. This action cannot be undone."
            : deleteDialog.type === 'post'
            ? "This will permanently delete the post and all its comments and likes. This action cannot be undone."
            : "This will permanently delete the comment. This action cannot be undone."
        }
        itemName={deleteDialog.name}
        isDeleting={deleteDialog.isDeleting}
      />
    </div>
  )
}

export default AdminDashboard