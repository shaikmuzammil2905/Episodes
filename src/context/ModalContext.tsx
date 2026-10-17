'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
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

  const openStoryModal = useCallback((story: Story) => {
    setSelectedStory(story);
    setIsStoryModalOpen(true);
  }, []);

  const closeStoryModal = useCallback(() => {
    setIsStoryModalOpen(false);
    setSelectedStory(null);
  }, []);

  const openGenreModal = useCallback((genre: Genre) => {
    setSelectedGenre(genre);
    setIsGenreModalOpen(true);
  }, []);

  const closeGenreModal = useCallback(() => {
    setIsGenreModalOpen(false);
    setSelectedGenre(null);
  }, []);

  const openStepModal = useCallback((step: HowItWorksStep) => {
    setSelectedStep(step);
    setIsStepModalOpen(true);
  }, []);

  const closeStepModal = useCallback(() => {
    setIsStepModalOpen(false);
    setSelectedStep(null);
  }, []);

  const openWhatsAppModal = useCallback(() => {
    setIsWhatsAppOpen(true);
  }, []);

  const closeWhatsAppModal = useCallback(() => {
    setIsWhatsAppOpen(false);
  }, []);

  const value = useMemo(
    () => ({
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
    }),
    [
      selectedStory,
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
    ]
  );

  return (
    <ModalContext.Provider value={value}>
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
