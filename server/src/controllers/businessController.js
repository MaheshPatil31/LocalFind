import mongoose from 'mongoose';

import Business from '../models/Business.js';

import cloudinary from '../config/cloudinary.js';

import { getReviewSummary } from './reviewController.js';

const editableFields = [
  'name',
  'category',
  'description',
  'phone',
  'email',
  'address',
  'city',
  'area',
  'pincode',
  'latitude',
  'longitude',
  'services',
  'workingHours',
];

function getBusinessInput(body) {
  return Object.fromEntries(
    editableFields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );
}

function addLocation(input) {
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);

  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    return {
      ...input,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };
  }

  return input;
}

function notFound() {
  const error = new Error('Business not found.');
  error.statusCode = 404;
  return error;
}

function invalidId() {
  const error = new Error('Invalid business id.');
  error.statusCode = 400;
  return error;
}

function escapedRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pageNumber(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : fallback;
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'localfind/businesses',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}

export async function getApprovedBusinesses(
  request,
  response,
  next,
) {
  try {
    const page = pageNumber(request.query.page, 1);

    const limit = Math.min(
      pageNumber(request.query.limit, 12),
      50,
    );

    const query = {
      status: 'approved',
    };

    const search =
      typeof request.query.search === 'string'
        ? request.query.search.trim().slice(0, 100)
        : '';

    const category =
      typeof request.query.category === 'string'
        ? request.query.category.trim().slice(0, 80)
        : '';

    const area =
      typeof request.query.area === 'string'
        ? request.query.area.trim().slice(0, 100)
        : '';

    if (category) {
      query.category = {
        $regex: `^${escapedRegex(category)}$`,
        $options: 'i',
      };
    }

    if (area) {
      query.area = {
        $regex: `^${escapedRegex(area)}$`,
        $options: 'i',
      };
    }

    if (search) {
      const searchPattern = {
        $regex: escapedRegex(search),
        $options: 'i',
      };

      query.$or = [
        { name: searchPattern },
        { category: searchPattern },
        { area: searchPattern },
        { city: searchPattern },
        { services: searchPattern },
      ];
    }

    const [businesses, total] = await Promise.all([
      Business.find(query)
        .select(
          'name category description phone email address city area pincode latitude longitude services workingHours images owner createdAt',
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Business.countDocuments(query),
    ]);

    const reviewSummary = await getReviewSummary(
      businesses.map((business) => business._id),
    );

    response.json({
      businesses: businesses.map((business) => ({
        ...business.toObject(),
        ...(reviewSummary.get(
          business._id.toString(),
        ) || {
          averageRating: null,
          reviewCount: 0,
        }),
      })),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getNearbyBusinesses(
  request,
  response,
  next,
) {
  try {
    const latitude = Number(request.query.latitude);
    const longitude = Number(request.query.longitude);

    const radius = Math.min(
      Math.max(Number(request.query.radius) || 5000, 500),
      20000,
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      const error = new Error(
        'Valid latitude and longitude are required.',
      );

      error.statusCode = 400;
      throw error;
    }

    const businesses = await Business.find({
      status: 'approved',

      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },

          $maxDistance: radius,
        },
      },
    })
      .select(
        'name category description phone email address city area pincode latitude longitude services workingHours images owner createdAt',
      )
      .limit(50);

    const reviewSummary = await getReviewSummary(
      businesses.map((business) => business._id),
    );

    response.json({
      businesses: businesses.map((business) => ({
        ...business.toObject(),

        ...(reviewSummary.get(
          business._id.toString(),
        ) || {
          averageRating: null,
          reviewCount: 0,
        }),
      })),

      location: {
        latitude,
        longitude,
        radius,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getApprovedBusiness(
  request,
  response,
  next,
) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) {
      throw notFound();
    }

    const business = await Business.findOne({
      _id: request.params.businessId,
      status: 'approved',
    })
      .select(
        'name category description phone email address city area pincode latitude longitude services workingHours images owner createdAt',
      )
      .populate('owner', 'name');

    if (!business) {
      throw notFound();
    }

    const reviewSummary = await getReviewSummary([
      business._id,
    ]);

    response.json({
      business: {
        ...business.toObject(),

        ...(reviewSummary.get(
          business._id.toString(),
        ) || {
          averageRating: null,
          reviewCount: 0,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createBusiness(
  request,
  response,
  next,
) {
  try {
    const input = getBusinessInput(request.body);

    const business = await Business.create({
      ...addLocation(input),
      owner: request.user._id,
    });

    response.status(201).json({ business });
  } catch (error) {
    next(error);
  }
}

export async function getMyBusinesses(
  request,
  response,
  next,
) {
  try {
    const businesses = await Business.find({
      owner: request.user._id,
    }).sort({ createdAt: -1 });

    response.json({ businesses });
  } catch (error) {
    next(error);
  }
}

export async function getMyBusiness(
  request,
  response,
  next,
) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) {
      throw invalidId();
    }

    const business = await Business.findOne({
      _id: request.params.businessId,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound();
    }

    response.json({ business });
  } catch (error) {
    next(error);
  }
}

export async function updateMyBusiness(
  request,
  response,
  next,
) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) {
      throw invalidId();
    }

    const input = getBusinessInput(request.body);

    const business = await Business.findOne({
      _id: request.params.businessId,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound();
    }

    const updatedInput = addLocation({
      ...business.toObject(),
      ...input,
    });

    const businessUpdate = await Business.findOneAndUpdate(
      {
        _id: request.params.businessId,
        owner: request.user._id,
      },

      {
        $set: {
          ...input,
          location: updatedInput.location,
        },
      },

      {
        new: true,
        runValidators: true,
      },
    );

    response.json({
      business: businessUpdate,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMyBusiness(
  request,
  response,
  next,
) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) {
      throw invalidId();
    }

    const business = await Business.findOneAndDelete({
      _id: request.params.businessId,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound();
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Upload business images to Cloudinary
export async function uploadBusinessImages(
  request,
  response,
  next,
) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) {
      throw invalidId();
    }

    const business = await Business.findOne({
      _id: request.params.businessId,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound();
    }

    if (!request.files || request.files.length === 0) {
      const error = new Error('Please select at least one image.');
      error.statusCode = 400;
      throw error;
    }

    const maximumImages = 6;

    if (
      business.images.length + request.files.length >
      maximumImages
    ) {
      const error = new Error(
        `A business can have a maximum of ${maximumImages} images.`,
      );

      error.statusCode = 400;
      throw error;
    }

    const uploadedImages = [];

    try {
      for (const file of request.files) {
        const result = await uploadToCloudinary(file.buffer);

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    } catch (uploadError) {
      for (const image of uploadedImages) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch {
          // Ignore cleanup errors.
        }
      }

      throw uploadError;
    }

    business.images.push(...uploadedImages);

    await business.save();

    response.status(201).json({
      images: business.images,
      business,
    });
  } catch (error) {
    next(error);
  }
}

// Delete one business image from Cloudinary and MongoDB
export async function deleteBusinessImage(
  request,
  response,
  next,
) {
  try {
    if (!mongoose.isValidObjectId(request.params.businessId)) {
      throw invalidId();
    }

    const { publicId } = request.body;

    if (
      typeof publicId !== 'string' ||
      !publicId.trim()
    ) {
      const error = new Error('Image publicId is required.');
      error.statusCode = 400;
      throw error;
    }

    const business = await Business.findOne({
      _id: request.params.businessId,
      owner: request.user._id,
    });

    if (!business) {
      throw notFound();
    }

    const image = business.images.find(
      (item) => item.publicId === publicId,
    );

    if (!image) {
      const error = new Error('Image not found.');
      error.statusCode = 404;
      throw error;
    }

    await cloudinary.uploader.destroy(image.publicId);

    business.images = business.images.filter(
      (item) => item.publicId !== publicId,
    );

    await business.save();

    response.json({
      images: business.images,
    });
  } catch (error) {
    next(error);
  }
}

// Admin: get all businesses

export async function getAllBusinessesForAdmin(
  request,
  response,
  next,
) {
  try {
    const businesses = await Business.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    response.json({ businesses });
  } catch (error) {
    next(error);
  }
}

// Admin: update business status

export async function updateBusinessStatus(
  request,
  response,
  next,
) {
  try {
    const { businessId } = request.params;
    const { status } = request.body;

    if (!mongoose.isValidObjectId(businessId)) {
      throw invalidId();
    }

    const allowedStatuses = [
      'pending',
      'approved',
      'rejected',
      'suspended',
    ];

    if (!allowedStatuses.includes(status)) {
      const error = new Error('Invalid business status.');
      error.statusCode = 400;
      throw error;
    }

    const business = await Business.findByIdAndUpdate(
      businessId,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).populate('owner', 'name email');

    if (!business) {
      throw notFound();
    }

    response.json({ business });
  } catch (error) {
    next(error);
  }
}