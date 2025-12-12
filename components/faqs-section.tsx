import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon } from "lucide-react";

export function FaqsSection() {
  return (
    <section className="mx-auto grid min-h-screen w-full max-w-5xl grid-cols-1 md:grid-cols-2 lg:border-x">
      <div className="px-4 pt-12 pb-6">
        <div className="space-y-5">
          <h2 className="text-balance font-bold text-4xl md:text-6xl lg:font-black">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Quick answers to common questions about Efferd. Open any question to
            learn more.
          </p>
          <p className="text-muted-foreground">
            {"Can't find what you're looking for? "}
            <a className="text-primary hover:underline" href="#">
              Contact Us
            </a>
          </p>
        </div>
      </div>
      <div className="relative place-content-center">
        {/* vertical guide line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-3 h-full w-px bg-border"
        />

        <Accordion collapsible type="single">
          {faqs.map((item) => (
            <AccordionItem
              className="group relative border-b pl-5 first:border-t last:border-b"
              key={item.id}
              value={item.id}
            >
              {/*  plus */}
              <PlusIcon
                aria-hidden="true"
                className="-bottom-[5.5px] -translate-x-1/2 pointer-events-none absolute left-[12.5px] size-2.5 text-muted-foreground group-last:hidden"
              />

              <AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
                {item.title}
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const faqs = [
  {
    id: "item-1",
    title: "What is FlowForge?",
    content:
      "FlowForge is a visual workflow automation tool that runs entirely in your browser. It allows you to build complex logic flows, integrate AI, and automate tasks without writing code.",
  },
  {
    id: "item-2",
    title: "Is it really free?",
    content:
      "Yes! The basic version runs entirely client-side, meaning you can build and execute workflows locally for free. We also offer cloud plans for features like scheduled runs and webhooks.",
  },
  {
    id: "item-3",
    title: "Can I use my own API keys?",
    content:
      "Absolutely. Your API keys (like OpenRouter or OpenAI) are stored securely in your environment and are never sent to our servers for local execution.",
  },
  {
    id: "item-4",
    title: "How does the AI integration work?",
    content:
      "We have dedicated AI nodes that connect to LLMs via OpenRouter. You can chain these nodes to build powerful AI agents and assistants directly in the canvas.",
  },
  {
    id: "item-5",
    title: "Can I export my workflows?",
    content:
      "Yes, you can export your workflows as JSON files to share with others or backup your work. You can also import workflows created by the community.",
  },
  {
    id: "item-6",
    title: "Do I need coding skills?",
    content:
      "No coding skills are required! However, for advanced users, we offer a 'Code Node' where you can write custom JavaScript logic within your workflow.",
  },
];
