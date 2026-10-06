import mongoose from 'mongoose';

import Business from '../models/Business.js';
import Enquiry from '../models/Enquiry.js';

function invalid(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function notFound(message = 'Enquiry not found.') {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

export async function createEnquiry(request, response, next) {
  try {
    const { businessId } = request.params;
    const { name, email, phone, message } = request.body;

    if (!mongoose.isValidObjectId(businessId)) {
      throw notFound('Business not found.');
    }

    if (!name?.trim() || name.trim().length < 2) {
      throw invalid('Name must be at least 2 characters.');
    }

    if (!email?.trim()) {
      throw invalid('Email is required.');
    }

    if (!message?.trim() || message.trim().length < 10) {
      throw invalid('Message must be at least 10 characters.');
    }

    if (message.trim().length > 1000) {
      throw invalid('Message cannot exceed 1000 characters.');
    }

    const business = await Business.findOne({
      _id: businessId,
      status: 'approved',
    });

    if (!business) {
      throw notFound('Business not found.');
    }

    const enquiry = await Enquiry.create({
      customer: request.user._id,
      business: business._id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      message: message.trim(),
    });

    response.status(201).json({ enquiry });
  } catch (error) {
    next(error);
  }
}

export async function getMyEnquiries(request, response, next) {
  try {
    const enquiries = await Enquiry.find({
      customer: request.user._id,
    })
      .populate('business', 'name category area city')
      .sort({ createdAt: -1 });

    response.json({ enquiries });
  } catch (error) {
    next(error);
  }
}

export async function getBusinessEnquiries(request, response, next) {
  try {
    const { businessId } = request.params;

    if (!mongoose.isValidObjectId(businessId)) {
      throw notFound('Business not found.');
    }

    const business = await Business.findOne({
      _id: businessId,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound('Business not found.');
    }

    const enquiries = await Enquiry.find({
      business: business._id,
    })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    response.json({ enquiries });
  } catch (error) {
    next(error);
  }
}

export async function updateEnquiryStatus(request, response, next) {
  try {
    const { enquiryId } = request.params;
    const { status } = request.body;

    if (!mongoose.isValidObjectId(enquiryId)) {
      throw notFound('Enquiry not found.');
    }

    if (!['new', 'read', 'resolved'].includes(status)) {
      throw invalid('Status must be new, read, or resolved.');
    }

    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      throw notFound('Enquiry not found.');
    }

    const business = await Business.findOne({
      _id: enquiry.business,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound('Enquiry not found.');
    }

    enquiry.status = status;
    await enquiry.save();

    response.json({ enquiry });
  } catch (error) {
    next(error);
  }
}

export async function replyToEnquiry(request, response, next) {
  try {
    const { enquiryId } = request.params;
    const { reply } = request.body;

    if (!mongoose.isValidObjectId(enquiryId)) {
      throw notFound('Enquiry not found.');
    }

    if (!reply?.trim()) {
      throw invalid('Reply cannot be empty.');
    }

    if (reply.trim().length > 1000) {
      throw invalid('Reply cannot exceed 1000 characters.');
    }

    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      throw notFound('Enquiry not found.');
    }

    const business = await Business.findOne({
      _id: enquiry.business,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound('Enquiry not found.');
    }

    enquiry.reply = reply.trim();

    if (enquiry.status === 'new') {
      enquiry.status = 'read';
    }

    await enquiry.save();

    response.json({ enquiry });
  } catch (error) {
    next(error);
  }
}