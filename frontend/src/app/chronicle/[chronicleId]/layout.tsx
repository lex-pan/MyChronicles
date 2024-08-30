import ChronicleNavBar from "./ChronicleNavBar";
import ValidPage from "./ValidPage";

export default function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode, params: {chronicleId: string};
}>) {
  // since body has auto 1fr auto, for footer center counts as 1fr instead of messing everything up
  return (
    <ValidPage params={params}>
        <div className="for-footer-center">
          <ChronicleNavBar params={params}/>
          {children}
        </div>
    </ValidPage>
  );
}
