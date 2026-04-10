import { Metadata } from 'next';
import { Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | AI Portal Weekly',
    description: 'Get in touch with the AI Portal Weekly team. Reach out for partnerships, tool submissions, or general inquiries.',
};

export default function ContactPage() {
    return (
        <div className="min-h-[80vh] text-foreground flex flex-col pt-16 pb-20 px-4 sm:px-6 font-sans">
            <main className="flex-1 max-w-4xl mx-auto w-full">
                <header className="space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                        Have a question, partnership inquiry, or want to submit a tool? We&apos;d love to hear from you.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Name</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Subject</label>
                                <select
                                    id="contact-subject"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="tool-submission">Tool Submission</option>
                                    <option value="bug">Report a Bug</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Message</label>
                                <textarea
                                    id="contact-message"
                                    rows={6}
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3.5 bg-foreground text-background font-semibold text-sm uppercase tracking-widest rounded-xl hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-1">Email Us</h3>
                                    <p className="text-sm text-muted-foreground">hello@aiportalweekly.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-1">Location</h3>
                                    <p className="text-sm text-muted-foreground">Remote-first, Global</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-1">Response Time</h3>
                                    <p className="text-sm text-muted-foreground">Usually within 24-48 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Want to submit a tool?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                If you&apos;ve built an AI tool and want it featured in our directory, use our dedicated submission page.
                            </p>
                            <a href="/submit-tool" className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4">
                                Submit a Tool →
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
