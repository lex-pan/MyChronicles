import ChronicleNavBar from "./ChronicleNavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <ChronicleNavBar />
        {children}
    </>
  );
}
