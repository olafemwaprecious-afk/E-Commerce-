import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addCartItem, adjustCartItem, removeCartItem, normalizeCart, readCart } from '../src/services/cart.js';

const validIds = new Set(['iphone', 'shoes']);
test('adding, incrementing and decrementing updates quantities without mutating previous state', () => {
  const first = addCartItem([], 'iphone');
  const twice = addCartItem(first, 'iphone', 2);
  assert.equal(first[0].qty, 1);
  assert.equal(twice[0].qty, 3);
  const incremented = adjustCartItem(adjustCartItem(twice, twice[0].key, 1), twice[0].key, 1);
  assert.equal(incremented[0].qty, 5);
  assert.equal(adjustCartItem(incremented, incremented[0].key, -1)[0].qty, 4);
});
test('removing last item by minus or remove produces an empty cart', () => {
  const cart = addCartItem([], 'iphone');
  assert.deepEqual(adjustCartItem(cart, cart[0].key, -1), []);
  assert.deepEqual(removeCartItem(cart, cart[0].key), []);
});
test('variations stay separate and removing one leaves the other', () => {
  const cart = addCartItem(addCartItem([], 'iphone', 1, 'Black'), 'iphone', 1, 'White');
  assert.equal(cart.length, 2);
  assert.equal(removeCartItem(cart, cart[0].key)[0].variation, 'White');
});
test('legacy persisted cart entries are migrated and survive reload', () => {
  const legacy = [{id:'iphone',key:'iphone',qty:'2'}, {id:'iphone',qty:1}, {id:'shoes',qty:1,variation:'Black'}];
  const migrated = normalizeCart(legacy, validIds);
  assert.equal(migrated[0].qty, 3);
  const storage = {getItem: () => JSON.stringify(migrated)};
  assert.deepEqual(readCart(storage, validIds), migrated);
  assert.deepEqual(readCart({getItem: () => '{broken'}, validIds), []);
  assert.deepEqual(normalizeCart([{id:'missing',qty:1},{id:'iphone',qty:0}], validIds), []);
});
