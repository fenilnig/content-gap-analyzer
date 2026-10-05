import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "CONTENT::GAP//ANALYZER",
  description:
    "Cross-platform content gap analyzer — identify YouTube uploads missing from Instagram Reels using perceptual video hashing and acoustic fingerprinting.",
  themeColor: "#050505",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>{children}</body>
    </html>
  );
}
