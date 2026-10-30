import React from 'react';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { NOTIFICATION_CHANNELS, NOTIFICATION_ITEMS } from '../services/account';
import { Notice, SectionCard } from './ui';

const channelMeta = {
  inApp: { Icon: Bell, label: 'In-app' },
  email: { Icon: Mail, label: 'Email' },
  sms: { Icon: MessageSquare, label: 'SMS' },
  push: { Icon: Smartphone, label: 'Push' },
};

export default function NotificationSettings() {
  const { preferences, setNotification } = useAccount();
  const notifications = preferences.notifications;

  return (
    <div className="acct-stack">
      <SectionCard
        title="Notification preferences"
        description="Choose what you hear about and where it arrives."
      >
        <Notice title="Channels in this preview">
          In-app preferences apply immediately on this device. Email, SMS and push delivery need
          notification providers that are not connected, so nothing is sent yet.
        </Notice>

        <div className="acct-notify-table" role="table" aria-label="Notification preferences">
          <div className="acct-notify-head" role="row">
            <span role="columnheader">Notification</span>
            {NOTIFICATION_CHANNELS.map(channel => {
              const { Icon } = channelMeta[channel.key];
              return (
                <span key={channel.key} role="columnheader">
                  <Icon size={14} aria-hidden="true" /> {channel.label}
                </span>
              );
            })}
          </div>

          {NOTIFICATION_ITEMS.map(item => (
            <div className="acct-notify-row" role="row" key={item.key}>
              <div role="rowheader" className="acct-notify-label">
                <b>{item.label}</b>
                <small>{item.description}</small>
              </div>
              {NOTIFICATION_CHANNELS.map(channel => (
                <label key={channel.key} className="acct-mini-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(notifications[item.key]?.[channel.key])}
                    onChange={event => setNotification(item.key, channel.key, event.target.checked)}
                    aria-label={`${item.label} — ${channel.label}`}
                  />
                  <span aria-hidden="true">
                    <i />
                  </span>
                  <em>{channel.label}</em>
                </label>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Marketing communications" description="Promotions, price drops and wishlist alerts.">
        <p className="acct-body-text">
          These are the marketing rows in the table above. Turning off email and SMS here does not
          cancel anything, because no marketing messages are being sent from this preview.
        </p>
      </SectionCard>
    </div>
  );
}
