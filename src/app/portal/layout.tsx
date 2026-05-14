export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-layout relative z-[100] min-h-screen bg-[#0A0A0A]">
      {children}
    </div>
  );
}