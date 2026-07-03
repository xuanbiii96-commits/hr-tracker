# HR Tracker - Leave, Shift & Calendar Management

A comprehensive HR management application for tracking employee leaves, managing shifts, and maintaining an integrated calendar system.

## Features

### 1. **Leave Management**
- Request and approve leaves
- Track leave balance and accrual
- Support multiple leave types (vacation, sick, unpaid, parental, etc.)
- Multi-level approval workflows
- Leave history and reporting

### 2. **Shift Management**
- Create and assign shifts
- Bulk scheduling capabilities
- Shift swaps and bidding
- Compliance checks (rest periods, working hours)
- Shift notifications and reminders

### 3. **Calendar Integration**
- Daily, weekly, and monthly views
- Color-coded status indicators
- Sync with Google Calendar/Outlook
- Export schedules (PDF/CSV)
- Holiday and special events management

### 4. **Additional Features**
- Role-based access control (Admin, Manager, Employee)
- Real-time notifications and alerts
- Dashboard with analytics
- Audit logs and compliance tracking
- Mobile-responsive design

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **React Query** - State management
- **FullCalendar** - Calendar component
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Sequelize/TypeORM** - ORM

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## Project Structure

```
hr-tracker/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── config/
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v16+
- PostgreSQL 12+
- Docker (optional)

### Installation

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run migrate
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Using Docker
```bash
docker-compose up -d
```

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for detailed endpoint documentation.

## Database Schema

See [DATABASE.md](./DATABASE.md) for database design and relationships.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.
