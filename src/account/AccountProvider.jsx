import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  STORAGE_KEYS,
  emptyProfile,
  mergePreferences,
  normalizeAddresses,
  normalizeNgPhone,
  normalizeOrders,
  normalizeProfile,
  normalizeReviews,
  readJSON,
  removeAddress,
  setDefaultAddress,
  upsertAddress,
  writeJSON,
} from '../services/account';

const AccountContext = createContext(null);
export const useAccount = () => useContext(AccountContext);

const storage = () => (typeof window === 'undefined' ? null : window.localStorage);

function usePersistentState(key, normalize, fallback) {
  const [value, setValue] = useState(() => normalize(readJSON(storage(), key, fallback)));
  useEffect(() => {
    writeJSON(storage(), key, value);
  }, [key, value]);
  return [value, setValue];
}

export function AccountProvider({ children }) {
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.profile, normalizeProfile, emptyProfile);
  const [addresses, setAddresses] = usePersistentState(STORAGE_KEYS.addresses, normalizeAddresses, []);
  const [preferences, setPreferences] = usePersistentState(
    STORAGE_KEYS.preferences,
    mergePreferences,
    null,
  );
  const [orders, setOrders] = usePersistentState(STORAGE_KEYS.orders, normalizeOrders, []);
  const [reviews, setReviews] = usePersistentState(STORAGE_KEYS.reviews, normalizeReviews, []);
  const [requests, setRequests] = usePersistentState(
    'ss-account-requests',
    value => (value && typeof value === 'object' && !Array.isArray(value) ? value : {}),
    {},
  );

  // Accessibility preferences are applied to the document so they take effect
  // across the whole marketplace, not only inside the Account Centre.
  useEffect(() => {
    const root = document.documentElement;
    const { reducedMotion, textSize } = preferences.accessibility;
    if (reducedMotion === 'reduce') root.setAttribute('data-reduced-motion', 'reduce');
    else root.removeAttribute('data-reduced-motion');
    if (textSize === 'large') root.setAttribute('data-text-size', 'large');
    else root.removeAttribute('data-text-size');
  }, [preferences.accessibility]);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      addresses,
      orders,
      reviews,
      preferences,
      requests,

      saveProfile: next => setProfile(normalizeProfile(next)),
      setPhone: phone => setProfile(current => ({ ...current, phone: normalizeNgPhone(phone) })),

      saveAddress: address => setAddresses(current => upsertAddress(current, address)),
      deleteAddress: id => setAddresses(current => removeAddress(current, id)),
      makeDefaultAddress: id => setAddresses(current => setDefaultAddress(current, id)),
      defaultAddress: addresses.find(a => a.isDefault) || null,

      updatePreferences: (section, patch) =>
        setPreferences(current => ({
          ...current,
          [section]:
            section === 'notifications'
              ? current.notifications
              : { ...current[section], ...patch },
        })),
      setNotification: (key, channel, enabled) =>
        setPreferences(current => ({
          ...current,
          notifications: {
            ...current.notifications,
            [key]: { ...current.notifications[key], [channel]: enabled },
          },
        })),

      addOrder: order => setOrders(current => [order, ...current]),
      addReview: review => setReviews(current => [review, ...current]),
      deleteReview: id => setReviews(current => current.filter(r => r.id !== id)),

      requestDataCopy: () =>
        setRequests(current => ({
          ...current,
          export: { status: 'requested', requestedAt: new Date().toISOString() },
        })),
      requestDeletion: () =>
        setRequests(current => ({
          ...current,
          deletion: { status: 'requested', requestedAt: new Date().toISOString() },
        })),
      cancelDeletion: () =>
        setRequests(current => {
          const next = { ...current };
          delete next.deletion;
          return next;
        }),
    }),
    [
      profile,
      setProfile,
      addresses,
      setAddresses,
      orders,
      setOrders,
      reviews,
      setReviews,
      preferences,
      setPreferences,
      requests,
      setRequests,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
