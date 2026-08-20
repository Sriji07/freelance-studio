import "./globals.css";

export const metadata = {
  title: "Studio — Web Design for Businesses",
  description:
    "A freelance web design studio creating modern websites for businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}