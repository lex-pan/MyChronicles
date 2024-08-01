import ChronicleNavBar from "./ChronicleNavBar";
import ValidPage from "./ValidPage";

export default function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode, params: {chronicleId: string};
}>) {
  return (
    <ValidPage params={params}>
        <ChronicleNavBar params={params}/>
        {children}
    </ValidPage>
  );
}
