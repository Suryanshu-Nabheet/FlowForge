"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { ContactCard } from "@/components/contact-card"; // Adjust path if it's components/ui/contact-card
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  return (
    <section id="contact" className="container mx-auto py-12 md:py-24">
      <ContactCard
        title="Get in Touch"
        description="Have questions about FlowForge? We're here to help. Send us a message and we'll respond as soon as possible."
        contactInfo={[
          {
            icon: Mail,
            label: "Email",
            value: "support@flowforge.app",
          },
          {
            icon: Phone,
            label: "Phone",
            value: "+1 (555) 123-4567",
          },
          {
            icon: MapPin,
            label: "Office",
            value: "123 Automation Way, Tech City",
          },
        ]}
      >
        <form className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="How can we help you?"
              className="resize-none"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </ContactCard>
    </section>
  );
}
