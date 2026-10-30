import React from 'react';
import { Heart, ShoppingCart, Eye, Clock3 } from 'lucide-react';
import { useShop } from '../shop-context';
import { products, money } from '../data';
import { EmptyState, PanelHeader } from './ui';

function AccountProductRow({ product, saved }) {
  const { open, add, toggle } = useShop();
  return (
    <article className="acct-product-row">
      <button type="button" className="acct-product-image" onClick={() => open(product)} aria-label={`Quick view ${product.name}`}>
        <img src={product.image} alt={product.name} />
      </button>
      <div className="acct-product-info">
        <small>{product.brand}</small>
        <b>{product.name}</b>
        <div className="acct-product-price">
          <strong>{money(product.price)}</strong>
          {product.oldPrice && <del>{money(product.oldPrice)}</del>}
        </div>
        <div className="acct-badge-row">
          <span className="acct-badge tone-muted">{product.category}</span>
          {product.freeShipping && <span className="acct-badge tone-success">Free shipping</span>}
        </div>
      </div>
      <div className="acct-product-actions">
        <button type="button" className="acct-btn ghost" onClick={() => open(product)}>
          <Eye size={15} /> Quick view
        </button>
        <button type="button" className="acct-btn primary" onClick={() => add(product)}>
          <ShoppingCart size={15} /> Add to cart
        </button>
        {saved && (
          <button type="button" className="acct-btn ghost danger-text" onClick={() => toggle(product.id)}>
            <Heart size={15} /> Remove
          </button>
        )}
      </div>
    </article>
  );
}

export function SavedProductsPanel() {
  const { saved, go } = useShop();
  const list = products.filter(product => saved.includes(product.id));
  return (
    <div className="acct-stack">
      <PanelHeader
        title="Saved products"
        description={list.length ? `${list.length} item(s) saved on this device.` : 'Products you save appear here.'}
        action={
          <button type="button" className="acct-btn ghost" onClick={() => go('/saved')}>
            Open wishlist page
          </button>
        }
      />
      {list.length ? (
        <div className="acct-product-list">
          {list.map(product => (
            <AccountProductRow key={product.id} product={product} saved />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart size={34} />}
          title="No saved products yet"
          description="Tap the heart on any product to keep it here."
          action={
            <button type="button" className="acct-btn primary" onClick={() => go('/categories')}>
              Discover products
            </button>
          }
        />
      )}
    </div>
  );
}

export function RecentlyViewedPanel() {
  const { recent, go } = useShop();
  const list = recent.map(id => products.find(product => product.id === id)).filter(Boolean);
  return (
    <div className="acct-stack">
      <PanelHeader
        title="Recently viewed"
        description={
          list.length
            ? 'Products you opened recently in this session.'
            : 'Products you open in quick view appear here.'
        }
      />
      {list.length ? (
        <div className="acct-product-list">
          {list.map(product => (
            <AccountProductRow key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Clock3 size={34} />}
          title="Nothing viewed yet"
          description="Open any product to see it in this list."
          action={
            <button type="button" className="acct-btn primary" onClick={() => go('/categories')}>
              Browse products
            </button>
          }
        />
      )}
    </div>
  );
}
