'use client';

import React from 'react';
import { ModalProvider } from '@/context/ModalContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import StoryModal from '@/components/StoryModal';
import WhatsAppPopup from '@/components/WhatsAppPopup';
import WhatsAppFAB from '@/components/WhatsAppFAB';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <Header />
      <main style={{ flex: 1, paddingBottom: 60 }}>{children}</main>
      <Footer />
      <MobileBottomNav />
      <StoryModal />
      <WhatsAppPopup />
      <WhatsAppFAB />
    </ModalProvider>
  );
}
