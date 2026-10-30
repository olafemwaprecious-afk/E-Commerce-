import React, { useState } from 'react';
import { ClipboardList, Eye, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { useShop } from '../shop-context';
import { money } from '../data';
import {
  formatAddress,
  formatDate,
  formatNgPhone,
  orderCounts,
  ORDER_STATUS_META,
} from '../services/account';
import {
  DisputeStatusBadge,
  FulfilmentStatusBadge,
  OrderStatusBadge,
  PaymentStatusBadge,
  SettlementStatusBadge,
} from './OrderStatus';
import { Badge, Dialog, EmptyState, PanelHeader, SectionCard } from './ui';

const FILTERS = [
  { id: 'all', label: 'All orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'dispatched', label: 'Dispatched' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'refunded', label: 'Refunded' },
];

export default function OrderHistory() {
  const { orders } = useAccount();
  const { go } = useShop();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const counts = orderCounts(orders);
  const visible = filter === 'all' ? orders : orders.filter(order => order.status === filter);

  return (
    <div className="acct-stack">
      <PanelHeader
        title="My orders"
        description="Order requests you have submitted, with their current status."
      />

      <div className="acct-filter-row" role="tablist" aria-label="Filter orders">
        {FILTERS.map(item => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={filter === item.id ? 'active' : ''}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
            <span>{counts[item.id]}</span>
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={38} />}
          title="No orders yet"
          description="When you place an order request, you can follow its status here. Nothing is invented — this space stays empty until you check out."
          action={
            <button type="button" className="acct-btn primary" onClick={() => go('/shop')}>
              Start shopping
            </button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={32} />}
          title={`No ${ORDER_STATUS_META[filter]?.label.toLowerCase() || filter} orders`}
          description="Try another filter to see your other order requests."
          action={
            <button type="button" className="acct-btn ghost" onClick={() => setFilter('all')}>
              Show all orders
            </button>
          }
        />
      ) : (
        <div className="acct-order-list">
          {visible.map(order => (
            <article key={order.id} className="acct-order-card">
              <header className="acct-order-head">
                <div>
                  <b>{order.reference}</b>
                  <small>
                    Placed {formatDate(order.createdAt)} · {order.items.reduce((sum, item) => sum + item.qty, 0)} item(s)
                  </small>
                </div>
                <OrderStatusBadge status={order.status} />
              </header>

              <div className="acct-order-items">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={`${order.id}-${item.productId}-${index}`} className="acct-order-item">
                    <img src={item.image} alt="" />
                    <div>
                      <b>{item.name}</b>
                      <small>
                        {item.variation ? `${item.variation} · ` : ''}Qty {item.qty}
                      </small>
                    </div>
                    <span>{money(item.price * item.qty)}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <small className="muted">+{order.items.length - 3} more item(s)</small>
                )}
              </div>

              <div className="acct-order-meta">
                <span>
                  <Truck size={15} /> {formatAddress(order.address) || 'No delivery address recorded'}
                </span>
                <span>
                  <ShieldCheck size={15} /> {order.paymentMethod || 'Payment method not set'}
                </span>
              </div>

              <footer className="acct-order-foot">
                <div>
                  <small>Order total</small>
                  <b>{money(order.total)}</b>
                </div>
                <button type="button" className="acct-btn ghost" onClick={() => setSelected(order)}>
                  <Eye size={15} /> View order details
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <p className="acct-fineprint">
          Payment, fulfilment, dispute and settlement details are tracked separately. Buyer Protection
          stages will appear once that service is connected.
        </p>
      )}

      <OrderDetails order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export function OrderDetails({ order, onClose }) {
  if (!order) return null;
  return (
    <Dialog
      open
      wide
      title={`Order ${order.reference}`}
      description={`Placed ${formatDate(order.createdAt)}`}
      onClose={onClose}
      footer={
        <button type="button" className="acct-btn primary" onClick={onClose}>
          Close
        </button>
      }
    >
      <div className="acct-stack-sm">
        <div className="acct-status-grid">
          <div>
            <small>Order status</small>
            <OrderStatusBadge status={order.status} />
          </div>
          <div>
            <small>Payment</small>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
          <div>
            <small>Fulfilment</small>
            <FulfilmentStatusBadge status={order.fulfilmentStatus} />
          </div>
          <div>
            <small>Dispute</small>
            <DisputeStatusBadge status={order.disputeStatus} />
          </div>
          <div>
            <small>Merchant settlement</small>
            <SettlementStatusBadge status={order.settlementStatus} />
          </div>
        </div>

        <SectionCard title="Items">
          <div className="acct-order-items">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="acct-order-item">
                <img src={item.image} alt="" />
                <div>
                  <b>{item.name}</b>
                  <small>
                    {item.variation ? `${item.variation} · ` : ''}Qty {item.qty} · {money(item.price)} each
                  </small>
                </div>
                <span>{money(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="acct-detail-columns">
          <SectionCard title="Delivery">
            {order.address ? (
              <div className="acct-address-block">
                <Badge tone="brand">{order.address.label}</Badge>
                <b>{order.address.fullName}</b>
                <p>{formatNgPhone(order.address.phone)}</p>
                <p>{formatAddress(order.address)}</p>
                <p>{order.address.state}, Nigeria</p>
                {order.address.instructions && (
                  <p className="acct-address-note">
                    <MapPin size={14} /> {order.address.instructions}
                  </p>
                )}
              </div>
            ) : (
              <p className="muted">No delivery address was recorded for this request.</p>
            )}
          </SectionCard>

          <SectionCard title="Payment summary">
            <dl className="acct-summary-list">
              <div>
                <dt>Payment method</dt>
                <dd>{order.paymentMethod || 'Not selected'}</dd>
              </div>
              <div>
                <dt>Subtotal</dt>
                <dd>{money(order.subtotal)}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>{order.delivery ? money(order.delivery) : 'FREE'}</dd>
              </div>
              <div className="total">
                <dt>Total</dt>
                <dd>{money(order.total)}</dd>
              </div>
            </dl>
            <p className="acct-fineprint">{order.note}</p>
          </SectionCard>
        </div>

        <SectionCard title="Buyer Protection">
          <p className="acct-body-text">
            Payment protection, fund holding, acceptance and settlement stages are part of the next
            SHOP SPRINT Buyer Protection phase. No protection status is claimed for this request yet.
          </p>
        </SectionCard>
      </div>
    </Dialog>
  );
}
