import AdminHeader from "./components/Header/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader/>
      {children}
    </>
  );
}