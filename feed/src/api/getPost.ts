import { Post, ListRequest } from '../types/mockPostType';
import { mockPosts } from '../mockData/mockPosts';

export const getPosts = async (request: ListRequest): Promise<Post[]> => {
  const { page, limit } = request;

  // 로딩 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return mockPosts.slice(startIndex, endIndex);
};