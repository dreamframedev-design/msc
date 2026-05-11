export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-layout relative z-30 min-h-screen">
      {children}
    </div>
  );
}