"use client";

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { lightTheme, darkTheme } from '@/theme/theme';
import { useEffect, useState } from 'react';

function MuiThemeSync({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <MuiThemeProvider theme={darkTheme}>{children}</MuiThemeProvider>;
    }

    const theme = resolvedTheme === 'light' ? lightTheme : darkTheme;

    return (
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    );
}

export default function AppLevelThemeController({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <MuiThemeSync>
                {children}
            </MuiThemeSync>
        </NextThemesProvider>
    );
}
