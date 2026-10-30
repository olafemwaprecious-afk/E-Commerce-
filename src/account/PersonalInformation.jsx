import React, { useEffect, useRef, useState } from 'react';
import { Camera, Trash2, Check } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { formatNgPhone, normalizeNgPhone, validateProfile } from '../services/account';
import { readImageFile } from '../services/media';
import { Badge, Notice, PanelHeader, TextField } from './ui';

const initials = name =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'SS';

export default function PersonalInformation({ embedded = false }) {
  const { profile, saveProfile } = useAccount();
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const update = (key, value) => {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: '' }));
    setSaved('');
  };

  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    const nextErrors = validateProfile(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSaved('');
      return;
    }
    setBusy(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    saveProfile({ ...draft, phone: normalizeNgPhone(draft.phone) });
    setBusy(false);
    setSaved('Your details were saved on this device.');
  };

  const pickPhoto = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setPhotoError('');
    try {
      const photo = await readImageFile(file, { maxSize: 360 });
      update('photo', photo);
    } catch (error) {
      setPhotoError(error.message);
    }
  };

  return (
    <form onSubmit={submit} noValidate className={embedded ? 'acct-embedded' : ''}>
      {!embedded && (
        <PanelHeader
          title="Personal information"
          description="The details we use for your account and deliveries."
        />
      )}

      <Notice title="Preview account">
        These details are stored only in this browser for the demo. Email and phone verification are
        not connected, so nothing here is shown as verified.
      </Notice>

      <div className="acct-photo-row">
        <div className="acct-avatar" aria-hidden={draft.photo ? undefined : 'true'}>
          {draft.photo ? <img src={draft.photo} alt="Your profile photo" /> : <span>{initials(draft.name)}</span>}
        </div>
        <div>
          <b>Profile photo</b>
          <p className="muted">Optional. JPG, PNG or WebP up to 5 MB.</p>
          <div className="acct-photo-actions">
            <button type="button" className="acct-btn ghost" onClick={() => fileRef.current?.click()}>
              <Camera size={15} /> {draft.photo ? 'Change photo' : 'Upload photo'}
            </button>
            {draft.photo && (
              <button type="button" className="acct-btn ghost danger-text" onClick={() => update('photo', null)}>
                <Trash2 size={15} /> Remove
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={pickPhoto}
            aria-label="Choose a profile photo"
          />
          {photoError && <small className="acct-error">{photoError}</small>}
        </div>
      </div>

      <div className="acct-form-grid">
        <TextField
          label="Display name"
          required
          value={draft.name}
          onChange={value => update('name', value)}
          error={errors.name}
          placeholder="e.g. Amaka Obi"
          autoComplete="name"
        />
        <TextField
          label="Email address"
          type="email"
          required
          value={draft.email}
          onChange={value => update('email', value)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <TextField
          label="Phone number"
          type="tel"
          required
          prefix="🇳🇬 +234"
          value={draft.phone}
          onChange={value => update('phone', value.replace(/[^\d\s()-]/g, ''))}
          error={errors.phone}
          hint={formatNgPhone(draft.phone) || 'Nigerian mobile numbers only.'}
          placeholder="801 234 5678"
          autoComplete="tel-national"
        />
        <div className="acct-field">
          <label>Verification</label>
          <div className="acct-badge-row">
            <Badge tone="muted">Email not verified</Badge>
            <Badge tone="muted">Phone not verified</Badge>
          </div>
          <small className="acct-hint">Verification needs the account service and is not available yet.</small>
        </div>
      </div>

      <div className="acct-form-footer">
        <button type="submit" className="acct-btn primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <p className="acct-inline-message" role="status">
            <Check size={15} /> {saved}
          </p>
        )}
      </div>
    </form>
  );
}
