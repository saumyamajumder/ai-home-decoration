import { BeforeAfterShowcase } from "@/components/landing/BeforeAfterShowcase";
import { CallToAction } from "@/components/landing/CallToAction";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RoomCategories } from "@/components/landing/RoomCategories";
import { StyleGallery } from "@/components/landing/StyleGallery";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <BeforeAfterShowcase />
      <HowItWorks />
      <RoomCategories />
      <StyleGallery />
      <Features />
      <CallToAction />
    </>
  );
}
