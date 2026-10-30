import React, { useState } from 'react';
import {
  Bell,
  CreditCard,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Accessibility,
} from 'lucide-react';
import PersonalInformation from './PersonalInformation';
import LoginSecurity from './LoginSecurity';
import NotificationSettings from './NotificationSettings';
import PaymentPreferences from './PaymentPreferences';
import ShoppingPreferences from './ShoppingPreferences';
import PrivacySettings from './PrivacySettings';
import AccessibilitySettings from './AccessibilitySettings';
import LanguageSettings from './LanguageSettings';
import { PanelHeader } from './ui';

const SECTIONS = [
  { id: 'account', label: 'Account preferences', Icon: UserRound, description: 'Name, email, phone and photo' },
  { id: 'security', label: 'Login & security', Icon: LockKeyhole, description: 'Password and sessions' },
  { id: 'notifications', label: 'Notifications', Icon: Bell, description: 'What you hear about' },
  { id: 'payments', label: 'Payment preferences', Icon: CreditCard, description: 'Preferred payment method' },
  { id: 'shopping', label: 'Shopping preferences', Icon: SlidersHorizontal, description: 'Categories, brands and sizes' },
  { id: 'privacy', label: 'Privacy & data', Icon: ShieldCheck, description: 'Privacy and account data' },
  { id: 'accessibility', label: 'Accessibility', Icon: Accessibility, description: 'Motion, text size and theme' },
  { id: 'region', label: 'Language & region', Icon: Globe2, description: 'Nigeria, NGN and English' },
];

export default function AccountSettings() {
  const [section, setSection] = useState('account');
  const active = SECTIONS.find(item => item.id === section);

  return (
    <div className="acct-stack">
      <PanelHeader
        title="Settings"
        description="Control your account preferences, notifications and privacy."
      />

      <nav className="acct-subnav" aria-label="Settings sections">
        {SECTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={section === id ? 'active' : ''}
            aria-current={section === id ? 'true' : undefined}
            onClick={() => setSection(id)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <div className="acct-subsection">
        <div className="acct-subsection-head">
          <h3>{active?.label}</h3>
          <p>{active?.description}</p>
        </div>

        {section === 'account' && <PersonalInformation embedded />}
        {section === 'security' && <LoginSecurity />}
        {section === 'notifications' && <NotificationSettings />}
        {section === 'payments' && <PaymentPreferences />}
        {section === 'shopping' && <ShoppingPreferences />}
        {section === 'privacy' && <PrivacySettings />}
        {section === 'accessibility' && <AccessibilitySettings />}
        {section === 'region' && <LanguageSettings />}
      </div>
    </div>
  );
}
