'use client';

import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
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
  ImageListItemBar,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  AddPhotoAlternate,
  Delete,
  Send,
  Close,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useFeedStore } from '../../store/store';
import { mockCategories } from '../../mockData/mockCategories';
import { currentUser } from '../../mockData/mockUesr';

export default function CreatePage() {
  const router = useRouter();
  const { addPosts, currentUser: user } = useFeedStore();
  
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
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
      router.push('/');
    } catch (error) {
      console.error('게시물 작성 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryName = mockCategories.find(c => c.id === selectedCategory)?.name || '';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            새 게시물 작성
          </Typography>
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={16} /> : <Send />}
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            sx={{ borderRadius: 2 }}
          >
            {isSubmitting ? '게시 중...' : '게시하기'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, width: '100%', maxWidth: 600 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Avatar
              src={user?.profileImage || currentUser.profileImage}
              alt={user?.name || currentUser.name}
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
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
            rows={6}
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

          <FormControl fullWidth sx={{ mb: 3 }}>
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
            <Box sx={{ mb: 3 }}>
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
                   style={{
                     width: '100%',
                     height: 'auto',
                     objectFit: 'contain',
                     borderRadius: 8,
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

          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddPhotoAlternate />}
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 4}
            sx={{ borderRadius: 2 }}
          >
            사진 추가 ({images.length}/4)
          </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
