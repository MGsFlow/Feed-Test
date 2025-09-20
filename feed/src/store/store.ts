import { create } from 'zustand';
import { Post, Author } from '../types/mockPostType';

interface FeedStore {
  // 게시물 관련 상태
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  
  // UI 상태
  isCreateModalOpen: boolean;
  selectedCategory: number | null;
  sortOrder: 'newest' | 'oldest';
  
  // 현재 사용자
  currentUser: Author | null;
  
  // 액션들
  setPosts: (posts: Post[]) => void;
  addPosts: (posts: Post[]) => void;
  updatePost: (postId: number, updates: Partial<Post>) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  setCreateModalOpen: (open: boolean) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  setSortOrder: (order: 'newest' | 'oldest') => void;
  setCurrentUser: (user: Author) => void;
  toggleLike: (postId: number) => void;
  toggleRetweet: (postId: number) => void;
  addComment: (postId: number, comment: any) => void;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  // 초기 상태
  posts: [],
  isLoading: false,
  hasMore: true,
  currentPage: 1,
  isCreateModalOpen: false,
  selectedCategory: null,
  sortOrder: 'newest',
  currentUser: null,

  // 액션들
  setPosts: (posts) => set({ posts }),
  
  addPosts: (newPosts) => set((state) => ({
    posts: [...newPosts, ...state.posts]
  })),
  
  updatePost: (postId, updates) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    )
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setHasMore: (hasMore) => set({ hasMore }),
  
  setCurrentPage: (currentPage) => set({ currentPage }),
  
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
  
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  
  setSortOrder: (sortOrder) => set({ sortOrder }),
  
  setCurrentUser: (currentUser) => set({ currentUser }),
  
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    )
  })),
  
  toggleRetweet: (postId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isRetweeted: !post.isRetweeted,
            retweets: post.isRetweeted ? post.retweets - 1 : post.retweets + 1
          }
        : post
    )
  })),

  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            commentList: [...(post.commentList || []), comment],
            comments: post.comments + 1
          }
        : post
    )
  })),
}));
