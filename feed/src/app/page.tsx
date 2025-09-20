'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  Box,
  Container,
  Fab,
  CircularProgress,
  Alert,
  Fade,
  Typography,
} from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import { useFeedStore } from '../store/store';
import { getPosts } from '../api/getPost';
import { PostCard } from '../components/PostCard';
import { PostSkeleton } from '../components/PostSkeleton';
import { CreatePostModal } from '../components/CreatePostModal';
import { Navigation } from '../components/Navigation';

export default function Home() {
  const {
    posts,
    isLoading,
    hasMore,
    currentPage,
    selectedCategory,
    sortOrder,
    setPosts,
    addPosts,
    setLoading,
    setHasMore,
    setCurrentPage,
    setCreateModalOpen,
  } = useFeedStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async (page: number, isInitial = false) => {
    try {
      setLoading(true);
      const newPosts = await getPosts({ page, limit: 10 });
      
      if (isInitial) {
        setPosts(newPosts);
      } else {
        addPosts(newPosts);
      }
      
      if (newPosts.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('게시물 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [setPosts, addPosts, setLoading, setHasMore]);

  useEffect(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPosts(nextPage);
    }
  }, [isLoading, hasMore, currentPage, setCurrentPage, loadPosts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 풀 투 리프레시 핸들러
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await loadPosts(1, true);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, loadPosts]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || window.scrollY > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    setPullDistance(distance);
    
    if (distance > 0) {
      e.preventDefault();
    }
  }, [isPulling, startY]);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 80) {
      handleRefresh();
    }
    setPullDistance(0);
    setIsPulling(false);
  }, [pullDistance, handleRefresh]);

  return (
    <Box 
      sx={{ minHeight: '100vh', bgcolor: 'background.default' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Navigation />
      
      {/* 풀 투 리프레시 인디케이터 */}
      <Fade in={isPulling && pullDistance > 0}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: pullDistance,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            zIndex: 1000,
            transform: `translateY(${Math.min(pullDistance - 60, 0)}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Refresh 
              sx={{ 
                transform: pullDistance > 80 ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease-in-out',
              }} 
            />
            <Typography variant="body2">
              {pullDistance > 80 ? '놓으면 새로고침' : '당겨서 새로고침'}
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* 새로고침 로딩 인디케이터 */}
      <Fade in={isRefreshing}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <Typography variant="body2">새로고침 중...</Typography>
          </Box>
        </Box>
      </Fade>
      
      <Container 
        ref={containerRef}
        maxWidth="sm" 
        sx={{ 
          py: 2,
          transform: isPulling ? `translateY(${Math.min(pullDistance, 60)}px)` : 'translateY(0)',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {posts.length === 0 && !isLoading ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            아직 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!
          </Alert>
        ) : (
          [...posts]
            .filter(post => selectedCategory === null || post.category === selectedCategory)
            .sort((a, b) => {
              const aTime = new Date(a.createdAt).getTime();
              const bTime = new Date(b.createdAt).getTime();
              return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
            })
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))
        )}

        {isLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          </>
        )}

        {!hasMore && posts.length > 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            모든 게시물을 불러왔습니다.
          </Alert>
        )}
      </Container>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setCreateModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>

      <CreatePostModal />
    </Box>
  );
}
