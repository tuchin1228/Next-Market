import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { CheckLoginStatus } from '../asset/extention/AuthCheck'
import styles from "../styles/Cart.module.css";
import axios from 'axios'
import Link from "next/link";
import Cookies from 'js-cookie'
export default function Cart({ ToggleCart }) {

    const [cartProduct, setCartProduct] = useState([])
    const [cartProductAddition, setCartProductAddition] = useState([])

    useEffect(() => {
        console.log('create cart');
        // const AuthCheck = async () => {
        //     let Check = await CheckLoginStatus()
        //     if (Check) {
        //         GetCartData()
        //     }
        // };
        GetCartData()

        // AuthCheck()
    }, [])

    const GetCartData = async () => {
        console.log('GetCartData');

        let userId = Cookies.get('userId')
        let res = await axios.post(`${process.env.API_URL}/Cart/getcart`, {
            userId
        })
        console.log(res);

        if (res.data.success) {
            setCartProduct(res.data.products)
            setCartProductAddition(res.data.productAdditions)
        }

    }

    //購物車修改商品數量
    const SetProductCount = async (type, product) => {
        console.log(product);
        let userId = Cookies.get('userId')
        if (type == 'add' && product.max_quantity && (product.count + 1 > product.max_quantity)) {
            alert('超過最大限制量')
            return null;
        }
        let res = await axios.post(`${process.env.API_URL}/Cart/setcartproductcount`, {
            count: type == 'minus' ? product.count - 1 : product.count + 1,
            productId: product.productId,
            productDetailId: product.productDetailId,
            userId: userId
        })
        console.log(res);
        if (res.data.success) {
            GetCartData()
        }
    }

    //購物車修改加購品數量
    const SetAdditionCount = async (type, addition) => {
        console.log(addition);
        let userId = Cookies.get('userId')
        if (type == 'add' && addition.max_quantity && (addition.count + 1 > addition.max_quantity)) {
            alert('超過最大限制量')
            return null;
        }
        let res = await axios.post(`${process.env.API_URL}/Cart/setcartproductadditioncount`, {
            count: type == 'minus' ? addition.count - 1 : addition.count + 1,
            productId: addition.productId,
            productDetailId: addition.productDetailId,
            productAdditionId: addition.productAdditionId,
            userId: userId
        })
        console.log(res);
        if (res.data.success) {
            GetCartData()
        }
    }

    const RemoveProduct = async (product) => {
        let userId = Cookies.get('userId')
        // console.log(product);
        let res = await axios.post(`${process.env.API_URL}/Cart/removecartproduct`, {
            product,
            userId
        })
        console.log(res);
        if (res.data.success) {
            GetCartData()
        }
        // console.log(res);
    }

    return (
        <div className='cart fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg w-full max-w-2xl min-h-500 rounded-lg bg-white z-20 p-5' >
            <div className="text-right text-2xl text-gray-300 hover:text-gray-200 absolute top-3 right-3">
                <FontAwesomeIcon icon={faTimesCircle} onClick={() => ToggleCart()} />

            </div>
            <h2 className='text-4xl text-yellow-900 tracking-wider font-bold border-b border-gray-200 py-3'>購物車</h2>
            <div className='overflow-y-scroll px-2' style={{ maxHeight: '400px' }}>
                {
                    cartProduct.map((product, idx) => (

                        <div className='border-b border-gray-300' key={product.productDetailId}>
                            <div className='my-2  py-3  flex items-start' >
                                <div className='flex '>
                                    <p className='flex items-center text-lg font-medium mr-1 p-2 text-white bg-yellow-900 '>{idx + 1}</p>
                                    <div className="" style={{ width: '80px' }}>
                                        <img className='w-full'  src={process.env.Image_URL + "/product/" + product.productId + "/product/" + product.filename} alt="" />
                                    </div>
                                </div>
                                <div className='w-full ml-2'>
                                    <Link href={`/product/${product.productCateId}/${product.productId}`}>
                                        <a className='text-base md:text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{product.productDetailName}</a>
                                    </Link>
                                    <h2 className='text-sm md:text-base font-light text-gray-400 tracking-widest my-1'>{product.productName}</h2>
                                    <p>NT$ {product.salePrice && product.salePrice < product.originPrice ? Math.round(product.salePrice) : Math.round(product.originPrice)}</p>
                                    {
                                        product.count == product.max_quantity ? <p className='text-red-500'>(已達購買限制量)</p> : null
                                    }
                                    <div className='w-full flex justify-end items-center mt-6 md:mt-0'>
                                        <button type='button' onClick={() => SetProductCount('minus', product)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                        <p className='text-lg px-5 border-2'>{product.count}</p>
                                        {/* <input type="number" name="" id="" className={`${styles.CartCountInput} text-lg text-yellow-900 border-2 border-yellow-900`} /> */}
                                        <button type='button' onClick={() => SetProductCount('add', product)} disabled={product.count == product.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400`}>+</button>
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => RemoveProduct(product)} className="text-3xl text-gray-400 hover:text-gray-300 mx-2" />
                                    </div>
                                </div>

                            </div>
                            {
                                cartProductAddition.map((addition, idx) => (
                                    addition.productDetailId == product.productDetailId ? (
                                        <div key={addition.productAdditionId}>
                                            {idx == 0 ? <h2 className='text-xl md:ml-6 bg-yellow-400 text-white p-1'>加購品</h2> : null}
                                            <div className={`md:pl-6 py-1  flex items-start ${addition.delete_at || (new Date().getTime() > new Date(addition.endTime).getTime()) ? 'bg-gray-100' : ''}`} >
                                                <div className='flex '>
                                                    <p className='flex items-center text-lg font-medium mr-1 p-2 text-white bg-yellow-400 '>{idx + 1}</p>
                                                    <img className='' style={{ width: '80px' }} src={process.env.Image_URL + "/additional_product/" + addition.productAdditionId + "/" + addition.imageFilename} alt="" />
                                                </div>
                                                <div className='md:w-full ml-2 md:ml-6'>
                                                    <h3 className={`text-base md:text-xl  font-medium   text-yellow-900 tracking-widest my-1 `}>{addition.productAdditionName}</h3>
                                                    <p>NT$ {addition.forAll ? Math.round(addition.forAllPrice) : Math.round(addition.addition_price)}</p>
                                                    {
                                                        addition.count == addition.max_quantity
                                                            && !addition.delete_at
                                                            && (new Date().getTime() < new Date(addition.endTime).getTime()) ? <p className='text-base text-red-500'>(已達加購限制量)</p> : null
                                                    }
                                                    {
                                                        addition.delete_at || (new Date().getTime() > new Date(addition.endTime).getTime()) ? <p className='text-gray-500'>(已失效)</p> : null
                                                    }

                                                    <div className='w-full flex justify-end '>
                                                        <button type='button' onClick={() => SetAdditionCount('minus', addition)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                                        <p className='text-lg px-5 border-2'>{addition.count}</p>
                                                        {/* <input type="number" name="" id="" className={`${styles.CartCountInput} text-lg text-yellow-900 border-2 border-yellow-900`} /> */}
                                                        <button type='button' onClick={() => SetAdditionCount('add', addition)} disabled={addition.count == addition.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400 `}>+</button>
                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => RemoveProduct(addition)} className="text-3xl text-gray-400 hover:text-gray-300 mx-2" />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>) : null
                                ))
                            }
                        </div>

                    ))
                }
                {/* <div className=' my-2'>
                    {
                        cartProductAddition && cartProductAddition.length > 0 ? <h2 className='text-xl bg-yellow-400 text-white p-1'>加購品</h2> : null}

                </div> */}
            </div>
            {
                cartProduct.length == 0 && cartProductAddition.length == 0 ? (
                    <div className="">
                        <h2 className='text-center text-gray-300 font-bold text-4xl my-10'>購物車沒有商品!</h2>
                        <button type='button' className=' w-full text-center py-2 text-white text-xl rounded-md bg-yellow-900 hover:bg-yellow-800' onClick={() => ToggleCart()}>繼續購買</button>
                    </div>

                ) : (
                    <div className=' grid grid-cols-2 gap-1 p-2 border-t border-gray-200'>
                        <button type='button' className='text-center py-2 text-white text-xl rounded-md bg-yellow-900 hover:bg-yellow-800' onClick={() => ToggleCart()}>繼續購買</button>
                        <Link href={`/cart/checkout`}>
                            <a className='text-center py-2 text-white text-xl rounded-md bg-red-500 hover:bg-red-400'>結　　帳</a>
                        </Link>
                    </div >
                )
            }

        </div >
    )
}
