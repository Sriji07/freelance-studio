import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export const metadata = {
  title: "Dive — Delve into design. Experience the immersive",
  description:
    "Delve into design. Experience the immersive.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <ScrollProgressBar />
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}