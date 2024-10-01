import React from 'react';
import { LinkedinIcon, GithubIcon, InstagramIcon, TwitterIcon } from 'lucide-react';

const Footer = () => {
  return (
    <div className='bg-black text-gray-300 py-16' style={{ fontFamily: '"Signika", sans-serif' }}>
      <div className='container mx-auto px-4 lg:w-[75%]'>
        <div>
          <h1 className='w-full text-3xl font-bold text-white'>
            Solis
          </h1>
          <p className='py-4'>
            The future of learning reimagined
          </p>
          <div className='flex justify-between md:w-[75%] my-6'>
            <a href="https://www.instagram.com/vihaanshahh" target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={30} />
            </a>
            <a href="https://twitter.com/thepixelvoyage" target="_blank" rel="noopener noreferrer">
              <TwitterIcon size={30} />
            </a>
            <a href="https://github.com/vihaanshah2014" target="_blank" rel="noopener noreferrer">
              <GithubIcon size={30} />
            </a>
            <a href="https://www.linkedin.com/in/vihaanshah04" target="_blank" rel="noopener noreferrer">
              <LinkedinIcon size={30} />
            </a>
          </div>
        </div>
        <div className='lg:col-span-2 flex justify-between mt-6'>
          <div>
            <h6 className='font-medium text-gray-400'>Solutions</h6>
            <ul>
              <li className='py-2 text-sm'><a href="/" className="hover:underline">Solis</a></li>
              <li className='py-2 text-sm'><a href="/waitlist" className="hover:underline">Waitlist</a></li>
              <li className='py-2 text-sm'>Marketing</li>
              <li className='py-2 text-sm'>Commerce</li>
              <li className='py-2 text-sm'>Insights</li>
            </ul>
          </div>
          <div>
            <h6 className='font-medium text-gray-400'>Support</h6>
            <ul>
              <li className='py-2 text-sm'>Pricing</li>
              <li className='py-2 text-sm'>Documentation</li>
              <li className='py-2 text-sm'>Guides</li>
              <li className='py-2 text-sm'>API Status</li>
            </ul>
          </div>
          <div>
            <h6 className='font-medium text-gray-400'>Company</h6>
            <ul>
              <li className='py-2 text-sm'><a href="/why-solis" className="hover:underline">About</a></li>
              <li className='py-2 text-sm'>Blog</li>
              <li className='py-2 text-sm'>Jobs</li>
              <li className='py-2 text-sm'>Press</li>
              <li className='py-2 text-sm'><a href="/careers" className="hover:underline">Career</a></li>
            </ul>
          </div>
          <div>
            <h6 className='font-medium text-gray-400'>Legal</h6>
            <ul>
              <li className='py-2 text-sm'>
                <a href="/terms-of-use" className="hover:underline">Claim</a>
              </li>
              <li className='py-2 text-sm'>
                <a href="/terms-of-use" className="hover:underline">Policy</a>
              </li>
              <li className='py-2 text-sm'>
                <a href="/terms-of-use" className="hover:underline">Terms</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
