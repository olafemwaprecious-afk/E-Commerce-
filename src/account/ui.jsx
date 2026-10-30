import React, { useEffect, useId, useRef } from 'react';
import { X, Check, Info } from 'lucide-react';

export function Badge({ tone = 'muted', children }) {
  return <span className={`acct-badge tone-${tone}`}>{children}</span>;
}

export function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className={`acct-toggle-row${disabled ? ' is-disabled' : ''}`}>
      <span className="acct-toggle-copy">
        <b>{label}</b>
        {description && <small>{description}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={event => onChange(event.target.checked)}
      />
      <span className="acct-switch" aria-hidden="true">
        <i />
      </span>
    </label>
  );
}

export function Notice({ tone = 'info', title, children }) {
  return (
    <div className={`acct-notice tone-${tone}`} role={tone === 'error' ? 'alert' : 'note'}>
      <Info size={17} aria-hidden="true" />
      <div>
        {title && <b>{title}</b>}
        <p>{children}</p>
      </div>
    </div>
  );
}

export function InlineMessage({ children }) {
  return (
    <p className="acct-inline-message" role="status">
      <Check size={15} aria-hidden="true" /> {children}
    </p>
  );
}

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  type = 'text',
  placeholder,
  autoComplete,
  required = false,
  maxLength,
  disabled = false,
  prefix,
  children,
  className = '',
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`acct-field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : <small> (optional)</small>}
      </label>
      <div className={`acct-input${error ? ' has-error' : ''}${prefix ? ' with-prefix' : ''}`}>
        {prefix && <span className="acct-prefix">{prefix}</span>}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          onChange={event => onChange(event.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          required={required}
        />
        {children}
      </div>
      {hint && !error && <small className="acct-hint">{hint}</small>}
      {error && (
        <small className="acct-error" id={errorId} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

export function Dialog({ open, title, description, onClose, children, footer, wide = false }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    const focusTarget = panelRef.current?.querySelector(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusTarget?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="acct-dialog-backdrop" onMouseDown={onClose}>
      <div
        className={`acct-dialog${wide ? ' is-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={panelRef}
        onMouseDown={event => event.stopPropagation()}
      >
        <div className="acct-dialog-head">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="acct-icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="acct-dialog-body">{children}</div>
        {footer && <div className="acct-dialog-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  confirmDisabled = false,
  onConfirm,
  onClose,
  children,
}) {
  return (
    <Dialog
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="acct-btn ghost" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`acct-btn ${tone}`}
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="acct-dialog-text">{message}</p>
      {children}
    </Dialog>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty acct-empty">
      {icon}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className = '' }) {
  return (
    <section className={`acct-card ${className}`.trim()}>
      {(title || action) && (
        <header className="acct-card-head">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PanelHeader({ title, description, action }) {
  return (
    <div className="acct-panel-head">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
