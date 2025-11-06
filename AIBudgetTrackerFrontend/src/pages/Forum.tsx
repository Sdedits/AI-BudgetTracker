import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, Plus, User as UserIcon } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Best budgeting strategies for beginners?',
        content: 'I\'m new to budgeting and looking for some advice on where to start. What strategies have worked best for you?',
        author: 'JohnDoe',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 15,
        liked: false,
        comments: [
          {
            id: 1,
            content: 'I recommend the 50/30/20 rule - 50% needs, 30% wants, 20% savings!',
            author: 'FinanceGuru',
            createdAt: new Date(Date.now() - 43200000).toISOString(),
            likes: 8
          },
          {
            id: 2,
            content: 'Track every expense for a month first, then set realistic budgets based on your actual spending.',
            author: 'SavvySaver',
            createdAt: new Date(Date.now() - 21600000).toISOString(),
            likes: 5
          }
        ]
      },
      {
        id: 2,
        title: 'How to reduce monthly expenses?',
        content: 'Looking for practical tips to cut down on monthly expenses without sacrificing quality of life.',
        author: 'MarySue',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        likes: 23,
        liked: false,
        comments: [
          {
            id: 3,
            content: 'Cancel unused subscriptions! I saved $50/month just by doing an audit.',
            author: 'BudgetMaster',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            likes: 12
          }
        ]
      },
      {
        id: 3,
        title: 'Emergency fund: How much is enough?',
        content: 'What\'s the ideal amount for an emergency fund? I\'ve heard 3-6 months of expenses, but curious what others think.',
        author: 'SafetyFirst',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        likes: 31,
        liked: false,
        comments: []
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const newPost: Post = {
      id: posts.length + 1,
      title: newPostTitle,
      content: newPostContent,
      author: 'You',
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);
  };

  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: number) => {
    const commentContent = commentInputs[postId]?.trim();
    if (!commentContent) {
      alert('Please enter a comment');
      return;
    }

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: post.comments.length + 1,
          content: commentContent,
          author: 'You',
          createdAt: new Date().toISOString(),
          likes: 0
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const toggleComments = (postId: number) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
        <p className="text-gray-600">Share tips, ask questions, and learn from the community</p>
      </div>

      {/* Create New Post Button */}
      <div className="mb-6">
        {!showNewPost ? (
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-md"
          >
            <Plus size={20} />
            Create New Post
          </button>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <input
              type="text"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full p-3 border rounded mb-3"
            />
            <textarea
              placeholder="What's on your mind? Share your financial tips or questions..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full p-3 border rounded mb-3 h-32"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreatePost}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Post
              </button>
              <button
                onClick={() => {
                  setShowNewPost(false);
                  setNewPostTitle('');
                  setNewPostContent('');
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">No posts yet. Be the first to start a discussion!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow">
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserIcon className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                  <div className="text-sm text-gray-500">
                    Posted by <span className="font-medium">{post.author}</span> · {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    post.liked
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ThumbsUp size={18} fill={post.liked ? 'currentColor' : 'none'} />
                  <span className="font-medium">{post.likes}</span>
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <MessageSquare size={18} />
                  <span className="font-medium">{post.comments.length} Comments</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedPosts.has(post.id) && (
                <div className="mt-4 pt-4 border-t">
                  {/* Existing Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-gray-300 p-1 rounded-full">
                              <UserIcon size={16} />
                            </div>
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">· {formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;
