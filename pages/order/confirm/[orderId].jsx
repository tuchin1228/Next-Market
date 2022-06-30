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
import Head from "next/head";

export default function Confirm() {

  const router = useRouter()


  useEffect(() => {

    if (router.query && router.query.orderId) {
      const AuthCheck = async () => {
        let Check = await CheckLoginStatus()
        if (!Check) {
          router.push('/')
        }
      };

      AuthCheck()
      if (router.query && router.query.orderId && router.query.transactionId) {
        confirmPay()
      } else {
        router.push('order/')
      }
    }
  }, [router.query])

  const confirmPay = async () => {
    // let userId = Cookies.get('userId')
    let res = await axios.post(`${process.env.API_URL}/Order/pay/ConfirmUrl`, {
      transactionId: router.query.transactionId,
      orderId: router.query.orderId
    }).catch(err => {
      alert('付款失敗，請稍後再試。')
      router.push(`/order/pay/${router.query.orderId}`)
    })
    console.log(res);
    if (res && res.data && res.data.success) {
      router.push(`/order/${router.query.orderId}`)
    } else {
      alert('付款失敗，請稍後再試。')
      router.push(`/order/pay/${router.query.orderId}`)
    }
  }

  return (
    <div>
      <Head>
        <title>付款中請稍後 - 巧克力工廠</title>
      </Head>
      <h2 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-3xl text-orange-800'>付款中請稍後...</h2>
    </div>
  )
}
