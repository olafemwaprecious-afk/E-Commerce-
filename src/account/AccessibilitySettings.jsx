import React from 'react';
import { Accessibility, MonitorPlay, Sun } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { Notice, SectionCard } from './ui';

export default function AccessibilitySettings() {
  const { preferences, updatePreferences } = useAccount();
  const { reducedMotion, textSize } = preferences.accessibility;

  return (
    <div className="acct-stack">
      <SectionCard title="Motion" description="Reduce animation across the marketplace.">
        <div className="acct-choice-list" role="radiogroup" aria-label="Reduced motion">
          {[
            { value: 'system', label: 'Follow my device', description: 'Use the reduced-motion setting from your operating system.' },
            { value: 'reduce', label: 'Reduce motion', description: 'Turn off decorative animation, transitions and smooth scrolling.' },
          ].map(option => (
            <label key={option.value} className="acct-choice">
              <input
                type="radio"
                name="reduced-motion"
                checked={reducedMotion === option.value}
                onChange={() => updatePreferences('accessibility', { reducedMotion: option.value })}
              />
              <span>
                <b>{option.label}</b>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </div>
        <p className="acct-fineprint">
          <MonitorPlay size={14} /> Respecting the device setting is the default and stays in sync with
          your operating system.
        </p>
      </SectionCard>

      <SectionCard title="Text size" description="Slightly larger text for account screens.">
        <div className="acct-choice-list" role="radiogroup" aria-label="Text size">
          {[
            { value: 'default', label: 'Default', description: 'The standard SHOP SPRINT text size.' },
            { value: 'large', label: 'Larger', description: 'Increases text size on account screens.' },
          ].map(option => (
            <label key={option.value} className="acct-choice">
              <input
                type="radio"
                name="text-size"
                checked={textSize === option.value}
                onChange={() => updatePreferences('accessibility', { textSize: option.value })}
              />
              <span>
                <b>{option.label}</b>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Theme" description="SHOP SPRINT currently ships one light theme.">
        <div className="acct-choice is-disabled">
          <input type="radio" checked readOnly aria-label="Light theme" />
          <span>
            <b>
              <Sun size={15} /> Light
            </b>
            <small>Dark mode is not available yet, so no other theme is offered.</small>
          </span>
        </div>
        <Notice tone="info">
          Your browser and operating system theme settings are always respected by the app.
        </Notice>
      </SectionCard>

      <SectionCard title="Accessibility support">
        <p className="acct-body-text">
          <Accessibility size={15} /> All account controls are keyboard reachable with visible focus
          states, and dialogs close with the Escape key. If something is hard to use, tell us through
          Support.
        </p>
      </SectionCard>
    </div>
  );
}
