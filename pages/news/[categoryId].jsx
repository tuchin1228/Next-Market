import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import styles from "../../styles/News.module.css";
import Link from "next/link";

export default function New_category({ news, categories }) {

  const router = useRouter()
  const { categoryId } = router.query

  useEffect(() => {
    let checkCategory = categories.filter(item => {
      return item.id == categoryId
    })

    if (!checkCategory || (checkCategory && checkCategory.length == 0)) {
      router.push('/news')
    }

  }, [router])


  const FilterDate = (date) => {
    // return date;
    let d = new Date(date.replace(/-/g,'/'));
    return `${d.getFullYear()} / ${d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
      } / ${d.getDate() > 9 ? d.getDate() : "0" + d.getDate()}`;
  };

  return (
    <div>
      <Navbar />

      <article className='min-h-screen mt-20 relative'>

        <div className={"banner " + styles.bannerImage} style={{ height: '500px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
        <h2 className='text-3xl my-16 text-center font-light tracking-widest text-yellow-900'>最　新　消　息<br /><span className='text-lg'>News</span></h2>

        <div className="category">
          <div className=' flex flex-wrap md:flex-nowrap justify-center items-center my-16'>
            <Link href={'/news'}><a className=' w-4/5 md:w-auto text-center my-1 px-6 lg:px-12  py-2 bg-gray-300 hover:bg-yellow-900 transition-all duration-200 text-white text-lg mx-3 rounded-full tracking-widest'>所有公告</a></Link>
            {
              categories.map(item => {
                return <Link href={'/news/' + item.id} key={item.id}>
                  <a className={` w-4/5 md:w-auto text-center my-1 px-6 lg:px-12  py-2  hover:bg-yellow-900 transition-all duration-200 text-white text-lg mx-3 rounded-full tracking-widest 
                  ${categoryId == item.id ? 'bg-yellow-900' : 'bg-gray-300'} `}>{item.articles_cate_title}</a></Link>
              })
            }
          </div>
          <section className='px-2 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-5 mb-10'>
            {
              news.map(item => {
                return <div key={item.article_id} className="p-2 bg-white shadow-lg rounded-lg">
                  <div className='overflow-hidden rounded-lg my-2'>
                    <Link href={`/news/${item.cateId}/${item.article_id}`}>
                      <img className='rounded-lg  transition-all duration-200 transform w-full' src={process.env.Image_URL +
                        "/news/" + item.article_id + '/' + item.banner} alt="" />
                    </Link>
                  </div>
                  <h3 className='my-1 font-medium text-yellow-900 text-lg'>【{item.articles_cate_title}】</h3>
                  <Link href={`/news/${item.cateId}/${item.article_id}`}>
                    <a className='my-1 font-normal text-gray-500 hover:text-yellow-900 tracking-wider text-md lg:text-xl  '>{item.title}</a>
                  </Link>
                  <p className=' text-gray-300 mt-4 text-md lg:text-xl '>{FilterDate(item.created_at)}</p>
                </div>
              })
            }
          </section>
        </div>
      </article >

      <Footer />
    </div>
  )
}




export async function getServerSideProps({ params }) {
  let categoryId = params.categoryId
  let NewsRes = await axios.get(`${process.env.API_URL}/News/GetNews/${categoryId}`);
  return { props: { news: NewsRes.data.news, categories: NewsRes.data.category } }

}

