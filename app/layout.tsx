import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "游戏设计档案｜游戏策划 × 技术策划",
  description: "独立游戏、玩法原型、设计文档与技术策划实践的个人作品集。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "游戏设计档案",
    description: "策划 × 技术 × 可玩原型",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "游戏设计档案分享封面" }]
  },
  twitter: { card: "summary_large_image", title: "游戏设计档案", description: "策划 × 技术 × 可玩原型", images: ["/og.png"] }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
