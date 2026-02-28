import { Nunito } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import './globals.css';

// Configure the font with desired weights
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nunito', // Use a CSS variable
});

export const metadata = {
  title: 'Civic Saathi',
  description: 'The best place to learn and play for kids',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Apply the font variable to the body */}
      <body className={`${nunito.variable} font-sans`}>
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