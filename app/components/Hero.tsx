import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div>
        <section className="relative h-[600px]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="/images/hero-bg.jpg"
          alt="Luxury hotel"
          fill
          className="object-cover"
          priority
        />
        <div className="container relative z-20 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Escape</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Discover luxury accommodations tailored to your desires
          </p>
          <Link
            href="/search"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Explore Rooms
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Hero