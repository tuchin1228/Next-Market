import React from 'react'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCatousel from "../../components/ProductCatousel";
import axios from "axios";
import styles from "../../styles/Product.module.css";
import Link from "next/link";
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Index({ category, product, productImages }) {
    console.log(category);
    console.log(product);
    console.log(productImages);

    const router = useRouter()
    const { productCateId } = router.query

    const FilterProductImage = (productId) => {
        return productImages.filter(image => image.product_id == productId)
    }

    return (
        <>

            <Navbar />


            <article className='min-h-screen mt-20 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center font-light tracking-widest', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <section className='py-10 max-w-7xl mx-auto '>
                    <h2 className='text-3xl my-16 text-center font-light tracking-widest text-yellow-900'>產 品 介 紹<br /><span className='text-lg'>Our Products</span></h2>
                    <div className='grid grid-cols-4 gap-2 py-5'>
                        <section className='col-span-4 md:col-span-1'>
                            <article className=' border border-yellow-900 text-xl  mb-2'>
                                <Link href={`/product`}>
                                    <a className={`block text-center text-yellow-900 hover:bg-yellow-900 hover:text-white  transition-all duration-200 py-2`}>所有商品</a>
                                </Link>
                            </article>
                            {
                                category ? category.map(item => (
                                    <article key={item.id} className=' border border-yellow-900 text-xl  my-2'>
                                        <Link href={`/product/${item.id}`}>
                                            <a className={`block text-center  transition-all duration-200 py-2 ${item.id == productCateId ? 'text-white bg-yellow-900 hover:bg-yellow-800 ' : 'text-yellow-900 hover:bg-yellow-900 hover:text-white'}`}>{item.productCateName}</a>
                                        </Link>
                                    </article>
                                )) : null
                            }
                        </section>
                        <section className='col-span-4 md:col-span-3 grid grid-cols-3 gap-2'>
                            {
                                product ? product.map(item => (
                                    <div key={item.productId} className="bg-white p-3 shadow-xl">
                                        <ProductCatousel productId={item.productId} productImages={FilterProductImage(item.productId)} />
                                        <div className=' p-2'>
                                            <h2 className=' text-2xl  tracking-wider font-bold pb-2 '>{item.productName}</h2>
                                            <div style={{ height: '60px' }}>
                                                <p className={` text-gray-500 font-light tracking-wider ${styles.overTwoLineHidden} `}>{item.productIntro}</p>
                                            </div>
                                            <div className="">
                                                <p className='text-right text-4xl font-bold text-yellow-900'><span className='text-2xl align-top'>$</span>{Math.round(item.salePrice)}</p>
                                            </div>
                                            <div className='mt-3 '>
                                                <a href="" className='block ml-auto mr-0 w-full text-center px-3 py-2 bg-yellow-900 hover:bg-yellow-800 text-white text-xl'><FontAwesomeIcon icon={faCartPlus}></FontAwesomeIcon> 立即購買</a>
                                            </div>
                                        </div>
                                    </div>
                                )) : null
                            }
                            <div></div>
                        </section>
                    </div>
                </section>

            </article >


            <Footer />

        </>
    )
}


export async function getServerSideProps({ query }) {

    let ProductRes = await axios.get(`${process.env.API_URL}/Product/${query.productCateId}`);
    return { props: { category: ProductRes.data.category, product: ProductRes.data.product, productImages: ProductRes.data.productImages } }

}