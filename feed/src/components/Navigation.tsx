'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add,
  Home,
  FilterList,
  Sort,
} from '@mui/icons-material';
import { useFeedStore } from '../store/store';
import { mockCategories } from '../mockData/mockCategories';

export const Navigation: React.FC = () => {
  const { 
    setCreateModalOpen, 
    currentUser, 
    selectedCategory, 
    setSelectedCategory,
    sortOrder,
    setSortOrder
  } = useFeedStore();
  
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const filterOpen = Boolean(filterAnchorEl);
  const sortOpen = Boolean(sortAnchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    handleFilterClose();
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    handleSortClose();
  };

  const selectedCategoryName = selectedCategory 
    ? mockCategories.find(c => c.id === selectedCategory)?.name 
    : null;

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 600, mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Home color="primary" />
          <Typography variant="h6" fontWeight="bold" color="primary">
            SocialFeed
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 정렬 옵션 */}
          <IconButton
            onClick={handleSortClick}
            sx={{ 
              color: 'text.secondary',
            }}
          >
            <Sort />
          </IconButton>

          {/* 카테고리 필터 */}
          <IconButton
            onClick={handleFilterClick}
            sx={{ 
              color: selectedCategory ? 'primary.main' : 'text.secondary',
              bgcolor: selectedCategory ? 'primary.light' : 'transparent',
            }}
          >
            <FilterList />
          </IconButton>
          
          {selectedCategoryName && (
            <Chip
              label={selectedCategoryName}
              size="small"
              color="primary"
              onDelete={() => setSelectedCategory(null)}
              sx={{ mr: 1 }}
            />
          )}

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            게시하기
          </Button>
          
          {currentUser && (
            <Avatar
              src={currentUser.profileImage}
              alt={currentUser.name}
              sx={{ width: 32, height: 32, ml: 1 }}
            />
          )}
        </Box>

        {/* 정렬 메뉴 */}
        <Menu
          anchorEl={sortAnchorEl}
          open={sortOpen}
          onClose={handleSortClose}
          PaperProps={{
            sx: { minWidth: 150 }
          }}
        >
          <MenuItem onClick={() => handleSortSelect('newest')}>
            <Typography variant="body2" color={sortOrder === 'newest' ? 'primary' : 'text.primary'}>
              최신순
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect('oldest')}>
            <Typography variant="body2" color={sortOrder === 'oldest' ? 'primary' : 'text.primary'}>
              오래된순
            </Typography>
          </MenuItem>
        </Menu>

        {/* 필터 메뉴 */}
        <Menu
          anchorEl={filterAnchorEl}
          open={filterOpen}
          onClose={handleFilterClose}
          PaperProps={{
            sx: { minWidth: 200 }
          }}
        >
          <MenuItem onClick={() => handleCategorySelect(null)}>
            <Typography variant="body2" color={selectedCategory === null ? 'primary' : 'text.primary'}>
              전체 카테고리
            </Typography>
          </MenuItem>
          {mockCategories.map((category) => (
            <MenuItem 
              key={category.id} 
              onClick={() => handleCategorySelect(category.id)}
            >
              <Typography 
                variant="body2" 
                color={selectedCategory === category.id ? 'primary' : 'text.primary'}
              >
                {category.name}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
