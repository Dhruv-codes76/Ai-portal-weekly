const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * Service to handle multiple image uploads for a single entity (News/Tool).
 * Maps specific file fields to their uploaded URLs.
 */
const handleImageUploads = async (files, existingData, folder = 'uploads') => {
  const updatedData = { ...existingData };
  const fields = ['featuredImage', 'ogImage', 'twitterImage'];

  for (const field of fields) {
    if (files && files[field] && files[field][0]) {
      const result = await uploadToCloudinary(files[field][0].buffer, folder);
      updatedData[field] = result.secure_url;
    }
  }

  return updatedData;
};

module.exports = {
  handleImageUploads
};
