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
import Head from "next/head";


export default function List() {

    const [order, setOrder] = useState([]);
    const [orderDetail, setOrderDetail] = useState([]);
    const [activePayStatus, setActivePayStatus] = useState('all')
    const [showCancel, setShowCancel] = useState(false);
    const [CancelOrderPayStatus, setCancelOrderPayStatus] = useState(0);
    const [CancelOrderId, setCancelOrderId] = useState('');
    const [CancelReason, setCancelReason] = useState('');


    useEffect(() => {
        const AuthCheck = async () => {
            let Check = await CheckLoginStatus()
            if (!Check) {
                router.push('/')
            }
        };

        AuthCheck()
        GetOrders()
    }, [])

    const GetOrders = async () => {
        let userId = Cookies.get('userId')
        let res = await axios.post(`${process.env.API_URL}/Order/order`, {
            userId
        })
        console.log(res);
        if (res.data.success) {
            setOrder(res.data.order)
            setOrderDetail(res.data.orderDetail)
        }
    }

    const ConfirmCancelDialog = (orderId, payStatus) => {
        setShowCancel(true)
        setCancelOrderId(orderId)
        setCancelOrderPayStatus(payStatus)
    }

    const cancelOrder = async () => {
        let userId = Cookies.get('userId')
        let res = await axios.post(`${process.env.API_URL}/Order/cancel/${CancelOrderId}`, {
            userId,
            CancelReason
        })
        console.log(res);
        if (res.data.success) {
            ClearCancel()
            GetOrders()
        }
    }

    const ClearCancel = () => {
        setShowCancel(false)
        setCancelOrderId('')
        setCancelOrderPayStatus(0)
        setCancelReason('')
    }

    const RenderPayStatus = (payStatus) => {
        switch (payStatus) {
            case 0:
                return <span className='text-yellow-300 font-medium  ml-auto mr-0'>?????????</span>
                break;
            case 1:
                return <span className='text-yellow-300 font-medium  ml-auto mr-0'>??????</span>
                break;
            case 2:
                return <span className='text-yellow-300 font-medium  ml-auto mr-0'>???????????????</span>
                break;
            case 3:
                return <span className='text-yellow-300 font-medium  ml-auto mr-0'>?????????</span>
                break;
            default:
                break;
        }
    }
    const RenderCancelButton = (item) => {

        switch (item.payStatus) {
            case 0:
                return <button onClick={() => ConfirmCancelDialog(item.orderId, item.payStatus)} type='button' className='w-full md:w-auto text-center my-1 ml-1 transition-all duration-150 px-2 py-1 text-lg tracking-wider text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white'>????????????</button>
                break;
            case 1:
                return <button onClick={() => ConfirmCancelDialog(item.orderId, item.payStatus)} type='button' className='w-full md:w-auto text-center my-1 ml-1 transition-all duration-150 px-2 py-1 text-lg tracking-wider text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white'>????????????</button>
                break;
            default:
                break;
        }

    }

    return (
        <>
            <Head>
                <title>???????????? - ???????????????</title>
            </Head>
            <Navbar />

            {
                !order || order.length == 0 ? (<div className='h-screen rounded-xl relative p-10   max-w-7xl mx-auto '>
                    <h2 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-900'>??????????????????</h2>
                </div>) :
                    <article className='min-h-screen my-32 rounded-xl relative px-5 py-10  md:p-10   max-w-7xl mx-auto '>
                        <div className="grid grid-cols-5">
                            <section className={`text-center text-lg md:text-2xl border border-yellow-900 py-2 ${activePayStatus == 'all' ? 'text-white bg-yellow-900' : 'text-yellow-900 bg-transparent'} `} onClick={() => setActivePayStatus('all')}>??????</section>
                            <section className={`text-center text-lg md:text-2xl border border-yellow-900 py-2 ${activePayStatus == 0 ? 'text-white bg-yellow-900' : 'text-yellow-900 bg-transparent'} `} onClick={() => setActivePayStatus(0)}>?????????</section>
                            <section className={`text-center text-lg md:text-2xl border border-yellow-900 py-2 ${activePayStatus == 1 ? 'text-white bg-yellow-900' : 'text-yellow-900 bg-transparent'} `} onClick={() => setActivePayStatus(1)}>?????????</section>
                            <section className={`text-center text-lg md:text-2xl border border-yellow-900 py-2 ${activePayStatus == 2 ? 'text-white bg-yellow-900' : 'text-yellow-900 bg-transparent'} `} onClick={() => setActivePayStatus(2)}>?????????</section>
                            <section className={`text-center text-lg md:text-2xl border border-yellow-900 py-2 ${activePayStatus == 3 ? 'text-white bg-yellow-900' : 'text-yellow-900 bg-transparent'} `} onClick={() => setActivePayStatus(3)}>?????????</section>
                        </div>
                        {
                            order.map(item => (
                                <div key={item.orderId}>
                                    {
                                        item.payStatus == activePayStatus || activePayStatus == 'all' ? (
                                            <div className='my-10' key={item.orderId}>
                                                <h3 className='bg-yellow-900 px-2  py-2  text-lg tracking-wider text-white flex justify-between items-center flex-wrap md:flex-nowrap'>
                                                    <span>?????????{item.orderId}</span>
                                                    {
                                                        RenderPayStatus(item.payStatus)
                                                    }
                                                    {/* <span className='text-yellow-300 font-medium'>{item.payStatus == 0 ? '?????????' : '??????'}</span> */}
                                                </h3>

                                                {
                                                    orderDetail.map(detail => (
                                                        detail.orderId == item.orderId ? (
                                                            <div className='p-2 bg-white' key={detail.productDetailId}>
                                                                <div className="">
                                                                    <div className='flex border-b py-2'>
                                                                        <img className="w-20 mr-2" src={`${process.env.Image_URL}/product/${detail.product_id}/product/${detail.filename}`} alt="" />
                                                                        <div className='flex-grow flex flex-col justify-between'>
                                                                            <p className='text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{detail.productDetailName}</p>
                                                                            <p className=' text-right text-gray-400'>NT ${detail.salePrice ? <><span className='line-through'>{Math.round(detail.originPrice)}</span>???<span className='text-xl text-yellow-900 font-bold'>${Math.round(detail.salePrice)}</span></> : <span className='text-xl text-yellow-900 font-bold'>{Math.round(detail.originPrice)}</span>}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                                                        <div className='my-6 border-r'>
                                                                            <h2 className='text-center font-light text-xl text-gray-500'>????????????<br /><span className='text-2xl font-bold text-yellow-900'>NT ${item.Total}</span></h2>
                                                                        </div>
                                                                        <div className='my-6'>
                                                                            <h2 className='text-center font-light text-xl text-gray-500'>????????????<br /><span className='text-2xl font-bold text-yellow-900'>{item.created_at}</span></h2>
                                                                        </div>
                                                                    </div>

                                                                    <div className='flex justify-end my-2 flex-wrap md:flex-nowrap '>
                                                                        {
                                                                            item.payStatus == 0 ? (<Link href={`/order/pay/${item.orderId}`} ><a className='w-full md:w-auto text-center my-1  ml-1 transition-all duration-150 px-2 py-1 text-lg tracking-wider bg-yellow-900 hover:bg-yellow-800 text-white' >????????????</a></Link>) : null
                                                                        }
                                                                        <Link href={`/order/${item.orderId}`} >
                                                                            <a className='w-full md:w-auto text-center my-1 ml-1 transition-all duration-150 text-yellow-900 border border-yellow-900 px-2 py-1 text-lg tracking-wider hover:bg-yellow-900 hover:text-white'>????????????</a>
                                                                        </Link>
                                                                        <Link href={`/contact`} >
                                                                            <a className='w-full md:w-auto text-center my-1 ml-1 transition-all duration-150 text-yellow-900 border border-yellow-900 px-2 py-1 text-lg tracking-wider hover:bg-yellow-900 hover:text-white'>????????????</a>
                                                                        </Link>
                                                                        {
                                                                            RenderCancelButton(item)
                                                                        }
                                                                        {/* {
                                                                            item.payStatus == 0 && item.payStatus < 2 ? (
                                                                                <button onClick={() => ConfirmCancelDialog(item.orderId, item.payStatus)} type='button' className='ml-1 transition-all duration-150 px-2 py-1 text-lg tracking-wider text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white'>????????????</button>
                                                                            ) : (
                                                                                <button onClick={() => ConfirmCancelDialog(item.orderId, item.payStatus)} type='button' className='ml-1 transition-all duration-150 px-2 py-1 text-lg tracking-wider text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white'>????????????</button>
                                                                            )

                                                                        } */}

                                                                    </div>
                                                                    {/* <p>{detail.created_at}</p> */}
                                                                </div>
                                                            </div>
                                                        ) : null

                                                    ))
                                                }
                                            </div>
                                        ) : null
                                    }

                                </div>
                            ))
                        }

                    </article>

            }
            <Footer />

            {
                showCancel ? (
                    <div className='fixed w-full h-full top-0 left-0 z-50' >
                        <div onClick={() => ClearCancel()} className="bg fixed top-0 left-0 w-full h-full bg-gray-600 opacity-20 "></div>
                        <div className="p-5 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-2xl  bg-white rounded-xl ">
                            <h2 className='text-2xl font-bold py-2 border-b'>????????????</h2>
                            <div className="py-3">
                                <p className='text-xl'>???????????????{CancelOrderId}</p>
                                {
                                    CancelOrderPayStatus == 1 ? (
                                        <div className="my-2">
                                            <p className='text-xl'>???????????????</p>

                                            <textarea value={CancelReason} onChange={(e) => setCancelReason(e.target.value)} className='outline-none p-3 w-full border rounded-md border-gray-200 ' name="" id="" cols="30" rows="10"></textarea>

                                        </div>
                                    ) : null
                                }
                            </div>
                            <div className="text-right">
                                <button type='button' onClick={() => cancelOrder()} className='px-2 py-1 ml-1 bg-red-500 hover:bg-red-400 text-white rounded-md font-medium text-xl'>??????</button>
                                <button type='button' onClick={() => ClearCancel()} className='px-2 py-1 ml-1 bg-gray-500 hover:bg-gray-400 text-white rounded-md font-medium text-xl'>??????</button>
                            </div>
                        </div>
                    </div>
                ) : null
            }

        </>
    )
}
