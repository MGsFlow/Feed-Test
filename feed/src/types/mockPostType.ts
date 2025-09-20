export interface Author {
    name: string;
    nickname: string;
    profileImage: string;
    verified: boolean;
  }
  
  export interface Comment {
    id: number;
    author: Author;
    content: string;
    createdAt: string;
    likes?: number;
    isLiked?: boolean;
  }
  
  export interface Post {
    id: number;
    author: Author;
    content: string;
    images: string[];
    category: number;
    categoryName: string;
    createdAt: string;
    likes: number;
    retweets: number;
    comments: number;
    isLiked: boolean;
    isRetweeted: boolean;
    hasMoreComments?: boolean;
    commentList: Comment[];
  }
  
  export interface ListRequest {
    page: number;
    limit: number;
  }