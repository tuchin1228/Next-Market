import React ,{useState} from 'react'
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/router'


export default function Login({ showLogin, ToggleShowLogin }) {
    const router = useRouter()
    console.log(`${process.env.BASE_URL}${router.pathname}`);
    const [client_id,setClient_id] = useState('1657025850')
    const [redirect_uri,setRedirect_uri] = useState(`${process.env.BASE_URL}${router.pathname}`)
    
    // Line登入畫面
    const LineLogin = async () => {
        
        location.href=`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${new Date().getTime()}&scope=profile%20openid%20email`
        // console.log({
        //     grant_type: 'authorization_code',
        //     code: `${new Date().getTime()}`,
        //     redirect_uri: 'http://114.35.65.114:3000/user/register',
        //     client_id: '1657025850',
        //     client_secret: '43767fd63709e07c151db2fcfca23822',
        // });
        // let res = await axios.post(`https://access.line.me/oauth2/v2.1/authorize?
        // response_type=code&client_id=${`1657025850`}&redirect_uri=${}&state=${}&scope=profile%20openid%20email
        // `, {
        //     grant_type: 'authorization_code',
        //     code: `${new Date().getTime()}`,
        //     redirect_uri: 'http://114.35.65.114:3000/user/register',
        //     client_id: '1657025850',
        //     client_secret: '43767fd63709e07c151db2fcfca23822',
        // }, {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        // }).catch(err=>{
        //     console.log(err);
        // })
        // console.log(res);
    }


    return (

        <>
            <div className={` fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white shadow-lg rounded-lg p-5 ${showLogin ? '' : 'hidden'}`} style={{ maxWidth: '500px', width: '90%' }}>
                <h2 className='text-3xl font-bold text-center tracking-widest text-yellow-900'>會員登入</h2>
                <form action="">
                    <div className='my-5'>
                        <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>行動電話：</label>
                        <input type="tel" name="" id="" className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入行動電話' />
                    </div>
                    <div className='my-5'>
                        <label htmlFor="" className=' block my-1 text-lg text-yellow-900'>密碼：</label>
                        <input type="password" name="" id="" className=' block my-1 text-lg border border-gray-200 p-2 w-full rounded-sm' placeholder='輸入密碼' />
                    </div>

                    <div className='text-center'>
                        <button type='button' className=' mx-1 px-5 py-1 mt-3 mb-5 border-2 border-gray-200 text-xl text-gray-400 hover:text-yellow-900 hover:border-yellow-900 transition-all duration-200 '>登　入</button>
                        <button type='button' onClick={() => ToggleShowLogin(false)} className=' mx-1 px-5 py-1 mt-3 mb-5 border-2 border-gray-200 text-xl text-gray-400 hover:text-yellow-900 hover:border-yellow-900 transition-all duration-200 '>取　消</button>

                    </div>
                    <div className='text-center flex justify-center my-3'>
                        <button type='button' className='   px-2 text-gray-300 hover:text-gray-400 '>忘記密碼</button>
                        <div className='border-r border-gray-300'></div>
                        <Link href={`/user/register`}>
                            <a className='   px-2 text-gray-300 hover:text-gray-400'>立即註冊</a>
                        </Link>
                    </div>
                </form>

                <div className='mt-10'>
                    <button type='button' onClick={()=>LineLogin()} className='w-full block my-1 text-xl py-2 bg-green-500 hover:bg-green-400 text-white font-bold text-center' >Line 登入</button>
                    <a href="" className=' block my-1 text-xl py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-center'>Facebook 登入</a>
                </div>
            </div>


        </>
    )
}
