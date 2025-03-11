// src/pages/Reporting.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import '../styles/Reporting.css';

const Reporting = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('sales');

  const generateReport = () => {
    console.log(`Generating ${reportType} report from ${startDate} to ${endDate}`);
  };

  return (
    <div className="reporting-container">
      <Navbar userRole="Manager" />
      <h1>Reporting</h1>
      <div className="report-form">
        <FormInput
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <FormInput
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <FormInput
          label="Report Type"
          type="select"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          options={['sales', 'inventory', 'financial']}
        />
        <button className="generate-button" onClick={generateReport}>
          Generate Report
        </button>
      </div>
      <div className="report-output">
        <p>Report data will display here (e.g., table or chart).</p>
        <div className="export-buttons">
          <button className="export-button pdf">Export PDF</button>
          <button className="export-button csv">Export CSV</button>
        </div>
      </div>
    </div>
  );
};

export default Reporting;