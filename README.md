# Clothing Management And Distribution System

A comprehensive solution for fabric retail stores to streamline inventory management, sales processing, and customer relationship management.

## Overview

The Clothing Management And Distribution System is designed for small to medium-sized fabric retail stores that require manual inventory management and streamlined payment processing. This system moves away from barcode-based systems and embraces a form-driven approach while integrating modern payment methods and customer management features.

## Key Features

- **Manual SKU Management**: Create, manage, and validate SKUs based on fabric properties
- **Customer Order Processing**: Manual order entry with pricing calculations including discounts and taxes
- **Payment Processing**: Support for cash and QR code payments, with credit period functionality
- **Inventory Management**: Track stock levels with low-stock alerts and inventory adjustment tools
- **Invoice Generation**: Create detailed invoices with support for printing and electronic formats
- **Returns Processing**: Handle customer returns with inventory updates
- **Reporting**: Generate sales, inventory, and payment reconciliation reports
- **Customer Relationship Management (CRM)**: Manage customer profiles and track order history

## Tech Stack

- **Frontend**: ReactJS
- **Backend**: Spring Boot MVC
- **Database**: PostgreSQL

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clothing-management-system.git

# Navigate to the project directory
cd clothing-management-system

# Install backend dependencies
./mvnw install

# Install frontend dependencies
cd frontend
npm install
```

## Running the Application

```bash
# Start the backend server
./mvnw spring-boot:run

# In a separate terminal, start the frontend
cd frontend
npm start
```

## System Requirements

- Standard commercial hardware (no specialized equipment needed)
- Windows or macOS operating system
- Internet connectivity for payment processing
- Touch screen compatibility (recommended but not required)

## User Roles

The system is designed for:

- **Sales Staff**: Process customer orders and payments
- **Inventory Staff**: Manage stock levels and record transactions 
- **Store Managers**: Monitor operations through a comprehensive dashboard

## Development Timeline

1. **Phase 1**: Core inventory, sales functions, and CRM (2 months)
2. **Phase 2**: Payment processing and credit period functionality (1 month)
3. **Phase 3**: Reporting and analytics (1 month)
4. **Phase 4**: Testing and refinement (1 month)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE.md)

## Client

This project is being developed for Mira Textile.

## Contact

Project Link: [https://github.com/yourusername/clothing-management-system](https://github.com/yourusername/clothing-management-system)
