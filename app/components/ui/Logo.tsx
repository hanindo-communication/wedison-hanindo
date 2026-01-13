'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  showText?: boolean
  href?: string
  onClick?: () => void
}

export default function Logo({ className = '', size = 'medium', showText = false, href = '/', onClick }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-16 w-16',
    large: 'h-24 w-24',
    xlarge: 'h-32 w-32',
  }

  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl',
  }

  // Default to center alignment unless overridden by className
  const defaultJustify = className.includes('justify') ? '' : 'justify-center'
  
  const handleClick = (e: React.MouseEvent) => {
    if (href === '#' || onClick) {
      e.preventDefault()
      if (onClick) {
        onClick()
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  
  const logoContent = (
    <>
      {/* Logo Image with fallback */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0 flex items-center justify-center overflow-hidden`}>
        {!imageError ? (
          <div className="relative w-full h-full">
            <Image
              src="/logo/logo.png"
              alt="Wedison Logo"
              fill
              sizes="(max-width: 768px) 40px, 64px"
              className={`object-contain ${className.includes('brightness-0') ? 'brightness-0' : ''} ${className.includes('invert') ? 'invert' : ''}`}
              onError={() => {
                setImageError(true)
              }}
              priority
              unoptimized
            />
          </div>
        ) : null}
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-secondary-teal`}>
          WEDISON
        </span>
      )}
    </>
  )
  
  if (href === '#' || onClick) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center ${defaultJustify} ${className} cursor-pointer`}
        aria-label="Scroll to top"
      >
        {logoContent}
      </button>
    )
  }
  
  return (
    <Link href={href} className={`flex items-center ${defaultJustify} ${className}`}>
      {logoContent}
    </Link>
  )
}
