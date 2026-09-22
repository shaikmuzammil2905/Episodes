'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';

export default function WhatsAppFAB() {
  const { openWhatsAppModal } = useModal();

  return (
    <>
      <button
        className="wa-fab"
        onClick={openWhatsAppModal}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.299.434 2.503 1.185 3.477l-.775 2.83 2.9-.761c.939.633 2.062.984 3.256.984 3.18 0 5.767-2.587 5.767-5.766 0-3.18-2.587-5.766-5.765-5.766zm3.385 8.165c-.143.402-.832.767-1.16.81-.322.043-.74.07-2.13-.483-1.666-.662-2.73-2.37-2.813-2.482-.083-.112-.676-.901-.676-1.718 0-.817.426-1.218.577-1.383.151-.165.33-.207.44-.207.11 0 .22 0 .316.005.103.005.241-.039.377.288.143.342.493 1.2.535 1.286.042.086.07.187.014.3-.056.113-.084.184-.168.282-.084.098-.178.22-.254.296-.084.084-.171.176-.073.344.098.168.437.72.937 1.166.643.573 1.185.751 1.353.835.168.084.267.07.366-.042.098-.113.422-.493.535-.662.113-.169.225-.141.38-.084.155.056.983.464 1.152.549.169.084.282.127.324.197.042.07.042.408-.101.81z" />
        </svg>
      </button>

      <style jsx>{`
        .wa-fab {
          position: fixed;
          bottom: calc(20px + env(safe-area-inset-bottom) + 60px);
          right: 20px;
          width: 56px;
          height: 56px;
          background-color: #25D366;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0, 0, 0, 0.1);
          cursor: pointer;
          z-index: 50;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .wa-fab:hover {
          background: #1EBE57;
          transform: scale(1.1);
        }

        @media (min-width: 768px) {
          .wa-fab {
            bottom: 32px;
            right: 32px;
          }
        }
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4); }
          50% { box-shadow: 0 4px 24px rgba(37, 211, 102, 0.6); }
        }
      `}</style>
    </>
  );
}
