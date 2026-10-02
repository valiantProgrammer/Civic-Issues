import { Plus_Jakarta_Sans, Nunito } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nunito',
});

export const metadata = {
  title: 'Civic साथी - Your City. Your Voice. Real Action.',
  description: 'Report local problems, track every step, and help build a better community for everyone.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      {/* Apply the font variable to the body */}
      <body className={`${jakarta.variable} ${nunito.variable} font-sans`}>
        {children}
        <Toaster position="top-right" />
        <Script
          src={`https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPMYINDIA_MAP_KEY}/map_sdk?v=3.0&layer=vector`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}