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

export default function checkout() {

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
        setPaysetCityName(Object.keys(City)[0])
        setReceiveCityName(Object.keys(City)[0])
        GetCartData()
    }, [])

    // 縣市更新，區域也要更新
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

    // 選擇縣市更新
    const UpdateCitySelect = (e) => {
        setCityName(e.target.value)
    }
    // 選擇區域更新
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

    //總計
    const Total = () => {
        let total = 0;
        cartProduct.forEach(item => item.salePrice ? total += Math.round(item.salePrice) * item.count : total += Math.round(item.originPrice) * item.count)
        cartProductAddition.forEach(item => item.forAll ? total += Math.round(item.forAllPrice) * item.count : total += Math.round(item.addition_price) * item.count)
        return total;
    }

    // 結帳
    const checkout = async () => {
        let userId = Cookies.get('userId')

        if (consistent && (
            !PayName ||
            !PayPhone ||
            !PayCityName ||
            !PayAreaName ||
            !PayAddress)) {
            alert('資料填寫不完全!')
            return null;
        } else if (!consistent && (
            !PayName ||
            !PayPhone ||
            !PayCityName ||
            !PayAreaName ||
            !PayAddress ||
            ReceiveName ||
            ReceivePhone ||
            ReceiveAddress ||
            ReceiveCityName ||
            ReceiveAreaName)) {
            alert('資料填寫不完全!')
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
        console.log('送出');
        if (res.data.success) {
            alert('訂單成功送出，請於指定時間前繳費完成。')

        }
    }

    // 同步購買人資料
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

            <Navbar />

            <article className='min-h-screen my-32 rounded-xl relative p-10   max-w-7xl mx-auto bg-white'>

                <h2 className='text-4xl text-yellow-900 tracking-wider font-bold border-b border-gray-200 py-3'>購物車</h2>
                <div className="grid grid-cols-6">
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center col-span-2'>品名</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>單價</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>小計</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>數量</p>
                    <p className='bg-yellow-900 text-white py-1 text-lg text-center '>刪除</p>
                </div>
                <div className=' ' >

                    {
                        cartProduct.map((product, idx) => (

                            <div className='border-b border-gray-300' key={product.productDetailId}>


                                <div className='my-2  py-3  grid grid-cols-6 items-center ' >
                                    <div className='flex items-start col-span-2'>
                                        <p className='self-stretch flex items-center text-lg font-medium mr-1 p-2 text-white bg-yellow-900 '>{idx + 1}</p>
                                        <img className='' style={{ width: '80px' }} src={process.env.Image_URL + "/product/" + product.productId + "/product/" + product.filename} alt="" />
                                        <div className='ml-2'>
                                            <Link href={`/product/${product.productCateId}/${product.productId}`}>
                                                <a className='text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{product.productDetailName}</a>
                                            </Link>
                                            <h2 className='text-base font-light text-gray-400 tracking-widest'>{product.productName}</h2>
                                            {
                                                product.count == product.max_quantity ? <p className='text-red-500'>(已達購買限制量)</p> : null
                                            }
                                        </div>
                                    </div>
                                    {/* <div className='w-full ml-6'> */}
                                    {/* <div className="grid grid-cols-4 items-center"> */}

                                    <p className=' text-center text-xl text-yellow-900 font-bold  mt-2'>$ {product.salePrice && product.salePrice < product.originPrice ? Math.round(product.salePrice) : Math.round(product.originPrice)}</p>
                                    <p className=' text-center text-xl text-yellow-900 font-bold  mt-2'>$ {product.salePrice && product.salePrice < product.originPrice ? Math.round(product.salePrice * product.count) : Math.round(product.originPrice * product.count)}</p>
                                    <div className='w-full flex justify-center items-center '>
                                        <button type='button' onClick={() => SetProductCount('minus', product)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                        <p className='text-lg px-5 border-2'>{product.count}</p>
                                        {/* <input type="number" name="" id="" className={`${styles.CartCountInput} text-lg text-yellow-900 border-2 border-yellow-900`} /> */}
                                        <button type='button' onClick={() => SetProductCount('add', product)} disabled={product.count == product.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400`}>+</button>

                                    </div>
                                    <div className="text-center">
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => RemoveProduct(product)} className="text-3xl text-gray-400 hover:text-gray-300 mx-2" />
                                    </div>
                                    {/* </div> */}

                                    {/* </div> */}

                                </div>
                                {
                                    cartProductAddition.map((addition, idx) => (
                                        addition.productDetailId == product.productDetailId ? (
                                            <div key={addition.productAdditionId}>
                                                <h2 className='text-xl  bg-yellow-400 text-white p-1'>加購品</h2>
                                                <div className={` py-1 grid grid-cols-6 items-center  ${addition.delete_at || (new Date().getTime() > new Date(addition.endTime).getTime()) ? 'bg-gray-100' : ''}`} >

                                                    <div className='flex items-start col-span-2'>
                                                        <p className='self-stretch flex items-center text-lg font-medium mr-1 p-2 text-white bg-yellow-400 '>{idx + 1}</p>
                                                        <img className='' style={{ width: '80px' }} src={process.env.Image_URL + "/additional_product/" + addition.productAdditionId + "/" + addition.imageFilename} alt="" />
                                                        <div className='ml-2'>
                                                            <h3 className={`text-xl  font-medium   text-yellow-900 tracking-widest  `}>{addition.productAdditionName}</h3>
                                                            {
                                                                addition.count == addition.max_quantity
                                                                    && !addition.delete_at
                                                                    && (new Date().getTime() < new Date(addition.endTime).getTime()) ? <p className='text-red-500'>(已達加購限制量)</p> : null
                                                            }
                                                            {
                                                                addition.delete_at || (new Date().getTime() > new Date(addition.endTime).getTime()) ? <p className='text-gray-500'>(已失效)</p> : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <p className='text-center text-xl text-yellow-900 font-bold'>$ {addition.forAll ? Math.round(addition.forAllPrice) : Math.round(addition.addition_price)}</p>
                                                    <p className='text-center text-xl text-yellow-900 font-bold'>$ {addition.forAll ? Math.round(addition.forAllPrice * addition.count) : Math.round(addition.addition_price * addition.count)}</p>
                                                    <div className='w-full flex justify-center '>
                                                        <button type='button' onClick={() => SetAdditionCount('minus', addition)} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white`}>-</button>
                                                        <p className='text-lg px-5 border-2'>{addition.count}</p>
                                                        {/* <input type="number" name="" id="" className={`${styles.CartCountInput} text-lg text-yellow-900 border-2 border-yellow-900`} /> */}
                                                        <button type='button' onClick={() => SetAdditionCount('add', addition)} disabled={addition.count == addition.max_quantity} className={`${styles.CartCountBtn} text-xl bg-yellow-900 hover:bg-yellow-800 text-white disabled:bg-gray-400 `}>+</button>

                                                    </div>
                                                    <div className='text-center'>
                                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => RemoveProduct(addition)} className="text-3xl text-gray-400 hover:text-gray-300 mx-2" />

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
                            <h2 className='text-center text-gray-300 font-bold text-4xl py-32'>購物車沒有商品</h2>
                            <div className="text-center">
                                <Link href={`/product`} className=" ">
                                    <a type='button' className=' text-center  px-6 py-2 text-white text-xl rounded-md bg-yellow-900 hover:bg-yellow-800' >立即選購</a>
                                </Link>
                            </div>
                        </div>

                    ) : <>
                        <div>
                            <h3 className='text-right text-xl my-2 text-yellow-900'>總金額：<span className='text-3xl font-bold'>NT$ {Total()}</span></h3>
                        </div>
                        <form action="" className='mt-10'>
                            <div>
                                <h3 className='py-2 text-3xl font-bold text-yellow-900 border-b border-gray-200'>購買人資訊</h3>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>購買人*</label>
                                    <input type="text" name="" id="" onChange={(e) => setPayName(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>行動電話*</label>
                                    <input type="tel" name="" id="" onChange={(e) => setPayPhone(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                                </div>
                                <div className="flex my-5">
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>縣市*</label>
                                        <select name="" id="" onChange={(e) => setPaysetCityName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                Object.keys(City).map((item, idx) => (<option value={item} key={item} >{item}</option>))
                                            }
                                        </select>
                                    </section>
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>區域*</label>
                                        <select name="" id="" onChange={(e) => setPaysetAreaName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                PayAreaArrray ? PayAreaArrray.map((item, idx) => (<option value={item} key={item} >{item}</option>)) : null
                                            }
                                        </select>
                                    </section>
                                    <section className='  flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>地址*</label>
                                        <input type="text" id="" name="" value={PayAddress} onChange={(e) => setPayAddress(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                                    </section>
                                </div>
                            </div>

                            <div className='mt-10'>
                                <h3 className='py-2 text-3xl font-bold text-yellow-900 border-b border-gray-200'>收件人資訊</h3>
                                <div className="form-check my-2">
                                    <input checked={consistent} onChange={() => setConsistent(!consistent)} className="w-4" type="checkbox" value="" id="flexCheckDefault" />
                                    <label className="form-check-label inline-block text-gray-800 ml-1 text-lg " htmlFor="flexCheckDefault">
                                        同購買人資料
                                    </label>
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>收件人*</label>
                                    <input type="text" name="" id="" disabled={consistent} onChange={(e) => setReceiveName(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                                </div>
                                <div className='my-5'>
                                    <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>行動電話*</label>
                                    <input type="tel" name="" id="" disabled={consistent} onChange={(e) => setReceivePhone(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                                </div>
                                <div className="flex my-5">
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>縣市*</label>
                                        <select name="" id="" disabled={consistent} onChange={(e) => setReceiveCityName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                Object.keys(City).map((item, idx) => (<option value={item} key={item} >{item}</option>))
                                            }
                                        </select>
                                    </section>
                                    <section className=' mr-1 flex-grow'>
                                        <label htmlFor="" className='block text-xl p-1 my-1 text-yellow-900 font-light'>區域*</label>
                                        <select name="" disabled={consistent} id="" onChange={(e) => setReceiveAreaName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' >
                                            {
                                                ReceiveAreaArrray ? ReceiveAreaArrray.map((item, idx) => (<option value={item} key={item} >{item}</option>)) : null
                                            }
                                        </select>
                                    </section>
                                    <section className='  flex-grow'>
                                        <label htmlFor="address" className='block text-xl p-1 my-1 text-yellow-900 font-light' onChange={(e) => ReceiveAddress()} value={ReceiveAddress}>地址*</label>
                                        <input type="text" disabled={consistent} id="" name="" value={ReceiveAddress} onChange={(e) => setReceiveAddress(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                                    </section>
                                </div>
                            </div>
                            <div className='mt-10'>
                                <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>備註</label>
                                <textarea name="" id="" onChange={(e) => setRemark(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='備註' ></textarea>
                            </div>
                            <div>
                                <button type='button' onClick={() => checkout()} className='w-full text-2xl py-2 bg-red-500 text-white my-2 rounded-lg hover:bg-red-400 transition-all duration-150'>送出訂單</button>
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
