import CustomerHeader from "./components/Header/Header";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomerHeader />
      {children}
    </>
  );
}