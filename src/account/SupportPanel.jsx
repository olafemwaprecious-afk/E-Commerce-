import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  HelpCircle,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import { useAccount } from './AccountProvider';
import { formatDate } from '../services/account';
import { Badge, Notice, PanelHeader, SectionCard } from './ui';

const FAQS = [
  {
    q: 'How do I follow my order?',
    a: 'Order requests saved on this device appear in My Orders, where you can open the full details for each request.',
  },
  {
    q: 'When is free delivery available?',
    a: 'Free delivery depends on the product and destination shown at checkout. It is never unlocked by making a payment.',
  },
  {
    q: 'How do returns work?',
    a: 'Eligible items can be returned under the returns policy. Read the returns page for the conditions that apply.',
  },
  {
    q: 'Is my payment protected?',
    a: 'Buyer Protection is being built as a separate phase. This preview does not hold funds or process payments.',
  },
];

const TOPICS = [
  'Order question',
  'Delivery issue',
  'Report a problem',
  'Return or refund',
  'Payment question',
  'Account help',
];

export default function SupportPanel() {
  const { orders } = useAccount();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const submit = event => {
    event.preventDefault();
    const nextErrors = {};
    if (message.trim().length < 15) nextErrors.message = 'Add a few details so we understand the issue.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus(
      'Support messaging is not connected in this preview, so nothing was sent. Your message stays on this page.',
    );
  };

  return (
    <div className="acct-stack">
      <PanelHeader
        title="Support"
        description="Find answers, report a problem or prepare an order question."
        action={
          <Link className="acct-btn ghost" to="/support">
            Open help centre <ArrowUpRight size={15} />
          </Link>
        }
      />

      <div className="acct-support-grid">
        <Link to="/support" className="acct-support-card">
          <HelpCircle size={20} />
          <b>Help centre</b>
          <p>Browse guidance for shopping, delivery and your account.</p>
          <span>Visit help centre →</span>
        </Link>
        <Link to="/support/protection" className="acct-support-card">
          <ShieldCheck size={20} />
          <b>Buyer Protection</b>
          <p>What protection means today, and what the next phase will add.</p>
          <span>Read about protection →</span>
        </Link>
        <Link to="/support/returns" className="acct-support-card">
          <RotateCcw size={20} />
          <b>Returns & refunds</b>
          <p>Return conditions, refund timelines and eligibility.</p>
          <span>Read the policy →</span>
        </Link>
        <Link to="/support/shipping" className="acct-support-card">
          <Truck size={20} />
          <b>Shipping & delivery</b>
          <p>Delivery estimates and how free delivery is decided.</p>
          <span>Read about delivery →</span>
        </Link>
      </div>

      <SectionCard
        title="Order-related support"
        description="Start from an order request so nothing has to be retyped."
      >
        {orders.length ? (
          <ul className="acct-order-support-list">
            {orders.map(order => (
              <li key={order.id}>
                <div>
                  <b>{order.reference}</b>
                  <small>
                    {formatDate(order.createdAt)} · {order.items[0]?.name || 'Order items'}
                  </small>
                </div>
                <Badge tone="info">Processing</Badge>
                <button
                  type="button"
                  className="acct-btn ghost"
                  onClick={() => {
                    setOrderId(order.id);
                    setTopic('Order question');
                    document.getElementById('support-message')?.focus();
                  }}
                >
                  Ask about this order
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="acct-body-text muted">
            No order requests yet. Once you check out, your orders will appear here with a shortcut to
            support.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Contact support" description="Tell us what happened and we will route it correctly.">
        <form onSubmit={submit} noValidate className="acct-stack-sm">
          <div className="acct-form-grid">
            <div className="acct-field">
              <label htmlFor="support-topic">Topic</label>
              <div className="acct-input">
                <select id="support-topic" value={topic} onChange={event => setTopic(event.target.value)}>
                  {TOPICS.map(item => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="acct-field">
              <label htmlFor="support-order">Related order <small>(optional)</small></label>
              <div className="acct-input">
                <select id="support-order" value={orderId} onChange={event => setOrderId(event.target.value)}>
                  <option value="">None</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      {order.reference}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="acct-field span-2">
              <label htmlFor="support-message">
                Your message <span aria-hidden="true">*</span>
              </label>
              <div className={`acct-input${errors.message ? ' has-error' : ''}`}>
                <textarea
                  id="support-message"
                  rows={4}
                  maxLength={600}
                  value={message}
                  onChange={event => {
                    setMessage(event.target.value);
                    setErrors({});
                    setStatus('');
                  }}
                  placeholder="Describe the issue, including what you expected to happen."
                />
              </div>
              <small className="acct-hint">{message.length}/600 characters</small>
              {errors.message && <small className="acct-error">{errors.message}</small>}
            </div>
          </div>

          <div className="acct-form-footer">
            <button type="submit" className="acct-btn primary">
              <MessageSquare size={15} /> Send message
            </button>
          </div>

          {status && (
            <Notice title="Message not sent" tone="warning">
              {status}
            </Notice>
          )}
        </form>
      </SectionCard>

      <SectionCard title="Frequently asked questions">
        <div className="acct-faq">
          {FAQS.map(item => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </SectionCard>

      <div className="acct-shortcuts">
        <button type="button" className="acct-shortcut" onClick={() => setTopic('Report a problem')}>
          <AlertTriangle size={20} aria-hidden="true" />
          <span>
            <b>Report a problem</b>
            <small>Use the contact form above with the “Report a problem” topic</small>
          </span>
        </button>
        <Link to="/support/protection" className="acct-shortcut">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>
            <b>Buyer Protection information</b>
            <small>Understand what is covered and what comes next</small>
          </span>
        </Link>
      </div>
    </div>
  );
}
