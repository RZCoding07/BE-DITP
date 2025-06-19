import { DataTypes } from 'sequelize';
import { db_immature } from '../../config/Database.js';

const WeeklyProgress = db_immature.define('weekly_progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  project_id: {
  type: DataTypes.UUID,
    allowNull: false,
  },
  week_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['project_id', 'week_number'],
    },
  ],
});

export default WeeklyProgress;