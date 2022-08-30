import React from 'react'
import Head from 'next/head';
import { BsLightbulbFill } from 'react-icons/bs';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <nav className='flex items-center justify-center px-6 py-4 '>
        <Head>
             <style>
               @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@600&display=swap');
             </style>
        </Head>
        <h1 className=' text-xl'>Vault Dapp</h1>
        <div className='flex flex-auto justify-end items-center px-4'>
        <BsLightbulbFill className='text-3xl cursor-pointer mr-4'/>
        <ConnectButton />
        </div>
    </nav>
  )
}

export default Navbar