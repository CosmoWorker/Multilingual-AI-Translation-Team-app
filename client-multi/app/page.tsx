import { HeroSection } from '@/components/sections/hero';
import { FeatureGrid } from '@/components/sections/feature-grid';
import { CallToAction } from '@/components/sections/call-action';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <HeroSection />
      <FeatureGrid />
      <CallToAction />
    </div>
  );
}