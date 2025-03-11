// src/pages/InventoryManagement.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import '../styles/InventoryManagement.css';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { sku: 'SKU001', fabric: 'Cotton', color: 'Blue', quantity: 50, reorder: 10, lastUpdated: '2025-03-01' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSku, setNewSku] = useState({ sku: '', fabric: '', color: '', quantity: '' });

  const handleAddSku = () => {
    setInventory([...inventory, { ...newSku, reorder: 10, lastUpdated: new Date().toISOString().split('T')[0] }]);
    setNewSku({ sku: '', fabric: '', color: '', quantity: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="inventory-container">
      <Navbar userRole="Inventory Staff" />
      <h1>Inventory Management</h1>
      <button className="new-sku-button" onClick={() => setIsModalOpen(true)}>New SKU</button>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Fabric</th>
            <th>Color</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} className={item.quantity < item.reorder ? 'low-quantity' : ''}>
              <td>{item.sku}</td>
              <td>{item.fabric}</td>
              <td>{item.color}</td>
              <td>{item.quantity}</td>
              <td>{item.reorder}</td>
              <td>{item.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New SKU">
        <FormInput
          label="SKU"
          value={newSku.sku}
          onChange={(e) => setNewSku({ ...newSku, sku: e.target.value })}
        />
        <FormInput
          label="Fabric"
          type="select"
          value={newSku.fabric}
          onChange={(e) => setNewSku({ ...newSku, fabric: e.target.value })}
          options={['Cotton', 'Silk']}
        />
        <FormInput
          label="Color"
          type="select"
          value={newSku.color}
          onChange={(e) => setNewSku({ ...newSku, color: e.target.value })}
          options={['Red', 'Blue']}
        />
        <FormInput
          label="Quantity"
          type="number"
          value={newSku.quantity}
          onChange={(e) => setNewSku({ ...newSku, quantity: e.target.value })}
        />
        <button onClick={handleAddSku}>Save</button>
      </Modal>
    </div>
  );
};

export default InventoryManagement;