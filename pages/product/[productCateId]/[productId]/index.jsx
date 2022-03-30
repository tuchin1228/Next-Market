import React from 'react'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import ProductDetailCatousel from "../../../../components/ProductDetailCatousel";
import axios from "axios";
import styles from "../../../../styles/Product.module.css";
import Link from "next/link";
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function index({ product, productAddition, productDetail, productImages }) {
  console.log('product', product);
  console.log('productAddition', productAddition);
  console.log('productDetail', productDetail);
  console.log('productImages', productImages);

  const [checkBoxProduct, setCheckBoxProduct] = useState({}); //勾選的商品
  const [tempCount, setTempCount] = useState(1); //商品數量
  const [activeTab, setActiveTab] = useState(1); //下方三個標籤切換

  useEffect(() => {
    //初始化預設第一個商品
    productDetail && productDetail.length > 0 ? setCheckBoxProduct(productDetail[0]) : null;
  }, [])

  useEffect(() => {
    //選擇的商品更改時數量要重置
    setTempCount(count => count = 1)
  }, [checkBoxProduct])
  

  //更改數量，要判斷是否超過最大可購買量
  const SetTempCount = (type, InputCount) => {
    console.log('InputCount', InputCount);
    switch (type) {
      case 'add':
        let EnableBuy = CheckMaxQuantity();
        EnableBuy ? setTempCount(count => count + 1) : (function () {
          window.alert('超過最大量')
          setTempCount(Math.round(checkBoxProduct.max_quantity))
        })();
        break;
      case 'minus':
        tempCount <= 1 ? setTempCount(1) : setTempCount(count => count - 1)
        break;
      case 'input':
        let InputEnableBuy = CheckMaxQuantity(InputCount);
        InputEnableBuy ? setTempCount(Math.round(InputCount)) : (function () {
          window.alert('超過最大量')
          setTempCount(Math.round(checkBoxProduct.max_quantity))
        })();
        break;
    }
  }

  //檢查每人最大購買量
  const CheckMaxQuantity = (InputCount) => {
    let maxQuantity = checkBoxProduct.max_quantity
    if (!maxQuantity || !InputCount && tempCount < maxQuantity || (InputCount && (Math.round(InputCount) < maxQuantity)) ) { //不限量或未超過，可購買
      return true
    } else {
      return false
    }
  }

  const ToggleTab = (tab) =>{
    setActiveTab(count => count = tab)
  }
  
  const showcheckBoxProduct = () => {
    console.log(checkBoxProduct);
  }

  return (
    <>

      <Navbar />

      <article className='min-h-screen mt-24 relative py-10  max-w-7xl mx-auto '>
        <section className="grid grid-cols-2">
          <div className='p-10'>
            <ProductDetailCatousel productImages={productImages} />
          </div>
          <div className='p-10 '>
            <section className='border-b pb-3'>
              <h2 className='text-3xl font-medium tracking-wider  text-yellow-900 pb-2 '>{product.productName}</h2>
              <p className='mt-2 text-gray-600 tracking-widest font-light text-base text-justify leading-relaxed'>{product.productIntro}</p>
            </section>
            {
              product.tagName ? (
                <section className='py-5 border-b'>
                  <span className='py-1 px-2' style={{ background: `${product.bgColor}`, color: `${product.textColor}` }}>{product.tagName}</span>
                </section>
              ) : null
            }

            {
              productDetail && productDetail.length > 0 ? (
                <div className='py-5 mt-3'>
                  {
                    productDetail.map((detail, idx) => (
                      <div key={detail.productDetailId} className={`flex items-center py-2 px-2 my-1 ${idx % 2 == 0 ? 'bg-orange-100' : 'bg-orange-50'}`}>
                        <div className="checkBox px-2">
                          <input type="radio"
                            name={`productDetail`}
                            id={`detail${detail.productDetailId}`}
                            className={`hidden ${styles.radioBox}`}
                            onChange={() => { }}
                            checked={(checkBoxProduct && checkBoxProduct.productDetailId == detail.productDetailId)} />
                          <label htmlFor={`detail${detail.productDetailId}`} className={`${styles.checkBoxLabel} `}></label>
                        </div>
                        <section className={` tracking-widest flex-grow `}
                          onClick={() => setCheckBoxProduct(detail)}>
                          <h3 className='text-yellow-900 font-medium mb-1 text-md'>{detail.productDetailName}</h3>
                          {detail.salePrice && detail.salePrice < detail.originPrice ? (
                            <h4 className='tracking-widest text-red-500 text-md'><span className='text-sm text-gray-400' style={{textDecoration:'line-through'}}>原價：NTD ${Math.round(detail.originPrice)}</span>　優惠價：NTD ${Math.round(detail.salePrice)}</h4>
                          ) : (
                            <h4 className='tracking-widest text-gray-700 text-md'>售　價：NTD ${Math.round(detail.originPrice)}</h4>
                          )}

                        </section>
                      </div>
                    ))
                  }
                </div>
              ) : null
            }

            <div className='py-5 my-3 flex items-center'>
              <h3 className={`text-lg font-light mr-5 text-gray-600 `}>數 量</h3>
              <div className='flex '>
                <button type='button' onClick={() => SetTempCount('minus')} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                <input type="number" name="" id="" onChange={(e) => SetTempCount('input', e.target.value)} value={tempCount} className={`${styles.CartCountInput} text-lg text-yellow-900 border-2 border-yellow-900`} />
                <button type='button' onClick={() => SetTempCount('add')} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>+</button>
              </div>
            </div>

            <div>
              <button type='button' onClick={() => showcheckBoxProduct()} className='bg-yellow-500 hover:bg-yellow-400 text-white py-3 px-5 my-3 mr-6 text-xl tracking-widest'>加入購物車</button>
              <button type='button' className='bg-yellow-900 hover:bg-yellow-800 text-white py-3 px-5 my-3 mr-6 text-xl tracking-widest'>立即購買</button>
            </div>


          </div>


        </section>

      </article >

      <article className='mb-10  max-w-7xl mx-auto'>
        <div className='grid grid-cols-3 gap-1  '>
          <a href="javascript:;" onClick={()=>ToggleTab(1)} className={`w-full text-center py-2 text-xl ${activeTab == 1 ? 'text-white bg-yellow-900 hover:bg-yellow-800 ':'text-yellow-900 bg-orange-100 hover:bg-yellow-900 hover:text-white'} transition-all duration-150`}>商品介紹</a>
          <a href="javascript:;" onClick={()=>ToggleTab(2)} className={`w-full text-center py-2 text-xl ${activeTab == 2 ? 'text-white bg-yellow-900 hover:bg-yellow-800 ':'text-yellow-900 bg-orange-100 hover:bg-yellow-900 hover:text-white'} transition-all duration-150`}>商品組成</a>
          <a href="javascript:;" onClick={()=>ToggleTab(3)} className={`w-full text-center py-2 text-xl ${activeTab == 3 ? 'text-white bg-yellow-900 hover:bg-yellow-800 ':'text-yellow-900 bg-orange-100 hover:bg-yellow-900 hover:text-white'} transition-all duration-150`}>購物須知</a>
        </div>
        <div className='htmlTemplate py-5'>
          
          <div className={`${activeTab == 1 ? '':'hidden'} `} dangerouslySetInnerHTML={{ __html: product.description }}></div>
          <div className={`${activeTab == 2 ? '':'hidden'} `} dangerouslySetInnerHTML={{ __html: product.composition }}></div>
          <div className={`${activeTab == 3 ? '':'hidden'} `} dangerouslySetInnerHTML={{ __html: product.buyflow }}></div>

        </div>

      </article>
      <Footer />

    </>
  )
}


export async function getServerSideProps({ query }) {

  let ProductRes = await axios.get(`${process.env.API_URL}/Product/product/${query.productId}`);
  // return { props: { res: ProductRes.data } }

  return { props: { product: ProductRes.data.product, productAddition: ProductRes.data.productAddition, productDetail: ProductRes.data.productDetail, productImages: ProductRes.data.productImages } }

}