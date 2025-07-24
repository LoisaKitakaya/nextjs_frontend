import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Recipe and Meal Planning App",
  description: "An api for generating recipes and meal plans using Gemini AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <>
          {/* react-hot-toast's 'Toaster' component to render toast notifications */}
          <Toaster position="bottom-center" />

          {children}
        </>
      </body>
    </html>
  );
}
