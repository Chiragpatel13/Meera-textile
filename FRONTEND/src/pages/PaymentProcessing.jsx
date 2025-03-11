import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';

const PaymentProcessing = () => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [totalAmount] = useState(200); // Mock total
  const [change, setChange] = useState(0);

  const calculateChange = (e) => {
    const received = parseFloat(e.target.value) || 0;
    setCashReceived(e.target.value);
    setChange(received - totalAmount);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Navbar userRole="Sales Staff" />
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Payment Processing</h1>
      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '16px', marginRight: '20px' }}>
            <input type="radio" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} /> Cash
          </label>
          <label style={{ fontSize: '16px' }}>
            <input type="radio" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} /> QR Code
          </label>
        </div>
        {paymentMethod === 'cash' ? (
          <div style={{ flex: 2 }}>
            <p style={{ fontSize: '16px' }}>Total: ${totalAmount}</p>
            <FormInput label="Cash Received" type="number" value={cashReceived} onChange={calculateChange} />
            <p style={{ fontSize: '16px', marginTop: '15px' }}>Change: ${change >= 0 ? change : 0}</p>
            <button style={{ marginTop: '15px' }}>Confirm Payment</button>
          </div>
        ) : (
          <div style={{ flex: 2 }}>
            <p style={{ fontSize: '16px' }}>Scan this QR code to pay ${totalAmount}</p>
            <div style={{ width: '200px', height: '200px', backgroundColor: '#f5f5f5', margin: '15px 0', textAlign: 'center', lineHeight: '200px' }}>QR Code Here</div>
            <button>Confirm Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessing;