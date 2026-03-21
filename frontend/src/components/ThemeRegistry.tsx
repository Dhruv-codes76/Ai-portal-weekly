"use client";

import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import { lightTheme, darkTheme } from '@/theme/theme';
import { useEffect, useState } from 'react';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // If we only return ThemeProvider from MUI, NextThemesProvider is wrapping it in layout.tsx.
    // However, the issue might be related to MUI's CSS injection order vs Tailwind.

    if (!mounted) {
        return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
    }

    const theme = resolvedTheme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}
