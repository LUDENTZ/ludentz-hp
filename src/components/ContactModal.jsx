import ContactForm from './ContactForm';

export default function ContactModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <ContactForm onCancel={onClose} resetKey={open ? 1 : 0} showCancel />
      </div>
    </div>
  );
}
