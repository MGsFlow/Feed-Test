'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  Close,
  AddPhotoAlternate,
} from '@mui/icons-material';
import { useFeedStore } from '../store/store';
import { mockCategories } from '../mockData/mockCategories';
import { currentUser } from '../mockData/mockUesr';
import { ImageModal } from './ImageModal';

export const CreatePostModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setCreateModalOpen,
    currentUser: user,
    addPosts,
  } = useFeedStore();

  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setCreateModalOpen(false);
    setContent('');
    setSelectedCategory(1);
    setImages([]);
    setImageModalOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (images.length + files.length > 4) {
        alert('이미지는 최대 4개까지만 업로드할 수 있습니다.');
        return;
      }
      
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setImages(prev => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newPost = {
      id: Date.now(),
      author: user || currentUser,
      content: content.trim(),
      images,
      category: selectedCategory,
      categoryName: mockCategories.find(c => c.id === selectedCategory)?.name || '기타',
      createdAt: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      comments: 0,
      isLiked: false,
      isRetweeted: false,
      hasMoreComments: false,
      commentList: [],
    };

    addPosts([newPost]);
    handleClose();
  };

  const selectedCategoryName = mockCategories.find(c => c.id === selectedCategory)?.name || '';

  return (
    <Dialog
      open={isCreateModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">새 게시물 작성</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            src={user?.profileImage || currentUser.profileImage}
            alt={user?.name || currentUser.name}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {user?.name || currentUser.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user?.nickname || currentUser.nickname}
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="무슨 일이 일어나고 있나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 280 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {content.length}/280
          </Typography>
          <Chip
            label={selectedCategoryName}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            label="카테고리"
          >
            {mockCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <ImageList cols={2} rowHeight={200}>
              {images.map((image, index) => (
                <ImageListItem key={index} sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      overflow: 'auto',
                      borderRadius: 1,
                      // position: 'relative',
                    }}
                  >
                    <img
                      src={image}
                      alt={`uploaded image ${index + 1}`}
                      onClick={() => handleImageClick(index)}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                        zIndex: 1,
                      }}
                      size="small"
                    >
                      <Close />
                    </IconButton>
                  </Box>
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          startIcon={<AddPhotoAlternate />}
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= 4}
          sx={{ mr: 'auto' }}
        >
          사진 추가 ({images.length}/4)
        </Button>
        <Button onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          게시하기
        </Button>
      </DialogActions>

      {/* 이미지 확대보기 모달 */}
      <ImageModal
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        images={images}
        currentIndex={currentImageIndex}
        onIndexChange={handleImageIndexChange}
      />
    </Dialog>
  );
};
