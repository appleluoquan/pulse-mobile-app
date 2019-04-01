import { SLIDE5, SLIDE7, SLIDE6, SLIDE8 } from "../../config/images";

const carouselImages = [
  {
    image: SLIDE5,
    displayBabylonLogo: true,
  },
  {
    image: SLIDE7,
    displayBabylonLogo: true,
  },
  {
    image: SLIDE6,
    displayBabylonLogo: false,
  },
  {
    image: SLIDE8,
    displayBabylonLogo: false,
  },
];

const getSlideImage = imageIdx => carouselImages[imageIdx] || carouselImages[0];

export default getSlideImage;
