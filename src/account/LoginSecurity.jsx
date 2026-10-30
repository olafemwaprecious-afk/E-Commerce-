import React, { useState } from 'react';
import { Eye, EyeOff, LogOut, ShieldCheck, Laptop, CircleHelp } from 'lucide-react';
import { Badge, ConfirmDialog, Notice, SectionCard, TextField } from './ui';

const empty = { current: '', next: '', confirm: '' };

export default function LoginSecurity() {
  const [form, setForm] = useState(empty);
  const [visible, setVisible] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signOutMessage, setSignOutMessage] = useState('');

  const update = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: '' }));
    setMessage('');
  };

  const toggle = key => setVisible(current => ({ ...current, [key]: !current[key] }));

  const submit = event => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.current) nextErrors.current = 'Enter your current password.';
    if (form.next.length < 8) nextErrors.next = 'Use at least 8 characters.';
    if (!/[a-z]/.test(form.next) || !/[A-Z]/.test(form.next) || !/\d/.test(form.next))
      nextErrors.next = 'Include upper and lowercase letters and a number.';
    if (form.next !== form.confirm) nextErrors.confirm = 'Passwords must match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setForm(empty);
    setMessage(
      'Password changes need the account service, which is not connected in this preview. Nothing was submitted or stored.',
    );
  };

  const eye = key =>
    visible[key] ? (
      <button type="button" className="acct-eye" onClick={() => toggle(key)} aria-label="Hide password">
        <EyeOff size={16} />
      </button>
    ) : (
      <button type="button" className="acct-eye" onClick={() => toggle(key)} aria-label="Show password">
        <Eye size={16} />
      </button>
    );

  return (
    <div className="acct-stack">
      <SectionCard
        title="Change password"
        description="Passwords are never stored in this browser."
      >
        <form onSubmit={submit} noValidate className="acct-stack-sm">
          <div className="acct-form-grid">
            <TextField
              label="Current password"
              type={visible.current ? 'text' : 'password'}
              required
              value={form.current}
              onChange={value => update('current', value)}
              error={errors.current}
              autoComplete="current-password"
            >
              {eye('current')}
            </TextField>
            <div />
            <TextField
              label="New password"
              type={visible.next ? 'text' : 'password'}
              required
              value={form.next}
              onChange={value => update('next', value)}
              error={errors.next}
              hint="8+ characters with upper and lowercase letters and a number."
              autoComplete="new-password"
            >
              {eye('next')}
            </TextField>
            <TextField
              label="Confirm new password"
              type={visible.confirm ? 'text' : 'password'}
              required
              value={form.confirm}
              onChange={value => update('confirm', value)}
              error={errors.confirm}
              autoComplete="new-password"
            >
              {eye('confirm')}
            </TextField>
          </div>
          <div className="acct-form-footer">
            <button type="submit" className="acct-btn primary">
              Update password
            </button>
          </div>
          {message && (
            <Notice title="Not connected yet" tone="warning">
              {message}
            </Notice>
          )}
        </form>
      </SectionCard>

      <SectionCard title="Connected accounts" description="Sign-in providers linked to your account.">
        <div className="acct-provider-row">
          <div>
            <b>Google</b>
            <small>No Google account is connected. Sign-in with Google is not available in this preview.</small>
          </div>
          <Badge tone="muted">Not connected</Badge>
          <button type="button" className="acct-btn ghost" disabled>
            Connect Google
          </button>
        </div>
        <p className="acct-fineprint">
          <CircleHelp size={14} /> Connecting an account requires the authentication service.
        </p>
      </SectionCard>

      <SectionCard title="Active sessions" description="Devices that can reach your account.">
        <div className="acct-session-row">
          <span className="acct-session-icon">
            <Laptop size={18} />
          </span>
          <div>
            <b>This browser</b>
            <small>Preview session · this device only</small>
          </div>
          <Badge tone="brand">Current</Badge>
        </div>
        <p className="acct-fineprint">
          <ShieldCheck size={14} /> Session history and remote sign-out arrive with the account
          service.
        </p>
        <div className="acct-form-footer">
          <button type="button" className="acct-btn ghost danger-text" onClick={() => setSignOutOpen(true)}>
            <LogOut size={15} /> Sign out of all devices
          </button>
        </div>
        {signOutMessage && <Notice tone="warning">{signOutMessage}</Notice>}
      </SectionCard>

      <ConfirmDialog
        open={signOutOpen}
        title="Sign out of all devices?"
        message="This preview has no account service, so no other sessions can be ended. You can still clear the demo account data saved in this browser."
        confirmLabel="Continue"
        tone="primary"
        onConfirm={() => {
          setSignOutOpen(false);
          setSignOutMessage(
            'Signing out of other devices is not available yet. Nothing was changed.',
          );
        }}
        onClose={() => setSignOutOpen(false)}
      />
    </div>
  );
}
