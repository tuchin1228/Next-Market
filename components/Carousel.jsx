import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

export default function Carousel() {
  const [carousels, setCarousels] = useState([]);
  const [WindowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    GetCarousel();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //存取畫面寬度
  const handleResize = () => {
    // console.log(window.innerWidth);
    setWindowWidth(window.innerWidth);
  };

  //取得輪播
  const GetCarousel = async () => {
    let res = await axios.get(`${process.env.API_URL}/Carousel/GetCarousel`);
    console.log(res);
    if (res.data.success) {
      setCarousels(res.data.carousels);
    }
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <div className="relative mt-20 -mb-2 z-10">
      {WindowWidth > 768 ? (
        // 桌機版
        <Slider {...settings}>
          {carousels ? (
            carousels.map((item) => {
              if (item.size == 0) {
                return (
                  <div key={item.id}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <img className="w-full"
                        src={
                          process.env.Image_URL + "/Carousel/" + item.filename
                        }
                        alt=""
                      />
                    </a>
                  </div>
                );
              }
            })
          ) : (
            <div></div>
          )}
        </Slider>
      ) : (
        // 手機版
        <Slider {...settings}>
          {carousels ? (
            carousels.map((item) => {
              if (item.size == 1) {
                return (
                  <div key={item.id}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <img
                        src={
                          process.env.Image_URL + "/Carousel/" + item.filename
                        }
                        alt=""
                      />
                    </a>
                  </div>
                );
              }
            })
          ) : (
            <div></div>
          )}
        </Slider>
      )}
    </div>
  );
}
