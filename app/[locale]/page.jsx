import AboutUs from "@/components/WelcomePage/AboutUs";
import Header from "@/components/Header/Header";
import TitleImg from "@/components/WelcomePage/TitleImg";
import TripExmple from "@/components/WelcomePage/TripExample/TripExample";
import Footer from "@/components/Footer/Footer";
import SeparatorContent from "@/components/WelcomePage/SeparatorContent/SeparatorContent";

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
