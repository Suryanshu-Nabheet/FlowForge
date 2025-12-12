"use client";

import * as PricingCard from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Briefcase, Building, CheckCircle2, Users } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      icon: <Users />,
      description: "For individuals exploring automation",
      name: "Basic",
      price: "Free",
      variant: "outline",
      features: [
        "Unlimited Local Workflows",
        "Client-side Execution",
        "100+ Pre-built Nodes",
        "Community Support",
        "Export to JSON",
        "Basic Templates",
      ],
    },
    {
      icon: <Briefcase />,
      description: "For professionals needing power",
      name: "Pro",
      badge: "Most Popular",
      price: "$12",
      original: "$19",
      period: "/month",
      variant: "default",
      features: [
        "Cloud Execution (10k runs/mo)",
        "API Webhooks",
        "Scheduled Flows (Cron)",
        "Priority Support",
        "AI Assistant Integration",
        "Version History",
        "Shared Workspaces",
      ],
    },
    {
      icon: <Building />,
      name: "Enterprise",
      description: "For teams scaling automation",
      price: "$49",
      original: "$79",
      period: "/month",
      variant: "outline",
      features: [
        "Unlimited Cloud Runs",
        "Dedicated Infrastructure",
        "SSO & SAML",
        "Audit Logs",
        "SLA Guarantee",
        "Dedicated Success Manager",
        "On-premise Deployment",
        "Custom Node Development",
      ],
    },
  ];

  return (
    <section className="mx-auto grid w-full max-w-4xl gap-4 p-6 md:grid-cols-3">
      {plans.map((plan, index) => (
        <PricingCard.Card
          className={cn("w-full max-w-full", index === 1 && "md:scale-105")}
          key={plan.name}
        >
          <PricingCard.Header>
            <PricingCard.Plan>
              <PricingCard.PlanName>
                {plan.icon}
                <span className="text-muted-foreground">{plan.name}</span>
              </PricingCard.PlanName>
              {plan.badge && (
                <PricingCard.Badge>{plan.badge}</PricingCard.Badge>
              )}
            </PricingCard.Plan>
            <PricingCard.Price>
              <PricingCard.MainPrice>{plan.price}</PricingCard.MainPrice>
              <PricingCard.Period>{plan.period}</PricingCard.Period>
              {plan.original && (
                <PricingCard.OriginalPrice className="ml-auto">
                  {plan.original}
                </PricingCard.OriginalPrice>
              )}
            </PricingCard.Price>
            <Button
              className={cn("w-full font-semibold")}
              variant={plan.variant as "outline" | "default"}
            >
              Get Started
            </Button>
          </PricingCard.Header>

          <PricingCard.Body>
            <PricingCard.Description>
              {plan.description}
            </PricingCard.Description>
            <PricingCard.List>
              {plan.features.map((item) => (
                <PricingCard.ListItem className="text-xs" key={item}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 text-foreground"
                  />
                  <span>{item}</span>
                </PricingCard.ListItem>
              ))}
            </PricingCard.List>
          </PricingCard.Body>
        </PricingCard.Card>
      ))}
    </section>
  );
}
