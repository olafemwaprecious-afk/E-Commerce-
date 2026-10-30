import React, { useState } from 'react';
import { Database, Download, ShieldAlert, Trash2 } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { formatDate } from '../services/account';
import { Badge, ConfirmDialog, Notice, SectionCard, Toggle } from './ui';

export default function PrivacySettings() {
  const { preferences, updatePreferences, requests, requestDataCopy, requestDeletion, cancelDeletion } =
    useAccount();
  const privacy = preferences.privacy;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="acct-stack">
      <SectionCard title="Privacy preferences" description="What SHOP SPRINT may use your data for.">
        <Toggle
          label="Use my activity for recommendations"
          description="Recently viewed products and preferences on this device."
          checked={privacy.useHistoryForRecommendations}
          onChange={value => updatePreferences('privacy', { useHistoryForRecommendations: value })}
        />
        <Toggle
          label="Share shopping preferences with merchants"
          description="Off by default. Nothing is shared with merchants in this preview."
          checked={privacy.shareWithMerchants}
          onChange={value => updatePreferences('privacy', { shareWithMerchants: value })}
        />
        <Toggle
          label="Allow analytics"
          description="Anonymous usage analytics. No analytics provider is connected."
          checked={privacy.allowAnalytics}
          onChange={value => updatePreferences('privacy', { allowAnalytics: value })}
        />
      </SectionCard>

      <SectionCard title="Your account data" description="What is stored, and where.">
        <p className="acct-body-text">
          <Database size={15} /> This demo stores your account details, addresses, preferences, order
          requests and reviews in this browser only. There is no account database, so nothing is
          shared with a server.
        </p>
        <div className="acct-data-row">
          <div>
            <b>Request a copy of my data</b>
            <small>
              {requests.export
                ? `Request noted ${formatDate(requests.export.requestedAt)}. No export has been produced.`
                : 'Adds a request note on this device.'}
            </small>
          </div>
          {requests.export && <Badge tone="warning">Requested</Badge>}
          <button type="button" className="acct-btn ghost" onClick={requestDataCopy}>
            <Download size={15} /> {requests.export ? 'Request noted' : 'Request data copy'}
          </button>
        </div>
        {requests.export && (
          <Notice title="Nothing has been exported" tone="warning">
            A real data export needs the account service. Your demo data is still only in this
            browser, and no file was generated.
          </Notice>
        )}
      </SectionCard>

      <SectionCard title="Delete account" description="Request permanent deletion of your account data.">
        <p className="acct-body-text">
          <ShieldAlert size={15} /> In this preview, a deletion request is recorded on this device. It
          does not remove your saved addresses, preferences or order requests automatically, and no
          account database is touched.
        </p>
        {requests.deletion ? (
          <div className="acct-data-row is-warning">
            <div>
              <b>Deletion request noted</b>
              <small>{formatDate(requests.deletion.requestedAt)} · awaiting the account service</small>
            </div>
            <Badge tone="warning">Requested</Badge>
            <button type="button" className="acct-btn ghost" onClick={cancelDeletion}>
              Cancel request
            </button>
          </div>
        ) : (
          <div className="acct-form-footer">
            <button type="button" className="acct-btn danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={15} /> Request account deletion
            </button>
          </div>
        )}
      </SectionCard>

      <ConfirmDialog
        open={deleteOpen}
        title="Request account deletion?"
        message="Deletion is permanent once processed by the account service. In this preview the request is only noted on this device, and nothing is deleted."
        confirmLabel="Submit deletion request"
        confirmDisabled={!acknowledged}
        onConfirm={() => {
          if (!acknowledged) return;
          requestDeletion();
          setDeleteOpen(false);
          setAcknowledged(false);
        }}
        onClose={() => {
          setDeleteOpen(false);
          setAcknowledged(false);
        }}
      >
        <label className="acct-checkbox">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={event => setAcknowledged(event.target.checked)}
          />
          <span>I understand that a deletion request cannot be undone once processed.</span>
        </label>
        {!acknowledged && <small className="acct-hint">Tick the box to enable the request.</small>}
      </ConfirmDialog>
    </div>
  );
}
