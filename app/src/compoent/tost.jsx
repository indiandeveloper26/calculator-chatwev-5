"use client";


import React, { useContext } from 'react'
import { ToastContainer } from 'react-toastify'
import { ChatContext } from '../context/chatcontext'

function Tost() {


    let { theme } = useContext(ChatContext)

    // console.log("tostpagee", theme)
    return (


        <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === "dark" ? "light" : "dark"}
        />
    )
}

export default Tost

