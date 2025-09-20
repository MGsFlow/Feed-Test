'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Box,
} from '@mui/material';

export const PostSkeleton: React.FC = () => {
  return (
    <Card sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={48} height={48} />}
        action={<Skeleton variant="rectangular" width={24} height={24} />}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={60} height={16} />
          </Box>
        }
        subheader={<Skeleton variant="rectangular" width={60} height={24} sx={{ mt: 1, borderRadius: 2 }} />}
      />
      <CardContent sx={{ pt: 0 }}>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
        
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={200} 
          sx={{ mb: 2, borderRadius: 1 }} 
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      </CardContent>
    </Card>
  );
};
