import React from 'react';
import { X } from 'lucide-react';

/**
 * View Component: SurveyModals
 * Modals for Live Chat Room and standard message preview.
 */
export function SurveyModals({
  isTemplateOpen,
  onCloseTemplate,
  isChatOpen,
  onCloseChat,
  activeGuest
}) {
  return (
    <>
      {/* Template Modal */}
      {isTemplateOpen && (
        <div className="survey-modal-backdrop" onClick={onCloseTemplate}>
          <div className="survey-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="survey-modal-header">
              <span className="modal-header-title">Format Pesan Konfirmasi WhatsApp &amp; Email</span>
              <button type="button" className="btn-modal-close" onClick={onCloseTemplate}>
                <X size={18} />
              </button>
            </div>
            <div className="survey-modal-body">
              <div className="template-sample-box">
                <span className="template-channel-tag">📱 Pesan WhatsApp Otomatis (Front Desk)</span>
                <p className="template-text">
                  &ldquo;Yth. Bapak/Ibu [Nama Tamu], terima kasih telah menginap di Grand Melia Jakarta. Sebelum melanjutkan perjalanan, apakah seluruh barang berharga Anda di Kamar [Nomor Kamar] sudah lengkap terbawa? Jika ada barang yang tertinggal, mohon balas pesan ini untuk penanganan segera.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {isChatOpen && activeGuest && (
        <div className="survey-modal-backdrop" onClick={onCloseChat}>
          <div className="survey-modal-card chat" onClick={(e) => e.stopPropagation()}>
            <div className="survey-modal-header">
              <div className="chat-guest-info">
                <span className="chat-guest-name">Chat Room: {activeGuest.name}</span>
                <span className="chat-room-badge">Kamar {activeGuest.roomNumber}</span>
              </div>
              <button type="button" className="btn-modal-close" onClick={onCloseChat}>
                <X size={18} />
              </button>
            </div>
            <div className="chat-modal-messages">
              <div className="chat-bubble bot">
                <span className="bubble-sender">Grand Melia Guest Care • 11:40 WIB</span>
                <p className="bubble-text">Yth. {activeGuest.name}, apakah ada barang tertinggal di Kamar {activeGuest.roomNumber} pasca checkout?</p>
              </div>
              <div className="chat-bubble guest">
                <span className="bubble-sender">{activeGuest.name} • 11:45 WIB</span>
                <p className="bubble-text">Iya tertinggal cincin emas di wastafel kamar mandi, tolong diamankan ya.</p>
              </div>
              <div className="chat-bubble officer">
                <span className="bubble-sender">Front Desk Supervisor • 11:48 WIB</span>
                <p className="bubble-text">Baik, cincin telah diamankan staf Housekeeping dan disimpan di Brankas Utama FO. Kami siap proses serah terima.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SurveyModals;
