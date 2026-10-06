import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 25,
      default: '',
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },

    reply: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },

    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true },
);

enquirySchema.index({ business: 1, createdAt: -1 });
enquirySchema.index({ customer: 1, createdAt: -1 });

export default mongoose.model('Enquiry', enquirySchema);