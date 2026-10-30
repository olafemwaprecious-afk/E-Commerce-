// Cart operations are kept independent of the UI so all entry points share them.
export const cartKey = (id, variation = '') => JSON.stringify([id, variation]);

export function normalizeCart(value, validIds) {
  if (!Array.isArray(value)) return [];
  const result = [];
  for (const item of value) {
    if (!item || typeof item.id !== 'string' || !validIds.has(item.id)) continue;
    const qty = Number(item.qty);
    if (!Number.isSafeInteger(qty) || qty < 1) continue;
    const variation = typeof item.variation === 'string' ? item.variation : '';
    const key = cartKey(item.id, variation);
    const existing = result.find(entry => entry.key === key);
    if (existing) existing.qty += qty;
    else result.push({ key, id: item.id, qty, variation });
  }
  return result;
}

export function readCart(storage, validIds) {
  try { return normalizeCart(JSON.parse(storage.getItem('ss-cart') || '[]'), validIds); }
  catch { return []; }
}

export function addCartItem(cart, id, qty = 1, variation = '') {
  if (!Number.isSafeInteger(qty) || qty < 1) return cart;
  const key = cartKey(id, variation);
  const existing = cart.find(item => item.key === key);
  return existing
    ? cart.map(item => item.key === key ? { ...item, qty: item.qty + qty } : item)
    : [...cart, { key, id, qty, variation }];
}

export function removeCartItem(cart, key) {
  return cart.filter(item => item.key !== key);
}

export function adjustCartItem(cart, key, delta) {
  return cart.flatMap(item => {
    if (item.key !== key) return [item];
    const qty = item.qty + delta;
    return qty > 0 ? [{ ...item, qty }] : [];
  });
}
