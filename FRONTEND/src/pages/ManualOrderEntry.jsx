// src/pages/ManualOrderEntry.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Modal from '../components/Modal';
import '../styles/ManualOrderEntry.css';

const ManualOrderEntry = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({ fabric: '', color: '', quantity: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const handleAddToCart = () => {
    if (selectedItem.fabric && selectedItem.quantity) {
      const itemPrice = 100; // Mock price
      setOrderItems([...orderItems, { ...selectedItem, price: itemPrice }]);
      setTotal(total + (itemPrice * selectedItem.quantity));
      setSelectedItem({ fabric: '', color: '', quantity: '' });
    }
  };

  const handleConfirmOrder = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="manual-order-container">
      <Navbar userRole="Sales Staff" />
      <h1>Manual Order Entry</h1>
      <div className="order-form-section">
        <div className="order-form">
          <FormInput
            label="Fabric Type"
            type="select"
            value={selectedItem.fabric}
            onChange={(e) => setSelectedItem({ ...selectedItem, fabric: e.target.value })}
            options={['Cotton', 'Silk', 'Wool']}
          />
          <FormInput
            label="Color"
            type="select"
            value={selectedItem.color}
            onChange={(e) => setSelectedItem({ ...selectedItem, color: e.target.value })}
            options={['Red', 'Blue', 'Green']}
          />
          <FormInput
            label="Quantity"
            type="number"
            value={selectedItem.quantity}
            onChange={(e) => setSelectedItem({ ...selectedItem, quantity: e.target.value })}
          />
          <button className="order-button" onClick={handleAddToCart}>Add to Cart</button>
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <table className="order-table">
            <thead>
              <tr>
                <th>Fabric</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.fabric}</td>
                  <td>{item.color}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="total-amount">Total: ${total}</p>
          <button className="order-button" onClick={handleConfirmOrder}>Submit Order</button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Order">
        <p>Confirm order with total: ${total}?</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={() => setIsModalOpen(false)}>Confirm</button>
          <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManualOrderEntry;