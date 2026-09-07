import { Compass, Focus, Smartphone, Moon, Activity, HeartHandshake, Brain, Scale } from 'lucide-react';

export const SECTION_ICON = {
  life: Compass,
  focus: Focus,
  digital: Smartphone,
  sleep: Moon,
  body: Activity,
  connection: HeartHandshake,
  mind: Brain,
  future: Scale,
};

export const SECTION_INSIGHT = {
  life: {
    attention: { badge: 'High Responsibility Load', desc: 'You are carrying significant daily responsibilities, which can quietly drain your reserves if unchecked.', suggestion: 'Delegate one task this week' },
    strength: { badge: 'Steady Life Rhythm', desc: 'Your daily structure and responsibilities feel manageable and well-paced.', suggestion: 'Keep protecting your routine' },
  },
  focus: {
    attention: { badge: 'High Cognitive Load', desc: 'You are processing complex decisions, but mental overextension is depleting your afternoon energy reserves.', suggestion: 'Batch task transitions' },
    strength: { badge: 'Sharp Focus', desc: 'Your concentration holds steady through long stretches of demanding work.', suggestion: 'Protect your deep-work blocks' },
  },
  digital: {
    attention: { badge: 'Digital Overload', desc: 'Frequent phone checking is fragmenting your attention more than you may realize.', suggestion: 'Try a notification curfew' },
    strength: { badge: 'Mindful Screen Use', desc: 'Your relationship with your phone feels intentional rather than compulsive.', suggestion: 'Keep boundaries visible' },
  },
  sleep: {
    attention: { badge: 'Fragile Sleep Cycle', desc: 'Racing thoughts and irregular timing are limiting how restorative your sleep really is.', suggestion: 'Try a wind-down ritual' },
    strength: { badge: 'Restorative Sleep', desc: 'Your sleep routine provides solid foundational recovery, though screen time right before bed delays deep REM cycles.', suggestion: 'Digital wind-down buffer' },
  },
  body: {
    attention: { badge: 'Depleted Reserves', desc: 'Movement, meals and recovery time have taken a back seat to your workload lately.', suggestion: 'Reclaim one small ritual' },
    strength: { badge: 'Grounded Vitality', desc: 'Your body feels supported by consistent movement and recovery time.', suggestion: 'Keep the rhythm going' },
  },
  connection: {
    attention: { badge: 'Quiet Isolation', desc: 'Support feels harder to reach right now, even when you need it most.', suggestion: 'Reach out to one person today' },
    strength: { badge: 'Strong Social Anchor', desc: 'Meaningful connections with trusted friends serve as your strongest buffer against daily friction.', suggestion: 'Shared quiet moments' },
  },
  mind: {
    attention: { badge: 'Racing Mind', desc: 'Overthinking and self-comparison are looping more than they need to.', suggestion: 'Name the thought, then release it' },
    strength: { badge: 'Clear Headspace', desc: 'You process setbacks quickly and keep a settled inner narrative.', suggestion: 'Keep journaling the wins' },
  },
  future: {
    attention: { badge: 'Future Uncertainty', desc: 'Financial and career unknowns are weighing on your sense of direction.', suggestion: 'Zoom in on the next small step' },
    strength: { badge: 'Grounded Direction', desc: 'You feel steady about where things are headed, even amid open questions.', suggestion: 'Revisit your plan monthly' },
  },
};
