'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
  IconButton,
  Chip,
  Grid,
  ImageList,
  ImageListItem,
  Button,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Repeat,
  ChatBubbleOutline,
  MoreHoriz,
  Verified,
} from '@mui/icons-material';
import { Post, Comment } from '../types/mockPostType';
import { getRelativeTime } from '../utils/timeUtils';
import { useFeedStore } from '../store/store';
import { toggleLike, toggleRetweet } from '../api/toggleLike';
import { ImageModal } from './ImageModal';
import { CommentSection } from './CommentSection';
import { HighlightedText } from './HighlightedText';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLike: toggleLikeStore, toggleRetweet: toggleRetweetStore, addComment } = useFeedStore();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = async () => {
    try {
      await toggleLike(post.id);
      toggleLikeStore(post.id);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    }
  };

  const handleRetweet = async () => {
    try {
      await toggleRetweet(post.id);
      toggleRetweetStore(post.id);
    } catch (error) {
      console.error('리트윗 처리 중 오류:', error);
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const handleImageIndexChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddComment = async (postId: number, content: string) => {
    // 실제 API 호출 대신 로컬 상태 업데이트
    const newComment: Comment = {
      id: Date.now(),
      author: {
        name: '현재 사용자',
        nickname: 'current_user',
        profileImage: 'https://via.placeholder.com/40',
        verified: false,
      },
      content,
      createdAt: new Date().toISOString(),
    };
    
    addComment(postId, newComment);
  };

  return (
    <Card sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.author.profileImage}
            alt={post.author.name}
            sx={{ width: 48, height: 48 }}
          />
        }
        action={
          <IconButton>
            <MoreHoriz />
          </IconButton>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.author.name}
            </Typography>
            {post.author.verified && (
              <Verified color="primary" sx={{ fontSize: 16 }} />
            )}
            <Typography variant="body2" color="text.secondary">
              @{post.author.nickname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              · {getRelativeTime(post.createdAt)}
            </Typography>
          </Box>
        }
        subheader={
          <Chip
            label={post.categoryName}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        }
      />
      
      <CardContent sx={{ pt: 0 }}>
        <HighlightedText 
          text={post.content || ''} 
          variant="body1"
          sx={{ mb: 2, whiteSpace: 'pre-wrap' }}
        />

        {post.images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <ImageList
              cols={post.images.length === 1 ? 1 : 2}
              rowHeight={200}
              sx={{ m: 0 }}
            >
              {post.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`게시물 이미지 ${index + 1}`}
                    loading="lazy"
                    onClick={() => handleImageClick(index)}
                    style={{
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={4}>
            <Button
              startIcon={post.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
              onClick={handleLike}
              sx={{
                color: post.isLiked ? 'error.main' : 'text.secondary',
                justifyContent: 'flex-start',
                textTransform: 'none',
              }}
            >
              {post.likes}
            </Button>
          </Grid>
          <Grid size={4}>
            <Button
              startIcon={post.isRetweeted ? <Repeat color="primary" /> : <Repeat />}
              onClick={handleRetweet}
              sx={{
                color: post.isRetweeted ? 'primary.main' : 'text.secondary',
                justifyContent: 'flex-start',
                textTransform: 'none',
              }}
            >
              {post.retweets}
            </Button>
          </Grid>
          <Grid size={4}>
            <Button
              startIcon={<ChatBubbleOutline />}
              sx={{
                color: 'text.secondary',
                justifyContent: 'flex-start',
                textTransform: 'none',
              }}
            >
              {post.comments}
            </Button>
          </Grid>
        </Grid>

        {/* 댓글 섹션 */}
        <Box sx={{ px: 2, pb: 2 }}>
          <CommentSection
            postId={post.id}
            comments={post.commentList || []}
            onAddComment={handleAddComment}
          />
        </Box>
      </CardContent>

      {/* 이미지 확대보기 모달 */}
      <ImageModal
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        images={post.images}
        currentIndex={currentImageIndex}
        onIndexChange={handleImageIndexChange}
      />
    </Card>
  );
};
