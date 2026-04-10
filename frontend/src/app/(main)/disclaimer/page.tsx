import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Disclaimer | AI Portal Weekly',
    description: 'Read the Disclaimer for AI Portal Weekly regarding AI-generated content, affiliate links, and editorial independence.',
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-[80vh] text-foreground flex flex-col pt-16 pb-20 px-4 sm:px-6 font-sans">
            <main className="flex-1 max-w-3xl mx-auto w-full">
                <header className="space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Disclaimer</h1>
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">General Information</h2>
                        <p>
                            The information provided on AI Portal Weekly is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">AI-Assisted Content</h2>
                        <p>
                            Some content on this platform, including news summaries, tool descriptions, and metadata, may be generated or assisted by artificial intelligence models. While all AI-generated content undergoes human editorial review before publication, we cannot guarantee that it is entirely free from errors or inaccuracies. Users are encouraged to verify critical information independently.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">Affiliate Links & Monetization</h2>
                        <p>
                            AI Portal Weekly may contain affiliate links to third-party products and services. If you click on an affiliate link and make a purchase, we may receive a small commission at no additional cost to you. This does not influence our editorial decisions, tool ratings, or reviews. We are committed to maintaining full editorial independence.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">No Professional Advice</h2>
                        <p>
                            The content on this platform does not constitute professional, legal, financial, or technical advice. Any reliance you place on such information is strictly at your own risk. We recommend consulting with appropriate professionals before making decisions based on the content provided here.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">External Links</h2>
                        <p>
                            Our platform contains links to external websites and tools that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies or content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">Tool Listings</h2>
                        <p>
                            Tool listings, pricing information, and feature descriptions on AI Portal Weekly are based on publicly available information at the time of writing. AI tools evolve rapidly, and pricing, features, and availability may change without notice. We encourage users to visit the official websites of listed tools for the most current information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                        <p>
                            If you have concerns about any content on this platform, please contact us at{' '}
                            <a href="mailto:hello@aiportalweekly.com" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
                                hello@aiportalweekly.com
                            </a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
