import React from 'react';
import {
  UserRound,
  MapPin,
  Package,
  Heart,
  Clock3,
  Star,
  Headphones,
  Settings as SettingsIcon,
  ChevronRight,
  Plus,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import { useShop } from '../shop-context';
import { products, money } from '../data';
import { useAccount } from './AccountProvider';
import { formatAddress, profileCompletion, formatDate } from '../services/account';
import { Badge, EmptyState, SectionCard } from './ui';

const QUICK_LINKS = [
  { id: 'personal', label: 'Personal information', description: 'Name, email and phone', Icon: UserRound },
  { id: 'addresses', label: 'Address book', description: 'Delivery addresses', Icon: MapPin },
  { id: 'orders', label: 'My orders', description: 'Order requests and status', Icon: Package },
  { id: 'saved', label: 'Saved products', description: 'Your wishlist', Icon: Heart },
  { id: 'reviews', label: 'Reviews', description: 'Ratings you have written', Icon: Star },
  { id: 'settings', label: 'Settings', description: 'Notifications and privacy', Icon: SettingsIcon },
];

export default function AccountOverview({ onNavigate }) {
  const { profile, addresses, orders, defaultAddress } = useAccount();
  const { saved, recent, go, open } = useShop();
  const completion = profileCompletion(profile, addresses);
  const latest = orders[0];
  const savedProducts = products.filter(p => saved.includes(p.id));
  const recentProducts = recent
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="acct-stack">
      <section className="acct-welcome">
        <div className="acct-welcome-copy">
          <span className="acct-eyebrow">YOUR ACCOUNT</span>
          <h2>{profile.name.trim() ? `Welcome back, ${profile.name.trim().split(/\s+/)[0]}` : 'Welcome to SHOP SPRINT'}</h2>
          <p>
            {profile.name.trim()
              ? 'Pick up where you left off, or update the details we use for your deliveries.'
              : 'Add your details and a delivery address so checkout is quicker next time.'}
          </p>
          <div className="acct-welcome-actions">
            <button type="button" className="acct-btn primary" onClick={() => onNavigate('personal')}>
              {profile.name.trim() ? 'Review personal details' : 'Add personal details'}
            </button>
            <button type="button" className="acct-btn ghost" onClick={() => go('/shop')}>
              Continue shopping
            </button>
          </div>
        </div>
        <div className="acct-completion">
          <span className="acct-completion-label">Profile completeness</span>
          <div className="acct-progress" role="img" aria-label={`${completion.percent}% complete`}>
            <i style={{ width: `${completion.percent}%` }} />
          </div>
          <b>
            {completion.completed} of {completion.total} details added
          </b>
          <small>Calculated only from details saved on this device.</small>
        </div>
      </section>

      <div className="acct-quick-links">
        {QUICK_LINKS.map(({ id, label, description, Icon }) => (
          <button key={id} type="button" onClick={() => onNavigate(id)}>
            <span className="acct-quick-icon">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>
              <b>{label}</b>
              <small>{description}</small>
            </span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="acct-overview-grid">
        <SectionCard
          title="Recent order"
          description="Order requests you have submitted on this device."
          action={
            <button type="button" className="acct-link-btn" onClick={() => onNavigate('orders')}>
              View all
            </button>
          }
        >
          {latest ? (
            <button type="button" className="acct-mini-order" onClick={() => onNavigate('orders')}>
              <img src={latest.items[0]?.image} alt="" />
              <span>
                <b>{latest.reference}</b>
                <small>{formatDate(latest.createdAt)} · {latest.items.length} item(s)</small>
                <Badge tone="info">Processing</Badge>
              </span>
              <strong>{money(latest.total)}</strong>
            </button>
          ) : (
            <div className="acct-mini-empty">
              <Package size={22} aria-hidden="true" />
              <p>No orders yet. Order requests will appear here once you check out.</p>
              <button type="button" className="acct-btn ghost" onClick={() => go('/shop')}>
                Find something you love
              </button>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Delivery address"
          description="Used to prefill your next checkout."
          action={
            <button type="button" className="acct-link-btn" onClick={() => onNavigate('addresses')}>
              Manage
            </button>
          }
        >
          {defaultAddress ? (
            <div className="acct-address-mini">
              <div>
                <Badge tone="brand">{defaultAddress.label}</Badge>
                <b>{defaultAddress.fullName}</b>
                <p>{formatAddress(defaultAddress)}</p>
                <small>Default delivery address</small>
              </div>
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
          ) : (
            <div className="acct-mini-empty">
              <MapPin size={22} aria-hidden="true" />
              <p>No delivery address saved yet.</p>
              <button type="button" className="acct-btn ghost" onClick={() => onNavigate('addresses')}>
                <Plus size={15} /> Add an address
              </button>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Saved products"
          description={savedProducts.length ? `${savedProducts.length} saved item(s)` : 'Your wishlist'}
          action={
            <button type="button" className="acct-link-btn" onClick={() => onNavigate('saved')}>
              View all
            </button>
          }
        >
          {savedProducts.length ? (
            <div className="acct-thumb-row">
              {savedProducts.slice(0, 3).map(product => (
                <button key={product.id} type="button" onClick={() => open(product)} className="acct-thumb">
                  <img src={product.image} alt={product.name} />
                  <span>{money(product.price)}</span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Heart size={24} aria-hidden="true" />}
              title="No saved products"
              description="Tap the heart on any product to keep it here."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Recently viewed"
          description={recentProducts.length ? 'Pick up where you left off' : 'Products you open appear here'}
          action={
            <button type="button" className="acct-link-btn" onClick={() => onNavigate('recent')}>
              View all
            </button>
          }
        >
          {recentProducts.length ? (
            <div className="acct-thumb-row">
              {recentProducts.map(product => (
                <button key={product.id} type="button" onClick={() => open(product)} className="acct-thumb">
                  <img src={product.image} alt={product.name} />
                  <span>{money(product.price)}</span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock3 size={24} aria-hidden="true" />}
              title="Nothing viewed yet"
              description="Open a product to see it here next time."
            />
          )}
        </SectionCard>
      </div>

      <div className="acct-shortcuts">
        <button type="button" className="acct-shortcut" onClick={() => onNavigate('support')}>
          <Headphones size={20} aria-hidden="true" />
          <span>
            <b>Support</b>
            <small>Help centre, returns and Buyer Protection information</small>
          </span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
        <button type="button" className="acct-shortcut" onClick={() => onNavigate('orders')}>
          <ShoppingBag size={20} aria-hidden="true" />
          <span>
            <b>Order help</b>
            <small>Report an issue with an order request</small>
          </span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
