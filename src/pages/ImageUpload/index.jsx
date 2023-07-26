import React, { useState } from "react";
import EXIF from "exif-js";

const Upload = () => {
  const [imageURL, setImageURL] = useState("");
  const [imageName, setImageName] = useState("");
  const [location, setLocation] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setImageURL(imageURL);
    setImageName(file.name);

    // Read EXIF data and get GPS coordinates
    EXIF.getData(file, function () {
      const latitude = EXIF.getTag(this, "GPSLatitude");
      const longitude = EXIF.getTag(this, "GPSLongitude");

      if (latitude && longitude) {
        const latDegrees = latitude[0];
        const latMinutes = latitude[1];
        const latSeconds = latitude[2];

        const lonDegrees = longitude[0];
        const lonMinutes = longitude[1];
        const lonSeconds = longitude[2];

        const latitudeValue = latDegrees + latMinutes / 60 + latSeconds / 3600;
        const longitudeValue = lonDegrees + lonMinutes / 60 + lonSeconds / 3600;

        setLocation({ latitude: latitudeValue, longitude: longitudeValue });
      } else {
        setLocation(null);
      }
    });
  };

  return (
    <div>
      <h1>Upload an Image</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageURL && (
        <div>
          <img
            src={imageURL}
            alt="Uploaded Image"
            style={{ maxWidth: "300px" }}
          />
          <p>Image Location: {imageName}</p>
          {location && (
            <p>
              GPS Coordinates: {location.latitude}, {location.longitude}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
