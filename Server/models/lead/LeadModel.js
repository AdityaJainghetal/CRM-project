const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  parentName: String,
  city: String,
  email: String,
  neetStatus: String,
  budget: Number,
  preferredCountry: String,

  assignedToTelecaller: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assignedToCounsellor: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },

  status: { 
    type: String, 
    enum: ['New', 'Not Interested', 'Call Back', 'Interested', 'Converted', 'Dropped'],
    default: 'New' 
  },

  leadTag: { 
    type: String, 
    enum: ['Hot', 'Warm', 'Cold'],
    default: 'null' 
  },

  remarks: [{
    text: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    date: { type: Date, default: Date.now }
  }],

  followUpDate: Date,
  registrationFeePaid: { type: Boolean, default: false },
  documentsSubmitted: { type: Boolean, default: false },
  admissionLetterIssued: { type: Boolean, default: false },
  visaApplied: { type: Boolean, default: false },
  visaIssued: { type: Boolean, default: false },
  ticketBooked: { type: Boolean, default: false },
  departureDate: Date,
  departureStatus: { type: Boolean, default: false },

  collegeName: String,
  emergencyContact: String,
  serviceManager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

leadSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Lead', leadSchema);