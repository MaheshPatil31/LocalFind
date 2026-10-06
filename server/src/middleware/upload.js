import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (request, file, callback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error('Only JPG, PNG, and WebP images are allowed.'),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;