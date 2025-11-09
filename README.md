# 🛡️ ProofPals

**Anonymous Ring-Based Journalist Review System**

A secure, privacy-preserving platform for anonymous peer review of journalistic content using advanced cryptographic techniques including ring signatures, blind credentials, and sybil-resistant voting mechanisms.

## 🌟 Features

### 🔐 **Privacy & Security**
- **Ring Signatures**: Complete voter anonymity while maintaining verifiability
- **Blind Credentials**: Sybil-resistant authentication without identity exposure
- **Atomic Operations**: Race-condition-free voting with Redis-based locking
- **Key Image Linking**: Prevents double-voting without revealing voter identity

### 📝 **Content Review Pipeline**
- **Multi-stage Review**: Submitter → Vetter → Community voting
- **Escalation System**: Flagged content routed to human moderators
- **Audit Trail**: Immutable logs for complete transparency
- **Real-time Monitoring**: Performance metrics and API call tracking

### 🎯 **User Roles**
- **Submitters**: Upload content for review
- **Vetters**: Initial content screening and validation
- **Voters**: Anonymous community-based scoring
- **Admins**: System oversight and escalation handling

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose**
- **Python 3.11+** (for local development)
- **Node.js 18+** (for frontend development)
- **PostgreSQL 15+** & **Redis 7+** (handled by Docker)

### 🐳 Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/Dv-19/ProofPals.git
cd ProofPals

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

**Access Points:**
- 🌐 **Frontend**: http://localhost
- 🔧 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs

### 🛠️ Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp env.example .env
# Edit .env with your database credentials

# Initialize database
python init_db.py

# Start development server
python main.py
```

#### Frontend Setup
```bash
cd proofpals-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
ProofPals/
├── 🔧 backend/                 # FastAPI backend
│   ├── main.py                 # Main application entry
│   ├── models.py               # Database models
│   ├── auth_service.py         # Authentication & credentials
│   ├── crypto_service.py       # Ring signature implementation
│   ├── token_service.py        # Atomic token management
│   ├── vote_service.py         # Voting logic
│   ├── escalation_service.py   # Content escalation
│   └── tests/                  # Comprehensive test suite
├── 🎨 proofpals-frontend/      # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API integration
│   │   └── types/              # TypeScript definitions
│   └── public/                 # Static assets
├── 🔐 pp_clsag_core/          # Rust cryptographic library
├── 🐳 docker-compose.yml      # Multi-service orchestration
└── 📋 DEPLOYMENT.md           # Deployment guide
```

## 🔧 Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **PostgreSQL**: Primary database with ACID compliance
- **Redis**: Caching and atomic operations
- **SQLAlchemy**: ORM with Alembic migrations
- **Pydantic**: Data validation and serialization

### Frontend
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Query**: Server state management
- **Zustand**: Client state management

### Cryptography
- **Ring Signatures**: Anonymous voting mechanism
- **Blind Signatures**: Privacy-preserving credentials
- **Key Images**: Double-spending prevention
- **Rust Integration**: High-performance crypto operations

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
python -m pytest

# Run specific test categories
python test_integration.py      # Integration tests
python test_concurrency.py      # Concurrency tests
python sybil_attack_test.py     # Security tests

# Performance testing
python performance_metrics.py
```

### Frontend Tests
```bash
cd proofpals-frontend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🔒 Security Features

### Cryptographic Guarantees
- **Anonymity**: Ring signatures hide voter identity among group members
- **Unlinkability**: Votes cannot be linked to voters
- **Unforgeability**: Only authorized users can create valid signatures
- **Double-spend Prevention**: Key images prevent multiple votes

### System Security
- **Atomic Operations**: Redis-based locking prevents race conditions
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API endpoint protection
- **Audit Logging**: Complete action traceability

## 📊 Monitoring & Analytics

- **Real-time Metrics**: API response times, error rates
- **Performance Reports**: Automated system health checks
- **Escalation Tracking**: Content review pipeline monitoring
- **User Activity**: Anonymous usage statistics

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production deployment instructions including:
- Cloud provider setup (AWS, GCP, Azure)
- SSL/TLS configuration
- Environment variables
- Scaling considerations
- Monitoring setup

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Run tests**: Ensure all tests pass
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure Docker builds succeed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **MLH Midnight Hack**: Original hackathon project
- **Ring Signature Research**: Academic cryptography community
- **Open Source Libraries**: All the amazing tools that made this possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Dv-19/ProofPals/issues)
- **Documentation**: Check `/backend/README.md` for detailed backend docs
- **API Reference**: Visit `/docs` endpoint when running locally

---

**Built with ❤️ for anonymous, secure journalism review**
