import React from "react";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
// Import required actions.
import { max, byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { fill } from "@cloudinary/url-gen/actions/resize";
const ProfileAvatar = ({ profilePic, width }) => {
  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dpc7wncat",
    },
  });
  // Use the image with public ID, 'front_face'.
  const myImage = cld.image(profilePic);

  // console.log(width);

  // Apply the transformation.
  myImage
    .format("png")
    .resize(fill().width(width).height(width)) // Crop the image.
    .roundCorners(max());

  // Render the transformed image in a React component.
  return (
    <div>
      <AdvancedImage
        cldImg={myImage}
        // plugins={[responsive()]}
      />
    </div>
  );
};

export default ProfileAvatar;
