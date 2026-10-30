import React from 'react';
import { Badge } from './ui';
import {
  DISPUTE_STATUS_META,
  FULFILMENT_STATUS_META,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  SETTLEMENT_STATUS_META,
} from '../services/account';

// Order, payment, fulfilment, dispute and settlement statuses stay separate so
// the Buyer Protection phase can add its own stages without mixing concerns.
const pill = (meta, fallback) => {
  const entry = meta || fallback;
  return <Badge tone={entry.tone}>{entry.label}</Badge>;
};

export const OrderStatusBadge = ({ status }) =>
  pill(ORDER_STATUS_META[status], { label: 'Status unavailable', tone: 'muted' });

export const PaymentStatusBadge = ({ status }) =>
  pill(PAYMENT_STATUS_META[status], { label: 'Payment status unavailable', tone: 'muted' });

export const FulfilmentStatusBadge = ({ status }) =>
  pill(FULFILMENT_STATUS_META[status], { label: 'Fulfilment status unavailable', tone: 'muted' });

export const DisputeStatusBadge = ({ status }) =>
  pill(DISPUTE_STATUS_META[status], { label: 'Dispute status unavailable', tone: 'muted' });

export const SettlementStatusBadge = ({ status }) =>
  pill(SETTLEMENT_STATUS_META[status], { label: 'Settlement status unavailable', tone: 'muted' });
