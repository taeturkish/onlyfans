import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnlyFans",
  description: "OnlyFans is the social platform revolutionizing creator and fan connections.",
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/OnlyFans_wordmark_2023.svg/32px-OnlyFans_wordmark_2023.svg.png",
  },
  openGraph: {
    title: "OnlyFans",
    description: "OnlyFans is the social platform revolutionizing creator and fan connections.",
    siteName: "OnlyFans",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://seeklogo.com/images/O/onlyfans-logo-FB9A2D7E3F-seeklogo.com.png" />
      </head>
      <body className="bg-[#f0f2f5] min-h-screen">
        {children}
      </body>
    </html>
  );
}
