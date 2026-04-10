import Link from "next/link";
import Logo from "./Logo";
import { Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-[#0a0a0a] border-t border-white/5 mt-auto">
            {/* Subtle top glow line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <div className="mb-5"><Logo size="lg" /></div>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-8">
                            Your one-stop destination for unbiased AI intelligence. We cut through the noise so you don&apos;t have to.
                        </p>
                        
                        {/* Newsletter Signup */}
                        <div className="flex flex-col gap-3">
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Stay Updated
                            </p>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="flex-1 bg-white/5 border border-white/10 rounded-l-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                                />
                                <button className="bg-white text-black px-5 py-2.5 rounded-r-lg text-sm font-semibold hover:bg-white/90 transition-colors shrink-0">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Explore Section */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h3 className="font-sans font-semibold text-white/80 text-xs uppercase tracking-widest mb-5">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="text-white/40 text-sm hover:text-white transition-colors">
                                    AI News
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools" className="text-white/40 text-sm hover:text-white transition-colors">
                                    AI Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/trending" className="text-white/40 text-sm hover:text-white transition-colors">
                                    Trending
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Section */}
                    <div className="lg:col-span-2">
                        <h3 className="font-sans font-semibold text-white/80 text-xs uppercase tracking-widest mb-5">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-white/40 text-sm hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white/40 text-sm hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/submit-tool" className="text-white/40 text-sm hover:text-white transition-colors">
                                    Submit a Tool
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div className="lg:col-span-2">
                        <h3 className="font-sans font-semibold text-white/80 text-xs uppercase tracking-widest mb-5">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy" className="text-white/40 text-sm hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-white/40 text-sm hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/disclaimer" className="text-white/40 text-sm hover:text-white transition-colors">
                                    Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/30">
                        &copy; {new Date().getFullYear()} AI Portal Weekly. All rights reserved.
                    </p>
                    <p className="text-xs text-white/20">
                        Built for India&apos;s Next-Gen Tech. Designed for Action.
                    </p>
                </div>
            </div>
        </footer>
    );

}