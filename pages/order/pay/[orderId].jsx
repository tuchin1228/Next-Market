import React from 'react'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ProductDetailCatousel from "../../../components/ProductDetailCatousel";
import axios from "axios";
import styles from "../../../styles/Cart.module.css";
import Link from "next/link";
import { CheckLoginStatus } from '../../../asset/extention/AuthCheck'
import Cookies from 'js-cookie'


export default function index() {

    const router = useRouter()
    const [order, setOrder] = useState([]);
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

            GetOrderDetail(router.query.orderId)
        }
    }, [router.query])

    const GetOrderDetail = async (orderId) => {
        // console.log('orderId', orderId);
        let userId = Cookies.get('userId')
        let res = await axios.post(`${process.env.API_URL}/Order/${orderId}`, {
            userId
        })
        console.log(res);
        if (res.data.success) {
            if(res.data.order && res.data.order.payStatus == 1){
                // 已付款
                router.push(`/order/${orderId}`)
            }
            setOrder(res.data.order)
            setOrderDetail(res.data.orderDetail)
            setOrderAdditionDetail(res.data.orderAdditionDetail)
        }
    }

    const pay = async () => {
        // console.log(router);
        // return null;
        // let userId = Cookies.get('userId')
        let orderId = router.query.orderId;
        let res = await axios.post(`${process.env.API_URL}/Order/pay/${orderId}`,{
            confirmUrl:`${process.env.BASE_URL}/order/confirm/${orderId}`
        })
        console.log(res);
        if (res.data.returnCode == '0000') {
            // 成功送出
            location.href = res.data.info.paymentUrl.web
        }else if (res.data.returnCode == '1133') {
            alert('付款失敗,非有效之條碼')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1110') {
            alert('付款失敗,無法使用的信用卡')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1142') {
            alert('付款失敗,餘額不足')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1183') {
            alert('付款失敗,付款金額必須大於 0')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1281') {
            alert('付款失敗,信用卡付款錯誤')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1282') {
            alert('付款失敗,信用卡授權錯誤')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1283') {
            alert('付款失敗,因疑似詐騙，拒絕付款')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1289') {
            alert('付款失敗,超過信用卡付款金額上限')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1291') {
            alert('付款失敗,此信用卡已被掛失')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1292') {
            alert('付款失敗,此信用卡已被停卡')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '1295') {
            alert('付款失敗,信用卡號無效')
            vm.LockSubmitOrder = false;
          } else if (res.data.returnCode == '9000') {
            alert('付款失敗,LinePay內部錯誤')
            vm.LockSubmitOrder = false;
          } 
    }

    return (
        <>

            <Navbar />

            <article className='min-h-screen my-32 rounded-xl relative p-10   max-w-7xl mx-auto bg-white'>
                <h2 className='text-4xl text-yellow-900 tracking-wider font-bold border-b border-gray-200 py-3'>訂單內容</h2>


                {
                    orderDetail.map(detail => (
                        <div className='p-2 bg-white' key={detail.Id}>
                            <div className="">
                                <div className='flex border-b py-2 items-start'>
                                    <img className="w-20 mr-2" src={`${process.env.Image_URL}/product/${detail.productId}/product/${detail.filename}`} alt="" />
                                    <div className='flex-grow flex flex-col  justify-between'>
                                        {
                                            detail.type ? <p><span className=' px-2 rounded-md bg-yellow-900 text-white'>加購品</span></p> : null
                                        }

                                        <p className='text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{detail.type == 1 ? detail.productAdditionName : detail.productDetailName}</p>
                                        <p className='text-lg text-gray-800 font-light'>x{detail.count}</p>
                                        {
                                            detail.type == 0 ?
                                                <p className=' text-right text-gray-400'>NT ${detail.salePrice ? <><span className='line-through'>{Math.round(detail.originPrice * detail.count)}</span>　<span className='text-xl text-yellow-900 font-bold'>${Math.round(detail.salePrice * detail.count)}</span></> : <span className='text-xl text-yellow-900 font-bold'>{Math.round(detail.originPrice * detail.count)}</span>}</p>
                                                :
                                                <p className=' text-right text-xl text-yellow-900 font-bold'>小計：NT ${Math.round(detail.productAdditionPrice)}</p>
                                        }
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
                                                <p className='text-lg text-gray-800 font-light'>x{addition.count}</p>
                                            </div>
                                            <p className=' text-right text-gray-400 '>小計：NT <span className='text-xl text-yellow-900 font-bold'>${addition.forAll ? Math.round(addition.forAllPrice * addition.count) : Math.round(addition.addition_price * addition.count)}</span></p>
                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                {
                    order.remark ? <p className='text-lg text-gray-400 tracking-wider py-2 font-light'>備註：{order.remark}</p> : null
                }

                <h3 className='text-right py-2 text-lg'>訂單總額：<span className='text-3xl text-yellow-900 font-bold'>NT$ {order.Total}</span></h3>

                <h2 className='text-4xl text-yellow-900 tracking-wider font-bold border-b border-gray-200 py-3 align-middle'>選擇付款方式</h2>
                <div className="flex py-3 flex-grow flex-wrap">
                    <button onClick={() => pay()} type='button' className='block outline-none text-center w-full font-extrabold text-green-500 hover:bg-green-500 hover:text-white transition-all duration-150 py-1 px-2 text-3xl border-2 border-green-500 rounded-md'>LINE PAY</button>
                    <p className='w-full my-2 text-gray-500 font-light'>目前僅使用LINE PAY串接，環境為Sandbox測試環境，並不會真實繳費，請放心登入模擬付款。</p>

                </div>
                {/* {
                    orderDetail.map(detail => (

                        <div className='p-2 bg-white' key={detail.productDetailId}>
                            <div className="">
                                <div className='flex border-b py-2'>
                                    <img className="w-20 mr-2" src={`${process.env.Image_URL}/product/${detail.product_id}/product/${detail.filename}`} alt="" />
                                    <div className='flex-grow flex flex-col justify-between'>
                                        <p className='text-xl  font-medium   text-yellow-900 tracking-widest my-1'>{detail.productDetailName}</p>
                                        <p className=' text-right text-gray-400'>NT ${detail.salePrice ? <><span className='line-through'>{Math.round(detail.originPrice)}</span>　<span className='text-xl text-yellow-900 font-bold'>${Math.round(detail.salePrice)}</span></> : <span className='text-xl text-yellow-900 font-bold'>{Math.round(detail.originPrice)}</span>}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))
                } */}


            </article>

            <Footer />

        </>
    )
}
