import { useState, useEffect, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductCatousel({ productId, productImages }) {
    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();
  
    return (
        <div className="relative overflow-x-hidden">
            <Slider asNavFor={nav2} ref={(slider) => setNav1(slider)} >
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
            <Slider slidesToShow={3}
                // centerPadding={30}
                focusOnSelect={true}
                centerMode={true}
                asNavFor={nav1}
                ref={(slider) => setNav2(slider)} >
                {productImages ? (
                    productImages.map((item) => {
                        return (
                            <div key={item.id} className="relative p-1" >
                                <div className="bg-no-repeat bg-cover bg-center hover:brightness-105 transition-all duration-200" style={{ maxHeight: '300px', padding: '50% 0', backgroundImage: `url(${process.env.Image_URL}/product/${item.product_id}/product/${item.filename})` }}>
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
