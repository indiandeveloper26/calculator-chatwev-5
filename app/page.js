'use client'

import React from 'react'
import Login from './login/page'
import Link from 'next/link'

function page() {
  return (
    <>

      <Link href={"suspence"}>go now</Link>
      <Login />
    </>
  )
}

export default page