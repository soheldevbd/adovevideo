import "./globals.css";
export const metadata = { title: "ChromaVault", description: "Green screen stock video generator" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
