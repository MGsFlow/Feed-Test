'use client';

import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  Collapse,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Send,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { currentUser } from '../mockData/mockUesr';
import { HighlightedText } from './HighlightedText';
import { Comment } from '../types/mockPostType';

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  onAddComment: (postId: number, content: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onAddComment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(postId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
    <Box>
      {/* 댓글 토글 버튼 */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
        sx={{
          color: 'text.secondary',
          textTransform: 'none',
          justifyContent: 'flex-start',
          px: 0,
          py: 1,
        }}
      >
        댓글 {comments.length}개 {isExpanded ? '숨기기' : '보기'}
      </Button>

      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1 }}>
          {/* 댓글 입력 */}
          <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Avatar
                src={currentUser.profileImage}
                alt={currentUser.name}
                sx={{ width: 32, height: 32, mt: 0.5 }}
              />
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="댓글을 입력하세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={!newComment.trim() || isSubmitting}
                    startIcon={<Send />}
                    sx={{ borderRadius: 2 }}
                  >
                    {isSubmitting ? '작성 중...' : '댓글 작성'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* 댓글 목록 */}
          {comments.length > 0 ? (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {comments.map((comment, index) => [
                <Box key={`comment-${comment.id}`}>
                  <Box sx={{ display: 'flex', gap: 1, py: 1.5 }}>
                    <Avatar
                      src={comment.author.profileImage}
                      alt={comment.author.name}
                      sx={{ width: 28, height: 28 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comment.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{comment.author.nickname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          · {getRelativeTime(comment.createdAt)}
                        </Typography>
                      </Box>
                      <HighlightedText 
                        text={comment.content || ''}
                        variant="body2"
                        sx={{ whiteSpace: 'pre-wrap' }}
                      />
                    </Box>
                  </Box>
                </Box>,
                index < comments.length - 1 && (
                  <Divider key={`divider-${comment.id}`} sx={{ ml: 4 }} />
                )
              ].filter(Boolean))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};
