import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import axios from "axios";
import { faMapMarkerAlt, faPhone, faStoreAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export async function getServerSideProps() {
  let NewsRes = await axios.get(`${process.env.API_URL}/News/GetTwoNews`);
  let AboutRes = await axios.get(`${process.env.API_URL}/About/showHomeAbout`);


  // if (res.data.success) {
  //   setNews(res.data.news);
  // }

  return { props: { news: NewsRes.data.news, about: AboutRes.data.about } }
}


export default function Home({ news, about }) {
  // const [news, setNews] = useState([]);
  // const [about, setAbout] = useState([]);

  useEffect(() => {
    // GetTwoNews();
    // GetShowHomeAbout();
  }, []);

  const FilterDate = (date) => {
    // return date;
    let d = new Date(date);
    return `${d.getFullYear()} / ${d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
      } / ${d.getDate() > 9 ? d.getDate() : "0" + d.getDate()}`;
  };

  //取得最新消息
  const GetTwoNews = async () => {
    let res = await axios.get(`${process.env.API_URL}/News/GetTwoNews`);
    console.log(res);
    if (res.data.success) {
      setNews(res.data.news);
    }
  };

  //取得關於我們
  const GetShowHomeAbout = async () => {
    let res = await axios.get(`${process.env.API_URL}/About/showHomeAbout`);
    console.log(res);
    if (res.data.success) {
      setAbout(res.data.about);
    }
  };


  return (
    <div>
      <Navbar />

      <Carousel />




      <div className="about ">
        {
          about.map((item, idx) => (
            <div key={item.id} className=" relative pt-36 pb-5  " style={idx == 0 ? {
              background:
                // "linear-gradient(0deg, #563006 0%, rgb(163 124 75) 48%, #563006 100%);"
                "linear-gradient(0deg, #ffe8b5 0%, white 48%, #ffe8b5 100%)"
            } : {}}>
              <div className="max-w-7xl mx-auto grid grid-cols-2 items-center ">
                <div className={idx % 2 == 0 ? 'order-1 px-10' : 'order-2 px-10'} >
                  <h2 className="leading-relaxed my-8 text-center text-3xl font-bold tracking-widest text-yellow-900 " >{item.subtitle}</h2>
                  <p className="text-justify  text-lg tracking-widest leading-relaxed text-gray-700  ">{item.intro}</p>
                  <div className="text-center my-10">
                    <a href="" className="py-2 px-14 transition-all duration-150  rounded-full text-xl bg-yellow-900 hover:bg-yellow-800 text-white ">{item.linkName}</a>
                  </div>
                </div>
                <div className={idx % 2 == 0 ? 'order-2' : 'order-1'}>
                  <img className="w-full rounded-xl mx-auto shadow-xl"
                    src={process.env.Image_URL +
                      "/HomeAbout/" +
                      item.about_id +
                      "/" +
                      item.filename} alt="" />
                </div>
              </div>
              {
                idx == 0 ?
                  <section className="shap5"></section>
                  : ''

              }
            </div>
          ))
        }

      </div>
      <section className="shap3"></section>


      <div
        className="relative py-10 min-h-500 "
        style={{
          background:
            "linear-gradient(0deg, #ffe8b5 0%, white 48%, #ffe8b5 100%);"
          // "linear-gradient(0deg, rgba(255,253,232,1) 0%, rgba(255,237,174,1) 48%, rgba(255,253,232,1) 100%)",
        }}
      >

        {/* <section className="shap1"></section> */}


        <div className="news container mx-auto z-10 relative text-gray-900">
          <h2 className="text-4xl font-medium tracking-wider leading-8 ">
            最新消息
            <br />
            <span className="text-lg text-yellow-900">Lates News</span>
          </h2>
          <div className="grid grid-cols-2 py-10 ">
            {news.map((item) => (
              <article key={item.article_id} className="relative ">
                <div
                  className="mx-auto  relative shadow-lg rounded-xl bg-white"
                  style={{ width: "90%", maxWidth: "450px" }}
                >
                  <h3 className="w-fit px-2 py-1 rounded text-white text-2xl bg-yellow-900 absolute top-0 left-0  z-20 transform -translate-x-1/4 -translate-y-1/3 ">
                    {item.articles_cate_title}
                  </h3>
                  <img
                    className="rounded-t-xl w-full mx-auto hover:brightness-105 transition duration-150"
                    src={
                      process.env.Image_URL +
                      "/news/" +
                      item.article_id +
                      "/" +
                      item.banner
                    }
                    alt=""
                  />
                  <div className="  relative  mx-auto  py-2 px-5 bg-white rounded-b-lg">
                    <h2 className="text-2xl font-medium tracking-wide text-yellow-900 ">
                      {item.title}
                    </h2>
                    {/* <p
                      className="twoLine my-1 text-sm text-gray-500 tracking-wider"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    ></p> */}
                    <p className="text-right text-md text-gray-400 font-light tracking-wider">
                      {FilterDate(item.created_at)}
                    </p>
                    <div className="border-b-2 opacity-40 my-3 border-yellow-900"></div>

                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <section className="shap2 -z-10"></section>
      </div>

      <div className="map container mx-auto py-20 relative">
        <iframe className="w-full rounded-xl shadow-xl" height="550" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5207.690671044539!2d120.30941981093964!3d22.63911691892543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e04f4871d07a7%3A0xccb9296f1ea5e649!2z6auY6ZuE6LuK56uZ!5e0!3m2!1szh-TW!2stw!4v1647443660085!5m2!1szh-TW!2stw" allowfullscreen="" loading="lazy"></iframe>
        <div className="card py-5 px-10 bg-white shadow-xl rounded-lg absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 " style={{ width: '90%', maxWidth: '400px', }}>
          <h2 className="text-4xl font-bold pb-6 border-b border-gray-200">位置訊息</h2>
          <p className="font-light py-6 text-xl tracking-wider leading-relaxed text-gray-900 ">歡迎透過聯絡表單或專線我們聯繫<br />將有專人盡速為您服務。</p>
          <p className="py-1 text-lg text-gray-400 font-light  tracking-wider"><FontAwesomeIcon icon={faMapMarkerAlt} />　807高雄市三民區建國二路318號</p>
          <p className="py-1 text-lg text-gray-400 font-light  tracking-wider"><FontAwesomeIcon icon={faPhone} />　04-2278-9608</p>
          <div className="py-1 text-lg text-gray-400 font-light  tracking-wider flex items-start"><FontAwesomeIcon className="mt-2" icon={faStoreAlt} />
            <div className="ml-3">
              <p>營業時間</p>
              <p className="my-1 text-base">週一至週五: 08:00 - 17:00</p>
              <p className="my-1 text-base">週六: 09:30 - 17:00</p>
              <p className="my-1 text-base">固定公休: 週日</p>
            </div>
          </div>
          <div className="text-center my-5">

            <button type="button" className="py-2 px-14 transition-all duration-150  rounded-full text-xl bg-yellow-900 hover:bg-yellow-800 text-white ">聯絡我們</button>
          </div>
        </div>
      </div>
      {/* <main className={styles.main}>
        <h1 className={styles.title, 'text-red-600 font-extrabold text-3xl'}>
          Welcome to <a className='text-blue-500' href="https://nextjs.org">Next.js!</a>
        </h1>
        <Link href="/test">
          <a>Test</a>
        </Link>
        <Link href={`/dynamic/${variable}`}>
          <a>Showid</a>
        </Link>
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main> */}

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}

    </div >
  );
}
