import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importa tus imágenes con la ruta correcta
import image1 from '../Img/Img01.jpg';
import image2 from '../Img/Img02.jpg';
import image3 from '../Img/Img03.jpg';

// Asigna las imágenes importadas al array
const images = [image1, image2, image3];

export default function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-16">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="outline-none">
            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-[400px] object-cover" />
          </div>
        ))}
      </Slider>
    </div>
  );
}

