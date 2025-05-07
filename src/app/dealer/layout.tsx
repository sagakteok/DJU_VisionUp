import DealerHeader from "./components/Header/Header";

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DealerHeader />
      {children}
    </>
  );
}