import './globals.css';

export const metadata = {
  title: 'Browser AI - Asszisztens',
  description: 'Multi-functional AI Assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
