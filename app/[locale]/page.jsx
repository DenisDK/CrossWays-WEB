// import AboutUs from "@/components/WelcomePage/AboutUs";
// import Header from "@/components/Header/Header";
// import TitleImg from "@/components/WelcomePage/TitleImg";
// import TripExmple from "@/components/WelcomePage/TripExample/TripExample";
// import Footer from "@/components/Footer/Footer";
// import SeparatorContent from "@/components/WelcomePage/SeparatorContent/SeparatorContent";

// export default function Home() {
//   return (
//     <>
//       <header>
//         <Header />
//       </header>
//       <main className="">
//         <TitleImg />
//         <AboutUs />
//         <section className="bg-[#8b68573b] mt-32 py-10">
//           <SeparatorContent />
//         </section>
//         <TripExmple />
//       </main>
//       <footer className="mt-24 bg-[#8b68573b]">
//         <Footer />
//       </footer>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import AboutUs from "@/components/WelcomePage/AboutUs";
import Header from "@/components/Header/Header";
import TitleImg from "@/components/WelcomePage/TitleImg";
import TripExmple from "@/components/WelcomePage/TripExample/TripExample";
import Footer from "@/components/Footer/Footer";
import SeparatorContent from "@/components/WelcomePage/SeparatorContent/SeparatorContent";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
          <CircularProgress />
        </div>
      ) : (
        <>
          <header>
            <Header />
          </header>
          <main>
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
      )}
    </>
  );
}
