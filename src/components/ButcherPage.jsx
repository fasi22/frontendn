import React, { useState, useEffect } from 'react';

const items = [
  'Kitfo',
  'Gored Gored',
  'Tibs',
  'Dullet',
  'Bozena Shiro',
  'Minchet Abish',
  'Zigni',
  'Key Wot',
  'Alicha'
];

export default function ButcherPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [sharedKg, setSharedKg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (itemKey) => {
    setSelectedItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((i) => i !== itemKey)
        : [...prev, itemKey]
    );
  };

  const handleSubmit = () => {
    const orderTime = new Date();
    const orderData = selectedItems.reduce((acc, item) => {
      acc[item] = sharedKg;
      return acc;
    }, {});

    console.log({
      customerName,
      orderTime: orderTime.toLocaleString(),
      items: orderData
    });

    alert('Order submitted!');
  };

  const formattedTime = currentDateTime.toLocaleString();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl p-6 bg-zinc-900 rounded shadow-lg">

        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-1/4" />
          <h2 className="text-3xl font-bold text-red-600 text-center flex-grow">
            Add Butcher
          </h2>
          <div className="w-1/4 text-right text-red-400 font-semibold text-sm">
            {formattedTime}
          </div>
        </div>

        {/* Item Cards */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-red-400 mb-2">
            Select Items
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, index) => {
              const itemKey = `${item}-${index}`;
              const isSelected = selectedItems.includes(itemKey);

              return (
                <div
                  key={itemKey}
                  onClick={() => handleSelect(itemKey)}
                  className={`p-4 rounded-lg border transition cursor-pointer select-none ${
                    isSelected
                      ? 'border-red-500 bg-zinc-800'
                      : 'border-zinc-700 hover:border-red-400'
                  }`}
                >
                  <span className="text-white font-medium">{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shared KG input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-red-400 mb-1">
            KG for all selected itemss
          </label>
          <input
            type="number"
            step="any"
            min="0"
            placeholder="kg"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-600"
            value={sharedKg}
            onChange={(e) => setSharedKg(e.target.value)}
          />
        </div>

        {/* Customer Name input */}
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

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
          >
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}