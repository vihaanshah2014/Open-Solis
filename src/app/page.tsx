'use client';

import Header from '@/components/home_page/Header';
import MainSection from '@/components/home_page/MainSection';
import FeatureSection from '@/components/home_page/FeatureSection';
import HowItWorks from '@/components/home_page/HomeItWorks';
import Why from '@/components/home_page/Why';
import Footer from '@/components/home_page/Footer';
import Insight from '@/components/home_page/Insights'
import Testimonial from '@/components/home_page/Testimonial'
import Pricing from '@/components/home_page/Pricing'


export default function Home() {
  return (
    <div className="font-['MD_Grotesk_Regular'] relative overflow-hidden text-gray-800 min-h-screen bg-gray-100">
      <Header />
      <MainSection />
      <Why />
      <Insight />
      <Testimonial />
      <Pricing />
      <HowItWorks />
      <FeatureSection />
      <Footer />
    </div>
  );
}
