'use client';

import React, { createContext, useContext, useState } from 'react';
import { Story, Genre } from '@/lib/types';

export interface HowItWorksStep {
  num: string;
  icon: string;
  title: string;
  desc: string;
  longDesc: string;
  features: string[];
  tip: string;
  actionText: string;
  actionLink: string;
}

interface ModalContextType {
  // Story Modal
  selectedStory: Story | null;
  activeStory: Story | null;
  isStoryModalOpen: boolean;
  openStoryModal: (story: Story) => void;
  closeStoryModal: () => void;

  // Genre Modal
  selectedGenre: Genre | null;
  isGenreModalOpen: boolean;
  openGenreModal: (genre: Genre) => void;
  closeGenreModal: () => void;

  // Step Modal
  selectedStep: HowItWorksStep | null;
  isStepModalOpen: boolean;
  openStepModal: (step: HowItWorksStep) => void;
  closeStepModal: () => void;

  // WhatsApp Modal
  isWhatsAppOpen: boolean;
  openWhatsAppModal: () => void;
  closeWhatsAppModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  // Story Modal State
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Genre Modal State
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);

  // Step Modal State
  const [selectedStep, setSelectedStep] = useState<HowItWorksStep | null>(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);

  // WhatsApp Modal State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const openStoryModal = (story: Story) => {
    setSelectedStory(story);
    setIsStoryModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsStoryModalOpen(false);
    setSelectedStory(null);
  };

  const openGenreModal = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsGenreModalOpen(true);
  };

  const closeGenreModal = () => {
    setIsGenreModalOpen(false);
    setSelectedGenre(null);
  };

  const openStepModal = (step: HowItWorksStep) => {
    setSelectedStep(step);
    setIsStepModalOpen(true);
  };

  const closeStepModal = () => {
    setIsStepModalOpen(false);
    setSelectedStep(null);
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
        selectedStory,
        activeStory: selectedStory,
        isStoryModalOpen,
        openStoryModal,
        closeStoryModal,
        selectedGenre,
        isGenreModalOpen,
        openGenreModal,
        closeGenreModal,
        selectedStep,
        isStepModalOpen,
        openStepModal,
        closeStepModal,
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
