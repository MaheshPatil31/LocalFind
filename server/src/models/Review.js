import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  },
  { timestamps: true },
);

reviewSchema.index({ user: 1, business: 1 }, { unique: true });
reviewSchema.index({ business: 1, createdAt: -1 });
export default mongoose.model('Review', reviewSchema);
