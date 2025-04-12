"use client";

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

export function Appbar() {
    return  <div className="flex justify-between items-center p-4">
        <div>Real Time Multi AI</div> 
        <div className='flex justify-end items-center p-4 gap-4 h-16'>
            <SignedOut>
                <SignInButton />
                <SignUpButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </div>
}