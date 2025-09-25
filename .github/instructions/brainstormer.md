---
applyTo: '**'
---
Provide project context and actionable guidance agents should follow when generating SaaS ideas, validating them for ROI, and delivering a prioritized recommendation.

## Purpose

This document is a concise playbook for an agent tasked with finding high-ROI SaaS ideas that center on one great feature. The goal is to produce 3 vetted ideas (one prioritized) with concrete evidence of willingness-to-pay and a clear path to an MVP or pilot.

## Contract (what the agent must deliver)
- Inputs: target industry(s) or verticals, 3–10 buyer personas, time budget (e.g., 2–4 weeks), available minimal dev resources.
- Outputs: 3 vetted SaaS ideas (1 prioritized); for each: one-page brief (target customer, core pain, one great feature, pricing hypothesis, estimated ROI); validation plan and artifacts (interview notes, landing page, pre-sales or pilot agreements); explicit recommendation (build/hold/kill) and next 30–60 day plan.
- Success criteria: at least one idea with evidence of willingness-to-pay (example: paid pilot, deposit, or 20 qualified signups), projected payback <12 months, and an LTV:CAC estimate or path to >=3.

## Operating assumptions
- "Not too big of a niche": avoid ideas that are impossibly tiny (TAM << $50M) unless pricing per customer is very high; also avoid undifferentiated horizontals unless you have a clear channel.
- One great feature: prioritize a single, measurable feature that directly delivers customer ROI.

## Core principles (short)
- Focus on measurable ROI (time saved, revenue gained, cost avoided).
- One feature that solves one clear pain beats many vague features.
- Validate monetization before building—pre-sales or paid pilots first.
- Prefer problems that are frequent and painful for the buyer.

## Edge cases and guardrails
- Hyper-niche low-TAM: score low unless customers can pay a premium (e.g., $10k+/year).
- Broad incumbents: require a narrow niche or channel plan to compete.
- Regulated/PII-heavy domains: run legal/infra feasibility checks early.
- Marketplace/two-sided networks: defer until single-sided demand is proven.

## Step-by-step workflow (practical timeline ~2–4 weeks)

1) Quick ideation & filter (1–2 days)
	- Generate ~20 candidate problems from the given verticals and personas.
	- Filter out: TAM < $50M (unless high price), or undifferentiated horizontals with no channel.

2) Problem validation interviews (3–7 days)
	- Interview 8–12 target customers (15–20m each) using the script below.
	- Score each problem on severity, frequency, and willingness-to-pay.

3) Define the one great feature (1–2 days)
	- For each validated pain, pick the single feature that most directly removes the pain and produces a measurable outcome.
	- Reject solutions requiring heavy integrations or large upfront engineering before validation.

4) Rapid prototype & pricing test (3–10 days)
	- Create a click-through landing page with clear value prop, pricing, and CTA (reserve/book/pay).
	- Use targeted outreach (LinkedIn, email, existing contacts) and optional small paid ads to test conversion.
	- Offer a concierge/manual pilot if that lowers friction to a paid commitment.

5) Pre-sales / pilot (up to 4 weeks)
	- Aim for 3–5 paid pilots or 10–50 committed signups.
	- Collect simple metrics: CAC, conversion %, expected MRR from pilots.

6) Decision point
	- If pilots show willingness-to-pay and an acquisition channel with acceptable CAC/payback, proceed to MVP.
	- Otherwise iterate on the feature or kill and move on.

## Fast validation experiments (low-cost)
- Landing page + payment/reservation (Stripe/PayPal) to collect deposits.
- Concierge MVP: manually deliver the feature and charge full price.
- Outreach funnel: 5 targeted LinkedIn messages per day; 20–50 emails; 5 cold calls.
- Paid pilot with money down and a simple refund policy.

## Scoring rubric (0–5 per axis)
- Problem severity: how painful is it? (5 = daily, very costly)
- Frequency: how often does it occur? (5 = daily)
- Willingness-to-pay evidence: (5 = paid pilot / deposit)
- TAM & scalability: (5 = >$500M or very high price per customer)
- Acquisition clarity: (5 = known repeatable channel)
- Technical feasibility & time-to-MVP: (5 = <4 weeks to workable MVP)
Total > 22/30 -> pilot candidate. Prioritize ideas with the highest per-customer ROI from the core feature.

## Interview script (concise)
- Intro: "15 minutes to ask about how you handle [domain]—quick?"
- Questions:
	1. "Walk me through your current process for X."
	2. "What part is most frustrating or time-consuming?"
	3. "How much time or money does that typically cost per month?"
	4. "What have you tried to fix it and why didn't that work?"
	5. "Would you pay for a fix? What amount feels reasonable?"
	6. "Would you be willing to try an early pilot if we built it?"

## Reusable prompts for agents (AI research + outreach)
- "List 10 recurring, time-consuming tasks for [role] in [industry]. Rank by frequency, monetary impact, and existing tooling gaps."
- "Generate 5 clear landing-page headlines that state the outcome (time saved or revenue increase) for [one great feature]."
- "Draft a 50–100 word outreach message to [role] offering a paid pilot to solve [pain]."

## Deliverables to the client
- Shortlist with scores and prioritized idea.
- One-page idea brief (customer, pain, core feature, pricing, ROI calc).
- Validation artifacts: interview notes, landing page screenshot/URL, receipts or signed pilot agreements.
- Clear recommendation and 30–60 day execution plan.

## Quality gates before full build
- Minimum: 3 paid pilots or 20 committed customers for the planned pricing tier.
- A clear acquisition channel with CAC and payback <12 months.
- LTV:CAC projected ≥ 3 or a documented, credible path to reach it.

## Quick notes for agents
- Prioritize measurable outcomes. When in doubt, ask: "Does this core feature save measurable time or increase revenue?" If not, discard.
- Use manual/concierge approaches to validate pricing quickly—engineering comes later.

## Closing guidance
Focus on single-feature ideas with clear buyer ROI, validate monetization before building, score ideas quickly, and kill ruthlessly when evidence fails to appear.
