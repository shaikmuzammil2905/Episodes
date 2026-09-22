'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';

export default function StepModal() {
  const { selectedStep, isStepModalOpen, closeStepModal } = useModal();

  if (!isStepModalOpen || !selectedStep) return null;

  return (
    <div className="modal-overlay" onClick={closeStepModal}>
      <div className="modal-container step-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeStepModal} aria-label="Close modal">
          ✕
        </button>

        <div className="step-modal-header">
          <div className="step-badge">{selectedStep.num}</div>
          <div className="step-icon-area">{selectedStep.icon}</div>
        </div>

        <h2 className="step-modal-title">{selectedStep.title}</h2>
        <p className="step-modal-lead">{selectedStep.desc}</p>

        <div className="step-content-body">
          <p>{selectedStep.longDesc}</p>

          <div className="step-features-box">
            <h4>Highlights & Key Advantages</h4>
            <ul>
              {selectedStep.features.map((feat, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span> {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="step-tip-box">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Pro Reading Tip:</strong> {selectedStep.tip}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="step-modal-actions">
          <Link
            href={selectedStep.actionLink}
            className="btn-primary full-width-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeStepModal}
          >
            {selectedStep.actionText} in New Page ↗
          </Link>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease-out;
        }

        .step-modal-box {
          background: #fff;
          border-radius: var(--radius-lg);
          max-width: 560px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--bg-cream);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .modal-close-btn:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }

        .step-modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .step-badge {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--royal-blue);
          background: var(--bg-light-blue);
          padding: 6px 14px;
          border-radius: var(--radius-full);
        }

        .step-icon-area {
          font-size: 2.4rem;
        }

        .step-modal-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .step-modal-lead {
          font-size: 1rem;
          font-weight: 600;
          color: var(--royal-blue);
          margin-bottom: 20px;
        }

        .step-content-body {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-features-box {
          background: var(--bg-cream);
          border-radius: var(--radius-md);
          padding: 16px;
        }

        .step-features-box h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .step-features-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .step-features-box li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .check-icon {
          color: #10B981;
          font-weight: 800;
        }

        .step-tip-box {
          display: flex;
          gap: 12px;
          background: #FEF3C7;
          border: 1px solid #FCD34D;
          border-radius: var(--radius-md);
          padding: 14px;
          color: #92400E;
          font-size: 0.85rem;
          align-items: flex-start;
        }

        .tip-icon {
          font-size: 1.2rem;
        }

        .full-width-btn {
          width: 100%;
          text-align: center;
          justify-content: center;
          padding: 14px;
          font-size: 0.95rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
