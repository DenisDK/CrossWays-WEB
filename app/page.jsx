import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SeparatorContent from "@/components/SeparatorContent";
import TitleImg from "@/components/TItleImg";
import TripExmple from "@/components/TripExample";

export default function Home() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="">
        <TitleImg />
        <AboutUs />
        <section className="bg-[#8b68573b] mt-32 py-10">
          <SeparatorContent />
        </section>
        <TripExmple />
      </main>
      <footer className="mt-24 bg-[#8b68573b]">
        <Footer />
      </footer>
    </>
  );
}
