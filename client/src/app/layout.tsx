import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
})
const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Contacts",
    description: "A contact management app.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${jetBrainsMono.variable} ${inter.variable} antialiased bg-neutral-100 dark:bg-neutral-900 `}
            >
                {/* <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                > */}
                    <Providers>{children}</Providers>
                {/* </ThemeProvider> */}
            </body>
        </html>
    );
}
