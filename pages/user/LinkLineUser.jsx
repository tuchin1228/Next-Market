import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/User.module.css";
import Link from "next/link";

export default function LinkLineUser() {

    const router = useRouter()
    const [sub, setSub] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        let sub = params.get('sub')
        console.log('sub', sub);
        if (!sub) { //沒有帶LineSub就轉址
            router.push('/user/login')
        } else {
            setSub((linesub) => linesub = sub)
        }
    }, [])

    const CheckAndLinkLineUser = async () => {

        let res = await axios.post(`${process.env.API_URL}/User/linkline`, {
            LineSub: sub,
            phone: phone,
            password: password
        })
        console.log(res);
        if (res.data.success) {
            alert('綁定成功')
            router.push('/user/login')
        } else if (res.data.errorStauts == 1) {
            alert('此帳號已綁定')
        } else if (res.data.errorStauts == 2) {
            alert('會員認證錯誤')
        }


    }


    return (
        <>
            <Navbar />
            <article className='min-h-screen mt-20 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <div className={` py-10 max-w-4xl mx-auto gap-2 `} >
                    <h2 className='text-center text-4xl font-bold  '>確認本站會員</h2>
                    <section>
                        <div className='my-5'>
                            <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>行動電話：</label>
                            <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                        </div>
                        <div className='my-5'>
                            <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>密碼：</label>
                            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入密碼' />
                        </div>
                        <div>
                            <button type='button' onClick={() => CheckAndLinkLineUser()} className='w-full rounded-full block my-3 text-2xl py-2 bg-green-500 hover:bg-green-400 text-white font-bold text-center'>確定連結</button>
                        </div>
                    </section>
                </div>
            </article>
            <Footer />
        </>
    )
}
