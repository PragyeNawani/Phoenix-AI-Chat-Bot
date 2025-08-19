'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { createaccount, getsessionactive } from '@/app/lib/appwrite';
import { useRouter } from 'next/navigation';
import { CircularProgress, LinearProgress } from './progressbar';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { SnackBarContext } from '@/app/contexts/SnackBarContext';
import { AnimatePresence } from 'framer-motion';
import { loginAction } from '@/app/lib/appwrite';
const Login = () => {
  const [session, setsession] = useState('loading')
  const router = useRouter();
  const [error, seterror] = useState('');
  useEffect(() => {
  const ses = async () => { 
    let status = await getsessionactive()
    console.log(status)
    if(status){
      setsession('active')
      router.push('/')
    }
    else{
      setsession('inactive')
    }
   }
  ses()
  }, [])
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const delay = (d) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, d * 1000);
    });
  };

  const onSubmit = async (data) => {
    await delay(2);
    const result = await loginAction(data);
    if (result.success) {
      console.log(result.session);
      // getsession()
      // window.location.href = result.redirect || '/'; // Client-side redirect
      // or use router.push if you're using Next.js client-side navigation
      if(result.session){router.push(result.redirect || '/');}
    } else {
      // Handle error
      //Get error data from form submission
      seterror(result.error);
    }
    console.log(result);
  };
  const { ShowSnackbar } = useContext(SnackBarContext);
  useEffect(() => {
    if (error.length != 0) {
      ShowSnackbar(error, 'error');
    }
  }, [error, ShowSnackbar]);
  if(session == 'loading'){
    return (
      <>
      <LinearProgress/>
      <section className='flex justify-center items-center w-full h-screen'><CircularProgress/></section>
      </>
    )
  }
  if(session == 'inactive'){
    return (
    <>
      <AnimatePresence>
        {isSubmitting && (
          <LinearProgress className='absolute top-0 right-0 left-0' />
        )}
      </AnimatePresence>
      <div className='relative w-screen h-dvh p-2 grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] lg:gap-2'>
        <div className='flex flex-col p-4'>
          <Link
            href='/'
            className='max-w-max mx-auto lg:mx-0'
          >
            <img
              src='logo-light.svg'
              width={133}
              height={24}
              alt='Phoenix Logo'
              className='dark:hidden'
            />
            <img
              src='logo-dark.svg'
              width={133}
              height={24}
              alt='Phoenix Logo'
              className='hidden dark:block'
            />
          </Link>
          <div className='flex flex-col gap-2 max-w-[480px] w-full mx-auto'>
            <h2 className='text-displaySmall font-semibold text-center text-light-onBackground dark:text-dark-onBackground'>
              Welcome Back To Phoenix
            </h2>
            <p className='text-bodyLarge text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant mt-1 mb-5 text-center px-2'>
              Enter you phoenix account details
            </p>
            <form
              method='POST'
              action=''
              className='grid grid-cols-1 gap-4'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='flex flex-col gap-2 text-field-wrapper'>
                <label
                  htmlFor='email'
                  className='label-text'
                >
                  Email
                </label>
                <input
                  {...register('email', { required: true })}
                  type='email'
                  placeholder='Email...'
                  className='text-field'
                  autoFocus={true}
                />
                {errors.email && (
                  <p className='helper-text'>{errors.email.message}</p>
                )}
              </div>
              <div className='flex flex-col gap-2 text-field-wrapper'>
                <label
                  htmlFor='password'
                  className='label-text'
                >
                  Password
                </label>
                <input
                  {...register('password', { required: true })}
                  type='password'
                  placeholder='Password...'
                  name='password'
                  required={true}
                  className='text-field'
                />
                {errors.password && (
                  <p className='helper-text'>{errors.password.message}</p>
                )}
              </div>
              <div className='text-right'>
                <Link
                  href={'/reset-link'}
                  className='link text-labelLarge inline-block'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='flex flex-col gap-2 text-field-wrapper'>
                <button
                  type='submit'
                  className='btn filled primary cursor-pointer disabled:cursor-default focus:shadow-none '
                  disabled={isSubmitting}
                >
                  {!isSubmitting && 'Sign In'}
                  {isSubmitting && <CircularProgress />}
                  {isSubmitting && 'loading...'}
                </button>
                <div className='state-layer'></div>
              </div>
            </form>
            <p className='text-bodyMedium text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant text-center mt-4'>
              Don't have an account?
              <Link
                href={`/register`}
                className='link inline-block ms-1 text-light-onSurface dark:text-dark-onSurface text-labelLarge'
              >
                Create an account
              </Link>
            </p>
          </div>
          <p className='mt-auto mx-auto text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant text-bodyMedium lg:mx-0'>
            &copy; 2025 codewithpragye. All rights reserved.
          </p>
        </div>
        <div className='hidden img-box lg:block lg:relative lg:rounded-large'>
          <img
            src='banner.webp'
            className='img-cover'
            alt=''
          />
          <p className='absolute bottom-10 left-12 right-12 z-10 text-displayLarge font-semibold leading-tight tex-right text-light-onSurface  drop-shadow-sm 2xl:text-[72px] '>
            Chat with Phoenix to supercharge your ideas.
          </p>
        </div>
      </div>
    </>
  );
  }
};

export default Login;
