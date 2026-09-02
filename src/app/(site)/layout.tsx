import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Chrome for the marketing site. Kept out of the root layout so standalone
 * landing pages (/skica) can opt out of the nav, footer, smooth scroll and
 * custom cursor entirely.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
