import React from 'react'
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/News.module.css";
import Link from "next/link";


export default function about_detail({ about }) {


    const router = useRouter()
    const { aboutId } = router.query
    console.log(about);
    useEffect(() => {

        let checkAbout = about.filter(item => {
            return item.about_id == aboutId
        })

        if (!checkAbout || (checkAbout && checkAbout.length == 0)) {
            router.push('/about')
        }

    }, [router]);

    return (
        <>

            <Navbar />
            <article className='min-h-screen mt-24 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <h2 className='text-3xl my-16 text-center font-light tracking-widest text-yellow-900'>關　於　我　們<br /><span className='text-lg'>Contact Us</span></h2>

                <div className="category">
                    <div className=' flex   flex-wrap md:flex-nowrap  justify-center items-center my-16'>
                        {
                            about.map((item, idx) => {
                                return <Link href={`/about/${item.about_id}`} key={item.about_id}><a className={`  w-4/5 md:w-auto text-center my-1 px-12 py-2  hover:bg-yellow-900 transition-all duration-200 text-white text-lg mx-3 rounded-full tracking-widest ${item.about_id == aboutId ? 'bg-yellow-900' : 'bg-gray-300'}`}>{item.title}</a></Link>
                            })
                        }
                    </div>
                </div>

                <section className='py-10  md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-2 '>

                    {

                        about && about.length > 0 ?
                            about.map(item => (
                                item.about_id == aboutId ?
                                    <div key={item.about_id}>
                                        <img className="w-full mx-auto "
                                            src={process.env.Image_URL +
                                                "/HomeAbout/" +
                                                item.about_id +
                                                "/" +
                                                item.filename} alt="" />

                                        <div className='editorInner py-10' dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                    </div>
                                    : null
                            ))
                            : <div></div>
                    }
                </section>

            </article>

            <Footer />
        </>
    )
};


export async function getServerSideProps() {
    let AboutRes = await axios.get(`${process.env.API_URL}/About/GetAbout`);
    return { props: { about: AboutRes.data.about } }

}