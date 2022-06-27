import React from 'react'
import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/About.module.css";
import Link from "next/link";


export default function About({ about }) {
    console.log(about);

    return (
        <>

            <Navbar />
            <article className='min-h-screen mt-20 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <h2 className='text-3xl my-16 text-center font-light tracking-widest text-yellow-900'>關　於　我　們<br /><span className='text-lg'>Contact Us</span></h2>

                <div className="category">
                    <div className=' flex flex-wrap md:flex-nowrap  justify-center items-center my-16'>
                        {
                            about.map((item, idx) => {
                                return <Link href={`/about/${item.about_id}`} key={item.about_id}><a className={` w-4/5 md:w-auto text-center my-1 px-12 py-2  hover:bg-yellow-900 transition-all duration-200 text-white text-lg mx-3 rounded-full tracking-widest ${idx == 0 ? 'bg-yellow-900' : 'bg-gray-300'}`}>{item.title}</a></Link>
                            })
                        }
                    </div>
                </div>
                <section className='py-10 md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-2 '>
                    {
                        about && about.length > 0 ?
                            <>
                                {/* <h1 className='text-3xl font-medium my-3'>{about[0].title}</h1> */}
                                <img className="w-full  mx-auto "
                                    src={process.env.Image_URL +
                                        "/HomeAbout/" +
                                        about[0].about_id +
                                        "/" +
                                        about[0].filename} alt="" />

                                <div className='editorInner py-10' dangerouslySetInnerHTML={{ __html: about[0].content }}></div>
                            </>
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