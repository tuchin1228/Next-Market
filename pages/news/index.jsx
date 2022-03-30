import React from 'react'
import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/News.module.css";
import Link from "next/link";


export default function news({ news, categories }) {


    console.log(news);
    console.log(categories);

    const FilterDate = (date) => {
        // return date;
        let d = new Date(date);
        return `${d.getFullYear()} / ${d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
            } / ${d.getDate() > 9 ? d.getDate() : "0" + d.getDate()}`;
    };

    return (
        <div>
            <Navbar />

            <article className='min-h-screen mt-24 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>

                <div className="category">
                    <div className=' flex justify-center items-center my-16'>
                        <Link href={'news'}><a className='px-12 py-2 bg-yellow-900 hover:bg-yellow-900 transition-all duration-200 text-white text-lg mx-3 rounded-full tracking-widest'>所有公告</a></Link>
                        {
                            categories.map(item => {
                                return <Link href={'news/' + item.id} key={item.id}><a className='px-12 py-2 bg-gray-300 hover:bg-yellow-900 transition-all duration-200 text-white text-lg mx-3 rounded-full tracking-widest'>{item.articles_cate_title}</a></Link>
                            })
                        }
                    </div>
                    <section className=' max-w-7xl mx-auto grid grid-cols-4 gap-5 mb-10'>
                        {
                            news.map(item => {
                                return <div key={item.article_id} className="p-2 bg-white shadow-lg rounded-lg">
                                    <div className='overflow-hidden rounded-lg my-2'>
                                        <Link href={`/news/${item.cateId}/${item.article_id}`}>
                                            <img className='rounded-lg  transition-all duration-200 transform scale-100 hover:scale-110' src={process.env.Image_URL +
                                                "/news/" + item.article_id + '/' + item.banner} alt="" />
                                        </Link>
                                    </div>
                                    <h3 className='my-1 font-medium text-yellow-900 text-lg'>【{item.articles_cate_title}】</h3>
                                    <Link href={`/news/${item.cateId}/${item.article_id}`}>
                                        <a className='my-1 font-normal text-gray-500 hover:text-yellow-900 tracking-wider text-xl '>{item.title}</a>
                                    </Link>
                                    <p className=' text-gray-300 mt-4 text-lg'>{FilterDate(item.created_at)}</p>
                                </div>
                            })
                        }
                    </section>
                </div>
            </article >

            <Footer />
        </div >
    )
}



export async function getServerSideProps() {
    let NewsRes = await axios.get(`${process.env.API_URL}/News/GetNews`);
    return { props: { news: NewsRes.data.news, categories: NewsRes.data.category } }

}