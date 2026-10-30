import React, { useRef, useState } from 'react';
import { Camera, Star, Trash2, X } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { products, money } from '../data';
import { hasDeliveredPurchase, formatDate, reviewableItems } from '../services/account';
import { readImageFile } from '../services/media';
import { Badge, ConfirmDialog, EmptyState, Notice, PanelHeader, SectionCard } from './ui';

function Stars({ value, onChange, label = 'Rating' }) {
  return (
    <div className="acct-stars" role={onChange ? 'radiogroup' : 'img'} aria-label={`${label}: ${value} of 5`}>
      {[1, 2, 3, 4, 5].map(star =>
        onChange ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className={star <= value ? 'filled' : ''}
            onClick={() => onChange(star)}
          >
            <Star size={20} />
          </button>
        ) : (
          <span key={star} className={star <= value ? 'filled' : ''} aria-hidden="true">
            <Star size={16} />
          </span>
        ),
      )}
    </div>
  );
}

export default function ReviewsPanel() {
  const { reviews, orders, addReview, deleteReview } = useAccount();
  const eligible = reviewableItems(orders, reviews);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [form, setForm] = useState({ productId: '', rating: 5, text: '', image: null });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const fileRef = useRef(null);

  const start = (productId = '') => {
    setForm({ productId, rating: 5, text: '', image: null });
    setErrors({});
    setStatus('');
    setOpen(true);
  };

  const upload = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    try {
      const image = await readImageFile(file, { maxSize: 640 });
      setForm(current => ({ ...current, image }));
    } catch (error) {
      setErrors(current => ({ ...current, image: error.message }));
    }
  };

  const submit = async event => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.productId) nextErrors.productId = 'Choose the product you are reviewing.';
    if (!form.text.trim()) nextErrors.text = 'Tell other shoppers a little about the product.';
    if (form.text.trim().length > 800) nextErrors.text = 'Keep your review under 800 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    const product = products.find(item => item.id === form.productId);
    await new Promise(resolve => setTimeout(resolve, 350));
    addReview({
      productId: form.productId,
      rating: form.rating,
      text: form.text.trim(),
      image: form.image,
      orderReference: hasDeliveredPurchase(orders, form.productId)
        ? orders.find(
            order =>
              order.status === 'delivered' &&
              order.items.some(item => item.productId === form.productId),
          )?.reference || ''
        : '',
    });
    setBusy(false);
    setOpen(false);
    setStatus(`Your review for ${product?.name || 'this product'} was saved on this device.`);
  };

  return (
    <div className="acct-stack">
      <PanelHeader
        title="Reviews"
        description="Reviews you have written and products you can still review."
        action={
          <button type="button" className="acct-btn primary" onClick={() => start()}>
            <Star size={16} /> Write a review
          </button>
        }
      />

      {status && (
        <p className="acct-inline-message" role="status">
          {status}
        </p>
      )}

      {open && (
        <SectionCard
          title="Write a review"
          action={
            <button type="button" className="acct-icon-button" onClick={() => setOpen(false)} aria-label="Close review form">
              <X size={17} />
            </button>
          }
        >
          <form onSubmit={submit} noValidate className="acct-stack-sm">
            <div className="acct-field">
              <label htmlFor="review-product">
                Product <span aria-hidden="true">*</span>
              </label>
              <div className={`acct-input${errors.productId ? ' has-error' : ''}`}>
                <select
                  id="review-product"
                  value={form.productId}
                  onChange={event => setForm(current => ({ ...current, productId: event.target.value }))}
                >
                  <option value="">Choose a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.productId && <small className="acct-error">{errors.productId}</small>}
            </div>

            <div className="acct-field">
              <label>Your rating</label>
              <Stars value={form.rating} onChange={rating => setForm(current => ({ ...current, rating }))} />
            </div>

            <div className="acct-field">
              <label htmlFor="review-text">
                Your review <span aria-hidden="true">*</span>
              </label>
              <div className={`acct-input${errors.text ? ' has-error' : ''}`}>
                <textarea
                  id="review-text"
                  rows={4}
                  maxLength={800}
                  value={form.text}
                  onChange={event => {
                    setForm(current => ({ ...current, text: event.target.value }));
                    setErrors(current => ({ ...current, text: '' }));
                  }}
                  placeholder="How was the product? Mention quality, fit or delivery if useful."
                />
              </div>
              <small className="acct-hint">{form.text.length}/800 characters</small>
              {errors.text && <small className="acct-error">{errors.text}</small>}
            </div>

            <div className="acct-field">
              <label>Add a photo <small>(optional)</small></label>
              <div className="acct-review-upload">
                {form.image && (
                  <div className="acct-review-preview">
                    <img src={form.image} alt="Review attachment preview" />
                    <button
                      type="button"
                      className="acct-icon-button"
                      aria-label="Remove photo"
                      onClick={() => setForm(current => ({ ...current, image: null }))}
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                <button type="button" className="acct-btn ghost" onClick={() => fileRef.current?.click()}>
                  <Camera size={15} /> {form.image ? 'Replace photo' : 'Upload photo'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} aria-label="Choose a review photo" />
              </div>
              {errors.image && <small className="acct-error">{errors.image}</small>}
            </div>

            <Notice>
              A review is marked as a verified purchase only when a delivered order on this device
              includes the product.
            </Notice>

            <div className="acct-form-footer">
              <button type="submit" className="acct-btn primary" disabled={busy}>
                {busy ? 'Saving…' : 'Submit review'}
              </button>
              <button type="button" className="acct-btn ghost" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {eligible.length > 0 && (
        <SectionCard title="Awaiting your review" description="Delivered products without a review yet.">
          <div className="acct-reviewable">
            {eligible.map(item => (
              <div key={item.productId} className="acct-reviewable-row">
                <img src={item.image} alt="" />
                <div>
                  <b>{item.name}</b>
                  <small>
                    Delivered with {item.orderReference} · {money(item.price)}
                  </small>
                </div>
                <button type="button" className="acct-btn ghost" onClick={() => start(item.productId)}>
                  Write review
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Your reviews" description={reviews.length ? `${reviews.length} review(s) saved on this device.` : undefined}>
        {reviews.length ? (
          <div className="acct-review-list">
            {reviews.map(review => {
              const product = products.find(item => item.id === review.productId);
              const verified = hasDeliveredPurchase(orders, review.productId);
              return (
                <article key={review.id} className="acct-review-card">
                  <div className="acct-review-head">
                    {product && <img src={product.image} alt="" />}
                    <div>
                      <b>{product?.name || 'Product'}</b>
                      <small>{formatDate(review.createdAt)}</small>
                    </div>
                    <Stars value={review.rating} />
                  </div>
                  <p>{review.text}</p>
                  {review.image && <img className="acct-review-image" src={review.image} alt="Photo attached to your review" />}
                  <div className="acct-review-foot">
                    {verified ? (
                      <Badge tone="success">Verified purchase</Badge>
                    ) : (
                      <Badge tone="muted">Not a verified purchase</Badge>
                    )}
                    <button type="button" className="acct-btn ghost danger-text" onClick={() => setPendingDelete(review)}>
                      <Trash2 size={14} /> Delete review
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Star size={32} />}
            title="No reviews written yet"
            description="Share what you think about a product you have used. Reviews need a delivered order to count as verified."
            action={
              <button type="button" className="acct-btn primary" onClick={() => start()}>
                Write your first review
              </button>
            }
          />
        )}
      </SectionCard>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this review?"
        message="Your review and any attached photo will be removed from this device."
        confirmLabel="Delete review"
        onConfirm={() => {
          deleteReview(pendingDelete.id);
          setPendingDelete(null);
          setStatus('Review deleted.');
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
