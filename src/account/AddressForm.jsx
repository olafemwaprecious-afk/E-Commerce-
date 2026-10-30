import React, { useEffect, useId, useState } from 'react';
import { ADDRESS_LABELS, LGAS, NIGERIAN_STATES, validateAddress } from '../services/account';
import { Dialog, TextField } from './ui';

const blank = {
  label: 'Home',
  fullName: '',
  phone: '',
  state: '',
  city: '',
  lga: '',
  street: '',
  apartment: '',
  instructions: '',
  isDefault: false,
};

export default function AddressForm({ open, initial, onSave, onClose, hasAddresses }) {
  const [draft, setDraft] = useState(blank);
  const [errors, setErrors] = useState({});
  const lgaListId = useId();

  useEffect(() => {
    if (!open) return;
    setDraft({ ...blank, ...(initial || {}) });
    setErrors({});
  }, [open, initial]);

  const update = (key, value) => {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: '' }));
  };

  const submit = event => {
    event.preventDefault();
    const nextErrors = validateAddress(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...draft, id: initial?.id });
    onClose();
  };

  const lgaSuggestions = LGAS[draft.state] || [];

  return (
    <Dialog
      open={open}
      wide
      title={initial ? 'Edit delivery address' : 'Add a delivery address'}
      description="Nigerian addresses only. We do not assume a postal code."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="acct-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="acct-btn primary" onClick={submit}>
            {initial ? 'Save address' : 'Add address'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="acct-stack-sm">
        <fieldset className="acct-fieldset">
          <legend>Address label</legend>
          <div className="acct-segmented">
            {ADDRESS_LABELS.map(label => (
              <button
                key={label}
                type="button"
                className={draft.label === label ? 'active' : ''}
                aria-pressed={draft.label === label}
                onClick={() => update('label', label)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="acct-form-grid">
          <TextField
            label="Full name"
            required
            value={draft.fullName}
            onChange={value => update('fullName', value)}
            error={errors.fullName}
            placeholder="Recipient’s full name"
            autoComplete="name"
          />
          <TextField
            label="Phone number"
            type="tel"
            required
            prefix="🇳🇬 +234"
            value={draft.phone}
            onChange={value => update('phone', value.replace(/[^\d\s()-]/g, ''))}
            error={errors.phone}
            placeholder="801 234 5678"
            autoComplete="tel-national"
          />
          <div className="acct-field">
            <label htmlFor="addr-state">
              State <span aria-hidden="true">*</span>
            </label>
            <div className={`acct-input${errors.state ? ' has-error' : ''}`}>
              <select
                id="addr-state"
                value={draft.state}
                onChange={event => {
                  update('state', event.target.value);
                  update('lga', '');
                }}
                aria-invalid={errors.state ? 'true' : undefined}
              >
                <option value="">Choose a state</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            {errors.state && <small className="acct-error">{errors.state}</small>}
          </div>
          <TextField
            label="City or town"
            required
            value={draft.city}
            onChange={value => update('city', value)}
            error={errors.city}
            placeholder="e.g. Ikeja"
          />
          <div className="acct-field">
            <label htmlFor="addr-lga">
              Local Government Area <span aria-hidden="true">*</span>
            </label>
            <div className={`acct-input${errors.lga ? ' has-error' : ''}`}>
              <input
                id="addr-lga"
                value={draft.lga}
                list={lgaSuggestions.length ? lgaListId : undefined}
                placeholder={lgaSuggestions.length ? 'Type or choose your LGA' : 'Type your LGA'}
                onChange={event => update('lga', event.target.value)}
                aria-invalid={errors.lga ? 'true' : undefined}
              />
            </div>
            {lgaSuggestions.length > 0 && (
              <datalist id={lgaListId}>
                {lgaSuggestions.map(lga => (
                  <option key={lga} value={lga} />
                ))}
              </datalist>
            )}
            {errors.lga ? (
              <small className="acct-error">{errors.lga}</small>
            ) : (
              <small className="acct-hint">
                {lgaSuggestions.length
                  ? 'Suggestions are available for this state.'
                  : 'Type the LGA name exactly as it is written locally.'}
              </small>
            )}
          </div>
          <TextField
            label="Street address"
            required
            className="span-2"
            value={draft.street}
            onChange={value => update('street', value)}
            error={errors.street}
            placeholder="House number and street name"
            autoComplete="street-address"
          />
          <TextField
            label="Apartment, house number or landmark"
            value={draft.apartment}
            onChange={value => update('apartment', value)}
            placeholder="e.g. Flat 2B, opposite the filling station"
          />
          <div className="acct-field span-2">
            <label htmlFor="addr-instructions">
              Delivery instructions <small>(optional)</small>
            </label>
            <div className="acct-input">
              <textarea
                id="addr-instructions"
                rows={3}
                maxLength={200}
                value={draft.instructions}
                onChange={event => update('instructions', event.target.value)}
                placeholder="Anything a rider should know"
              />
            </div>
            <small className="acct-hint">{draft.instructions.length}/200 characters</small>
            {errors.instructions && <small className="acct-error">{errors.instructions}</small>}
          </div>
        </div>

        <label className="acct-checkbox">
          <input
            type="checkbox"
            checked={draft.isDefault || !hasAddresses}
            disabled={!hasAddresses}
            onChange={event => update('isDefault', event.target.checked)}
          />
          <span>
            Use as my default delivery address
            {!hasAddresses && <small>Your first address becomes the default.</small>}
          </span>
        </label>
      </form>
    </Dialog>
  );
}
