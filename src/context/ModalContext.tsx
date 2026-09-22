'use client';

import React, { createContext, useContext, useState } from 'react';
import { Story } from '@/lib/types';

interface ModalContextType {
  activeStory: Story | null;
  openStoryModal: (story: Story) => void;
  closeStoryModal: () => void;
  isWhatsAppOpen: boolean;
  openWhatsAppModal: () => void;
  closeWhatsAppModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const openStoryModal = (story: Story) => {
    setActiveStory(story);
    document.body.style.overflow = 'hidden';
  };

  const closeStoryModal = () => {
    setActiveStory(null);
    document.body.style.overflow = '';
  };

  const openWhatsAppModal = () => {
    setIsWhatsAppOpen(true);
  };

  const closeWhatsAppModal = () => {
    setIsWhatsAppOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        activeStory,
        openStoryModal,
        closeStoryModal,
        isWhatsAppOpen,
        openWhatsAppModal,
        closeWhatsAppModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
