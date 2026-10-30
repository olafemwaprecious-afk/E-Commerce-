import React from 'react';
import { CreditCard, ShieldCheck, Plus } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { PAYMENT_METHODS } from '../services/account';
import { Badge, EmptyState, Notice, SectionCard } from './ui';

export default function PaymentPreferences() {
  const { preferences, updatePreferences } = useAccount();
  const preferred = preferences.payments.preferredMethod;

  return (
    <div className="acct-stack">
      <SectionCard title="Preferred payment method" description="Used as the default at checkout.">
        <div className="acct-choice-list" role="radiogroup" aria-label="Preferred payment method">
          {PAYMENT_METHODS.map(method => (
            <label
              key={method.id}
              className={`acct-choice${method.available ? '' : ' is-disabled'}`}
            >
              <input
                type="radio"
                name="preferred-payment"
                checked={preferred === method.id}
                disabled={!method.available}
                onChange={() => updatePreferences('payments', { preferredMethod: method.id })}
              />
              <span>
                <b>{method.label}</b>
                <small>{method.description}</small>
              </span>
              {!method.available && <Badge tone="muted">Unavailable</Badge>}
            </label>
          ))}
        </div>
        <Notice title="No payment provider connected">
          Payment preferences are saved on this device only. No payment is taken, held or verified in
          this preview.
        </Notice>
      </SectionCard>

      <SectionCard title="Saved payment methods" description="Cards and bank accounts are never stored here.">
        <EmptyState
          icon={<CreditCard size={30} />}
          title="No saved payment methods"
          description="Saved cards, bank accounts and payment providers are not connected yet. SHOP SPRINT does not collect card numbers or CVVs in this preview."
          action={
            <button type="button" className="acct-btn ghost" disabled>
              <Plus size={15} /> Add payment method
            </button>
          }
        />
      </SectionCard>

      <SectionCard title="Payment safety" description="What you can expect from SHOP SPRINT.">
        <ul className="acct-check-list">
          <li>
            <ShieldCheck size={16} /> Card details, CVVs and bank passwords are never collected by this
            app.
          </li>
          <li>
            <ShieldCheck size={16} /> Payment protection and fund holding are part of the next Buyer
            Protection phase.
          </li>
          <li>
            <ShieldCheck size={16} /> Checkout keeps the existing protection section unchanged.
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
