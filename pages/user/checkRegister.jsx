import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/User.module.css";
import Link from "next/link";

export default function checkRegister() {
    const router = useRouter()
    const [sub, setSub] = useState('')
    useEffect(() => {
        const params = new URLSearchParams(window.location.search) 
        let sub = params.get('sub') 
        if (!sub) { //沒有帶LineSub就轉址
            router.push('/user/login')
        } else {
            setSub((linesub) => linesub = sub)
        }
    }, [])

    const GoLinkLineUser = () => {
        router.push({
            pathname: '/user/LinkLineUser',
            query: { sub: sub }
        })
    }

    const GoLinkLineRegister = () => {
        router.push({
            pathname: '/user/register',
            query: { sub: sub }
        })
    }

    return (
        <>
            <Navbar />
            <article className='min-h-screen mt-20 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <div className={` py-10 max-w-4xl mx-auto gap-2 grid grid-cols-2 `} >
                    <h2 className='text-center text-4xl font-bold col-span-2 '>是否擁有本站會員?</h2>

                    <button type='button' onClick={() => GoLinkLineUser()} className='my-3 py-5 text-3xl tracking-wider font-bold text-center bg-green-600 text-white hover:bg-green-500' >我已是會員<br />我要綁定Line</button>
                    <button type='button' onClick={() => GoLinkLineRegister()} className='my-3 py-5 text-3xl tracking-wider font-bold text-center bg-red-600 text-white hover:bg-red-500' >我不是會員<br />我要註冊</button>


                </div>
            </article>
            <Footer />
        </>
    )
}
