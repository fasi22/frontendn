import React, { useState, useEffect } from 'react';

export default function Adminpage() {
  const [customerName, setCustomerName] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    setErrorMessage(null);
    if (!customerName || !waiterName) {
      setErrorMessage('Please fill all required fields');
      return;
    }
    setSubmitting(true);

    setTimeout(() => {
      const newOrder = { customerName, waiterName };
      if (editIndex !== null) {
        const updatedOrders = [...orders];
        updatedOrders[editIndex] = newOrder;
        setOrders(updatedOrders);
        setEditIndex(null);
      } else {
        setOrders([...orders, newOrder]);
        // Go to the last page if a new item is added
        const newTotal = orders.length + 1;
        setCurrentPage(Math.ceil(newTotal / ordersPerPage));
      }

      setCustomerName('');
      setWaiterName('');
      setSubmitting(false);
    }, 500);
  };

  const handleDelete = (indexToDelete) => {
    const newOrders = orders.filter((_, index) => index !== indexToDelete);
    setOrders(newOrders);

    // Adjust current page if last item on the page was deleted
    const lastPage = Math.max(1, Math.ceil((newOrders.length) / ordersPerPage));
    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  };

  const handleEdit = (index) => {
    const order = orders[index];
    setCustomerName(order.customerName);
    setWaiterName(order.waiterName);
    setEditIndex(index);
  };

  const formattedTime = currentDateTime.toLocaleString();

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-2">
      <div className="w-full max-w-4xl p-6 bg-zinc-900 rounded shadow-lg mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-red-600 text-center">Admin Page</h2>
          <span className="text-red-400 font-semibold text-sm">{formattedTime}</span>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded">{errorMessage}</div>
        )}

        {/* Customer Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-red-400 mb-2">Customer Name</label>
          <input
            type="text"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Waiter Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-red-400 mb-2">Waiter</label>
          <input
            type="text"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2"
            value={waiterName}
            onChange={(e) => setWaiterName(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            {submitting ? 'Submitting...' : editIndex !== null ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {/* Display Orders */}
      {orders.length > 0 && (
        <div className="w-full max-w-4xl bg-zinc-800 p-5 rounded shadow-lg">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Submitted Orders</h3>

          {currentOrders.map((order, index) => {
            const actualIndex = indexOfFirstOrder + index;
            return (
              <div
                key={actualIndex}
                className="flex justify-between items-center bg-zinc-700 px-4 rounded mb-2"
              >
                <div>
                  <p>
                    <span className="font-semibold text-red-300">Customer:</span>{' '}
                    {order.customerName}
                  </p>
                  <p>
                    <span className="font-semibold text-red-300">Waiter:</span>{' '}
                    {order.waiterName}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(actualIndex)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(actualIndex)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-zinc-600 hover:bg-zinc-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-zinc-600 hover:bg-zinc-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
