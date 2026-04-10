import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | AI Portal Weekly',
    description: 'Read the Terms of Service for AI Portal Weekly. Understand the rules and conditions governing your use of our platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-[80vh] text-foreground flex flex-col pt-16 pb-20 px-4 sm:px-6 font-sans">
            <main className="flex-1 max-w-3xl mx-auto w-full">
                <header className="space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Terms of Service</h1>
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using AI Portal Weekly (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                        <p>
                            AI Portal Weekly provides curated AI news, tool reviews, and a directory of AI products. Our content is for informational purposes only. We do not guarantee the accuracy, completeness, or usefulness of any information on the Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">3. User Conduct</h2>
                        <p>When using the Platform, you agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-3">
                            <li>Use the service for any unlawful purpose or in violation of any applicable laws.</li>
                            <li>Attempt to gain unauthorized access to any part of the Platform.</li>
                            <li>Interfere with or disrupt the integrity of the Platform.</li>
                            <li>Scrape, copy, or redistribute our content without written permission.</li>
                            <li>Submit false, misleading, or spam content through any forms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
                        <p>
                            All content on AI Portal Weekly, including text, graphics, logos, and software, is the property of AI Portal Weekly or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works without our express written consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">5. Third-Party Links</h2>
                        <p>
                            The Platform may contain links to third-party websites and tools. We do not endorse or assume responsibility for the content, privacy policies, or practices of any third-party sites. You acknowledge and agree that AI Portal Weekly shall not be liable for any damage or loss caused by the use of such content or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
                        <p>
                            AI Portal Weekly and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Platform. This includes but is not limited to damages for loss of profits, data, or other intangible losses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">7. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Continued use of the Platform after changes are posted constitutes acceptance of the revised terms. We encourage you to review this page periodically for updates.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">8. Contact</h2>
                        <p>
                            If you have any questions about these Terms, please reach out to us at{' '}
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
