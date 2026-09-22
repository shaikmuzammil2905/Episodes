'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';

export default function WhatsAppPopup() {
  const { isWhatsAppOpen, closeWhatsAppModal } = useModal();

  if (!isWhatsAppOpen) return null;

  const message = encodeURIComponent('Hello StoryEpisodes, I would like to know more about the platform.');
  const whatsappUrl = `https://wa.me/918790349941?text=${message}`;

  return (
    <div className="wa-backdrop" onClick={closeWhatsAppModal}>
      <div className="wa-popup" onClick={(e) => e.stopPropagation()}>
        <button className="wa-close" onClick={closeWhatsAppModal} aria-label="Close WhatsApp Popup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="wa-icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#25D366">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.299.434 2.503 1.185 3.477l-.775 2.83 2.9-.761c.939.633 2.062.984 3.256.984 3.18 0 5.767-2.587 5.767-5.766 0-3.18-2.587-5.766-5.765-5.766zm3.385 8.165c-.143.402-.832.767-1.16.81-.322.043-.74.07-2.13-.483-1.666-.662-2.73-2.37-2.813-2.482-.083-.112-.676-.901-.676-1.718 0-.817.426-1.218.577-1.383.151-.165.33-.207.44-.207.11 0 .22 0 .316.005.103.005.241-.039.377.288.143.342.493 1.2.535 1.286.042.086.07.187.014.3-.056.113-.084.184-.168.282-.084.098-.178.22-.254.296-.084.084-.171.176-.073.344.098.168.437.72.937 1.166.643.573 1.185.751 1.353.835.168.084.267.07.366-.042.098-.113.422-.493.535-.662.113-.169.225-.141.38-.084.155.056.983.464 1.152.549.169.084.282.127.324.197.042.07.042.408-.101.81z" />
          </svg>
        </div>

        <h3 className="wa-title">Chat with StoryEpisodes</h3>
        <p className="wa-desc">
          Have a question or want to know more? Connect with us directly on WhatsApp.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-chat-btn"
          onClick={closeWhatsAppModal}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.299.434 2.503 1.185 3.477l-.775 2.83 2.9-.761c.939.633 2.062.984 3.256.984 3.18 0 5.767-2.587 5.767-5.766 0-3.18-2.587-5.766-5.765-5.766zm3.385 8.165c-.143.402-.832.767-1.16.81-.322.043-.74.07-2.13-.483-1.666-.662-2.73-2.37-2.813-2.482-.083-.112-.676-.901-.676-1.718 0-.817.426-1.218.577-1.383.151-.165.33-.207.44-.207.11 0 .22 0 .316.005.103.005.241-.039.377.288.143.342.493 1.2.535 1.286.042.086.07.187.014.3-.056.113-.084.184-.168.282-.084.098-.178.22-.254.296-.084.084-.171.176-.073.344.098.168.437.72.937 1.166.643.573 1.185.751 1.353.835.168.084.267.07.366-.042.098-.113.422-.493.535-.662.113-.169.225-.141.38-.084.155.056.983.464 1.152.549.169.084.282.127.324.197.042.07.042.408-.101.81z" />
          </svg>
          Chat on WhatsApp
        </a>

        <button className="wa-cancel-btn" onClick={closeWhatsAppModal}>Close</button>
      </div>

      <style jsx>{`
        .wa-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }

        .wa-popup {
          background: #fff;
          border-radius: var(--radius-lg);
          padding: 40px 32px 28px;
          max-width: 380px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-xl);
          position: relative;
          animation: popScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wa-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: var(--transition-fast);
        }

        .wa-close:hover {
          background: var(--bg-main);
          color: var(--text-primary);
        }

        .wa-icon-circle {
          width: 72px;
          height: 72px;
          background: #E8F8EE;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .wa-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .wa-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 24px;
        }

        .wa-chat-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: #25D366;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          padding: 14px 24px;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        .wa-chat-btn:hover {
          background: #1EBE57;
          transform: translateY(-1px);
        }

        .wa-cancel-btn {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-top: 14px;
          padding: 8px 16px;
          transition: var(--transition-fast);
        }

        .wa-cancel-btn:hover {
          color: var(--text-primary);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popScale {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
