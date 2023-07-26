import React, { useState } from 'react';
import EXIF from 'exif-js';

const ImageUploadWithExif = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // Read EXIF data from the selected image
    EXIF.getData(file, function () {
      const lat = EXIF.getTag(this, 'GPSLatitude');
      const lon = EXIF.getTag(this, 'GPSLongitude');

      if (lat && lon) {
        setLocation({
          latitude: convertDMSToDD(lat),
          longitude: convertDMSToDD(lon),
        });
      } else {
        setLocation(null);
      }
    });
  };

  const convertDMSToDD = (dmsArray) => {
    const degrees = dmsArray[0];
    const minutes = dmsArray[1];
    const seconds = dmsArray[2];

    return degrees + minutes / 60 + seconds / 3600;
  };

  return (
    <div>
      <h2>Image Upload with EXIF</h2>
      <form>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Selected" />}
        {location ? (
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
        ) : (
          <p>No location data found in the image EXIF.</p>
        )}
      </form>
    </div>
  );
};

export default ImageUploadWithExif;
