import React from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar';

export default function Showid() {
  const router = useRouter();
  const { id } = router.query
  return (
    <>
      <Navbar />
      <div>{id}</div>
    </>
  )
}
