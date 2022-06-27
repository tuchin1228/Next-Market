import React from 'react'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductDetailCatousel from "../../components/ProductDetailCatousel";
import axios from "axios";
import styles from "../../styles/Cart.module.css";
import Link from "next/link";
import { CheckLoginStatus } from '../../asset/extention/AuthCheck'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList, faMoneyBillWave, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'

export default function OrderId() {

    const router = useRouter()
    const [order, setOrder] = useState({});
    const [orderDetail, setOrderDetail] = useState([]);
    const [orderAdditionDetail, setOrderAdditionDetail] = useState([]);


    useEffect(() => {

        if (router.query && router.query.orderId) {
            const AuthCheck = async () => {
                let Check = await CheckLoginStatus()
                if (!Check) {
                    router.push('/')
                }
            };

            AuthCheck()
            if (router.query && router.query.orderId) {
                GetOrderDetail()
            } else {
                router.push('/')
            }
        }
    }, [router.query])

    const GetOrderDetail = async () => {
        let userId = Cookies.get('userId')
        let res = await axios.post(`${process.env.API_URL}/Order/${router.query.orderId}`, {
            userId
        })
        console.log(res);
        if (res.data.success) {
            setOrder(res.data.order)
            setOrderDetail(res.data.orderDetail)
            setOrderAdditionDetail(res.data.orderAdditionDetail)
        } else[
            router.push('/')
        ]
    }


    const RenderPayStatus = (payStatus) => {
        switch (payStatus) {
            case 0:
                return <p className='text-lg md:text-xl font-medium text-gray-400'>尚未付款</p>
                break;
            case 1:
                return <><p className='text-lg md:text-xl font-medium text-yellow-900'>付款成功</p><p className='text-sm md:text-lg text-gray-400'>{order.pay_at}</p></>
                break;
            case 2:
                return <><p className='text-lg md:text-xl font-medium text-yellow-900'>取消申請中</p><p className='text-sm md:text-lg text-gray-400'>{order.cancel_at}</p></>
                break;
            case 3:
                return <><p className='text-lg md:text-xl font-medium text-yellow-900'>已取消</p><p className='text-sm md:text-lg text-gray-400'>{order.cancel_at}</p></>
                break;
            default:
                break;
        }
    }

    return (
        <>

            <Navbar />

            <article className='min-h-screen my-32 rounded-xl relative px-5 py-10 md:p-10   max-w-7xl mx-auto '>
                <section className='' key={order.orderId}>
                    <h3 className='bg-yellow-900 px-2  py-2  text-lg tracking-wider text-white flex justify-between orders-center'>
                        <span>單號：{order.orderId}</span>
                    </h3>
                </section>
                <div className="bg-white p-3 md:p-10">
                    <section className='grid grid-cols-3 py-10'>
                        <div className=" text-center  px-3 my-3">
                            <div className='relative'>
                                <FontAwesomeIcon icon={faClipboardList} className="text-5xl  text-green-500" />
                                <div className="bg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 rounded-full border-green-500"></div>
                            </div>
                            <div className='mt-8'>
                                <p className='text-lg md:text-xl font-medium text-yellow-900'>訂單成立</p>
                                <p className='text-sm md:text-lg text-gray-400'>{order.created_at}</p>
                            </div>
                        </div>
                        <div className=" text-center  px-3 my-3">
                            <div className='relative'>
                                <FontAwesomeIcon icon={faLongArrowAltRight} className="text-5xl  text-gray-300" />
                            </div>
                        </div>
                        <div className=" text-center px-3 my-3">
                            <div className='relative'>
                                <FontAwesomeIcon icon={faMoneyBillWave} className={`text-5xl  ${order.payStatus == 0 ? 'text-gray-400' : 'text-green-500'} `} />
                                <div className={`bg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 rounded-full  ${order.payStatus == 0 ? 'border-gray-400' : 'border-green-500'}  `}></div>
                            </div>
                            <div className='mt-8'>
                                {/* {
                                    order.payStatus == 0 ? <p className='text-xl font-medium text-gray-400'>尚未付款</p> : (<><p className='text-xl font-medium text-yellow-900'>付款成功</p><p className='text-lg text-gray-400'>{order.pay_at}</p></>)
                                } */}
                                {RenderPayStatus(order.payStatus)}

                            </div>
                        </div>
                    </section>
                    <section className=' py-10'>
                        <h2 className='text-4xl font-bold text-yellow-900 border-b py-2'>訂單資訊</h2>
                        {
                            orderDetail.map(detail => (
                                <div className='p-2 bg-white' key={detail.productDetailId}>
                                    <div className="">
                                        <div className='flex border-b py-2'>
                                            <img className="w-20 mr-2" src={`${process.env.Image_URL}/product/${detail.product_id}/product/${detail.filename}`} alt="" />
                                            <div className='flex-grow flex flex-col justify-between'>
                                                <div>
                                                    <p className='text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{detail.productDetailName}</p>
                                                    <p className='text-lg  font-medium   text-gray-400'>x{detail.count}</p>
                                                </div>
                                                <p className=' text-right text-gray-400'>小計：NT ${detail.productPrice == detail.originSubTotal ? <span className='text-xl text-yellow-900 font-bold'>{Math.round(detail.originSubTotal)}</span> : <><span className='line-through'>{Math.round(detail.originSubTotal)}</span>　<span className='text-xl text-yellow-900 font-bold'>${Math.round(detail.productPrice)}</span></>}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))
                        }
                        {
                            orderAdditionDetail.map(addition => (
                                <div className='p-2 bg-white' key={addition.productAdditionId}>
                                    <div className='flex border-b py-2 items-start'>
                                        <img className="w-20 mr-2" src={`${process.env.Image_URL}/additional_product/${addition.productAdditionId}/${addition.imageFilename}`} alt="" />
                                        <div className='flex-grow flex flex-col justify-between'>
                                            <div>
                                                <p><span className=' px-2 rounded-md bg-yellow-900 text-white'>加購品</span></p>
                                                <p className='text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{addition.productAdditionName}</p>
                                                <p className='text-lg  font-medium   text-gray-400'>x{addition.count}</p>
                                            </div>
                                            <p className=' text-right text-gray-400'>小計：NT <span className=' text-xl text-yellow-900 font-bold'>${addition.forAll ? Math.round(addition.forAllPrice * addition.count) : Math.round(addition.addition_price * addition.count)}</span></p>
                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                        <div className='my-6 border-r'>
                            <h3 className='text-right text-xl my-2 text-yellow-900'>訂單金額：<span className='text-3xl font-bold'>NT$ {order.Total}</span></h3>
                        </div>
                    </section>
                    <section>
                        <h2 className='text-4xl font-bold text-yellow-900 border-b py-2'>備註</h2>
                        <p className='py-2 text-right text-gray-500 text-lg'>{order.remark ? order.remark : '無'}</p>
                    </section>
                    <section className=' py-10'>
                        <h2 className='text-4xl font-bold text-yellow-900 border-b py-2 mb-3'>購買人資訊</h2>
                        <p className='py-2 text-xl font-light flex justify-between'><span>姓名：</span><span>{order.payName}</span></p>
                        <p className='py-2 text-xl font-light flex justify-between'><span>電話：</span><span>{order.payphone}</span></p>
                        <p className='py-2 text-xl font-light flex justify-between'><span>地址：</span><span>{`${order.payCity}${order.payArea}${order.payAddress}`}</span></p>
                    </section>
                    <section className=' py-10'>
                        <h2 className='text-4xl font-bold text-yellow-900 border-b py-2'>收件人資訊</h2>
                        <p className='py-2 text-xl font-light  flex justify-between'><span>姓名：</span><span>{order.receiveName}</span></p>
                        <p className='py-2 text-xl font-light  flex justify-between'><span>電話：</span><span>{order.receivePhone}</span></p>
                        <p className='py-2 text-xl font-light  flex justify-between'><span>地址：</span><span>{`${order.receiveCity}${order.receiveArea}${order.receiveAddress}`}</span></p>
                    </section>

                </div>
            </article>
            <Footer />
        </>
    )
}
