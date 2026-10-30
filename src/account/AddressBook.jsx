import React, { useState } from 'react';
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { formatNgPhone } from '../services/account';
import AddressForm from './AddressForm';
import { Badge, ConfirmDialog, EmptyState, Notice, PanelHeader } from './ui';

export default function AddressBook() {
  const { addresses, saveAddress, deleteAddress, makeDefaultAddress } = useAccount();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [status, setStatus] = useState('');

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = address => {
    setEditing(address);
    setFormOpen(true);
  };

  const handleSave = address => {
    saveAddress(address);
    setStatus(address.id ? 'Address updated on this device.' : 'Address added on this device.');
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteAddress(pendingDelete.id);
    setStatus('Address removed.');
    setPendingDelete(null);
  };

  const makeDefault = id => {
    makeDefaultAddress(id);
    setStatus('Default delivery address updated.');
  };

  return (
    <div className="acct-stack">
      <PanelHeader
        title="Address book"
        description="Save the addresses you want to use at checkout."
        action={
          <button type="button" className="acct-btn primary" onClick={openAdd}>
            <Plus size={16} /> Add address
          </button>
        }
      />

      {status && (
        <p className="acct-inline-message" role="status">
          {status}
        </p>
      )}

      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin size={34} />}
          title="No delivery addresses saved"
          description="Add an address to make checkout faster. You can save a home, work and other address."
          action={
            <button type="button" className="acct-btn primary" onClick={openAdd}>
              <Plus size={16} /> Add your first address
            </button>
          }
        />
      ) : (
        <div className="acct-address-grid">
          {addresses.map(address => (
            <article
              key={address.id}
              className={`acct-address-card${address.isDefault ? ' is-default' : ''}`}
            >
              <header>
                <Badge tone="brand">{address.label}</Badge>
                {address.isDefault && <Badge tone="success">Default</Badge>}
              </header>
              <b>{address.fullName}</b>
              <p className="acct-address-phone">{formatNgPhone(address.phone)}</p>
              <p>
                {address.street}
                {address.apartment ? `, ${address.apartment}` : ''}
              </p>
              <p>
                {address.city}, {address.lga}
              </p>
              <p>{address.state}, Nigeria</p>
              {address.instructions && (
                <p className="acct-address-note">
                  <small>Delivery note:</small> {address.instructions}
                </p>
              )}
              <div className="acct-address-actions">
                <button type="button" onClick={() => openEdit(address)}>
                  <Pencil size={14} /> Edit
                </button>
                {!address.isDefault && (
                  <button type="button" onClick={() => makeDefault(address.id)}>
                    <Star size={14} /> Make default
                  </button>
                )}
                <button
                  type="button"
                  className="danger-text"
                  onClick={() => setPendingDelete(address)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Notice>
        Delivery availability and cost depend on your location and the products in your cart. Nothing
        here promises coverage for every address.
      </Notice>

      <AddressForm
        open={formOpen}
        initial={editing}
        hasAddresses={addresses.length > 0}
        onSave={handleSave}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this address?"
        message={
          pendingDelete
            ? `${pendingDelete.label} address for ${pendingDelete.fullName} will be removed from this device. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete address"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
