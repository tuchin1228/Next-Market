import React from 'react'
import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/About.module.css";
import Link from "next/link";


export default function about({ about }) {
    console.log(about);

    return (
        <>

            <Navbar />
            <article className='min-h-screen mt-24 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
                <div className="category">
                    <div className=' flex justify-center items-center my-16'>
                        {
                            about.map((item, idx) => {
                                return <Link href={`/about/${item.about_id}`} key={item.about_id}><a className={`px-12 py-2  hover:bg-yellow-900 transition-all duration-200 text-white text-lg mx-3 rounded-full tracking-widest ${idx == 0 ? 'bg-yellow-900' : 'bg-gray-300'}`}>{item.title}</a></Link>
                            })
                        }
                    </div>
                </div>
                <section className='py-10 max-w-5xl mx-auto '>
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