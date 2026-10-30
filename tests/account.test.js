import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  defaultPreferences,
  mergePreferences,
  normalizeAddresses,
  normalizeNgPhone,
  isValidNgPhone,
  validateAddress,
  upsertAddress,
  removeAddress,
  setDefaultAddress,
  profileCompletion,
  buildOrder,
  orderCounts,
  hasDeliveredPurchase,
  reviewableItems,
  formatAddress,
} from '../src/services/account.js';

const address = (over = {}) => ({
  fullName: 'Amaka Obi',
  phone: '08012345678',
  state: 'Lagos',
  city: 'Ikeja',
  lga: 'Ikeja',
  street: '12 Allen Avenue',
  apartment: '',
  instructions: '',
  label: 'Home',
  isDefault: false,
  ...over,
});

test('Nigerian phone numbers are normalised and validated', () => {
  assert.equal(normalizeNgPhone('+234 801 234 5678'), '08012345678');
  assert.equal(normalizeNgPhone('8012345678'), '08012345678');
  assert.ok(isValidNgPhone('08012345678'));
  assert.ok(!isValidNgPhone('12345'));
  assert.ok(!isValidNgPhone('080123456789'));
});

test('address validation reports every required field', () => {
  const errors = validateAddress({
    fullName: '',
    phone: '',
    state: 'Atlantis',
    city: '',
    lga: '',
    street: '',
    instructions: 'x'.repeat(201),
  });
  assert.deepEqual(Object.keys(errors).sort(), [
    'city', 'fullName', 'instructions', 'lga', 'phone', 'state', 'street',
  ]);
  assert.deepEqual(validateAddress(address()), {});
});

test('adding, editing and defaulting addresses keeps one default', () => {
  const first = upsertAddress([], address());
  assert.equal(first.length, 1);
  assert.equal(first[0].isDefault, true);

  const second = upsertAddress(first, address({ label: 'Work', city: 'Yaba' }));
  assert.equal(second.length, 2);
  assert.equal(second.filter(a => a.isDefault).length, 1);

  const edited = upsertAddress(second, { ...second[1], street: '5 Herbert Macaulay Way' });
  assert.equal(edited[1].street, '5 Herbert Macaulay Way');

  const defaulted = setDefaultAddress(edited, edited[1].id);
  assert.equal(defaulted.find(a => a.isDefault).id, edited[1].id);
  assert.equal(defaulted.filter(a => a.isDefault).length, 1);

  const remaining = removeAddress(defaulted, defaulted[1].id);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].isDefault, true);
  assert.deepEqual(removeAddress(remaining, remaining[0].id), []);
});

test('stored addresses always keep exactly one default', () => {
  const list = normalizeAddresses([
    { id: 'a', fullName: 'A', isDefault: true, state: 'Lagos' },
    { id: 'b', fullName: 'B', isDefault: true, state: 'Oyo' },
  ]);
  assert.equal(list.filter(a => a.isDefault).length, 1);
  const noDefault = normalizeAddresses([{ id: 'c', fullName: 'C', state: 'Oyo' }]);
  assert.equal(noDefault[0].isDefault, true);
});

test('preferences merge with defaults and keep notification channels', () => {
  const merged = mergePreferences({ notifications: { promotions: { inApp: true } } });
  assert.equal(merged.notifications.promotions.inApp, true);
  assert.equal(merged.notifications.orderConfirmations.inApp, true);
  assert.equal(merged.notifications.orderConfirmations.email, false);
  assert.equal(merged.accessibility.reducedMotion, 'system');
  assert.equal(merged.region.currency, 'NGN');
  const defaults = defaultPreferences();
  assert.equal(defaults.notifications.promotions.inApp, false);
});

test('profile completion only counts saved details', () => {
  assert.equal(profileCompletion({ name: '', email: '', phone: '', photo: null }, []).completed, 0);
  const profile = { name: 'Amaka', email: 'a@b.co', phone: '08012345678', photo: 'x' };
  const result = profileCompletion(profile, [upsertAddress([], address())[0]]);
  assert.equal(result.completed, result.total);
  assert.equal(result.percent, 100);
});

test('orders keep payment, fulfilment, dispute and settlement separate', () => {
  const order = buildOrder({
    items: [{ productId: 'iphone', name: 'iPhone', image: '/x.png', price: 100, qty: 2 }],
    subtotal: 200,
    delivery: 2500,
    address: address({ id: 'addr_1' }),
    paymentMethod: 'Protected prepayment',
  });
  assert.match(order.reference, /^SS-\d{8}-[A-Z0-9]{4}$/);
  assert.equal(order.status, 'processing');
  assert.equal(order.paymentStatus, 'unconfirmed');
  assert.equal(order.fulfilmentStatus, 'pending');
  assert.equal(order.disputeStatus, 'none');
  assert.equal(order.settlementStatus, 'not_eligible');
  assert.equal(order.total, 2700);
  assert.equal(orderCounts([order]).processing, 1);
  assert.equal(orderCounts([order]).delivered, 0);
  assert.match(formatAddress(order.address), /12 Allen Avenue/);
});

test('verified reviews require a delivered order for that product', () => {
  const orders = [
    buildOrder({ items: [{ productId: 'iphone', name: 'iPhone', price: 1, qty: 1 }] }),
    { ...buildOrder({ items: [{ productId: 'shoes', name: 'Shoes', price: 1, qty: 1 }] }), status: 'delivered' },
  ];
  assert.equal(hasDeliveredPurchase(orders, 'iphone'), false);
  assert.equal(hasDeliveredPurchase(orders, 'shoes'), true);
  const reviewable = reviewableItems(orders, []);
  assert.deepEqual(reviewable.map(item => item.productId), ['shoes']);
  const reviewed = reviewableItems(orders, [{ productId: 'shoes' }]);
  assert.equal(reviewed.length, 0);
});
