import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/User.module.css";
import Link from "next/link";
import City from '../../asset/extention/tw_city'
import Head from "next/head";


export default function Index() {
    const router = useRouter()
    console.log(City);
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [CityName, setCityName] = useState('')
    const [AreaName, setAreaName] = useState('')
    const [sub, setSub] = useState('')

    const [AreaArrray, setAreaArrray] = useState([])

    // 初始化縣市選單
    useEffect(() => {
        setCityName(Object.keys(City)[0])
        const params = new URLSearchParams(window.location.search)
        let sub = params.get('sub')
        console.log('sub', sub);
        // if (!sub) { //沒有帶LineSub就轉址
        //     router.push('/user/login')
        // } else {
        //     setSub((linesub) => linesub = sub)
        // }
        if (sub) { //沒有帶LineSub就轉址
            setSub((linesub) => linesub = sub)
        }
    }, [])

    // 縣市更新，區域也要更新
    useEffect(() => {
        if (!CityName) return null;
        setAreaArrray(City[`${CityName}`])
        setAreaName(City[`${CityName}`][0])
    }, [CityName])

    // 選擇縣市更新
    const UpdateCitySelect = (e) => {
        setCityName(e.target.value)
    }
    // 選擇區域更新
    const UpdateAreaSelect = (e) => {
        setAreaName(e.target.value)
    }

    const SubmitRegister = async () => {
        if (!name || !phone || !password || !confirmPassword || !address || !CityName || !AreaName) {
            alert('欄位填寫不完全')
            return null;
        } else if (password !== confirmPassword) {
            alert('兩次密碼輸入不同')
            return null;
        }

        let res = await axios.post(`${process.env.API_URL}/User/register`, {
            LineSub: sub ? sub : '',
            name: name,
            phone: phone,
            password: password,
            confirmPassword: confirmPassword,
            email: email,
            address: address,
            CityName: CityName,
            AreaName: AreaName,
        })

        console.log(res);
        if (res.data.success) {
            router.push('/user/login')
        } else {
            alert(res.data.msg)
        }
    }
    // const [direction, setDirection] = useState('')
    // const [contactCategoryId, setContactCategoryId] = useState('')
    // const [category, setCategory] = useState([])


    return (
        <>
            <Head>
                <title>會員註冊 - 巧克力工廠</title>
            </Head>
            <Navbar />

            <article className='min-h-screen mt-20 relative  px-2'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>

                <form action="" className="  py-10 max-w-5xl mx-auto gap-2">
                    <section className='my-5'>
                        <label htmlFor="name" className='block text-xl p-1 my-1 text-yellow-900 font-light'>姓名*</label>
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="phone" className='block text-xl p-1 my-1 text-yellow-900 font-light'>聯絡電話*</label>
                        <input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="password" className='block text-xl p-1 my-1 text-yellow-900 font-light'>密碼*</label>
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="confirmPassword" className='block text-xl p-1 my-1 text-yellow-900 font-light'>確認密碼*</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="email" className='block text-xl p-1 my-1 text-yellow-900 font-light'>電子信箱</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='my-5'>
                        <label htmlFor="city" className='block text-xl p-1 my-1 text-yellow-900 font-light'>縣市*</label>
                        <select name="city" id="city" onChange={UpdateCitySelect} className='block w-full py-2 px-2 rounded-md border text-lg' >
                            {
                                Object.keys(City).map((item, idx) => (<option value={item} key={item} >{item}</option>))
                            }
                        </select>
                    </section>
                    <section className='my-5'>
                        <label htmlFor="city" className='block text-xl p-1 my-1 text-yellow-900 font-light'>區域*</label>
                        <select name="city" id="city" onChange={UpdateAreaSelect} className='block w-full py-2 px-2 rounded-md border text-lg' >
                            {
                                AreaArrray ? AreaArrray.map((item, idx) => (<option value={item} key={item} >{item}</option>)) : null
                            }
                        </select>
                    </section>
                    <section className='my-5'>
                        <label htmlFor="address" className='block text-xl p-1 my-1 text-yellow-900 font-light'>地址*</label>
                        <input type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='col-span-2 text-center my-3'>
                        <button type='button' onClick={() => SubmitRegister()} className='text-3xl bg-yellow-900 hover:bg-yellow-800 text-white px-8 py-2 tracking-widest rounded-full transition-all duration-200'>送　出</button>
                    </section>
                </form>


            </article>

            <Footer />
        </>
    )
}
