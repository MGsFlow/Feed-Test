'use client';

import React from 'react';
import { Box, Link, Typography } from '@mui/material';

interface HighlightedTextProps {
  text: string;
  variant?: 'body1' | 'body2' | 'caption';
  sx?: any;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ 
  text, 
  variant = 'body1',
  sx = {} 
}) => {
  // text가 없거나 빈 문자열인 경우 빈 문자열 반환
  if (!text || typeof text !== 'string') {
    return <Typography variant={variant} sx={sx}></Typography>;
  }

  // URL 정규식
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // 해시태그 정규식
  const hashtagRegex = /#[\w가-힣]+/g;
  // 멘션 정규식
  const mentionRegex = /@[\w가-힣]+/g;

  const parseText = (text: string) => {
    if (!text || typeof text !== 'string') {
      return [{ type: 'text', text: '' }];
    }
    
    const parts = [];
    let lastIndex = 0;

    // 모든 패턴을 찾아서 정렬
    const matches = [];
    
    // URL 매치
    let urlMatch;
    while ((urlMatch = urlRegex.exec(text)) !== null) {
      matches.push({
        type: 'url',
        text: urlMatch[0],
        start: urlMatch.index,
        end: urlMatch.index + urlMatch[0].length,
      });
    }

    // 해시태그 매치
    let hashtagMatch;
    while ((hashtagMatch = hashtagRegex.exec(text)) !== null) {
      matches.push({
        type: 'hashtag',
        text: hashtagMatch[0],
        start: hashtagMatch.index,
        end: hashtagMatch.index + hashtagMatch[0].length,
      });
    }

    // 멘션 매치
    let mentionMatch;
    while ((mentionMatch = mentionRegex.exec(text)) !== null) {
      matches.push({
        type: 'mention',
        text: mentionMatch[0],
        start: mentionMatch.index,
        end: mentionMatch.index + mentionMatch[0].length,
      });
    }

    // 시작 위치로 정렬
    matches.sort((a, b) => a.start - b.start);

    // 중복 제거 (겹치는 부분이 있는 경우)
    const filteredMatches = [];
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const previous = filteredMatches[filteredMatches.length - 1];
      
      if (!previous || current.start >= previous.end) {
        filteredMatches.push(current);
      }
    }

    // 텍스트 파싱
    filteredMatches.forEach((match, index) => {
      // 매치 전 텍스트 추가
      if (match.start > lastIndex) {
        parts.push({
          type: 'text',
          text: text.slice(lastIndex, match.start),
        });
      }

      // 매치된 텍스트 추가
      parts.push({
        type: match.type,
        text: match.text,
      });

      lastIndex = match.end;
    });

    // 마지막 텍스트 추가
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        text: text.slice(lastIndex),
      });
    }

    return parts;
  };

  const handleUrlClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleHashtagClick = (hashtag: string) => {
    // 해시태그 클릭 시 필터링 기능 (나중에 구현)
    console.log('해시태그 클릭:', hashtag);
  };

  const handleMentionClick = (mention: string) => {
    // 멘션 클릭 시 사용자 프로필 (나중에 구현)
    console.log('멘션 클릭:', mention);
  };

  const parsedParts = parseText(text);

  return (
    <Typography variant={variant} sx={sx}>
      {parsedParts.map((part, index) => {
        switch (part.type) {
          case 'url':
            return (
              <Link
                key={`url-${index}-${part.text.slice(0, 10)}`}
                href={part.text}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleUrlClick(part.text);
                }}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
              >
                {part.text}
              </Link>
            );

          case 'hashtag':
            return (
              <Box
                key={`hashtag-${index}-${part.text}`}
                component="span"
                onClick={() => handleHashtagClick(part.text)}
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.dark',
                    textDecoration: 'underline',
                  },
                }}
              >
                {part.text}
              </Box>
            );

          case 'mention':
            return (
              <Box
                key={`mention-${index}-${part.text}`}
                component="span"
                onClick={() => handleMentionClick(part.text)}
                sx={{
                  color: 'secondary.main',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'secondary.dark',
                    textDecoration: 'underline',
                  },
                }}
              >
                {part.text}
              </Box>
            );

          default:
            return <span key={`text-${index}-${part.text.slice(0, 10)}`}>{part.text}</span>;
        }
      })}
    </Typography>
  );
};
