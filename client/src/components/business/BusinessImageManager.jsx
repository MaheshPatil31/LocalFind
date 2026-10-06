import React from 'react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { businessApi } from '../../services/api.js';

const MAX_IMAGES = 6;

export default function BusinessImageManager({
  businessId,
  images = [],
  onImagesChange,
}) {
  const { token } = useAuth();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function selectFiles(event) {
    const files = Array.from(event.target.files || []);

    setError('');
    setMessage('');

    const remainingSlots =
      MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`,
      );
      event.target.value = '';
      return;
    }

    const filesToUse = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setError(
        `Only ${remainingSlots} more image${
          remainingSlots === 1 ? '' : 's'
        } can be selected.`,
      );
    }

    setSelectedFiles(filesToUse);
  }

  async function uploadImages() {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const result = await businessApi.uploadImages(
        token,
        businessId,
        selectedFiles,
      );

      onImagesChange(result.images);

      setSelectedFiles([]);
      setMessage('Images uploaded successfully.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(publicId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this image?',
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(publicId);
    setError('');
    setMessage('');

    try {
      const result = await businessApi.deleteImage(
        token,
        businessId,
        publicId,
      );

      onImagesChange(result.images);

      setMessage('Image deleted successfully.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId('');
    }
  }

  return (
    <section className="business-image-manager">
      <div className="business-image-manager-header">
        <div>
          <p className="eyebrow">Business photos</p>

          <h2>Manage images</h2>

          <p className="page-copy">
            Upload up to {MAX_IMAGES} JPG, PNG, or WebP
            images. Each image can be up to 5 MB.
          </p>
        </div>

        <span>
          {images.length}/{MAX_IMAGES}
        </span>
      </div>

      {images.length > 0 && (
        <div className="business-image-grid">
          {images.map((image) => (
            <div
              className="business-image-item"
              key={image.publicId}
            >
              <img
                src={image.url}
                alt="Business"
              />

              <button
                type="button"
                onClick={() =>
                  deleteImage(image.publicId)
                }
                disabled={deletingId === image.publicId}
              >
                {deletingId === image.publicId
                  ? 'Deleting…'
                  : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="empty-state">
          No business images uploaded yet.
        </p>
      )}

      {images.length < MAX_IMAGES && (
        <div className="business-image-upload">
          <label>
            Select images

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={selectFiles}
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="selected-image-list">
              <p>
                Selected {selectedFiles.length}{' '}
                image
                {selectedFiles.length === 1
                  ? ''
                  : 's'}
                :
              </p>

              <ul>
                {selectedFiles.map((file) => (
                  <li key={`${file.name}-${file.lastModified}`}>
                    {file.name}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={uploadImages}
                disabled={uploading}
              >
                {uploading
                  ? 'Uploading…'
                  : 'Upload images'}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {message && (
        <p className="form-success">
          {message}
        </p>
      )}
    </section>
  );
}