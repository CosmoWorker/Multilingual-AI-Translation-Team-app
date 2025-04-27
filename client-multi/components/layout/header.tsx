"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignInButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";

const mainNav = [
  { name: "Text to Speech", href: "/text-to-speech" },
  { name: "Speech to Text", href: "/speech-to-text" },
  { name: "Text to Text", href: "/text-to-text" },
  { name: "Image to Text", href: "/image-to-text" },
];

const toolsItems = [
  {
    title: "Text to Speech",
    href: "/app/translate/tts",
    description: "Convert written text to natural-sounding speech",
  },
  {
    title: "Speech to Text",
    href: "/app/translate/stt",
    description: "Transcribe spoken words to written text in real-time",
  },
  {
    title: "Text to Text",
    href: "/app/translate/text",
    description: "Translate or transform text between languages and formats",
  },
  {
    title: "Image to Text",
    href: "/app/translate/image",
    description: "Extract and describe text content from images",
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const {isSignedIn}=useAuth();
  // const {signOut}=useClerk();

  // const handleSignOut= async()=>{
  //   await signOut();
  //   window.location.href='/'
  // }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/polycomm-logo.png"
              alt="PolyComm Logo"
              width={44}
              height={44}
              className="h-11 w-11"
            />
            <span className="font-bold text-xl">PolyComm</span>
          </Link>

          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {toolsItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/pricing">Pricing</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/about">About</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex md:items-center md:gap-4">
            <ThemeToggle />
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline">Log in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign up</Button>
                </SignUpButton>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/" className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6" />
                    <span className="font-bold text-xl">PolyComm</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {mainNav.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/pricing"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/about"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      About
                    </Link>
                  </nav>
                  <div className="flex flex-col gap-2">
                    {isSignedIn ? (
                      <UserButton afterSignOutUrl="/" />
                    ) : (
                      <>
                        <SignInButton mode="modal">
                          <Button variant="outline" className="w-full">Log in</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button className="w-full">Sign up</Button>
                        </SignUpButton>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    title: string;
    href: string;
    children: React.ReactNode;
  }
>(({ className, title, children, href, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
