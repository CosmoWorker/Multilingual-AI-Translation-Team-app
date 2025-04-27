import Link from 'next/link';
import Image from "next/image";

const footerTextStyle="text-sm text-muted-foreground hover:text-foreground transition-colors"
const partialFooterStyle="text-muted-foreground hover:text-foreground transition-colors"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 px-5">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/polycomm-logo.png"
                alt="PolyComm Logo"
                width={44}
                height={44}
                className="h-11 w-11"
              />
              <span className="font-bold text-xl">PolyComm</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 md:pr-10">
              Transform your communication with our advanced AI-powered tools for text-to-speech, 
              speech-to-text, and more.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Product</p>
            <nav className="flex flex-col gap-2">
              <Link href="/text-to-speech" className={footerTextStyle}>
                Text to Speech
              </Link>
              <Link href="/speech-to-text" className={footerTextStyle}>
                Speech to Text
              </Link>
              <Link href="/text-to-text" className={footerTextStyle}>
                Text to Text
              </Link>
              <Link href="/image-to-text" className={footerTextStyle}>
                Image to Text
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Company</p>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className={footerTextStyle}>
                About
              </Link>
              <Link href="/pricing" className={footerTextStyle}>
                Pricing
              </Link>
              <Link href="/blog" className={footerTextStyle}>
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Legal</p>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy" className={footerTextStyle}>
                Privacy
              </Link>
              <Link href="/terms" className={footerTextStyle}>
                Terms
              </Link>
              <Link href="/licenses" className={footerTextStyle}>
                Licenses
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PolyComm. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="https://twitter.com" className={partialFooterStyle}>
              Twitter
            </Link>
            <Link href="https://github.com" className={partialFooterStyle}>
              GitHub
            </Link>
            <Link href="https://discord.com" className={partialFooterStyle}>
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}