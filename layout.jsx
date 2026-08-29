export const metadata = {
  title: 'Financial Advisor',
  description: 'AI Financial Advisor for Rural Micro-Entrepreneurs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
