import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/Contact.module.css";
import Link from "next/link";


export default function index() {

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [direction, setDirection] = useState('')
    const [contactCategoryId, setContactCategoryId] = useState('')
    const [category, setCategory] = useState([])



    useEffect(() => {
        GetContactCategory()
    }, [])

    // 取得問題分類
    const GetContactCategory = async () => {
        let CategoryRes = await axios.get(`${process.env.API_URL}/Contact/GetContactCategry`);
        console.log(CategoryRes);
        if (CategoryRes.data.success) {
            setCategory(CategoryRes.data.category)
        }
    }

    const SubmitContact = async () => {
        const data = {
            name: name,
            phone: phone,
            contactCategoryId: contactCategoryId,
            email: email,
            direction: direction,

        }
        let ContactRes = await axios.post(`${process.env.API_URL}/Contact/submitContact`,
            data
        )
        console.log(ContactRes);
        if (ContactRes.data.success) {
            alert('成功送出，我們將由專員連繫您')
            setName('')
            setPhone('')
            setEmail('')
            setDirection('')
            setContactCategoryId('')
        }
    }


    return (
        <>
            <Navbar />
            <article className='min-h-screen mt-20 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <h2 className='text-3xl my-16 text-center font-light tracking-widest text-yellow-900'>聯　絡　我　們<br /><span className='text-lg'>Contact Us</span></h2>

                <form action="" className="md:grid  md:grid-cols-2 py-10 max-w-5xl mx-auto gap-2">
                    {/* <h2 className='col-span-2  my-5 font-bold text-5xl'>聯絡我們</h2> */}

                    <section >
                        <label htmlFor="category" className='block text-xl p-1 my-1 text-yellow-900 font-light'>問題分類</label>
                        <select name="category" id="category" className='block w-full py-2 px-2 rounded-md border text-lg' onChange={(e) => setContactCategoryId(e.target.value)}>
                            {
                                category.map(item => (
                                    <option value={item.id} key={item.id} >{item.title}</option>
                                ))
                            }
                        </select>
                    </section>
                    <section>
                        <label htmlFor="name" className='block text-xl p-1 my-1 text-yellow-900 font-light'>姓名</label>
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section>
                        <label htmlFor="phone" className='block text-xl p-1 my-1 text-yellow-900 font-light'>聯絡電話</label>
                        <input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section>
                        <label htmlFor="email" className='block text-xl p-1 my-1 text-yellow-900 font-light'>電子信箱</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required />
                    </section>
                    <section className='col-span-2'>
                        <label htmlFor="direction" className='block text-xl p-1 my-1 text-yellow-900 font-light'>需求說明</label>
                        <textarea id="direction" name="direction" value={direction} onChange={(e) => setDirection(e.target.value)} className='block w-full py-2 px-2 rounded-md border text-lg' required></textarea>
                    </section>
                    <section className='col-span-2 text-center my-3'>
                        <button type='button' onClick={() => SubmitContact()} className='text-3xl bg-yellow-900 hover:bg-yellow-800 text-white px-8 py-2 tracking-widest rounded-full transition-all duration-200'>送　出</button>
                    </section>
                </form>
            </article>
            <Footer />
        </>
    )
}
