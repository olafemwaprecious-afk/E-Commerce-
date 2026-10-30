import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserRound,
  MapPin,
  Package,
  Heart,
  Clock3,
  Star,
  Headphones,
  Settings as SettingsIcon,
  ChevronRight,
} from 'lucide-react';
import { useAccount } from './AccountProvider';
import AccountOverview from './AccountOverview';
import PersonalInformation from './PersonalInformation';
import AddressBook from './AddressBook';
import OrderHistory from './OrderHistory';
import { SavedProductsPanel, RecentlyViewedPanel } from './AccountProducts';
import ReviewsPanel from './ReviewsPanel';
import SupportPanel from './SupportPanel';
import AccountSettings from './AccountSettings';
import './account.css';

export const ACCOUNT_TABS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'personal', label: 'Personal Information', Icon: UserRound },
  { id: 'addresses', label: 'Address Book', Icon: MapPin },
  { id: 'orders', label: 'My Orders', Icon: Package },
  { id: 'saved', label: 'Saved Products', Icon: Heart },
  { id: 'recent', label: 'Recently Viewed', Icon: Clock3 },
  { id: 'reviews', label: 'Reviews', Icon: Star },
  { id: 'support', label: 'Support', Icon: Headphones },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

const tabFromPath = pathname => {
  const slug = pathname.split('/').filter(Boolean).pop();
  if (pathname.startsWith('/orders')) return 'orders';
  return ACCOUNT_TABS.some(tab => tab.id === slug) ? slug : 'overview';
};

export default function AccountCentre() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { profile } = useAccount();
  const [tab, setTab] = useState(() => tabFromPath(loc.pathname));

  useEffect(() => {
    setTab(tabFromPath(loc.pathname));
  }, [loc.pathname]);

  const selectTab = id => {
    setTab(id);
    navigate(id === 'overview' ? '/account' : `/account/${id}`);
  };

  const firstName = profile.name.trim().split(/\s+/)[0];

  return (
    <div className="wrap page acct-shell">
      <div className="breadcrumb">
        <Link to="/shop">Home</Link> /{' '}
        {tab === 'overview' ? 'My Account' : ACCOUNT_TABS.find(t => t.id === tab)?.label}
      </div>

      <header className="acct-heading">
        <div>
          <h1>{firstName ? `Hi, ${firstName}` : 'My Account'}</h1>
          <p>Your details, deliveries and shopping preferences in one place.</p>
        </div>
        <span className="acct-demo-tag">Demo account · saved on this device</span>
      </header>

      <div className="acct-layout">
        <aside className="acct-sidebar">
          <nav className="acct-nav" aria-label="Account sections">
            {ACCOUNT_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className={tab === id ? 'active' : ''}
                aria-current={tab === id ? 'page' : undefined}
                onClick={() => selectTab(id)}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
                <ChevronRight size={15} className="acct-nav-chevron" aria-hidden="true" />
              </button>
            ))}
          </nav>
          <div className="acct-sidebar-help">
            <Headphones size={18} aria-hidden="true" />
            <div>
              <b>Need a hand?</b>
              <p>Browse the help centre or contact support.</p>
              <button type="button" onClick={() => selectTab('support')}>
                Get support
              </button>
            </div>
          </div>
        </aside>

        <section className="acct-content" aria-live="polite">
          {tab === 'overview' && <AccountOverview onNavigate={selectTab} />}
          {tab === 'personal' && <PersonalInformation />}
          {tab === 'addresses' && <AddressBook />}
          {tab === 'orders' && <OrderHistory />}
          {tab === 'saved' && <SavedProductsPanel />}
          {tab === 'recent' && <RecentlyViewedPanel />}
          {tab === 'reviews' && <ReviewsPanel />}
          {tab === 'support' && <SupportPanel />}
          {tab === 'settings' && <AccountSettings />}
        </section>
      </div>
    </div>
  );
}
