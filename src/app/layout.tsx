import type { Metadata } from "next";
import "./globals.css";
import { ConfigProvider } from "antd";

import "@ant-design/v5-patch-for-react-19";

export const metadata: Metadata = {
  title: "Task Dashboard",
  description: "Modern task manager built with Next.js 15 + Ant Design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1890ff",
              borderRadius: 6,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
