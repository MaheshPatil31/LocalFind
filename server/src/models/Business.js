import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: '',
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      default: 'Hyderabad',
    },

    area: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^[1-9][0-9]{5}$/,
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
      },

      coordinates: {
        type: [Number],
      },
    },

    services: [
      {
        type: String,
        trim: true,
        maxlength: 100,
      },
    ],

    workingHours: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    images: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
          maxlength: 2048,
        },

        publicId: {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
        },
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

businessSchema.index({
  owner: 1,
  createdAt: -1,
});

businessSchema.index({
  status: 1,
  category: 1,
  area: 1,
  createdAt: -1,
});

businessSchema.index({
  location: '2dsphere',
});

export default mongoose.model('Business', businessSchema);