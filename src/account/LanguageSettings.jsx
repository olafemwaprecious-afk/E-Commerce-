import React from 'react';
import { Globe2 } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { Notice, SectionCard } from './ui';

const rows = [
  { key: 'country', label: 'Country', value: 'Nigeria', help: 'Delivery addresses and phone numbers use Nigerian formats.' },
  { key: 'currency', label: 'Currency', value: 'NGN (₦)', help: 'Prices are shown in Nigerian Naira. Exchange-rate conversion is not connected.' },
  { key: 'region', label: 'Region', value: 'Nigeria', help: 'The region used for delivery estimates and catalogue availability.' },
  { key: 'language', label: 'Language', value: 'English', help: 'The storefront is currently available in English only.' },
];

export default function LanguageSettings() {
  const { preferences } = useAccount();
  return (
    <div className="acct-stack">
      <SectionCard
        title="Language & region"
        description="SHOP SPRINT is set up for shopping in Nigeria."
      >
        <dl className="acct-summary-list">
          {rows.map(row => (
            <div key={row.key}>
              <dt>{row.label}</dt>
              <dd>
                <b>{preferences.region[row.key] || row.value}</b>
                <small>{row.help}</small>
              </dd>
            </div>
          ))}
        </dl>
        <Notice tone="info" title="Fixed for this preview">
          Only Nigeria, NGN and English are supported. Unsupported currencies are not offered, and no
          exchange-rate service is connected.
        </Notice>
      </SectionCard>

      <SectionCard title="About regional settings">
        <p className="acct-body-text">
          <Globe2 size={15} /> Delivery coverage and costs depend on your address and the products in
          your cart. Nothing in this preview promises coverage for every location.
        </p>
      </SectionCard>
    </div>
  );
}
