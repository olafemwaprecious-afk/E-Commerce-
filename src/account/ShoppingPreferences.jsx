import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAccount } from './AccountProvider';
import { products, categories } from '../data';
import { Notice, SectionCard, Toggle } from './ui';

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45', '46'];
const brands = [...new Set(products.map(product => product.brand))];

export default function ShoppingPreferences() {
  const { preferences, updatePreferences } = useAccount();
  const shopping = preferences.shopping;

  const toggleList = (key, value) => {
    const list = shopping[key];
    updatePreferences('shopping', {
      [key]: list.includes(value) ? list.filter(item => item !== value) : [...list, value],
    });
  };

  return (
    <div className="acct-stack">
      <SectionCard
        title="Shopping preferences"
        description="Saved on this device to support future personalisation."
      >
        <div className="acct-field">
          <label>Favourite categories</label>
          <div className="acct-chip-group" role="group" aria-label="Favourite categories">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                className={shopping.categories.includes(category) ? 'active' : ''}
                aria-pressed={shopping.categories.includes(category)}
                onClick={() => toggleList('categories', category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="acct-field">
          <label>Preferred brands</label>
          <div className="acct-chip-group" role="group" aria-label="Preferred brands">
            {brands.map(brand => (
              <button
                key={brand}
                type="button"
                className={shopping.brands.includes(brand) ? 'active' : ''}
                aria-pressed={shopping.brands.includes(brand)}
                onClick={() => toggleList('brands', brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="acct-form-grid">
          <div className="acct-field">
            <label htmlFor="clothing-size">Clothing size</label>
            <div className="acct-input">
              <select
                id="clothing-size"
                value={shopping.clothingSize}
                onChange={event => updatePreferences('shopping', { clothingSize: event.target.value })}
              >
                <option value="">Not set</option>
                {CLOTHING_SIZES.map(size => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="acct-field">
            <label htmlFor="shoe-size">Shoe size</label>
            <div className="acct-input">
              <select
                id="shoe-size"
                value={shopping.shoeSize}
                onChange={event => updatePreferences('shopping', { shoeSize: event.target.value })}
              >
                <option value="">Not set</option>
                {SHOE_SIZES.map(size => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="acct-field span-2">
            <label htmlFor="interests">Product interests <small>(optional)</small></label>
            <div className="acct-input">
              <textarea
                id="interests"
                rows={3}
                maxLength={240}
                value={shopping.interests}
                onChange={event => updatePreferences('shopping', { interests: event.target.value })}
                placeholder="e.g. home office setup, modest fashion, small kitchen appliances"
              />
            </div>
            <small className="acct-hint">{shopping.interests.length}/240 characters</small>
          </div>
        </div>

        <Toggle
          label="Shopping recommendations"
          description="Use my preferences and activity on this device to shape recommendations."
          checked={shopping.recommendations}
          onChange={value => updatePreferences('shopping', { recommendations: value })}
        />

        <Notice title="Not connected to personalisation yet" tone="info">
          These choices are stored locally and do not change the current storefront. Recommendations
          will use them once personalisation is built.
        </Notice>
      </SectionCard>

      <SectionCard title="Why we ask" description="Preferences help future sorting and suggestions.">
        <p className="acct-body-text">
          <Sparkles size={15} /> Favourite categories, brands and sizes are optional. You can clear any
          of them at any time.
        </p>
      </SectionCard>
    </div>
  );
}
