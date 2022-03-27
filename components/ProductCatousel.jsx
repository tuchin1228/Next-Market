import { useState, useEffect, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductCatousel({ productId, productImages }) {

    console.log('productImages', productImages);
    var settings = {
        dots: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
    };
    return (
        <div className="relative overflow-x-hidden">
            <Slider {...settings}>
                {productImages ? (
                    productImages.map((item) => {
                        return (
                            <div key={item.id} className="relative" >
                                <div className="bg-no-repeat bg-cover bg-center hover:brightness-105 transition-all duration-200" style={{ padding: '50% 0', backgroundImage: `url(${process.env.Image_URL}/product/${item.product_id}/product/${item.filename})` }}>
                                </div>
                            </div>
                        );
                    })
                ) : <div></div>
                }
            </Slider >
        </div >
    )
}
