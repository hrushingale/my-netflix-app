import Input from "@/components/input";
import { Console } from "console";
import { useCallback, useState } from "react";
import axios from 'axios';
import {signIn} from 'next-auth/react';
import { useRouter } from "next/router";
import prisma from '@/lib/prismadb'; // Adjust the import according to your project structure
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";


const Auth = () =>{
    const router=useRouter();
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [password,setPassword]=useState('');
    const [variant,setVariant]=useState('login');

    const toggleVariant=useCallback(()=>{
        setVariant((currentVariant)=>currentVariant==='login'?'register':'login')
    },[]);

    const login=useCallback(async()=>{
        try {
            const result=await signIn('credentials',{
                email,
                password,
                redirect:false,
                callbackUrl:'/profiles'
            });
            if(result?.error){
                console.log('error logging in');
                console.log(result.error);
            }
            else{
                console.log('login success');
                router.push('/profiles');

            }
            
        } catch (error) {
            console.log(error);
        }

    },[email,password,router]);

    const register=useCallback(async ()=>{
        try{
            console.log("Sending request with data:", { email, name, password });

            await axios.post('https://my-netflix-app-indol.vercel.app/api/register',{
                email,
                name,
                password
            });

            login();
        }
        catch(error){
            console.log(error);
        }
    },[email,name,password,login]);

    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
            <nav className="px-12 py-5">
                <img src="/images/logo.svg" alt="logo" className="h-12"></img>
            </nav>
            <div className="flex justify-center">
                
            <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">

                <h2 className="text-white text-4xl mb-8 font-semibold">
                    {variant==='login'?'Sign in':'Register'}
                </h2>
                <div className="flex flex-col gap-4">
                    
                       { variant==='register' && 
                    
                <Input 
                    id={"name"} 
                    onChange={(obj:any)=>setName(obj.target.value)} 
                    value={name} 
                    label={"Username"}
                    type="name"
                    />
                       }
                    
                <Input 
                    id={"email"} 
                    onChange={(obj:any)=>setEmail(obj.target.value)} 
                    value={email} 
                    label={"Email"}
                    type="email"
                    />

                <Input 
                    id={"password"} 
                    onChange={(obj:any)=>setPassword(obj.target.value)} 
                    value={password} 
                    label={"Password"}
                    type="password"
                    />  
                </div>

                <button 
                onClick={variant==='login'?login:register}
                className="
                bg-red-600 py-3 text-white rounded-md
                w-full mt-10 hover:bg-red-700 transition
                ">{variant==='login'?'Login':'Sign Up'}</button>
                <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                       <div
                       className="
                       w-10
                       h-10
                       bg-white
                       rounded-full
                       flex
                       items-center
                       justify-center
                       cursor-pointer
                       hover:opacity-80
                       transition
                       "
                       onClick={()=>{
                        signIn('google',{ callbackUrl:'/profiles'})
                       }}
                       
                       >
                        <FcGoogle size={30}/>


                       </div>
                       <div

                       onClick={()=>{
                        signIn('github',{ callbackUrl:'/profiles'})
                       }}

                       className="
                       w-10
                       h-10
                       bg-white
                       rounded-full
                       flex
                       items-center
                       justify-center
                       cursor-pointer
                       hover:opacity-80
                       transition
                       "
                       >
                        <FaGithub size={30}/>


                       </div>

                </div>

                <p className="text-neutral-500 mt-12">
                {variant==='login'?'First time using Netflix?':'Already have an account?'}
                    <span 
                    onClick={toggleVariant}
                    className="text-white ml-1 hover:underline cursor-pointer">
                        {variant==='login'?'Create an account!':'Log in'}
                    </span>

                </p>
            
            
            </div>
            </div>

            </div>

        </div>
    );
}

export default Auth;
