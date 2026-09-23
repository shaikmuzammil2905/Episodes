'use client';

import React from 'react';
import { ModalProvider } from '@/context/ModalContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import StoryModal from '@/components/StoryModal';
import GenreModal from '@/components/GenreModal';
import StepModal from '@/components/StepModal';
import WhatsAppPopup from '@/components/WhatsAppPopup';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import SplashScreen from '@/components/SplashScreen';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ModalProvider>
        <SplashScreen />
        <Header />
        <main style={{ flex: 1, paddingBottom: 60 }}>{children}</main>
        <Footer />
        <MobileBottomNav />
        <StoryModal />
        <GenreModal />
        <StepModal />
        <WhatsAppPopup />
        <WhatsAppFAB />
      </ModalProvider>
    </LanguageProvider>
  );
}
