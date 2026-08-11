import Script from "next/script";
import Backgrounds from "@/components/Backgrounds";
import Preloader from "@/components/Preloader";
import Dock from "@/components/Dock";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Project from "@/components/Project";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <Backgrounds />
      <Dock />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Project />
        <Stats />
        <Contact />
      </main>
      <Script src="/anim.js" strategy="afterInteractive" />
    </>
  );
}
