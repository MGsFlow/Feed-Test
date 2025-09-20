'use client';

import type { Metadata } from "next";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme/theme';
import { currentUser } from '../mockData/mockUesr';
import { useFeedStore } from '../store/store';
import { useEffect } from 'react';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setCurrentUser = useFeedStore((state) => state.setCurrentUser);

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [setCurrentUser]);

  return (
    <html lang="ko">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
