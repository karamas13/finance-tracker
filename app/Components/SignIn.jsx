import React, { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { authContext } from '../lib/store/auth-context';

function SignIn() {
 
    const { googleLoginHandler } = useContext(authContext);
 
    return (
    <main className="container max-w-xl px-6 mx-auto">
        <h1 className="mb-6 text-5xl font-bold text-center">Welcome</h1>

        <div className="flex flex-col overfolow-hidden shadow-md shadow-slate-500 bg-slate-800 rounded-2xl h-[15rem] my-10">
           <h2 className="text-slate-200 mx-auto py-2 w-full text-center">
             <span className="text-2xl">
              <span className="text-blue-500 text-bold">SignIn</span> Now
             </span>
              <br></br> 
              for your every day finance-tracking!
              
              </h2>

            <div className="px-4 py-10">
               <h3 className='text-xl text-center'>SignIn with Google:</h3>
               <button onClick={googleLoginHandler} className="flex self-start gap-2 p-3 mx-auto mt-6 font-medium text-slate-50 align-middle bg-gray-700 rounded-lg">
                 <FcGoogle className='text-xl'/>
                 Google
                </button>
            </div>
             
        </div>

        
    </main>
  )
}

export default SignIn;