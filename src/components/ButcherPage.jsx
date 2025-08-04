import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function ButcherPage() {
  const [items, setItems] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [sharedKg, setSharedKg] = useState('');
  const [orderType, setOrderType] = useState('INDOOR');
  const [selectedWaiter, setSelectedWaiter] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingWaiters, setLoadingWaiters] = useState(false);
  const [errorItems, setErrorItems] = useState(null);
  const [errorWaiters, setErrorWaiters] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchWaiters();

    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchItems = async () => {
    setLoadingItems(true);
    setErrorItems(null);
    try {
      const response = await axios.get('http://localhost:6000/api/items');
      setItems(response.data);
    } catch (err) {
      setErrorItems('Failed to load items. Please try again.');
      console.error('Error loading items:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchWaiters = async () => {
    setLoadingWaiters(true);
    setErrorWaiters(null);
    try {
      const response = await axios.get('http://localhost:6000/api/waiters/we');
      setWaiters(response.data);
    } catch (err) {
      setErrorWaiters('Failed to load waiters. Please try again.');
      console.error('Error loading waiters:', err);
    } finally {
      setLoadingWaiters(false);
    }
  };

  const handleSelect = (itemName) => {
    setSelectedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName]
    );
  };

  const handleSubmit = async () => {
    if (!customerName || !sharedKg || selectedItems.length === 0 || (orderType === 'INDOOR' && !selectedWaiter)) {
      setErrorItems('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const itemData = {};
      selectedItems.forEach((item) => {
        itemData[item] = sharedKg;
      });

      const payload = {
        customerName,
        orderType,
        waiter: selectedWaiter,
        items: itemData,
      };

      await axios.post('http://localhost:6000/api/orders/', payload);
      alert('Order submitted successfully!');
      setSelectedItems([]);
      setSharedKg('');
      setCustomerName('');
      setSelectedWaiter('');
      setErrorItems(null);
      setErrorWaiters(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error submitting order. Please try again.';
      setErrorItems(errorMsg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedTime = currentDateTime.toLocaleString();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl p-6 bg-zinc-900 rounded shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-red-600 text-center">
            Add Butcher
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={fetchItems}
                disabled={loadingItems}
                className="text-xs bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded border border-zinc-500 disabled:opacity-50"
              >
                {loadingItems ? 'Loading...' : 'Refresh Items'}
              </button>
              <button
                onClick={fetchWaiters}
                disabled={loadingWaiters}
                className="text-xs bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded border border-zinc-500 disabled:opacity-50"
              >
                {loadingWaiters ? 'Loading...' : 'Refresh Waiters'}
              </button>
            </div>
            <span className="text-red-400 font-semibold text-sm">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Error Messages */}
        {errorItems && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded">
            {errorItems}
          </div>
        )}
        {errorWaiters && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded">
            {errorWaiters}
          </div>
        )}

        {/* Select Items Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-red-400">
              Select Items
            </label>
            {loadingItems && (
              <span className="text-xs text-gray-400">Loading items...</span>
            )}
          </div>
          
          {items.length === 0 && !loadingItems ? (
            <div className="text-center py-4 text-gray-400">
              No items available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item) => {
                const isSelected = selectedItems.includes(item.name);
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(item.name)}
                    className={`p-4 rounded-lg border transition cursor-pointer select-none ${
                      isSelected
                        ? 'border-red-500 bg-zinc-800'
                        : 'border-zinc-700 hover:border-red-400'
                    }`}
                  >
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* KG Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-red-400 mb-1">
            KG for all selected items
          </label>
          <input
            type="number"
            step="any"
            min="0"
            placeholder="kg"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-600"
            value={sharedKg}
            onChange={(e) => setSharedKg(e.target.value)}
            disabled={selectedItems.length === 0}
          />
        </div>

        {/* Customer Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-red-400 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-600"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Order Type */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-red-400 mb-1">
            Order Type
          </label>
          <div className="flex gap-4">
            {['INDOOR', 'OUTDOOR'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="orderType"
                  value={type}
                  checked={orderType === type}
                  onChange={() => setOrderType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Select Waiter - only show for INDOOR orders */}
        {orderType === 'INDOOR' && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-red-400">
                Select Waiter
              </label>
              {loadingWaiters && (
                <span className="text-xs text-gray-400">Loading waiters...</span>
              )}
            </div>
            <select
              value={selectedWaiter}
              onChange={(e) => setSelectedWaiter(e.target.value)}
              className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-600"
              required
              disabled={waiters.length === 0}
            >
              <option value="">-- Select Waiter --</option>
              {waiters.map((waiter) => (
                <option key={waiter._id} value={waiter.name}>
                  {waiter.name}
                </option>
              ))}
            </select>
            {waiters.length === 0 && !loadingWaiters && (
              <p className="text-xs text-red-400 mt-1">No waiters available</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}