import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import axios from "axios";
import styles from "../../../styles/News.module.css";
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from "next/link";


export default function new_detail({ success, newsDetail }) {

    const router = useRouter()
    const { categoryId } = router.query

    console.log(newsDetail);
    useEffect(() => {
        if (!success) {
            router.push('/news')
        }
    }, [router])

    const FilterDate = (date) => {
        // return date;
        let d = new Date(date);
        return `${d.getDate() > 9 ? d.getDate() : "0" + d.getDate()}`;
    };

    const FilterYearMonth = (date) => {
        // return date;
        let d = new Date(date);
        return `${d.getFullYear()}.${d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
            }`;
    };

    return (
        <div>

            <Navbar />
            <article className='min-h-screen mt-24 relative'>
                <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>


                <section className='py-10 max-w-5xl mx-auto '>
                    <div className="flex items-center py-5">
                        <div className='mr-5'>
                            <p className='text-center text-7xl text-yellow-900'>{FilterDate(newsDetail.created_at)}</p>
                            <p className='text-center text-xl tracking-wider text-gray-400 font-light'>{FilterYearMonth(newsDetail.created_at)}</p>
                        </div>
                        <div>
                            <h3 className='text-lg tracking-wider text-yellow-900'>【{newsDetail.articles_cate_title}】</h3>
                            <h2 className='text-2xl font-light tracking-wider text-gray-800'>{newsDetail.title}</h2>
                        </div>
                    </div>
                    <hr />
                    <div className='editorInner py-10' dangerouslySetInnerHTML={{ __html: newsDetail.content }}></div>
                    <hr />
                    <div className='text-center py-5'>
                        <Link href={'/news/' + newsDetail.cateId}>
                            <a className='text-xl text-yellow-900 hover:text-yellow-700 tracking-widest font-light'><FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon> BACK</a>
                        </Link>
                    </div>
                </section>
            </article>
            <Footer />
        </div>
    )
}




export async function getServerSideProps({ params }) {
    let categoryId = params.categoryId
    let articleId = params.articleId
    let NewsDetail = await axios.get(`${process.env.API_URL}/News/GetNews/${categoryId}/${articleId}`);

    return { props: { success: NewsDetail.data.success, newsDetail: NewsDetail.data.newsDetail } }

}

