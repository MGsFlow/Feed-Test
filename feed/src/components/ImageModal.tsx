'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Close,
  NavigateBefore,
  NavigateNext,
  ZoomIn,
  ZoomOut,
  RotateRight,
} from '@mui/icons-material';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  open,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentImage = images[currentIndex];

  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setImageLoaded(false);
    }
  }, [open, currentIndex]);

  // 이미지 변경 시 렌더링 강제 새로고침
  useEffect(() => {
    if (currentImage) {
      setImageLoaded(false);
      // 약간의 지연 후 이미지 로드 상태를 true로 설정
      const timer = setTimeout(() => {
        setImageLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentImage]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onIndexChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onIndexChange(newIndex);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        onClose();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case 'r':
      case 'R':
        handleRotate();
        break;
    }
  };

  const handleImageClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const centerX = rect.width / 2;
    
    if (x < centerX) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  if (!currentImage) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* 헤더 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        }}
      >
        <Typography variant="h6">
          {currentIndex + 1} / {images.length}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleZoomOut}
            sx={{ color: 'white' }}
            title="축소 (Z)"
          >
            <ZoomOut />
          </IconButton>
          <IconButton
            onClick={handleZoomIn}
            sx={{ color: 'white' }}
            title="확대 (Z)"
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            onClick={handleRotate}
            sx={{ color: 'white' }}
            title="회전 (R)"
          >
            <RotateRight />
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{ color: 'white' }}
            title="닫기 (ESC)"
          >
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* 메인 이미지 영역 */}
      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Fade in={imageLoaded} timeout={300} key={`${currentImage}-${currentIndex}`}>
          <Box
            sx={{
              position: 'relative',
              cursor: 'pointer',
              userSelect: 'none',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-in-out',
              maxWidth: '100%',
              maxHeight: '100%',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
            onClick={handleImageClick}
          >
            <img
              src={currentImage}
              alt={`이미지 ${currentIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 8,
                display: 'block',
                imageRendering: 'auto',
              } as React.CSSProperties}
              onLoad={() => setImageLoaded(true)}
              draggable={false}
            />
          </Box>
        </Fade>

        {/* 네비게이션 버튼 */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                zIndex: 1,
              }}
              title="이전 이미지 (←)"
            >
              <NavigateBefore />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                zIndex: 1,
              }}
              title="다음 이미지 (→)"
            >
              <NavigateNext />
            </IconButton>
          </>
        )}
      </DialogContent>

      {/* 썸네일 영역 */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            overflowX: 'auto',
            zIndex: 1,
          }}
        >
          {images.map((image, index) => (
            <Zoom
              in={true}
              timeout={200}
              key={index}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentIndex === index ? '2px solid white' : '2px solid transparent',
                  opacity: currentIndex === index ? 1 : 0.7,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.1)',
                  },
                }}
                onClick={() => onIndexChange(index)}
              >
                <img
                  src={image}
                  alt={`썸네일 ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Zoom>
          ))}
        </Box>
      )}

      {/* 로딩 인디케이터 */}
      {!imageLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
          }}
        >
          <Typography>이미지 로딩 중...</Typography>
        </Box>
      )}
    </Dialog>
  );
};
