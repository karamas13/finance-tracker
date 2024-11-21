"use client"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import localFont from "next/font/local";
import "./globals.css";
import Navigation from "./Components/Navigation";


import FinanceContextProvider from './lib/store/finance-context';
import AuthContextProvider from "./lib/store/auth-context";

import { Metadata } from 'next'



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});





export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <title>Finance Tracker</title>
       <AuthContextProvider> 
         <FinanceContextProvider>
           <ToastContainer /> 
             <Navigation />
             {children}           
         </FinanceContextProvider>
       </AuthContextProvider> 
      </body>
    </html>
  );
}
