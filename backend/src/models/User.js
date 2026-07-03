const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'employee'),
    defaultValue: 'employee',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: 'users',
});

// Hash password before saving
User.beforeCreate(async (user) => {
  user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('passwordHash')) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
  }
});

// Method to compare passwords
User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Method to get safe user data (without password)
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.passwordHash;
  return values;
};

module.exports = User;
