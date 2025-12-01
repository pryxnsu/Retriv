import { Header } from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Footer from '@/components/Footer';
import { HeroSection } from '@/components/Hero';

const Faq = [
    {
        number: 1,
        question: 'What is Retriv ?',
        answer: 'Retriv is a platform that lets you create an AI agent for your website, allowing it to respond to user queries based on your website’s content.',
    },
    {
        number: 2,
        question: 'How does Retriv work?',
        answer: 'Retriv automatically crawls and indexes your website pages, then uses that content to generate accurate responses to user queries.',
    },
    {
        number: 3,
        question: 'How do I integrate the agent into my website?',
        answer: 'We provide a script code to add your agent easily on your website. ',
    },
    {
        number: 4,
        question: 'What if my website changes later?',
        answer: 'Retriv can re-crawl your website and update the AI’s knowledge base whenever you want.',
    },
];

export default function Home() {
    return (
        <main>
            <section className="relative h-[60vh] sm:h-screen sm:min-h-screen rounded-2xl mt-12 mx-auto w-10/12 border border-neutral-300 dark:border-neutral-800">
                <Header />
                <HeroSection />
                <div className="hidden sm:block h-[400px] md:h-[500px] lg:h-[600px]"></div>
            </section>

            <section id="faq" className="mt-20 py-5 px-4 bg-muted/20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground">Everything you need to know about Retriv</p>
                    </div>

                    <div className="w-full max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {Faq.map((item) => (
                                <AccordionItem
                                    key={item.number}
                                    value={`item-${item.number}`}
                                    className=" border-neutral-300 dark:border-neutral-800"
                                >
                                    <AccordionTrigger className="text-base sm:text-lg lg:text-xl font-semibold hover:no-underline cursor-pointer text-foreground text-left">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
