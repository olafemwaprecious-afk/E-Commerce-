// Account Centre data models and pure helpers.
// Everything here is local-demo state: no backend, no authentication provider
// and no payment or notification provider is connected.

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

// Local Government Area suggestions for states where the list is maintained.
// Any other state accepts a typed LGA so nothing is invented for the customer.
export const LGAS = {
  Lagos: [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu',
    'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo',
    'Oshodi-Isolo', 'Shomolu', 'Surulere',
  ],
  'FCT - Abuja': [
    'Abaji', 'Abuja Municipal (AMAC)', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali',
  ],
  Ogun: [
    'Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ewekoro', 'Ifo',
    'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne',
    'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu',
    'Ogun Waterside', 'Remo North', 'Sagamu', 'Yewa North', 'Yewa South',
  ],
  Oyo: [
    'Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North',
    'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East',
    'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North',
    'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu',
    'Ogbomosho North', 'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole',
    'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East',
    'Saki West', 'Surulere',
  ],
  Rivers: [
    'Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni',
    'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana',
    'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo',
    'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai',
  ],
  Enugu: [
    'Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu',
    'Igbo Etiti', 'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East',
    'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo Uwani',
  ],
  Anambra: [
    'Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North',
    'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North',
    'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South',
    'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North',
    'Orumba South', 'Oyi',
  ],
  Delta: [
    'Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East',
    'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South',
    'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South',
    'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani',
    'Uvwie', 'Warri North', 'Warri South', 'Warri South West',
  ],
};

export const ADDRESS_LABELS = ['Home', 'Work', 'Other'];

export const STORAGE_KEYS = {
  profile: 'ss-profile',
  addresses: 'ss-addresses',
  preferences: 'ss-preferences',
  orders: 'ss-orders',
  reviews: 'ss-reviews',
};

export function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable or full */
  }
}

export const newId = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/* ------------------------------------------------------------------ phone */

// Normalises a Nigerian number to the local 0XXXXXXXXXX form when possible.
export function normalizeNgPhone(input = '') {
  let digits = String(input).replace(/\D/g, '');
  if (digits.startsWith('234')) digits = '0' + digits.slice(3);
  else if (digits.length === 10 && /^[789]/.test(digits)) digits = '0' + digits;
  return digits;
}

export function isValidNgPhone(input = '') {
  const digits = normalizeNgPhone(input);
  return /^0[789][01]\d{8}$/.test(digits);
}

export const formatNgPhone = value => {
  const digits = normalizeNgPhone(value);
  if (!isValidNgPhone(digits)) return value ? `+234 ${digits}` : '';
  return `+234 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
};

/* ------------------------------------------------------------------ profile */

export const emptyProfile = { name: '', email: '', phone: '', photo: null };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeProfile(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    name: typeof source.name === 'string' ? source.name : '',
    email: typeof source.email === 'string' ? source.email : '',
    phone: typeof source.phone === 'string' ? source.phone : '',
    photo: typeof source.photo === 'string' ? source.photo : null,
  };
}

export function validateProfile(profile) {
  const errors = {};
  if (!profile.name.trim() || profile.name.trim().length < 2)
    errors.name = 'Enter the name you want us to use.';
  if (!emailPattern.test(profile.email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!isValidNgPhone(profile.phone))
    errors.phone = 'Enter a valid Nigerian mobile number, e.g. 0801 234 5678.';
  return errors;
}

export function profileCompletion(profile, addresses = []) {
  const checks = [
    Boolean(profile.name.trim()),
    Boolean(profile.email.trim()),
    Boolean(profile.phone.trim()),
    Boolean(profile.photo),
    addresses.length > 0,
    addresses.some(a => a.isDefault),
  ];
  return {
    completed: checks.filter(Boolean).length,
    total: checks.length,
    percent: Math.round((checks.filter(Boolean).length / checks.length) * 100),
  };
}

/* ---------------------------------------------------------------- addresses */

export function normalizeAddress(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    id: typeof source.id === 'string' && source.id ? source.id : newId('addr'),
    label: ADDRESS_LABELS.includes(source.label) ? source.label : 'Home',
    fullName: typeof source.fullName === 'string' ? source.fullName : '',
    phone: typeof source.phone === 'string' ? normalizeNgPhone(source.phone) : '',
    state: typeof source.state === 'string' ? source.state : '',
    city: typeof source.city === 'string' ? source.city : '',
    lga: typeof source.lga === 'string' ? source.lga : '',
    street: typeof source.street === 'string' ? source.street : '',
    apartment: typeof source.apartment === 'string' ? source.apartment : '',
    instructions: typeof source.instructions === 'string' ? source.instructions : '',
    isDefault: Boolean(source.isDefault),
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString(),
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : new Date().toISOString(),
  };
}

export function normalizeAddresses(value) {
  if (!Array.isArray(value)) return [];
  const list = value.map(normalizeAddress);
  if (list.length && !list.some(a => a.isDefault)) list[0].isDefault = true;
  let seenDefault = false;
  return list.map(a => {
    if (!a.isDefault) return a;
    if (seenDefault) return { ...a, isDefault: false };
    seenDefault = true;
    return a;
  });
}

export function validateAddress(address) {
  const errors = {};
  if (!address.fullName.trim() || address.fullName.trim().length < 2)
    errors.fullName = 'Enter the recipient’s full name.';
  if (!isValidNgPhone(address.phone))
    errors.phone = 'Enter a valid Nigerian mobile number.';
  if (!NIGERIAN_STATES.includes(address.state))
    errors.state = 'Choose a state.';
  if (!address.city.trim()) errors.city = 'Enter your city or town.';
  if (!address.lga.trim()) errors.lga = 'Enter your local government area.';
  if (!address.street.trim() || address.street.trim().length < 5)
    errors.street = 'Enter your street address (at least 5 characters).';
  if (address.instructions.length > 200)
    errors.instructions = 'Keep delivery instructions under 200 characters.';
  return errors;
}

export function upsertAddress(list, address) {
  const clean = normalizeAddress({ ...address, updatedAt: new Date().toISOString() });
  const exists = list.some(a => a.id === clean.id);
  let next = exists ? list.map(a => (a.id === clean.id ? clean : a)) : [...list, clean];
  if (clean.isDefault) next = next.map(a => ({ ...a, isDefault: a.id === clean.id }));
  if (!next.some(a => a.isDefault) && next.length) next[0] = { ...next[0], isDefault: true };
  return next;
}

export function removeAddress(list, id) {
  const next = list.filter(a => a.id !== id);
  if (next.length && !next.some(a => a.isDefault)) next[0] = { ...next[0], isDefault: true };
  return next;
}

export function setDefaultAddress(list, id) {
  return list.map(a => ({ ...a, isDefault: a.id === id }));
}

export function formatAddress(address) {
  if (!address) return '';
  return [address.street, address.apartment, address.city, address.lga, address.state]
    .filter(Boolean)
    .join(', ');
}

/* -------------------------------------------------------------- preferences */

export const NOTIFICATION_ITEMS = [
  { key: 'orderConfirmations', label: 'Order confirmations', description: 'When an order request is recorded.' },
  { key: 'paymentUpdates', label: 'Payment updates', description: 'Payment status and confirmation.' },
  { key: 'merchantDispatch', label: 'Merchant dispatch', description: 'When a merchant marks an item as dispatched.' },
  { key: 'deliveryUpdates', label: 'Delivery updates', description: 'Delivery progress and arrival.' },
  { key: 'refundsDisputes', label: 'Refunds & disputes', description: 'Updates on returns, disputes and refunds.' },
  { key: 'promotions', label: 'Promotions & offers', description: 'Sales and special offers.' },
  { key: 'priceDrops', label: 'Price-drop alerts', description: 'When a saved product’s price changes.' },
  { key: 'wishlistAvailability', label: 'Wishlist availability', description: 'When a saved product is back in stock.' },
];

export const NOTIFICATION_CHANNELS = [
  { key: 'inApp', label: 'In-app' },
  { key: 'email', label: 'Email' },
  { key: 'sms', label: 'SMS' },
];

const marketingKeys = ['promotions', 'priceDrops', 'wishlistAvailability'];

export const PAYMENT_METHODS = [
  {
    id: 'protected_prepayment',
    label: 'Protected prepayment',
    description: 'Pay online with purchase protection on eligible orders.',
    available: true,
  },
  {
    id: 'inspect_first',
    label: 'Inspect first, pay on delivery',
    description: 'Available for eligible items and locations.',
    available: true,
  },
  {
    id: 'saved_cards',
    label: 'Saved cards',
    description: 'Not available in this preview. Card details are never collected here.',
    available: false,
  },
  {
    id: 'bank_transfer',
    label: 'Bank transfer',
    description: 'Bank transfer details are not connected yet.',
    available: false,
  },
];

const notificationDefaults = () =>
  Object.fromEntries(
    NOTIFICATION_ITEMS.map(item => [
      item.key,
      {
        inApp: !marketingKeys.includes(item.key),
        email: false,
        sms: false,
      },
    ]),
  );

export const defaultPreferences = () => ({
  notifications: notificationDefaults(),
  payments: { preferredMethod: 'protected_prepayment' },
  shopping: {
    categories: [],
    brands: [],
    clothingSize: '',
    shoeSize: '',
    interests: '',
    recommendations: true,
  },
  privacy: {
    useHistoryForRecommendations: true,
    shareWithMerchants: false,
    allowAnalytics: false,
  },
  accessibility: { reducedMotion: 'system', textSize: 'default' },
  region: { country: 'Nigeria', currency: 'NGN', language: 'English' },
});

export function mergePreferences(value) {
  const base = defaultPreferences();
  const source = value && typeof value === 'object' ? value : {};
  const merged = {
    ...base,
    ...source,
    notifications: { ...base.notifications },
    payments: { ...base.payments, ...(source.payments || {}) },
    shopping: { ...base.shopping, ...(source.shopping || {}) },
    privacy: { ...base.privacy, ...(source.privacy || {}) },
    accessibility: { ...base.accessibility, ...(source.accessibility || {}) },
    region: { ...base.region, ...(source.region || {}) },
  };
  NOTIFICATION_ITEMS.forEach(item => {
    merged.notifications[item.key] = {
      ...base.notifications[item.key],
      ...((source.notifications && source.notifications[item.key]) || {}),
    };
  });
  return merged;
}

/* ------------------------------------------------------------------- orders */

export const ORDER_STATUSES = ['processing', 'dispatched', 'delivered', 'cancelled', 'refunded'];

export const ORDER_STATUS_META = {
  processing: { label: 'Processing', tone: 'info' },
  dispatched: { label: 'Dispatched', tone: 'info' },
  delivered: { label: 'Delivered', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
  refunded: { label: 'Refunded', tone: 'success' },
};

// Kept separate on purpose: payment, fulfilment, dispute and settlement are
// different concerns and will be driven by the Buyer Protection phase later.
export const PAYMENT_STATUS_META = {
  unconfirmed: { label: 'Payment not confirmed', tone: 'warning' },
  confirmed: { label: 'Payment confirmed', tone: 'success' },
  protected: { label: 'Funds protected', tone: 'success' },
  refunded: { label: 'Payment refunded', tone: 'success' },
};

export const FULFILMENT_STATUS_META = {
  pending: { label: 'Awaiting dispatch', tone: 'muted' },
  dispatched: { label: 'Dispatched', tone: 'info' },
  delivered: { label: 'Delivered', tone: 'success' },
};

export const DISPUTE_STATUS_META = {
  none: { label: 'No dispute', tone: 'muted' },
  opened: { label: 'Dispute opened', tone: 'warning' },
  resolved: { label: 'Dispute resolved', tone: 'success' },
};

export const SETTLEMENT_STATUS_META = {
  not_eligible: { label: 'Settlement not applicable', tone: 'muted' },
  eligible: { label: 'Settlement eligible', tone: 'info' },
  confirmed: { label: 'Settlement confirmed', tone: 'success' },
};

// Reference only. These stages are shown in the future Buyer Protection phase.
export const BUYER_PROTECTION_STAGES = [
  'Payment confirmed',
  'Funds protected',
  'Order processing',
  'Dispatched',
  'Delivered — awaiting acceptance',
  'Acceptance recorded',
  '24-hour grace period',
  'Settlement eligible',
  'Payout processing',
  'Settlement confirmed',
  'Dispute opened',
  'Refund processing',
  'Refund confirmed',
];

export function normalizeOrder(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    id: typeof source.id === 'string' && source.id ? source.id : newId('order'),
    reference: typeof source.reference === 'string' ? source.reference : '',
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString(),
    items: Array.isArray(source.items) ? source.items : [],
    subtotal: Number(source.subtotal) || 0,
    delivery: Number(source.delivery) || 0,
    total: Number(source.total) || 0,
    address: source.address ? normalizeAddress(source.address) : null,
    paymentMethod: typeof source.paymentMethod === 'string' ? source.paymentMethod : '',
    status: ORDER_STATUSES.includes(source.status) ? source.status : 'processing',
    paymentStatus: PAYMENT_STATUS_META[source.paymentStatus] ? source.paymentStatus : 'unconfirmed',
    fulfilmentStatus: FULFILMENT_STATUS_META[source.fulfilmentStatus]
      ? source.fulfilmentStatus
      : 'pending',
    disputeStatus: DISPUTE_STATUS_META[source.disputeStatus] ? source.disputeStatus : 'none',
    settlementStatus: SETTLEMENT_STATUS_META[source.settlementStatus]
      ? source.settlementStatus
      : 'not_eligible',
    note:
      typeof source.note === 'string'
        ? source.note
        : 'Saved on this device. No payment has been charged.',
  };
}

export function normalizeOrders(value) {
  return Array.isArray(value) ? value.map(normalizeOrder) : [];
}

// Creates a local record of an order request the customer actually submitted.
export function buildOrder({ items = [], subtotal = 0, delivery = 0, address = null, paymentMethod = '' }) {
  const stamp = new Date();
  const reference = `SS-${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, '0')}${String(
    stamp.getDate(),
  ).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  return normalizeOrder({
    reference,
    createdAt: stamp.toISOString(),
    items,
    subtotal,
    delivery,
    total: subtotal + delivery,
    address,
    paymentMethod,
    status: 'processing',
    note: 'Order request saved on this device. No payment has been charged.',
  });
}

export function orderCounts(orders = []) {
  return {
    all: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    dispatched: orders.filter(o => o.status === 'dispatched').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    refunded: orders.filter(o => o.status === 'refunded').length,
  };
}

/* ------------------------------------------------------------------ reviews */

export function normalizeReview(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    id: typeof source.id === 'string' && source.id ? source.id : newId('review'),
    productId: typeof source.productId === 'string' ? source.productId : '',
    rating: Math.min(5, Math.max(1, Math.round(Number(source.rating) || 0) || 5)),
    text: typeof source.text === 'string' ? source.text : '',
    image: typeof source.image === 'string' ? source.image : null,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString(),
    orderReference: typeof source.orderReference === 'string' ? source.orderReference : '',
  };
}

export function normalizeReviews(value) {
  return Array.isArray(value) ? value.map(normalizeReview) : [];
}

// A review can only be marked verified when a delivered order contains the product.
export function hasDeliveredPurchase(orders, productId) {
  return orders.some(
    order =>
      order.status === 'delivered' && order.items.some(item => item.productId === productId),
  );
}

export function reviewableItems(orders, reviews) {
  const seen = new Set();
  const items = [];
  orders
    .filter(order => order.status === 'delivered')
    .forEach(order => {
      order.items.forEach(item => {
        if (seen.has(item.productId)) return;
        if (reviews.some(r => r.productId === item.productId)) return;
        seen.add(item.productId);
        items.push({ ...item, orderReference: order.reference });
      });
    });
  return items;
}

export const formatDate = iso => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};
