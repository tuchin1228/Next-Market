import React from 'react'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductDetailCatousel from "../../components/ProductDetailCatousel";
import axios from "axios";
import styles from "../../styles/Cart.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { CheckLoginStatus } from '../../asset/extention/AuthCheck'
import Cookies from 'js-cookie'
import City from '../../asset/extention/tw_city'
import Head from "next/head";


export default function Checkout() {
    const router = useRouter()
    const [consistent, setConsistent] = useState(false)
    const [PayName, setPayName] = useState('')
    const [PayPhone, setPayPhone] = useState('')
    const [ReceiveName, setReceiveName] = useState('')
    const [ReceivePhone, setReceivePhone] = useState('')
    const [PayAddress, setPayAddress] = useState('')
    const [ReceiveAddress, setReceiveAddress] = useState('')
    const [PayCityName, setPaysetCityName] = useState('')
    const [PayAreaName, setPaysetAreaName] = useState('')
    const [ReceiveCityName, setReceiveCityName] = useState('')
    const [ReceiveAreaName, setReceiveAreaName] = useState('')
    const [remark, setRemark] = useState('')

    const [cartProduct, setCartProduct] = useState([])
    const [cartProductAddition, setCartProductAddition] = useState([])

    const [PayAreaArrray, setPayAreaArrray] = useState([])
    const [ReceiveAreaArrray, setReceiveAreaArrray] = useState([])

    useEffect(() => {
        const AuthCheck = async () => {
            let Check = await CheckLoginStatus()
            if (!Check) {
                router.push('/')
            }
        };

        AuthCheck()

        setPaysetCityName(Object.keys(City)[0])
        setReceiveCityName(Object.keys(City)[0])
        GetCartData()
    }, [])

    // ?????????????????????????????????
    useEffect(() => {
        if (!PayCityName) return null;
        setPayAreaArrray(City[`${PayCityName}`])
        setPaysetAreaName(City[`${PayCityName}`][0])
    }, [PayCityName])
    useEffect(() => {
        if (!ReceiveCityName) return null;
        setReceiveAreaArrray(City[`${ReceiveCityName}`])
        setReceiveAreaName(City[`${ReceiveCityName}`][0])
    }, [ReceiveCityName])

    // ??????????????????
    const UpdateCitySelect = (e) => {
        setCityName(e.target.value)
    }
    // ??????????????????
    const UpdateAreaSelect = (e) => {
        setAreaName(e.target.value)
    }

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
    //???????????????????????????
    const SetProductCount = async (type, product) => {
        console.log(product);
        let userId = Cookies.get('userId')
        if (type == 'add' && product.max_quantity && (product.count + 1 > product.max_quantity)) {
            alert('?????????????????????')
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

    //??????????????????????????????
    const SetAdditionCount = async (type, addition) => {
        console.log(addition);
        let userId = Cookies.get('userId')
        if (type == 'add' && addition.max_quantity && (addition.count + 1 > addition.max_quantity)) {
            alert('?????????????????????')
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

    //??????
    const Total = () => {
        let total = 0;
        cartProduct.forEach(item => item.salePrice ? total += Math.round(item.salePrice) * item.count : total += Math.round(item.originPrice) * item.count)
        cartProductAddition.forEach(item => item.forAll ? total += Math.round(item.forAllPrice) * item.count : total += Math.round(item.addition_price) * item.count)
        return total;
    }

    // ??????
    const checkout = async () => {
        let userId = Cookies.get('userId')

        if (consistent && (
            !PayName ||
            !PayPhone ||
            !PayCityName ||
            !PayAreaName ||
            !PayAddress)) {
            alert('?????????????????????!')
            return null;
        } else if (!consistent && (
            !PayName ||
            !PayPhone ||
            !PayCityName ||
            !PayAreaName ||
            !PayAddress ||
            !ReceiveName ||
            !ReceivePhone ||
            !ReceiveAddress ||
            !ReceiveCityName ||
            !ReceiveAreaName)) {
            alert('?????????????????????!')
            return null;
        }
        let res = await axios.post(`${process.env.API_URL}/Checkout/checkout`, {
            PayName,
            PayPhone,
            PayCityName,
            PayAreaName,
            PayAddress,
            ReceiveName,
            ReceivePhone,
            ReceiveAddress,
            ReceiveCityName,
            ReceiveAreaName,
            remark,
            cartProduct,
            cartProductAddition,
            userId,
            consistent
        })
        console.log(res);
        console.log('??????');
        if (res.data.success) {
            alert('?????????????????????????????????????????????')
            router.push(`/order/pay/${res.data.orderId}`)
        }
    }

    // ?????????????????????
    const ConsistentInfo = () => {
        console.log('ConsistentInfo', consistent);
        if (consistent) {
            setReceiveName(PayName)
            setReceivePhone(PayPhone)
            setReceiveCityName(PayCityName)
            setReceiveAreaName(PayAreaName)
            setReceiveAddress(PayAddress)
        } else {
            setReceiveName('')
            setReceivePhone('')
            setReceiveCityName('')
            setReceiveAreaName('')
            setReceiveAddress('')
        }

        setConsistent(!consistent)

    }

    return (
        <>
            <Head>
                <title>???????????? - ???????????????</title>
            </Head>
            <Navbar />

            <article className='min-h-screen my-32 rounded-xl relative px-5 md:p-10  max-w-7xl mx-auto bg-white'>

                <h2 className='text-4xl text-yellow-900 tracking-wider font-bold border-b border-gray-200 py-3'>?????????</h2>
                <div className="hidden md:grid grid-cols-6">
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center col-span-2'>??????</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>??????</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>??????</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>??????</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>??????</p>
                </div>
                <div className=' ' >

                    {
                        cartProduct.map((product, idx) => (

                            <div className='border-b border-gray-300' key={product.productDetailId}>


                                <div className='my-2  pt-3  md:grid grid-cols-6 items-center ' >
                                    <div className='flex items-start col-span-2'>
                                        <p className='self-stretch flex items-center text-lg font-medium mr-1 p-2 text-white bg-yellow-900 '>{idx + 1}</p>
                                        <img className='' style={{ width: '80px' }} src={process.env.Image_URL + "/product/" + product.productId + "/product/" + product.filename} alt="" />
                                        <div className='ml-2'>
                                            <Link href={`/product/${product.productCateId}/${product.productId}`}>
                                                <a className='text-lg lg:text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{product.productDetailName}</a>
                                            </Link>
                                            <h2 className='text-sm lg:text-base font-light text-gray-400 tracking-widest'>{product.productName}</h2>
                                            {
                                                product.count == product.max_quantity ? <p className='text-red-500'>(?????????????????????)</p> : null
                                            }
                                        </div>
                                    </div>
                                    {/* <div className='w-full ml-6'> */}
                                    {/* <div className="grid grid-cols-4 items-center"> */}

                                    {/* md up */}
                                    <p className=' text-center text-xl text-yellow-900 font-bold  mt-2  hidden md:block'>$ {product.salePrice ? Math.round(product.salePrice) : Math.round(product.originPrice)}</p>
                                    <p className=' text-center text-xl text-yellow-900 font-bold  mt-2  hidden md:block'>$ {product.salePrice ? Math.round(product.salePrice * product.count) : Math.round(product.originPrice * product.count)}</p>

                                    {/* md down */}
                                    <div className="grid grid-cols-2 md:hidden my-2 border border-orange-200">
                                        <div>
                                            <h2 className="text-center bg-orange-200 text-yellow-800">??????</h2>
                                            <p className="text-center">$ {product.salePrice ? Math.round(product.salePrice) : Math.round(product.originPrice)}</p>
                                        </div>
                                        <div>
                                            <h2 className="text-center bg-orange-200 text-yellow-800">??????</h2>
                                            <p className="text-center">$ {product.salePrice ? Math.round(product.salePrice * product.count) : Math.round(product.originPrice * product.count)}</p>
                                        </div>
                                    </div>

                                    {/* md up */}
                                    <div className='w-full justify-center items-center hidden md:flex'>
                                        <button type='button' onClick={() => SetProductCount('minus', product)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                        <p className='text-lg px-5 border-2'>{product.count}</p>
                                        <button type='button' onClick={() => SetProductCount('add', product)} disabled={product.count == product.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400`}>+</button>
                                    </div>
                                    <div className="text-center hidden md:block">
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => RemoveProduct(product)} className="text-3xl text-gray-400 hover:text-gray-300 mx-2" />
                                    </div>

                                    {/* md down */}
                                    <div className='flex justify-end items-center md:hidden'>
                                        <div className='flex justify-center items-center '>
                                            <button type='button' onClick={() => SetProductCount('minus', product)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                            <p className='text-lg px-5 border-2'>{product.count}</p>
                                            <button type='button' onClick={() => SetProductCount('add', product)} disabled={product.count == product.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400`}>+</button>
                                        </div>
                                        <div className="text-center">
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => RemoveProduct(product)} className="text-3xl text-gray-400 hover:text-gray-300 mx-2" />
                                        </div>
                                    </div>
                                    {/* </div> */}

                                    {/* </div> */}

                                </div>
                                {
                                    cartProductAddition.map((addition, addtionidx) => (
                                        addition.productDetailId == product.productDetailId ? (
                                            <div key={addition.productAdditionId} className="pb-3">
                                                <h2 className='text-xl  bg-yellow-400 text-white p-1'>?????????</h2>
                                                <div className={` py-1 md:grid grid-cols-6 items-center  ${addition.delete_at || (new Date().getTime() > new Date(addition.endTime).getTime()) ? 'bg-gray-100' : ''}`} >

                                                    <div className='flex items-start col-span-2'>
                                                        {/* <p className='self-stretch flex items-center text-lg font-medium mr-1 p-2 text-white bg-yellow-400 '>{addtionidx + 1}</p> */}
                                                        <img className='' style={{ width: '80px' }} src={process.env.Image_URL + "/additional_product/" + addition.productAdditionId + "/" + addition.imageFilename} alt="" />
                                                        <div className='ml-2'>
                                                            <h3 className={`text-lg lg:text-xl  font-medium   text-yellow-900 tracking-widest  `}>{addition.productAdditionName}</h3>
                                                            {
                                                                addition.count == addition.max_quantity
                                                                    && !addition.delete_at
                                                                    && (new Date().getTime() < new Date(addition.endTime).getTime()) ? <p className='text-red-500'>(?????????????????????)</p> : null
                                                            }
                                                            {
                                                                addition.delete_at || (new Date().getTime() > new Date(addition.endTime).getTime()) ? <p className='text-gray-500'>(?????????)</p> : null
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* md up */}
                                                    <p className='text-center text-xl text-yellow-900 font-bold hidden md:block'>$ {addition.forAll ? Math.round(addition.forAllPrice) : Math.round(addition.addition_price)}</p>
                                                    <p className='text-center text-xl text-yellow-900 font-bold hidden md:block'>$ {addition.forAll ? Math.round(addition.forAllPrice * addition.count) : Math.round(addition.addition_price * addition.count)}</p>
                                                    <div className='w-full  justify-center hidden md:flex'>
                                                        <button type='button' onClick={() => SetAdditionCount('minus', addition)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                                        <p className='text-lg px-5 border-2'>{addition.count}</p>
                                                        {/* <input type="number" name="" id="" className={`${styles.CartCountInput} text-lg text-yellow-900 border-2 border-yellow-900`} /> */}
                                                        <button type='button' onClick={() => SetAdditionCount('add', addition)} disabled={addition.count == addition.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400 `}>+</button>

                                                    </div>
                                                    <div className='text-center hidden md:block'>
                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => RemoveProduct(addition)} className="text-3xl text-gray-400 hover:text-gray-300 mx-2" />
                                                    </div>


                                                    {/* md down */}
                                                    <div className="grid grid-cols-2 md:hidden my-2 border border-orange-200">
                                                        <div>
                                                            <h2 className="text-center bg-orange-200 text-yellow-800">??????</h2>
                                                            <p className="text-center">$ {addition.forAll ? Math.round(addition.forAllPrice) : Math.round(addition.addition_price)}</p>
                                                        </div>
                                                        <div>
                                                            <h2 className="text-center bg-orange-200 text-yellow-800">??????</h2>
                                                            <p className="text-center">$ {addition.forAll ? Math.round(addition.forAllPrice * addition.count) : Math.round(addition.addition_price * addition.count)}</p>
                                                        </div>
                                                    </div>
                                                    {/* md down */}
                                                    <div className='flex justify-end items-center md:hidden'>
                                                        <div className='flex justify-center items-center'>
                                                            <button type='button' onClick={() => SetAdditionCount('minus', addition)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                                            <p className='text-lg px-5 border-2'>{addition.count}</p>
                                                            {/* <input type="number" name="" id="" className={`${styles.CartCountInput} text-lg text-yellow-900 border-2 border-yellow-900`} /> */}
                                                            <button type='button' onClick={() => SetAdditionCount('add', addition)} disabled={addition.count == addition.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400 `}>+</button>

                                                        </div>
                                                        <div className='text-center hidden md:block'>
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
                    {cartProduct.length == 0 && cartProductAddition.length == 0 ? (
                        <div className="">
                            <h2 className='text-center text-gray-300 font-bold text-4xl py-32'>?????????????????????</h2>
                            <div className="text-center">
                                <Link href={`/product`} className=" ">
                                    <a type='button' className=' text-center  px-6 py-2 text-white text-xl rounded-md bg-yellow-900 hover:bg-yellow-800' >????????????</a>
                                </Link>
                            </div>
                        </div>

                    ) : <>
                        <div>
                            <h3 className='text-right text-xl my-2 text-yellow-900'>????????????<span className='text-3xl font-bold'>NT$ {Total()}</span></h3>
                        </div>
                        <form action="" className='mt-10'>
                            <div>
                                <h3 className='py-2 text-3xl font-bold text-yellow-900 border-b border-gray-200'>???????????????</h3>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>?????????*</label>
                                    <input type="text" name="" id="" onChange={(e) => setPayName(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='?????????' />
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>????????????*</label>
                                    <input type="tel" name="" id="" onChange={(e) => setPayPhone(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='??????????????????' />
                                </div>
                                <div className="flex my-5 flex-wrap md:flex-nowrap">
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>??????*</label>
                                        <select name="" id="" onChange={(e) => setPaysetCityName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                Object.keys(City).map((item, idx) => (<option value={item} key={item} >{item}</option>))
                                            }
                                        </select>
                                    </section>
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>??????*</label>
                                        <select name="" id="" onChange={(e) => setPaysetAreaName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                PayAreaArrray ? PayAreaArrray.map((item, idx) => (<option value={item} key={item} >{item}</option>)) : null
                                            }
                                        </select>
                                    </section>
                                    <section className='  flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>??????*</label>
                                        <input type="text" id="" name="" value={PayAddress} onChange={(e) => setPayAddress(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                                    </section>
                                </div>
                            </div>

                            <div className='mt-10'>
                                <h3 className='py-2 text-3xl font-bold text-yellow-900 border-b border-gray-200'>???????????????</h3>
                                <div className="form-check my-2">
                                    <input checked={consistent} onChange={() => setConsistent(!consistent)} className="w-4" type="checkbox" autoComplete="off" value="" id="flexCheckDefault" />
                                    <label className="form-check-label inline-block text-gray-800 ml-1 text-lg " htmlFor="flexCheckDefault">
                                        ??????????????????
                                    </label>
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>?????????*</label>
                                    <input type="text" name="" id="" disabled={consistent} onChange={(e) => setReceiveName(e.target.value)} autoComplete="off" className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='?????????' />
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>????????????*</label>
                                    <input type="tel" name="" id="" disabled={consistent} onChange={(e) => setReceivePhone(e.target.value)} autoComplete="off" className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='??????????????????' />
                                </div>
                                <div className="flex my-5 flex-wrap md:flex-nowrap">
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>??????*</label>
                                        <select name="" id="" disabled={consistent} onChange={(e) => setReceiveCityName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                Object.keys(City).map((item, idx) => (<option value={item} key={item} >{item}</option>))
                                            }
                                        </select>
                                    </section>
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>??????*</label>
                                        <select name="" disabled={consistent} id="" onChange={(e) => setReceiveAreaName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                ReceiveAreaArrray ? ReceiveAreaArrray.map((item, idx) => (<option value={item} key={item} >{item}</option>)) : null
                                            }
                                        </select>
                                    </section>
                                    <section className='  flex-grow'>
                                        <label htmlFor="address" className='block text-xl p-1 my-1 text-yellow-900 font-light' onChange={(e) => ReceiveAddress()} value={ReceiveAddress}>??????*</label>
                                        <input type="text" disabled={consistent} id="" name="" value={ReceiveAddress} autoComplete="off" onChange={(e) => setReceiveAddress(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                                    </section>
                                </div>
                            </div>
                            <div className='mt-10'>
                                <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>??????</label>
                                <textarea name="" id="" onChange={(e) => setRemark(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='??????' ></textarea>
                            </div>
                            <div>
                                <button type='button' onClick={() => checkout()} className='w-full text-2xl py-2 bg-red-500 text-white my-2 rounded-lg hover:bg-red-400 transition-all duration-150'>????????????</button>
                            </div>
                        </form>

                    </>
                    }

                </div>


            </article>
            <Footer />

        </>
    )
}
