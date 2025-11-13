import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

async function getSocialLinks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social`, {
    next: { revalidate: 60 }, // ISR → كل دقيقة يحدث تلقائياً
  });
  if (!res.ok) throw new Error("Failed to fetch social links");
  const json = await res.json();
  return json.data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socialLinks = await getSocialLinks();

  return (
    <div className="max-w-[1366px] mx-auto">
      <Navbar />
      {children}
      <Footer links={socialLinks} />
    </div>
  );
}
