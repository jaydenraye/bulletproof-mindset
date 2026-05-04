import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "home",    icon: "⌂",  label: "Home"    },
  { id: "chat",    icon: "◎",  label: "Support" },
  { id: "emotions",icon: "◑",  label: "Check In"},
  { id: "journal", icon: "▤",  label: "Journal" },
  { id: "beliefs", icon: "◈",  label: "Beliefs" },
  { id: "reflect", icon: "❋",  label: "Rest"    },
  { id: "learn",   icon: "◧",  label: "Learn"   },
];

const EMOTION_DATA = [
  { score: 1, emoji: "😔", label: "Disengaged / Bored",
    signal: "Boredom and disengagement at work share the same root belief — that the experiences currently available are not the ones needed to develop and move forward. The mind has quietly concluded that life is not providing sufficient factors for growth, and so withdraws investment from what is in front of it.\n\nThis is not laziness. It is a specific belief that has been reached: that the current path is insufficient, that something important is missing, that development requires different circumstances than the ones available right now.\n\nLeft unaddressed, sustained boredom creates a physical response — the body begins to reflect the belief that development is being starved. This is the precise mechanism behind Type 1 Chronic Fatigue: not overwork, but underfeeding of the mind's developmental requirements — or the belief that this is the case.\n\nThe accurate understanding: every experience on your current path — including the ones that feel insufficient or unremarkable — is providing exactly the development your mind requires at this moment. The path is always correct. Nothing is being missed out on. The data being received right now is the data that was needed.",
    prompt: "What does your mind believe is missing from your current work or path? What experience or opportunity does it conclude you need but are not getting?",
    followThrough: {
      title: "Your Path Is Providing What You Need",
      points: [
        "Every experience on your current path — including the ones that feel insufficient — is providing exactly the development required at this moment. The belief that something important is missing is the belief to examine, not the circumstances.",
        "Boredom is not evidence that your path is wrong. It is evidence that the mind has concluded it needs different experiences to grow. That conclusion is the incorrect belief — not a fact about your situation.",
        "Development never stops and is never on hold. Every interaction, every routine task, every unremarkable moment is adding data to your understanding of reality. The fact that it doesn't feel significant is not evidence that it isn't.",
        "You are not missing out on your requirements. Life is providing exactly what is needed for the development you are meant to have right now. The feeling of missing out is produced by the 'If you are good — you'll get' belief applied to developmental experiences.",
      ],
      action: "beliefs",
      actionLabel: "Work on this belief →",
    }
  },
  { score: 2, emoji: "😢", label: "Flat / Sad",
    signal: "Flatness or sadness at work signals that the mind has concluded something important has been lost — a role, a relationship with a colleague, recognition that was expected, or a direction that once felt meaningful. The belief underneath is that something that should be happening isn't, or that something that shouldn't have happened did.",
    prompt: "What does your mind believe has been lost or has gone wrong at work? What is it concluding about what that means for your value or your future there?",
    followThrough: {
      title: "Nothing of True Value Has Been Lost",
      points: [
        "Sadness signals the belief that something important has been lost or has gone wrong. It is an accurate indicator — but not necessarily an accurate account of what has actually happened.",
        "Everything that has happened has happened because of cause and effect — the only way it could have. The loss that feels wrong is part of the developmental path, not an interruption to it.",
        "What genuinely serves your development cannot be taken from you. The data you have received from every experience — including the ones that ended — remains part of your understanding. That cannot be lost.",
        "The belief that something should still be present, or should not have ended, is what produces the sadness. The accurate understanding is that it was present for exactly as long as it needed to be.",
      ],
      action: "chat",
      actionLabel: "Talk this through with AI support →",
    }
  },
  { score: 3, emoji: "😠", label: "Angry / Resentful",
    signal: "Workplace anger and resentment share the same root: the belief that someone — a manager, colleague, or the organisation — could have simply chosen to act differently and didn't. That belief is not accurate. Free will does not exist. Every person acts from the beliefs and priorities they hold at that point in their development, governed by the law of cause and effect. No one could have acted differently. The accurate understanding removes resentment — not by excusing what happened, but by revealing why it could not have been any other way.",
    prompt: "Who are you angry or resentful toward at work? What do you believe they could and should have done differently?",
    followThrough: {
      title: "Why No One Could Have Acted Differently",
      points: [
        "Every person who has caused frustration or harm acted from the beliefs and priorities they held at that specific moment in their development. Given those beliefs, they could not have acted any differently.",
        "This is not an excuse for harmful behaviour. It is the accurate account of how behaviour works — and it is what allows the energy of resentment to be released.",
        "Resentment is not a fair response to what happened. It is a sustained psychological cost you are paying toward a belief — the free will belief — that is not accurate.",
        "Understanding why something happened is not the same as approving of it. You can understand completely and still take whatever steps are needed. Understanding simply removes the drain of sustaining anger toward something that could not have been any other way.",
      ],
      action: "beliefs",
      actionLabel: "Work through the conflict exercise →",
    }
  },
  { score: 4, emoji: "😨", label: "Stressed / Anxious",
    signal: "Workplace stress and anxiety are driven by two specific beliefs working together. The first: that TOTAL control over outcomes, people, and situations at work is both possible and required. The second: that TOTAL prevention of unwanted events is both possible and the correct strategy. Control and prevention are normal parts of any working day. The problem arises when these cross into the demand for total control and total prevention — which is impossible. The sympathetic nervous system fires because the failure to achieve this is perceived as a threat to being assessed as incompetent, useless, or failing — which under the 'If you are good — you'll get' belief means losing standing, security, or opportunity.",
    prompt: "What specifically is your mind trying to totally control or prevent at work? What do you believe colleagues or management will conclude about you if that situation isn't controlled?",
    followThrough: {
      title: "Total Control Is Not Available — and Not Needed",
      points: [
        "Total control over outcomes and total prevention of unwanted events are not available to any person in any workplace. The stress is produced entirely by the belief that they are required.",
        "No workplace outcome — including the ones that go wrong — decreases your value as a contributor. Your worth is not attached to any result. The belief that it is is what generates the need for total control.",
        "You can prepare thoroughly, contribute to the outcome, and engage with the work — without needing to control the result. These are different things. Only one of them is possible.",
        "The events you cannot prevent are not evidence of failure. They are the experiences that provide the development you could not have chosen for yourself.",
      ],
      action: "beliefs",
      actionLabel: "Work on the anxiety exercise →",
    }
  },
  { score: 5, emoji: "😶", label: "Burnt Out / Numb",
    signal: "Burnout and numbness signal that the mind has been attempting total control and total prevention for an extended period — and has exhausted its capacity to continue. This is not weakness. It is the inevitable physiological result of a sustained impossible demand.\n\nBurnout begins with the 'If you are good — you'll get' belief applied to coping ability. The person's worth becomes connected to being seen to cope — creating the demand for total control, because any uncontrolled event is evidence of not coping. The adrenaline system cannot sustain this indefinitely.",
    prompt: "What does coming to work feel like right now? What belief is making it feel pointless or exhausting to be present in what is taking place?",
    followThrough: {
      title: "Recovery Is a Shift in Belief — Not Just Rest",
      points: [
        "Rest is important but not sufficient on its own. The belief that produced the burnout is still running when you return. Recovery requires addressing that belief directly.",
        "Your worth is not attached to your ability to cope. Displaying that you cannot cope does not decrease your value — any more than displaying that you can cope increases it. The belief that it does is the belief that needs upgrading.",
        "The shift required is from control-mode to receiving-mode — from 'attending to situations to prevent them threatening my standing' to 'receiving what each experience provides.' This is not passive. It is engaged — but without your worth on the line.",
        "You have been contributing to this workplace throughout this period — even through the burnout, even through the numbness. That contribution has not stopped. Your value has not decreased. What has been exhausted is the adrenaline system — not your worth.",
      ],
      action: "chat",
      actionLabel: "Talk this through with AI support →",
    }
  },
  { score: 6, emoji: "😊", label: "Engaged / Appreciative",
    signal: "Feeling engaged and appreciative at work signals that your beliefs are matching the reality of what your work is actually providing — that you are recognising what is being received and contributed rather than what is being threatened. This is not just a good mood. It is the direct result of an accurate understanding of what your contribution means and why it matters.",
    prompt: "What are you recognising as valuable or purposeful about your work right now? What understanding is making it possible to appreciate what is taking place?",
    followThrough: {
      title: "This Is What the Wisdom Model Feels Like",
      points: [
        "What you are experiencing right now is the direct result of accurate beliefs about your contribution and your path. This is not luck or circumstance — it is the natural state that follows correct understanding.",
        "Notice what beliefs are running that are allowing this. The more clearly you can identify them, the more readily you can return to them when the Achievement Model reasserts itself.",
        "Engagement and appreciation are not the goal — they are the by-product of accurate beliefs about life, contribution, and development. The goal is the accurate beliefs. These feelings follow naturally.",
        "This state is available consistently — not just when circumstances are favourable. The same understanding applies regardless of what is happening in your work.",
      ],
      action: "journal",
      actionLabel: "Record what is working →",
    }
  },
];

const JOURNAL_PROMPTS = [
  "What belief about your performance or value at work has been causing the most stress? Is that belief an accurate account of what is actually taking place — or is it measuring your worth by something you haven't yet achieved or proven?",
  "Describe a workplace situation that upset you recently. What did your mind conclude was happening? Is that conclusion accurate — or is it based on the belief that your standing, security, or competence is being threatened?",
  "What belief about your career, your role, or your workplace is producing the most stress right now? What would change if you understood that your value as a contributor is automatic and cannot be decreased by any outcome?",
  "What has your workplace been forcing you to encounter lately? Is your mind assessing this as a threat — or is it possible this is simply data your development required you to receive?",
  "Where did you notice your professional worth feeling threatened today? What is the belief underneath that? Is that belief an accurate account of how contribution and value are correctly measured?",
];

const BELIEF_STEPS = [
  { title: "Name It", desc: "What is the belief about your work, your role, or your value that is producing the most stress right now? Write it out plainly.", placeholder: "e.g. I am not performing well enough. My contributions are not valued. I am going to be seen as incompetent..." },
  { title: "Question It", desc: "Does this belief measure your worth by what you've achieved, proven, or controlled at work? Is it demanding you reach a certain standard before you're allowed to feel okay about yourself?", placeholder: "What standard is this belief demanding you meet? What happens to your sense of worth if you don't meet it?" },
  { title: "Test Its Accuracy", desc: "Is this belief an accurate account of reality — or is it the Achievement Model measuring you by outcomes rather than by the contribution you are making simply by showing up, engaging, and developing?", placeholder: "When I test this belief honestly against the facts, I notice..." },
  { title: "The Accurate Understanding", desc: "Every person at work is automatically contributing to the development of everyone around them — through the example they set, the data they provide, the interactions they have. Your value as a contributor is not earned through results. It is automatic. Write the accurate understanding that cancels the incorrect belief.", placeholder: "What is the accurate understanding that replaces this? What would you tell a colleague you respected who held this belief about themselves?" },
  { title: "Embed It", desc: "Read your new understanding clearly. Old thoughts will still surface — that is normal and expected. New understandings are added alongside old ones, not instead of them. When the old belief returns, apply the new reasoning. That is how beliefs are upgraded.", placeholder: "Describe what you notice as you apply the new understanding..." },
];

const EXERCISES = [
  {
    id: "achievementbox",
    icon: "◻",
    title: "What's in Your Workplace Achievement Box?",
    sub: "Uncover what you believe your career must prove",
    dur: "10 min",
    intro: "Every person carries a hidden 'achievement box' — a specific career outcome or professional standing they believe they must reach before their contribution is considered worthwhile. Workplace stress often escalates when this goal feels threatened or out of reach. This exercise helps you find yours.",
    steps: [
      { q: "Complete this honestly: 'My career will have been a success if I...'", hint: "Write what you actually believe — not what sounds professionally appropriate. A title, a salary, recognition from a specific person, proving something to someone.", ph: "My career will have been a success if I..." },
      { q: "Whose assessment of your work matters most to you? Whose opinion are you really working for?", hint: "A manager? A parent? A past employer who doubted you? Colleagues? Notice whether your sense of professional worth is sitting in someone else's assessment.", ph: "The person whose assessment of me matters most is..." },
      { q: "What do you believe will happen to your sense of worth if this career goal is never achieved?", hint: "This is where the real pressure lives. The fear underneath the ambition is what drives the stress — understanding it is what begins to neutralise it — not by removing it, but by adding the accurate data that upgrades the belief producing it.", ph: "If I never achieve this, I believe I will be seen as..." },
      { q: "Is reaching that goal the only possible evidence of a valuable contribution?", hint: "Think of colleagues or people in your field you genuinely respect. Is their achievement box the only reason you respect them? What does that tell you about how value is actually measured?", ph: "When I question this as the only measure of professional worth, I notice..." },
    ],
    closing: "Your value as a contributor is not inside that box. It never was. Every day you show up and engage, you are automatically playing a role in the development of everyone around you — without needing to prove it through any particular outcome."
  },
  {
    id: "conflict",
    icon: "◌",
    title: "Workplace Conflict & Resentment",
    sub: "Why no one at work could have acted differently",
    dur: "12 min",
    intro: "Workplace anger, resentment, and guilt all rest on the same belief: that someone — a manager, a colleague, or yourself — could have simply chosen to act differently. This exercise walks through why that belief, however convincing it feels, is not accurate.",
    steps: [
      { q: "Think of a workplace situation involving another person that you feel resentful or angry about. Describe it briefly.", hint: "Name it clearly — you don't need to justify or re-examine every detail. Just identify the situation and who was involved.", ph: "The situation I feel most resentful or angry about at work is..." },
      { q: "What do you believe they could and should have done differently?", hint: "Be specific. What was the choice you believe they had that they failed to make? This is where the free will belief lives.", ph: "What they should have done differently was..." },
      { q: "What beliefs and priorities were governing their actions at that moment?", hint: "Consider what they were trying to achieve, what they feared, what they believed about the situation from their position. They acted from their belief system at that point in their development — just as everyone does.", ph: "The beliefs governing their actions were probably..." },
      { q: "What information or understanding would they have needed to act differently?", hint: "If they would have needed to already hold different beliefs to have acted differently — and they didn't hold those beliefs — then the choice you believe they had was not actually available to them.", ph: "To have acted differently, they would have needed to already understand..." },
    ],
    closing: "No person in your workplace could have acted any differently than they did — because every action is governed by the beliefs held at that point in development. This is not an excuse for harmful behaviour. It is the understanding that sets people free from the resentment that consumes them — and allows workplaces to function from understanding rather than judgment."
  },
  {
    id: "performance",
    icon: "◎",
    title: "Performance Pressure & Self-Assessment",
    sub: "What your results actually say about your worth",
    dur: "8 min",
    intro: "The stress before a result almost always comes from the same source: the belief that outcomes prove worth. This exercise helps identify the specific belief driving performance anxiety and test whether it is accurate.",
    steps: [
      { q: "What aspect of your performance are you most concerned about right now?", hint: "Name it specifically — a project outcome, a presentation, a target, how you come across to specific people, a review that's coming.", ph: "The performance concern producing the most stress right now is..." },
      { q: "What does your mind believe this outcome will prove about you?", hint: "Outcomes are not neutral. When they feel threatening, they feel that way because they are believed to prove something about your competence, value, or standing. What specifically?", ph: "If this goes wrong, I believe it will prove that I am..." },
      { q: "Who will be making that assessment — and does their assessment determine your actual worth?", hint: "Identify the specific person or people whose assessment feels most threatening. Then ask: is their assessment of your performance an accurate measure of your value as a person and contributor?", ph: "The person whose assessment concerns me most is... and what their assessment actually measures is..." },
      { q: "What would change in how you approach this work if your worth were not attached to the outcome?", hint: "Not detachment — active contribution. But contribution from the position of developing and adding to the situation rather than proving. What would that look like?", ph: "If my worth were not attached to this outcome, I would approach it by..." },
    ],
    closing: "Results tell you what took place. They do not tell you what you are worth. Every effort you put into your work — regardless of the outcome — is a contribution to the development of everyone around you. That contribution is automatic and cannot be decreased by any result."
  },
  {
    id: "anxiety",
    icon: "◇",
    title: "From Workplace Pressure to Clarity",
    sub: "Understanding what the stress is actually about",
    dur: "10 min",
    intro: "Workplace stress is driven by two beliefs working together: that total control over outcomes and people is both possible and required, and that total prevention of unwanted events is the correct strategy. This exercise helps identify what specifically your mind is trying to control or prevent — and what it believes is at stake.",
    steps: [
      { q: "What situation at work is your mind most desperately trying to control or prevent right now?", hint: "Be specific. A particular outcome, a person's behaviour, what someone concludes about your performance, a decision being made above you.", ph: "What I am most desperately trying to control or prevent at work is..." },
      { q: "What do you believe will happen if you lose control of this, or if the thing you're trying to prevent actually happens?", hint: "This is the belief underneath the stress. Not the event itself — but what it is believed to prove about your competence, standing, or security.", ph: "If I lose control of this / if this happens, I believe it will prove that..." },
      { q: "Is total control over this actually possible — or is that what is creating the pressure?", hint: "Many factors determine every workplace outcome. You can influence — never totally control. What would change in your stress level if you genuinely accepted that total control is not available to anyone?", ph: "When I honestly accept that total control is not possible here, I notice..." },
      { q: "What can you receive from this situation regardless of how it goes?", hint: "Not positive thinking. An accurate question: what data, development, or understanding does this situation provide — regardless of the outcome? Every work situation provides something, even when it doesn't go as desired.", ph: "Regardless of how this goes, what this situation provides me with is..." },
    ],
    closing: "Total control and total prevention are not available to any person in any workplace. The stress is produced entirely by the belief that they are required. Understanding why no workplace outcome can actually decrease your value is what removes the need for total control — and replaces the stress with the ability to engage clearly and contribute effectively."
  },
];

const LEARN_ITEMS = [
  {
    title: "Why Workplace Stress Is Never About the Job",
    cat: "Foundation",
    dur: "6 min",
    summary: "The same workload, the same manager, the same target produces completely different responses in different people. This lesson explains why — and why the answer is never in the situation.",
    content: "Think about two people sitting side by side doing the same job, reporting to the same manager, facing the same deadlines. One is at ease with the work. The other is experiencing significant psychological stress.\n\nThe job is identical. The manager is identical. The environment is identical. Yet the experience is completely different.\n\nThis tells you something important: workplace stress is not caused by the workplace.\n\nStress is caused by the beliefs through which work situations are being assessed. The same event — a critical comment from a manager, a missed target, a difficult colleague — produces entirely different psychological responses depending on what the person believes that event means about their worth, their standing, and their future.\n\nFor one person, a critical comment is data — useful information that helps them improve. For another, it is evidence that their worth is being called into question. The comment is the same. The belief through which it is assessed is different.\n\nThis is why wellbeing programs that focus on reducing workloads or improving work conditions rarely produce lasting results. They are addressing the situation — which is not the cause. The cause is always the belief.\n\nThe accurate understanding: no workplace event can decrease your worth. Your contribution to this organisation — and to every person you interact with — is automatic and unconditional. It does not depend on any result, any assessment, or any outcome. Understanding this is what removes the sting from the situations that were causing stress. The situations do not change. The belief through which they are assessed does.",
  },
  {
    title: "The Achievement Model in the Workplace",
    cat: "Foundation",
    dur: "8 min",
    summary: "There are two models through which people measure professional worth. One produces performance anxiety, burnout, and resentment. The other produces engaged, grounded contributors.",
    content: "Every person at work is operating from one of two models — usually without being consciously aware of which one.\n\nThe Achievement Model teaches that professional worth is measured by performance, results, titles, and approval from the right people. Under this model, your value as a contributor is constantly at stake. A good result temporarily confirms your worth. A poor result threatens it. Approval from management feels like oxygen. Criticism feels like an attack on who you are.\n\nThis model produces predictable outcomes: performance anxiety before important presentations, because the outcome will prove something about worth. Burnout from the sustained attempt to control every outcome to protect that worth. Resentment toward colleagues whose actions are seen as threatening standing or opportunity. And disengagement — the quiet conclusion that there is no point putting in effort, because the achievement that would prove worth no longer seems reachable.\n\nThe Wisdom Model operates completely differently. Under this model, professional worth is not measured by results. It is automatic and unconditional. Every person in any workplace is automatically contributing to the development of everyone around them — through the data they provide, the example they set, the interactions they have. This contribution cannot be decreased by any result.\n\nUnder the Wisdom Model, goals and performance standards still matter enormously — but not for the same reason. The purpose of a career goal is not to prove worth by achieving it. It is to keep a person actively engaged with work, encountering the experiences that force development and expand their wisdom.\n\nThe shift from the Achievement Model to the Wisdom Model does not reduce ambition or performance. It removes the stress produced by the belief that worth must be proven through results — and the work is approached from a grounded, stable foundation rather than a defensive one.",
  },
  {
    title: "Why No Colleague Could Have Acted Differently",
    cat: "Core Truths",
    dur: "10 min",
    summary: "Workplace resentment, anger, and conflict all rest on the same belief — that someone could have simply chosen to act differently. This lesson examines why that belief is not accurate.",
    content: "Consider the colleague who let you down. The manager who handled a situation badly. The team member who didn't pull their weight when it mattered. The organisation that made a decision that affected you.\n\nThe belief underneath most workplace resentment is this: they could have chosen to act differently. They had options. They chose wrongly. And that means they owe you something — an apology, better behaviour, acknowledgement of what they did.\n\nThis belief feels entirely reasonable. But it rests on a foundation that does not hold up.\n\nFree will — the idea that a person can simply choose to act outside their current belief system — does not exist. Every person in every workplace acts from the beliefs and priorities they hold at that specific moment in their development. Those beliefs are governed by reasoning, which is governed by the law of cause and effect. The colleague who let you down was acting from exactly the beliefs and priorities they held at that moment. Given those beliefs, given those priorities, they could not have acted any differently than they did.\n\nThis is not a comfortable idea at first. It can feel like it excuses harmful behaviour — but it does not. Understanding why something happened is not the same as approving of it.\n\nWhat it does do is neutralise the resentment — the understanding upgrades the belief producing it. And resentment is worth neutralising — not for the other person's sake, but because it is consuming resources that could be going into your work, your development, and your contribution.\n\nThe accurate understanding: relationships in the workplace must be based on understanding, not trust. Understanding is not naive — it is the recognition that every person is acting from their belief system at their current level of development. That understanding does not require you to like what they did. It simply removes the energy drain of sustaining resentment toward something that could not have been any other way.",
  },
  {
    title: "What Burnout Actually Is — and How It Ends",
    cat: "Core Truths",
    dur: "8 min",
    summary: "Burnout is not caused by working too hard. It is caused by a specific belief — and understanding that belief is what allows recovery to actually take place.",
    content: "The standard explanation for burnout is that a person has worked too hard for too long and simply run out of energy. Rest more. Reduce workload. Improve work-life balance.\n\nThis explanation is incomplete — and the solution it produces is temporary at best.\n\nHere is the accurate clinical picture.\n\nBurnout begins with the 'If you are good — you'll get' philosophy applied specifically to the ability to COPE. The person's value becomes connected to their ability to cope with whatever work demands. Being seen to cope — to handle everything competently and without visible strain — is the proof that they are good enough to keep receiving what they need: security, standing, opportunity.\n\nThis creates the demand for total control and total prevention. Every situation must be managed, every threat prevented — because any event that goes uncontrolled is evidence that they cannot cope. The sympathetic nervous system fires continuously, producing sustained adrenaline, because the belief that total control and prevention are required keeps it permanently activated. The system is not responding to specific stressors — it is responding to the belief itself.\n\nBecause total control is impossible, unwanted events keep happening. Each one confirms: I am not coping. Standing is threatened.\n\nThen something shifts. The anxiety itself becomes a threat. Visible anxiety is now evidence of not coping — and not coping means value is in jeopardy. The person now has to control the anxiety on top of controlling everything else. This creates a compounding loop: anxiety produces more anxiety, because the anxiety itself is now proof that the coping belief is failing.\n\nEventually the belief system reaches a specific conclusion: my ability to cope is not just threatened — it is failing. At that point the signal being sent to the adrenal glands changes entirely. It is no longer 'produce more adrenaline — I need to keep coping.' It is 'the ability to cope is deteriorating.' The adrenal glands respond to this new signal with adrenal exhaustion — the physical manifestation of the belief that the coping ability itself has failed.\n\nThis is why rest alone does not produce recovery. The person rests. Returns. The same belief is still running. The same demand for total control is still active. The adrenal cycle resumes.\n\nGenuine recovery requires two things. First: the 'If you are good — you'll get' belief that attached worth to coping ability must be addressed directly. No outcome, no visible display of coping or not coping, determines worth. Worth is automatic and unconditional.\n\nSecond: the shift from 'spending energy attending to situations through control' to 'receiving from what the experiences work provides.' Not disengagement — active contribution, but from the position of developing rather than proving and protecting.\n\nWhen both beliefs shift, the adrenal system stops receiving the signal that triggered exhaustion. Recovery follows — and does not reverse.",
  },
  {
    title: "Your Contribution Is Automatic — Here's Why",
    cat: "Self-Worth",
    dur: "7 min",
    summary: "Professional worth is not earned through results. This lesson explains precisely why your contribution to the people around you is automatic — and what that means for how you engage with your work.",
    content: "The idea that professional worth is earned through results is so deeply embedded in workplace culture that it is almost invisible. We measure people by their output, their targets, their performance reviews. We feel good about ourselves when we deliver and uneasy when we don't.\n\nThis is the Achievement Model operating as if it were simply reality. But it is not reality — it is a belief system. And it is worth examining accurately.\n\nHere is what is actually taking place in any workplace: every person, simply by showing up and engaging with the work and the people around them, is automatically contributing to the development of everyone they interact with. Not because of their results. Because of their presence, their responses, the data they provide to other people's minds through every interaction.\n\nConsider what you provide to the people around you every single day. You set an example of how a person in your position can act. You give other people data about reality through your responses, your decisions, your way of working. You contribute to their development — and to their development as professionals — simply through the fact that they are in an environment that includes you.\n\nThis contribution is not measured by whether your project succeeded or failed. It is not increased by a promotion or decreased by a poor review. It is automatic — the consequence of your simply being present and engaged in a shared environment with other developing human beings.\n\nUnderstanding this does not mean results stop mattering. They matter because engaging with goals and standards is what keeps you active in the experiences that develop your own capability and understanding. The goal is not the destination. It is the vehicle that keeps you in the experiences you need.\n\nWhat changes when this is genuinely understood: you can put genuine effort into your work without your sense of self being attached to any particular outcome. The work gets your complete attention. The outcome provides data. Neither confirms nor threatens what you are worth.",
  },
  {
    title: "Performance Pressure: What Results Actually Measure",
    cat: "Performance",
    dur: "6 min",
    summary: "Results tell you what took place. They do not tell you what you or anyone else is worth. This distinction is the foundation of grounded, effective performance.",
    content: "The experience before a major presentation, going into a review, or waiting for a result that feels important — most people understand this as normal, just part of working life.\n\nBut the intensity of that experience is worth examining. Because it is directly proportional to how much worth is attached to the outcome.\n\nWhen a result feels like it will prove something about your competence, your standing, or your right to be in the role — the anxiety is intense. When a result is simply data about what took place — information to learn from and build on — the experience is minimal.\n\nSame result. Completely different experience. The difference is in what the result is believed to measure.\n\nHere is the accurate account: results measure what took place. They tell you what happened given all the factors involved — your preparation, the circumstances, the responses of other people, a hundred variables outside your control. They are useful information. They are not a verdict on your worth.\n\nA poor result does not mean you are incompetent. It means that given all the factors involved, the outcome was what it was. A good result does not prove your worth. It tells you that given all the factors involved, the outcome was favourable.\n\nPeople who have genuinely understood this are often the best performers — not despite removing worth from results, but because of it. They can engage with the work, take in the information results provide, adjust and improve, without the psychological drain of having their sense of self on the line with every outcome.\n\nThe question worth asking when results feel threatening: what is this result actually measuring? Is it measuring my worth — or is it measuring what took place?",
  },
  {
    title: "Workplace Conflict: The Belief Underneath Every Dispute",
    cat: "Relationships",
    dur: "8 min",
    summary: "Every workplace conflict, without exception, traces back to the same root belief. Understanding this belief is what allows resolution to actually take place — rather than just management.",
    content: "Workplace conflict takes many forms. A disagreement between team members. Tension between an employee and their manager. Resentment toward an organisation's decision. Frustration with a colleague who is not pulling their weight.\n\nDespite the variety of forms it takes, every workplace conflict traces back to the same root belief: that someone could have simply chosen to act differently.\n\nThe manager who responded poorly to feedback could have chosen to listen. The colleague who missed the deadline could have chosen to prioritise it. The organisation that made the restructuring decision could have chosen differently. The belief in each case is the same — there was a choice available that was not taken, and the person holding that belief now has grounds for resentment.\n\nThis belief feels completely justified. But it requires free will to exist. And free will does not exist.\n\nEvery person in every workplace dispute was acting from the beliefs and priorities they held at that specific moment in their development. The manager who responded poorly did so because of how they assessed the situation through their belief system — not because they freely chose to be difficult. The colleague who missed the deadline did so because of how they prioritised competing demands through their current beliefs — not because they chose to let people down.\n\nThis understanding does not make conflict irrelevant. It does not mean harmful behaviour should be accepted or that boundaries should not exist. What it means is that the resentment — the energy drain of sustaining anger toward people for choices they did not actually have — can be released.\n\nConflict resolution that actually works requires this foundation. Without it, you are managing the surface expression of resentment. With it, the energy that was fuelling the conflict simply stops being generated — because its source, the belief that someone could have chosen differently, has been replaced by an accurate account of what actually governs human behaviour.",
  },
  {
    title: "Managing From the Wisdom Model",
    cat: "Leadership",
    dur: "9 min",
    summary: "The way most people manage is built on incorrect beliefs about how behaviour works. This lesson covers what changes when leadership is applied from an accurate understanding of what actually governs how people act.",
    content: "Management is an attempt to get people to do things. How a manager attempts this, and what they believe about why people do and don't do things, determines everything about how effective they are — and how the people around them feel.\n\nMost management approaches are built, implicitly, on the Achievement Model. The assumption is that people need to be motivated, held accountable, rewarded for good performance, and corrected for poor performance. Underlying all of this is the belief that people could be performing better if they simply chose to — and the manager's job is to make that choice more likely.\n\nThis is not an accurate account of how human behaviour works.\n\nEvery person on any team is always doing what they believe is the most important thing at that moment, governed by their beliefs and priorities. Nobody is performing poorly because they chose to. Nobody is failing to meet a standard because they decided not to. Behaviour is always the output of a belief system — and it can only change when the beliefs governing it change.\n\nThis changes management in several important ways.\n\nFirst: the question about underperformance shifts from 'why won't they just do it' to 'what do they currently believe about this task, this role, and their own capability?' The answer to the second question produces a path to actual improvement. The answer to the first question produces frustration and eventual blame.\n\nSecond: working on an employee's confidence — telling them to believe in themselves more, to back themselves, to have more faith in their ability — confirms to that person that there is something to worry about if they fail. The correct approach is moving them to an understanding where their worth is not attached to performance outcomes. That produces genuine stability, not performance-anxiety dressed up as confidence.\n\nThird: never use the word balance in a management context. Telling employees that one area of their work is getting too much attention and interfering with other areas is dangerous — it is precisely the belief structure that creates the most serious psychological and physical health conditions.\n\nManaging from the Wisdom Model means understanding that every team member is always doing their best given their current beliefs. The leader's role is not to force different behaviour — it is to provide the understanding that upgrades the beliefs governing the behaviour.",
  },
  {
    title: "Why Lazy Employees Don't Exist",
    cat: "Leadership",
    dur: "6 min",
    summary: "Laziness is one of the most commonly cited problems in workplace performance. It does not exist. Understanding why changes everything about how underperformance is approached.",
    content: "There is not a lazy person in any workplace anywhere.\n\nThis is not an optimistic claim. It is an accurate account of how human behaviour works — and understanding it is one of the most practically useful things any manager or team leader can have.\n\nEvery person, at every moment, is doing what they believe is the most important thing to be doing at that moment. Their behaviour is governed by their beliefs and their priorities within those beliefs. It cannot be any other way. A person cannot act against their own priority system — any more than water can flow uphill.\n\nWhat we call laziness is always one of two things. Either the person has different beliefs than we do about what matters and what should be done first. Or the person holds a belief — often subconscious — that makes performing the task feel pointless, threatening, or inconsistent with something else they believe about themselves or the situation.\n\nIn either case, the answer is not to increase monitoring, accountability, or motivation. These approaches treat behaviour as if it were a choice being made — as if the person could simply choose to work harder if they decided to. They cannot. The behaviour they are displaying is the output of their current belief system.\n\nThe productive question is always: what does this person believe about this task, about this role, about the purpose of the effort they are being asked to put in? What belief is making this task feel low priority or not worth engaging with?\n\nWhen those beliefs are identified and addressed with accurate understanding — when the person genuinely understands why the work matters, what it contributes, and why their engagement with it is valuable — the behaviour changes. Not because they chose to change. Because the belief governing the behaviour has been upgraded.\n\nThis is not soft management. It is the most effective and accurate form of management available. It addresses the actual cause of the behaviour rather than increasing demands on the surface expression of a belief system that has not changed.",
  },
  {
    title: "Anxiety at Work: From Prevention to Engagement",
    cat: "Anxiety",
    dur: "9 min",
    summary: "Workplace anxiety is one of the most widespread and most misunderstood experiences in modern organisations. This lesson covers precisely what it is, why it is generated, and what actually resolves it.",
    content: "Workplace anxiety is epidemic. It shows up as the inability to switch off from work. The constant checking of messages. The dread before a difficult conversation. The physical symptoms — tension, poor sleep, difficulty concentrating — that follow people home.\n\nMost workplace wellbeing approaches treat anxiety as a response to external pressure that needs to be managed. Mindfulness to reduce reactivity. Breathing exercises to calm the nervous system. Time management to reduce workload. Resilience training to build tolerance.\n\nNone of these address the cause.\n\nWorkplace anxiety is produced by two specific beliefs working together. The first is the belief that total control over outcomes, situations, and people at work is both possible and required. The second is the belief that total prevention of unwanted events is the correct strategy.\n\nControl and prevention are normal parts of any working day — and the brain acting on beliefs and priorities will naturally try to bring about desired outcomes and avoid undesired ones. This is not the problem. The problem arises specifically when these cross into the demand for total control and total prevention — which is not available to any person in any workplace.\n\nThe sympathetic nervous system fires because the failure to achieve total control or total prevention is perceived as a threat to being assessed as incompetent or failing. The anxiety is not about the work situation itself. It is about what failing to control or prevent that situation is believed to prove about the person's worth in the eyes of their colleagues, their manager, and the organisation.\n\nTHE TWO STAGES\n\nWorkplace anxiety often develops in stages. In the first stage, a person becomes anxious about specific work events and outcomes. In the second stage — which many people reach without recognising it — they become anxious about the anxiety itself. The visible anxiety is now evidence of not coping at work, which threatens standing and worth. The person must now control everything at work AND control their own visible psychological state. This compounds the loop significantly.\n\nBreathing exercises and distraction provide only temporary relief because they address the symptom without touching the beliefs producing it. As soon as the person returns to the environment in which those beliefs run, the symptoms return.\n\nWhat actually resolves workplace anxiety is understanding two things. First: total control and total prevention are not available. A person can influence, prepare, and contribute — never totally control. Accepting this genuinely removes the impossible demand. Second: no workplace outcome decreases genuine value as a contributor. When this is understood, the threat disappears. The nervous system stops firing because there is nothing to protect against.",
  },
  {
    title: "Panic Attacks at Work — What They Are and What Helps",
    cat: "Anxiety",
    dur: "8 min",
    summary: "Panic attacks in the workplace are more common than reported — and almost universally misunderstood. This lesson explains precisely what is happening and what actually resolves it.",
    content: "A panic attack is a severe form of anxiety with one additional component.\n\nIn anxiety, the mind holds: 'I must urgently attend to things or something will go wrong.' In a panic attack, the additional belief present is that what could go wrong threatens to remove the person's very opportunity to continue working, contributing, and developing. The psyche registers this at the level of survival. Not 'my performance will suffer' — 'I will be cut off from opportunity entirely.'\n\nThis additional belief physically activates the respiratory system. The desperate need to keep receiving opportunity — to not be cut off — causes the breathing to accelerate sharply. This is what distinguishes a panic attack from anxiety.\n\nPanic attacks can occur in situations a person consciously believes to be safe. This is because the brain works via association. A voice, a setting, a physical sensation, even a smell that is connected in memory to a previous high-stress event can re-activate the same state — not because of any current direct threat, but because of the association the brain has made.\n\nAT THE MOMENT OF A PANIC ATTACK\n\nBreathe out first. Then begin noticing and speaking — internally or quietly — about what you are currently receiving from your environment. The parasympathetic nervous system (calm state) is triggered by the belief that something is being received rather than threatened. Shifting focus to what is being received right now directly contradicts the belief driving the attack.\n\nTHE SECONDARY STAGE\n\nAfter experiencing workplace panic attacks for a period, many people develop a second fear: that the attacks themselves prove they cannot cope professionally. This threatens standing, future opportunity, and worth — which triggers further attacks. The loop becomes self-sustaining.\n\nTHE RESOLUTION\n\nThe same understanding that resolves anxiety resolves panic attacks, with one addition: no event — including a panic attack — can cut a person off from what they are meant to receive. Their opportunity for development and contribution is automatic and cannot be seized. This is the specific belief to address.\n\nManagers: if a team member experiences panic attacks, the most helpful response is never to reassure them that everything is fine. The helpful response is to begin addressing the belief that their worth and opportunity are contingent on visible psychological control.",
  },
  {
    title: "Trauma and the Workplace — Understanding the Real Mechanism",
    cat: "Anxiety",
    dur: "8 min",
    summary: "Workplace trauma is widely misunderstood — both in what perpetuates it and what actually resolves it. The ongoing suffering is rarely about the original event.",
    content: "When someone has experienced a significant traumatic event — whether in the workplace or outside it — the conventional assumption is that the ongoing distress is caused by the event itself continuing to affect them.\n\nThis is usually not what is happening.\n\nHere is the more accurate picture.\n\nAfter encountering a severely traumatic event, people are genuinely distressed. Over time, many find a way to understand the event itself and are no longer directly distressed by it. But then a second, different fear develops.\n\nMemories of the original event keep surfacing in conscious awareness. Under the 'If you are good — you'll get' philosophy — which has people believing they must prove psychological control and coping ability to remain worthy of receiving — these surfacing memories are interpreted as proof of failure. If memories are still arising, the mind concludes: I am not over it. I am not coping. I am not in control of my own psychological state.\n\nIn a workplace context, not coping means professional standing is threatened. It means opportunity might be reduced. It means worth is under question. The fear produced by this chain of reasoning matches or exceeds the original trauma.\n\nThe person is not continuing to suffer because of the original event. They are suffering because of what the surfacing memories are believed to prove about their coping ability, their worth, and their professional standing.\n\nMany wellbeing programs, EAP services, and trauma-focused treatments continue working on the original event — not recognising that the source of the current fear is this secondary mechanism. This approach does not reach the actual cause and the person does not recover.\n\nTHE ACCURATE UNDERSTANDING\n\nIt is perfectly normal — completely expected — for memories to surface. The brain works via neurons. Old neurons do not disappear when beliefs change. They remain and can be activated by associated stimuli — a tone of voice, an environment, a physical sensation. This is how every human brain functions. It is not evidence of failure. It is not evidence of not coping.\n\nNo person needs to prove they can cope — at work or anywhere. We are not here to demonstrate psychological control. We are here to develop our understanding. Personal value has nothing to do with whether memories arise.\n\nFor managers supporting team members through trauma: the most useful thing you can provide is this understanding. The memories surfacing do not mean the person is failing. It means they have a brain that works normally.",
  },
];


const REFLECTIONS = [
  { icon: "□", title: "Resting the Mind", dur: "5 min", sub: "Breathing — not to control the mind, but to give it a rest", text: "The working mind has been processing, assessing, and directing all day. It does not need to be given another task right now. Let the breath simply be what it is — the body doing what it does automatically. You do not need to solve anything. Just let the mental faculty rest from its usual processing for a few minutes.", breathing: true },
  { icon: "◯", title: "Giving the Mind a Rest", dur: "10 min", sub: "Sit, watch, and observe — curious and appreciative of what the mind does", text: "Sit comfortably. Your thoughts will continue — that is the brain doing exactly what it has evolved to do.\n\nDirect your attention to the breath moving in and out through your nostrils. Notice the sensation of air entering, and the sensation of it leaving. The brain will automatically register and process this — observe it doing so with curiosity. What an extraordinary organ, doing all of this automatically without any effort on your part.\n\nNow expand your attention to include the sensations in your body. The brain will immediately begin assessing and labelling what it finds. Let it. Watch it doing this automatically.\n\nNow include the sounds around you. The brain will label them — that is what it does. Notice it doing so, curious about how automatically and effortlessly it all happens.\n\nWhen a thought pulls your attention fully away, simply notice that it has happened and bring your attention back. This is the practice. Watching this remarkable evolved organ at work, with appreciation for everything it does automatically." },
  { icon: "◇", title: "What My Work Is Actually Providing", dur: "6 min", sub: "Recognise what is being contributed and received", text: "Consider what your work is actually providing — not in terms of outcomes and results, but in terms of what it contributes to the people around you. The data you give them. The example you set. The interactions that form part of their development. Every engagement at work, every conversation, every piece of effort — all of it automatically contributes to the development of others. That contribution is taking place whether it is recognised or not." },
  { icon: "♡", title: "My Value as a Contributor", dur: "8 min", sub: "Recognise the automatic role you play", text: "You do not need to achieve any particular outcome to be valuable as a contributor. Right now, simply by showing up and engaging with the work in front of you, you are part of other people's environment and therefore part of their development. Your value as a contributor is not earned through results. It is automatic. This is an accurate account of what is taking place — not a concept to feel good about, but a fact about how contribution and development actually work." },
];

const DAILY_INSIGHTS = [
  "Workplace stress is never about the workload. It is about the belief that performance determines worth — and that belief can be upgraded.",
  "No colleague could have acted any differently than they did. Every action is governed by beliefs and priorities, governed by reasoning, governed by cause and effect.",
  "Laziness does not exist in any workplace. Every person is always doing what they believe is most important at that moment. Understanding this transforms management.",
  "Burnout is not caused by working too hard. It is caused by the belief that coping ability proves worth — and the adrenal exhaustion that follows when the belief system concludes that ability is failing.",
  "Your contribution to this organisation is automatic and unconditional. It does not depend on your results, your title, or anyone's assessment of you.",
  "The purpose of a career goal is not to prove your worth by achieving it. It is to keep you actively engaged in experiences that develop your understanding.",
  "Conflict in the workplace always traces back to the belief that someone could have simply chosen to act differently. That belief is not accurate.",
  "Results tell you what took place. They do not tell you what you or anyone else is worth.",
];

// ─── HR UNLOCK ───────────────────────────────────────────────────────────────
const HR_UNLOCK_CODE = "BPMHR2025";
const HR_STORAGE_KEY = "bpm_hr_unlocked";
function getHRUnlocked() { try { return localStorage.getItem(HR_STORAGE_KEY) === "true"; } catch { return false; } }
function setHRUnlocked() { try { localStorage.setItem(HR_STORAGE_KEY, "true"); } catch {} }

// ─── HR DATA ─────────────────────────────────────────────────────────────────

const HR_PRESENTATIONS = [
  {
    id: "stress",
    title: "Why Workplace Stress Is Never About the Job",
    audience: "All employees",
    duration: "15 min",
    slides: [
      { heading: "The Observation", content: "Two people. Same job. Same manager. Same targets. Same environment.\n\nOne is at ease with the work. The other is experiencing significant psychological stress.\n\nIf the job caused the stress — both would be stressed.\n\nWhat does this tell us?" },
      { heading: "The Key Insight", content: "Workplace stress is not caused by the workplace.\n\nIt is caused by the beliefs through which workplace situations are assessed.\n\nThe same event — critical feedback, a missed target, a difficult conversation — produces completely different experiences depending on what the person believes that event means about their worth and their standing." },
      { heading: "The Two Models", content: "ACHIEVEMENT MODEL:\nYour worth is measured by your results, your title, and approval from the right people. Every outcome either confirms or threatens your standing.\n\nWISDOM MODEL:\nYour contribution is automatic and unconditional. Results are information — not verdicts on your worth." },
      { heading: "What Changes", content: "Under the Achievement Model:\n→ Critical feedback feels like a personal attack\n→ Missed targets produce shame and anxiety\n→ Uncertainty feels threatening\n\nUnder the Wisdom Model:\n→ Critical feedback is useful data\n→ Missed targets tell you what happened\n→ Uncertainty is where development lives" },
      { heading: "The Practical Shift", content: "You cannot change your beliefs by deciding to.\n\nBut you can notice which model is running — and apply the accurate understanding that your worth is not attached to any outcome.\n\nEvery time you do, the belief loses a little of its grip.\n\nThis is what Bulletproof Mindset is designed to support." },
      { heading: "Discussion Prompt", content: "Think of a situation at work that recently caused you stress.\n\nWhat did your mind conclude that situation meant about your standing or your worth?\n\nIs that conclusion accurate — or is the Achievement Model running?" },
    ]
  },
  {
    id: "conflict",
    title: "Understanding Workplace Conflict",
    audience: "All employees & managers",
    duration: "20 min",
    slides: [
      { heading: "The Common Experience", content: "Most people have experienced workplace conflict.\n\nHow?\n\nBelieving a colleague let them down. Assessing the actions of a manager could've been better. Thinking the team is not behaving the way they should.\n\nThe frustration feels completely justified — and that it's best to take action to change these events. But this is not the most effective way to upgrade the supposed conflict.\n\nYou see, the conflict is not in the workplace. It is in our mind — and the interpretations that arise due to the beliefs we carry." },
      { heading: "The Belief Underneath All Conflict", content: "Every workplace dispute — without exception — traces back to the same belief:\n\nSomeone could have simply chosen to act differently.\n\nThey had options. They chose wrongly. This makes them responsible for the harm caused." },
      { heading: "Why That Belief Is Inaccurate", content: "Free will — the idea that a person can choose to act outside their current belief system — does not exist.\n\nEvery person acts from the beliefs and priorities they hold at that specific moment in their development.\n\nGiven those beliefs, they could not have acted any differently.\n\nThis is not an excuse. It is an accurate account of how human behaviour works." },
      { heading: "What This Means for Teams", content: "Understanding this does not mean:\n→ Harmful behaviour should be accepted\n→ Standards should not be maintained\n→ Difficult conversations should be avoided\n\nIt does mean:\n→ Resentment is not logically sustainable\n→ Sustained anger drains resources that belong elsewhere\n→ Resolution becomes possible when understanding replaces judgment" },
      { heading: "From Resentment to Understanding", content: "The question that transforms conflict:\n\nInstead of: 'Why did they choose to act that way?'\n\nAsk: 'What beliefs were governing their actions at that moment?'\n\nThis doesn't require agreement. It requires accurate understanding of how people work." },
      { heading: "Discussion Prompt", content: "Think of a current or recent workplace tension.\n\nWhat do you believe the other person could and should have done differently?\n\nWhat might their belief system have looked like from where they were standing?" },
    ]
  },
  {
    id: "burnout",
    title: "What Burnout Actually Is — and How It Ends",
    audience: "All employees & managers",
    duration: "20 min",
    slides: [
      { heading: "The Standard Explanation", content: "The common understanding of burnout:\n\nWorked too hard. Too long. Ran out of energy.\n\nSolution: rest, reduce workload, improve balance.\n\nThe person recovers and returns.\n\nExcept — they often don't. Or they do, return, and burn out again within months.\n\nThe reason is that rest addresses the symptom — not the belief producing it." },
      { heading: "Where It Actually Begins", content: "Burnout begins with 'If you are good — you'll get' applied to the ability to COPE.\n\nThe person's value becomes connected to being seen to cope with everything work demands. Coping = proof you are good enough to keep your standing.\n\nThis creates the demand for total control and prevention — because any uncontrolled event is evidence that they cannot cope.\n\nThe sympathetic nervous system fires continuously. Adrenaline is sustained as long as this belief runs." },
      { heading: "The Compounding Loop", content: "Because total control is impossible, unwanted events keep happening.\n\nEach one confirms: I am not coping. My standing is threatened.\n\nThen the anxiety itself becomes a threat — because visible anxiety is evidence of not coping.\n\nNow they must control everything AND control the anxiety.\n\nAnxiety produces more anxiety. The loop compounds." },
      { heading: "What Burnout Actually Is", content: "Eventually the belief system reaches a specific conclusion:\n\nMy ability to cope is not just threatened — it is FAILING.\n\nThe signal to the adrenal glands changes: no longer 'produce more adrenaline to cope' — but 'the coping ability is deteriorating.'\n\nAdrenal exhaustion is the physical manifestation of this specific belief.\n\nThis is why rest alone doesn't produce recovery — the belief is still running when they return." },
      { heading: "What Actually Resolves It", content: "Two beliefs must shift:\n\n1. The 'If you are good — you'll get' belief that attached worth to coping ability must be addressed directly. No display of coping or not coping determines worth.\n\n2. The shift from 'attending to situations through control' to 'receiving from what the experiences work provides.'\n\nWhen both shift, the adrenal system stops receiving the signal that triggered exhaustion." },
      { heading: "For Managers", content: "When a team member is burning out, reducing workload helps short-term.\n\nThe more important conversation is about the belief — specifically, whether their sense of worth is attached to being seen to cope.\n\nAsk: 'Is there any part of this where you feel that if you're not handling everything, it says something about you here?'\n\nThat conversation, handled with accurate understanding, produces lasting recovery." },
    ]
  },
  {
    id: "laziness",
    title: "Why Lazy Employees Don't Exist",
    audience: "Managers & team leaders",
    duration: "15 min",
    slides: [
      { heading: "The Challenge", content: "Every manager has experienced the team member who appears to be coasting.\n\nMissing deadlines. Minimal effort. Can't seem to generate urgency about anything.\n\nThe label that gets applied — even if it's never said aloud:\n\nLazy." },
      { heading: "The Accurate Account", content: "There is not a lazy person in any workplace.\n\nEvery person, at every moment, is doing what they believe is the most important thing to be doing at that moment.\n\nBehaviour is always the output of a belief system. It cannot be any other way." },
      { heading: "What Looks Like Laziness", content: "Is always one of two things:\n\n1. Different beliefs about what matters and what should be prioritised — what looks like laziness is simply a different priority system.\n\n2. A belief — often subconscious — that makes the task feel pointless, threatening, or not worth engaging with." },
      { heading: "The Wrong Response", content: "Increasing monitoring, accountability, and consequences treats behaviour as if it were a choice.\n\nAs if the person could simply decide to work harder.\n\nThey cannot. The behaviour is the output of their current beliefs. Addressing the behaviour — without addressing the belief producing it — generates compliance at best, and resentment at worst." },
      { heading: "The Right Response", content: "The question that changes everything:\n\nNot: 'Why won't they just do it?'\n\nBut: 'What do they currently believe about this task, this role, and the value of their contribution?'\n\nWhen those beliefs are identified and addressed with accurate understanding, the behaviour changes — not because they chose to change, but because the belief governing the behaviour has been upgraded." },
      { heading: "Discussion Prompt", content: "Think of a team member whose engagement has concerned you.\n\nWhat do you believe about why they are not performing?\n\nWhat might they currently believe about this work and why it matters?" },
    ]
  },
  {
    id: "free-will",
    title: "Why Nobody Could Have Done It Differently",
    audience: "All employees & managers",
    duration: "20 min",
    slides: [
      { heading: "The Most Common Workplace Belief", content: "Behind almost every piece of workplace frustration, resentment, or blame is this conclusion:\n\n'They could have simply chosen to act differently.'\n\nThey had options. They chose the wrong one. This makes them responsible for everything that followed.\n\nThis belief feels obvious. It also has serious consequences — for individuals, teams, and organisations." },
      { heading: "A Quick Test", content: "Try this now:\n\nThink of something you currently don't believe — and could never believe regardless of what anyone told you.\n\nNow simply choose to believe it.\n\nYou cannot. Nobody can.\n\nThis is not a failure of will. It is how the human mind actually works." },
      { heading: "The Accurate Account", content: "Every person, at every moment, acts from the beliefs and priorities they hold at that precise point in their development.\n\nThose beliefs are the product of everything they have experienced up to that moment — family, education, culture, every interaction, every event.\n\nGiven those beliefs, they could not have acted any differently than they did.\n\nThis is governed by the law of cause and effect — the same law governing everything in the universe." },
      { heading: "What This Does to Workplaces", content: "When managers believe people chose to perform poorly:\n→ Frustration replaces understanding\n→ Punishment replaces the right intervention\n→ The actual cause is never addressed\n\nWhen colleagues believe someone chose to let them down:\n→ Resentment builds\n→ Collaboration deteriorates\n→ The relationship carries that weight indefinitely" },
      { heading: "What Changes When We Understand This", content: "Understanding that behaviour is always belief-governed does NOT mean:\n→ Standards stop mattering\n→ Poor performance is accepted\n→ Difficult conversations are avoided\n\nIt DOES mean:\n→ The intervention targets the right thing — the belief, not the person\n→ Resentment no longer has a logical foundation\n→ Conversations become about understanding rather than blame\n→ Recovery becomes possible" },
      { heading: "Discussion Prompt", content: "Think of a situation at work where you believed someone simply chose to act badly.\n\nWhat were they most likely believing at that moment that made their action the logical response to them?\n\nHow does this change your response to the situation?" },
    ]
  },
  {
    id: "fear",
    title: "The Fear Running Every Workplace",
    audience: "All employees",
    duration: "15 min",
    slides: [
      { heading: "One Philosophy. Everywhere.", content: "There is a philosophy installed in virtually everyone before they reach adulthood.\n\nIt arrives through parents, schools, workplaces, and culture.\n\nMost people have never examined it — but it is running in the background of almost every psychological experience at work.\n\nIt sounds like this:\n\n'If you are good — you will get.'" },
      { heading: "What It Means in the Workplace", content: "In the workplace, this philosophy operates as:\n\n'If I am competent enough, productive enough, liked enough, reliable enough — I will keep my standing. I will receive security, recognition, opportunity, and belonging.'\n\n'If I am NOT good enough — I will be assessed as failing. I will miss out. My place here is at risk.'\n\nPerformance is no longer just performance. It is proof of worth." },
      { heading: "The Fear It Creates", content: "From this philosophy comes the specific fear that drives most workplace stress:\n\nThe fear that if I do not perform well enough, I will miss out on what I need.\n\nThis fear is why:\n→ Critical feedback feels like a personal attack\n→ Mistakes feel catastrophic\n→ Uncertainty at work feels threatening\n→ Other people's success feels threatening to your own standing\n→ Taking time off feels risky\n\nNone of these are about the work. All of them are about the belief." },
      { heading: "Where the Belief Came From", content: "Nobody chose this philosophy.\n\nIt was taught — by people who believed it themselves, who received it from people who believed it before them.\n\nParents, teachers, coaches, managers — all delivering the same underlying message: prove yourself and you'll be valued. Fail to prove yourself and you risk missing out.\n\nIt is not a personal flaw. It is a cultural inheritance. And it is inaccurate." },
      { heading: "The Accurate Understanding", content: "Professional contribution is not something that must be earned and maintained through performance.\n\nIt is automatic.\n\nEvery person in any workplace is already contributing to the development of the people and the organisation around them — through every interaction, every response, every presence. That contribution cannot be removed by any result.\n\nGoals and standards still matter enormously — but as direction and development, not as proof of worth." },
      { heading: "Discussion Prompt", content: "What version of 'If you are good — you'll get' are you currently running at work?\n\nWhat do you believe you need to achieve here to prove you are a worthwhile investment?\n\nIs that belief accurate — or is it what you were taught?" },
    ]
  },
  {
    id: "emotions",
    title: "What Your Emotions Are Actually Telling You",
    audience: "All employees",
    duration: "15 min",
    slides: [
      { heading: "The Common Understanding", content: "Most people understand emotions as reactions to events.\n\nA difficult meeting produces frustration. A failed project produces disappointment. An unfair outcome produces anger.\n\nThe event causes the emotion.\n\nIf this were accurate — everyone in the same meeting would feel the same emotion.\n\nThey don't. Which means the event is not the cause." },
      { heading: "Where Emotions Actually Come From", content: "Emotions are produced by beliefs — not events.\n\nWhen an event occurs, the mind assesses it against a set of beliefs: What does this mean? Is this beneficial or threatening? What does this say about my situation, my worth, my future?\n\nThe emotion produced is entirely determined by that assessment.\n\nSame event. Different beliefs. Different emotion." },
      { heading: "What Emotions Are For", content: "Emotions are not malfunctions to be managed or switched off.\n\nThey are information — precise signals telling you which beliefs are running and how those beliefs are assessing what just happened.\n\nAnger tells you that you believe someone could and should have acted differently.\nAnxiety tells you that you believe total control and total prevention are both required and under threat.\nDepression tells you that you believe the goal that was meant to prove your worth is no longer achievable.\nGuilt tells you that you believe you could have chosen to act differently than you did.\n\nEvery emotion is a signal pointing to a specific belief." },
      { heading: "What This Means for Wellbeing Programs", content: "Programs that focus on managing, regulating, or redirecting emotions are addressing the signal — not the belief producing it.\n\nAs long as the belief is in place, the emotional response will continue to be produced.\n\nYou cannot sustainably quiet the signal while the source remains unchanged.\n\nThe only approach that produces lasting change is identifying and upgrading the specific belief the emotion is pointing to." },
      { heading: "The Practical Application", content: "The next time an emotional stress signal activates at work:\n\nInstead of asking 'How do I make this feeling go away?' — ask:\n\n'What has my mind just concluded about what this situation means for my worth, my standing, or my future?'\n\nThat question reaches the belief. And the belief is where the understanding needs to be applied." },
      { heading: "Discussion Prompt", content: "Think of an emotion that regularly shows up for you at work.\n\nWhat does your mind typically conclude when that emotion arises — about the situation, about yourself, or about what will happen next?\n\nIs that conclusion accurate?" },
    ]
  },
  {
    id: "anger-guilt",
    title: "Anger, Guilt, and Resentment at Work",
    audience: "All employees & managers",
    duration: "20 min",
    slides: [
      { heading: "The Workplace Cost", content: "Anger, guilt, and resentment are among the most costly psychological states in any organisation.\n\nThey consume attention that belongs on work. They deteriorate relationships that teams depend on. They sustain a physical stress response that exhausts the body over time.\n\nAnd they are almost universally misunderstood — both in where they come from and what would actually resolve them." },
      { heading: "What Produces Anger", content: "Anger is always produced by a single belief:\n\nSomeone could have chosen to act differently — and chose not to.\n\nThis is why workplace anger is always directed at someone. The anger is the emotional output of the belief that a different choice was available and the wrong one was made.\n\nThe longer that belief is held, the more sustained the anger. And the more sustained the anger, the more the nervous system pays for it." },
      { heading: "What Produces Guilt and Regret", content: "Guilt and regret are the same belief — turned inward.\n\n'I could have chosen to act differently. I chose wrongly. I am responsible for what followed.'\n\nLike anger, guilt rests entirely on the belief that a different choice was available at that moment.\n\nThe accurate understanding — that every action is governed by the beliefs and priorities held at that precise moment, and no different action was available — is what removes guilt at its source. Not talking about it. Not forgiving yourself. Understanding it." },
      { heading: "Does Anger Have Purpose?", content: "Yes — initially.\n\nAnger is a signal that the mind has concluded someone acted incorrectly. That signal is useful — it points to a belief worth examining.\n\nBut holding onto anger to serve justice later, or to protect against the same harm happening again, is not useful. It sustains the psychological and physical cost without producing the outcome it's meant to achieve.\n\nUnderstanding the belief that produced the other person's behaviour resolves anger where no amount of time alone will." },
      { heading: "Making Someone Feel Guilty — Does It Work?", content: "A common management approach: making a team member feel guilty about their underperformance, hoping guilt will produce change.\n\nIt won't — not lastingly.\n\nGuilt can produce short-term compliance. It cannot change the belief governing the behaviour. The behaviour returns when the consequences are no longer immediately in view — because the belief that was producing it has not been touched.\n\nWorse: guilt adds another stressor to a person already struggling. The relationship with the manager deteriorates. Trust erodes.\n\nThe belief must be addressed directly — not through guilt, but through accurate understanding." },
      { heading: "Discussion Prompt", content: "Is there a workplace situation you are currently carrying anger, guilt, or resentment about?\n\nWhat specifically do you believe that person — or you — could and should have done differently?\n\nWhat were the beliefs actually governing the action at that moment?" },
    ]
  },
  {
    id: "four-stages",
    title: "The Four Stages of Learning — Where Is Your Team?",
    audience: "Managers & team leaders",
    duration: "20 min",
    slides: [
      { heading: "Why People Seem 'Stuck'", content: "Managers frequently experience team members who seem unable to change despite training, feedback, and clear performance expectations.\n\nThe frustration is understandable. But the standard explanation — that the person is choosing not to engage — is inaccurate.\n\nThere is a precise model for understanding exactly where a person is in their development — and what type of support actually moves them forward." },
      { heading: "Stage 1: Unconsciously Incompetent", content: "The person has not yet received the data that would allow them to recognise what needs to change.\n\nThey are not aware there is anything to learn.\n\nExample: 'I don't know my beliefs about contribution are causing my disengagement.'\n\nWhat helps: Not feedback about performance — but data that activates awareness. The conscious window needs to be opened before it can collect new information." },
      { heading: "Stage 2: Consciously Incompetent", content: "The person now recognises they have something to learn. The conscious window is open and actively collecting new data.\n\nExample: 'I can see my beliefs about what this job means for my worth are producing the stress I'm experiencing. I need to gather new understanding.'\n\nWhat helps: Education. Accurate understanding about what is actually happening and why. This is the stage where Bulletproof Mindset content is most readily received." },
      { heading: "Stage 3: Consciously Competent", content: "The person has the new understanding and is actively applying it.\n\nThis takes conscious effort — the new belief is present but not yet automatic.\n\nExample: 'I can use my new understanding about contribution to identify inaccurate beliefs as they arise and apply the accurate account.'\n\nWhat helps: Opportunity to apply the understanding in real situations, with the support of someone who can provide accurate guidance when old beliefs surface." },
      { heading: "Stage 4: Unconsciously Competent", content: "The new understanding has been integrated deeply enough to run automatically.\n\nThe person no longer needs to consciously apply the new belief — it has become the operating programme.\n\nExample: 'I have enough wisdom that upgrading inaccurate beliefs is now automatic and fast.'\n\nWhat helps: New depth of understanding. People at Stage 4 are ready for the next level of development — not repeated content they have already integrated." },
      { heading: "Discussion Prompt", content: "Think of a team member you are currently trying to develop.\n\nWhich stage best describes where they are right now?\n\nIs the support you are providing matched to that stage — or are you delivering Stage 3 content to someone still at Stage 1?" },
    ]
  },
  {
    id: "goals",
    title: "What Goals Are Actually For",
    audience: "All employees",
    duration: "15 min",
    slides: [
      { heading: "The Standard Relationship with Goals", content: "Most people at work hold goals in a particular way.\n\nAchieve the goal → success, worth confirmed.\nFail to achieve the goal → failure, worth threatened.\n\nThis means every goal carries psychological stakes that have nothing to do with the goal itself.\n\nAnd this relationship with goals is one of the primary sources of workplace stress — because it turns every missed target into a statement about worth." },
      { heading: "What the Achievement Model Does With Goals", content: "Under the Achievement Model, the goal has one purpose: to prove worth through achievement.\n\nThis creates predictable problems:\n→ The closer to the goal, the higher the anxiety — because failure at this point feels more costly\n→ Achievement feels temporary — the next goal must be set immediately to keep proving worth\n→ No amount of achievement permanently resolves the underlying inadequacy\n→ When a goal becomes clearly unachievable, the conclusion is not just 'the goal is gone' — it is 'my chance to prove my worth is gone'\n\nThis is the precise mechanism that produces depression — the specific conclusion that the goal that would have proven worth is no longer reachable." },
      { heading: "What Goals Are Actually For", content: "Under the Wisdom Model, goals have a completely different purpose.\n\nA goal is a direction — a way of orienting activity so that a person actively engages with work and encounters the experiences that force development.\n\nThe goal provides the orientation. The development happens through the process of pursuing it — including, and especially, the parts that don't go to plan.\n\nAchieving the goal is not the purpose. Engaging with the pursuit is." },
      { heading: "What This Changes", content: "When goals are understood as direction rather than proof:\n\n→ Missing a target is no longer a verdict — it is information about what happened and what to do next\n→ The effort becomes genuinely worth it regardless of the outcome\n→ Setbacks provide the most development — because those are the events that force the deepest learning\n→ The stress produced by the belief that outcomes prove worth is removed\n\nPerformance typically improves. Not because effort increases — but because the anxiety that was consuming resources is no longer running." },
      { heading: "The Correct Measure", content: "The question to change your relationship with any goal:\n\nNot: 'Did I achieve it?'\n\nBut: 'What did the pursuit of it develop in me?'\n\nEvery person in this room has achieved thousands of goals in the course of their work and development. But the assessment of development by achievement alone misses almost everything that actually happened." },
      { heading: "Discussion Prompt", content: "Think of a goal you are currently working toward — or one you recently failed to achieve.\n\nWhat specifically were you believing that goal would prove if you achieved it?\n\nWhat has the pursuit of it actually developed in you — regardless of the outcome?" },
    ]
  },
  {
    id: "performance",
    title: "Why Performance Conversations Fail — and What Works",
    audience: "Managers & HR",
    duration: "20 min",
    slides: [
      { heading: "The Standard Performance Conversation", content: "Most organisations have a version of this conversation:\n\nThe manager identifies a performance gap. They tell the team member what is expected. They set targets. They increase monitoring. They may apply consequences.\n\nThe team member appears to understand. They may even agree.\n\nAnd then — nothing changes. Or changes briefly, then reverts.\n\nWhy?" },
      { heading: "The Gap That Gets Missed", content: "The standard performance conversation assumes the gap is about knowledge, skill, effort, or awareness.\n\nThe team member just needs to know what's expected. Or to be held more accountable. Or to face the consequences of not performing.\n\nNone of this reaches the actual cause.\n\nEvery performance gap is produced by a belief. Not a choice, not a lack of information — a belief governing the behaviour at that moment.\n\nUntil the belief is identified and addressed, no performance conversation will produce lasting change." },
      { heading: "The Belief-First Approach", content: "Before addressing the behaviour — understand the belief.\n\nThe correct question is not: 'Why aren't you meeting the standard?'\n\nIt is: 'What do you currently believe about this task, this role, and what your contribution here means for you?'\n\nThe answer to that question tells you exactly what belief is governing the performance gap — and gives you the correct intervention point.\n\nThe behaviour is the symptom. The belief is the cause." },
      { heading: "Common Beliefs Behind Performance Gaps", content: "1. 'My contribution here doesn't matter.' → disengagement\n2. 'If I try and fail, it proves something about my worth.' → avoidance\n3. 'This task is beneath what I should be doing.' → resentment-based withdrawal\n4. 'No matter how much I do, it won't be enough.' → exhaustion and surrender\n5. 'I don't know what I'm doing and people will find out.' → paralysis and delay\n\nEach of these requires a completely different conversation — but all share the same underlying structure: a belief about worth, standing, or what the work means." },
      { heading: "What Actually Produces Lasting Change", content: "When the belief is identified:\n\n1. Validate that the behaviour makes sense given the belief. It always does.\n2. Provide the accurate understanding about what the work and contribution actually mean — specifically, that no result determines worth.\n3. Give the person time to genuinely receive that understanding. It does not change in a single conversation.\n4. Follow up with the content of the conversation — not just the performance standard.\n\nThis is what produces a genuine shift. Not more monitoring. Not consequences. The accurate understanding that changes what the work means." },
      { heading: "Discussion Prompt", content: "Think of a performance conversation you have had that produced short-term change but didn't last.\n\nWhat belief might have been governing that team member's behaviour?\n\nIf you had addressed that belief directly — what would the conversation have looked like?" },
    ]
  },
  {
    id: "disengagement",
    title: "What Disengagement Is Really About",
    audience: "Managers & HR",
    duration: "15 min",
    slides: [
      { heading: "The Disengagement Problem", content: "Disengagement is one of the most expensive problems in any organisation.\n\nTeam members who are present but not contributing. Going through the motions. Doing the minimum.\n\nThe most common response: engagement initiatives. Events, recognition programmes, surveys, wellness activities.\n\nThese often produce short-term improvement. The disengagement returns.\n\nBecause the cause was never addressed." },
      { heading: "What Disengagement Actually Is", content: "Disengagement is always the output of a specific belief about the pointlessness of engagement.\n\nUnder the Achievement Model, engagement only makes sense if the effort leads to an outcome that proves worth — recognition, advancement, achievement, security.\n\nWhen a person has concluded — consciously or not — that this is no longer likely, the brain reaches a logical decision: there is no point engaging further.\n\nThis is the precise mechanism of depression applied to the workplace: the conclusion that the goal which would prove worth is no longer reachable. So the effort is withdrawn.\n\nDisengagement is not laziness. It is the brain's logical response to a belief that effort is pointless." },
      { heading: "What Doesn't Work — and Why", content: "Engagement initiatives that provide external motivation — events, recognition, perks — temporarily shift attention away from the disengagement belief.\n\nThey do not address it.\n\nWhen the event passes and the person returns to the environment in which the belief runs, the belief resumes governing behaviour.\n\nWorse: some recognition programmes reinforce the Achievement Model — they confirm that worth is contingent on being seen and acknowledged. This compounds the original problem." },
      { heading: "The Belief to Address", content: "For most disengaged employees, there is one of two beliefs at the core:\n\n1. 'My contribution here doesn't matter / is not recognised / makes no real difference.'\n2. 'I have tried and the outcome I needed to prove my worth here is not coming.'\n\nBoth require the same accurate understanding:\n\nContribution is automatic and unconditional. No result, no recognition, and no outcome determines the value of what any person does. The contribution is happening regardless of whether it is seen, acknowledged, or rewarded." },
      { heading: "The Practical Approach", content: "When a team member shows signs of disengagement:\n\nThe first conversation is not about standards or expectations.\n\nIt is about understanding — specifically, what they currently believe their effort here means for them, and what conclusion they have reached about the value of continuing.\n\nOnly when that belief is identified can the right understanding be offered.\n\nThe belief-first conversation produces more lasting change in one session than twelve months of engagement activity." },
      { heading: "Discussion Prompt", content: "Think of a disengaged team member.\n\nWhat do you believe they have concluded about the value of their effort here?\n\nWhat accurate understanding — if they genuinely received it — would most directly address that conclusion?" },
    ]
  },
  {
    id: "bullying",
    title: "Bullying and Harassment — What's Actually Happening",
    audience: "All employees & managers",
    duration: "20 min",
    slides: [
      { heading: "The Numbers", content: "Bullying and harassment is the top driver of serious mental health compensation claims in Australian workplaces.\n\n33% of all mental health claims involve bullying or harassment as the primary cause.\n\nFor organisations, the cost is significant — claims, liability, talent loss, and team deterioration.\n\nFor individuals, the psychological impact can be severe and lasting.\n\nBut most responses to bullying address only the surface — without touching the belief structures that produce it or sustain its impact." },
      { heading: "What Produces Bullying Behaviour", content: "Nobody wakes up and chooses to be a bully.\n\nBullying behaviour is always the output of a belief system. Specifically, the belief that:\n\n→ Personal standing or worth is threatened by another person's presence, performance, or behaviour\n→ Total control over that person — their actions, their standing, their impact — is both possible and required\n→ Establishing dominance or compliance is the correct strategy for protecting standing\n\nThe behaviour is a logical output of these beliefs. This does not make it acceptable. It means the belief is where genuine change must happen." },
      { heading: "Why Targets Are Affected the Way They Are", content: "Two people can receive the same bullying behaviour and experience it completely differently.\n\nOne person is devastated. Another is frustrated but not destabilised.\n\nThe difference is not toughness. It is the belief running in the person receiving the behaviour.\n\nWhen a person believes their worth is connected to how others treat them — when another person's conduct can confirm or threaten their standing — bullying lands as an existential threat.\n\nWhen a person holds the understanding that no conduct by another person can change their value, the behaviour still needs to be addressed — but it no longer carries the same psychological weight." },
      { heading: "Why Standard Responses Fall Short", content: "Policies, complaints processes, investigations, and disciplinary action are necessary.\n\nThey are not sufficient.\n\nThey address the behaviour without touching the belief that produced it in the person bullying — which means the behaviour is redirected or contained, not resolved. It finds a new target or a new form.\n\nThey also do nothing for the psychological impact on the person targeted — because the impact is produced by the belief the conduct triggered, not the conduct itself.\n\nBoth require belief-level work, not just procedural response." },
      { heading: "What Actually Helps", content: "For the person experiencing bullying:\n→ The accurate understanding that no person's conduct can decrease genuine value\n→ Address the specific belief the bullying triggered — whether about worth, belonging, or safety at work\n\nFor the person demonstrating bullying behaviour:\n→ Identify which belief is producing the behaviour — usually fear of losing standing or control\n→ Address the 'If you are good — you'll get' belief driving the need to dominate\n\nFor the organisation:\n→ Create a culture in which worth is not tied to standing, hierarchy, or approval — because bullying flourishes where it is" },
      { heading: "Discussion Prompt", content: "Has there been a situation at work where someone's behaviour toward you significantly affected how you felt about yourself?\n\nWhat did your mind conclude that their behaviour meant about your worth or your place here?\n\nIs that conclusion accurate — or did the belief amplify the impact of the behaviour?" },
    ]
  },
  {
    id: "recognition",
    title: "Lack of Recognition — Why It Hurts and What It Means",
    audience: "All employees & managers",
    duration: "15 min",
    slides: [
      { heading: "One of the Most Common Complaints", content: "Lack of career progression and recognition is one of the top reported complaints in Australian workplaces.\n\nPeople feel their contribution is invisible. Their effort is not acknowledged. Their development is not supported.\n\nThe frustration is real. But what is actually producing the pain — and what would actually resolve it — is almost never addressed." },
      { heading: "Why Lack of Recognition Hurts", content: "Recognition is not painful simply because it is absent.\n\nIt is painful when a person is using recognition as the source of their sense of value.\n\nUnder the 'If you are good — you'll get' philosophy, recognition from management and colleagues is one of the primary signals that worth has been confirmed. When it doesn't arrive, the signal instead reads: your contribution is not good enough. Your standing is not secure.\n\nThe pain is not about the recognition. It is about what the absence of recognition is believed to prove." },
      { heading: "The Trap This Creates", content: "When worth is tied to recognition, the person is perpetually dependent on an external signal to feel valuable.\n\nThis creates a monitoring programme that is exhausting to run — constantly scanning for signs of acknowledgement or its absence.\n\nAnd it puts an impossible burden on managers — who cannot possibly provide enough recognition often enough to compensate for a belief that routes worth through external approval.\n\nNo amount of recognition permanently resolves the underlying belief. The need returns the moment it has been satisfied." },
      { heading: "The Accurate Understanding", content: "Recognition from management confirms that a person's contribution was observed.\n\nIt does not create the value of that contribution. The contribution is valuable whether it is seen or not.\n\nEvery employee is already affecting the development of the people around them — through every interaction, every piece of work, every presence in the system. That effect is happening regardless of whether anyone acknowledges it.\n\nThis is not a consolation. It is an accurate account of how contribution actually works." },
      { heading: "For Managers", content: "Recognition should still be given — freely and specifically. It matters as feedback and as a signal of attention.\n\nBut the most powerful thing a manager can do for a team member who is distressed by a perceived lack of recognition is not to give more recognition.\n\nIt is to provide the understanding that their worth is not held in your acknowledgement.\n\nA person who genuinely receives that understanding is freed from the monitoring programme. They stop needing the recognition to feel okay — and can then receive it as information rather than survival signal." },
      { heading: "Discussion Prompt", content: "Is there an area of your work where you feel your contribution is not recognised?\n\nWhat specifically do you believe the absence of that recognition means about your contribution or your worth?\n\nIf your worth was completely independent of that recognition — how would you experience its absence differently?" },
    ]
  },
  {
    id: "communication",
    title: "Poor Communication — The Belief Behind the Complaint",
    audience: "All employees & managers",
    duration: "15 min",
    slides: [
      { heading: "One of the Top Workplace Complaints", content: "Poor communication and lack of transparency from leadership is consistently one of the most cited workplace grievances.\n\nEmployees feel uninformed, disconnected, and excluded from decisions that affect their work.\n\nThe frustration is understandable. But the intensity of the response — why it matters as much as it does — is almost never examined." },
      { heading: "What Information Means Under the Achievement Model", content: "Under the 'If you are good — you'll get' philosophy, information is not just operational data.\n\nIt is a signal about standing.\n\nBeing informed means being included — being considered important enough to know. Being kept in the loop confirms that my place here is secure.\n\nBeing uninformed means being excluded — being assessed as not important enough, not trusted, possibly at risk.\n\nThis is why poor communication produces emotional responses that go far beyond inconvenience. The belief reads it as a signal about worth." },
      { heading: "What Transparency Anxiety Actually Is", content: "When employees become anxious about what leadership is or isn't communicating, the anxiety is not about the information itself.\n\nIt is about what the absence of information is believed to mean.\n\n'If they were planning changes that didn't affect me, I would already know. The fact I don't know means the change affects me. And if the change affects me, my standing here might be at risk.'\n\nThis is the belief chain running underneath the complaint. Addressing the communication without addressing this chain produces partial relief at best." },
      { heading: "For Leaders", content: "Transparency is good practice — communicate clearly, honestly, and frequently.\n\nBut no amount of communication will fully resolve communication anxiety in a team running the Achievement Model.\n\nBecause the issue is not the quantity of information — it is the belief that information signals worth.\n\nTeams that have received the understanding that their contribution is unconditional are less destabilised by uncertainty and periods of limited information. They can tolerate not knowing because their worth is not held in the answer." },
      { heading: "The Accurate Account", content: "Organisational decisions are governed by the beliefs and priorities of the people making them — not by assessments of each individual's worth.\n\nWhen communication is poor, it reflects the belief system and capability of the people communicating — not a verdict on the worth of those not being communicated with.\n\nThis understanding does not excuse poor communication. It removes the existential weight that poor communication carries when worth is riding on every piece of information received." },
      { heading: "Discussion Prompt", content: "Think of a time when poor communication from leadership made you feel worse than the content of the news itself.\n\nWhat did your mind conclude the lack of communication meant about your standing or your worth here?\n\nIs that conclusion accurate?" },
    ]
  },
  {
    id: "favoritism",
    title: "Favouritism — Why It Feels Personal and What to Do With That",
    audience: "All employees & managers",
    duration: "15 min",
    slides: [
      { heading: "A Complaint in Most Workplaces", content: "Favouritism and nepotism are consistently cited as major sources of workplace frustration and resentment.\n\nSomeone gets the better project. Someone gets promoted ahead of more qualified colleagues. Someone can break the rules others are held to.\n\nThe response is often intense — and lasting. People carry the resentment of perceived favouritism for years.\n\nTo understand why it affects people the way it does, we need to look at what the belief system is doing with it." },
      { heading: "What Favouritism Triggers", content: "Under the 'If you are good — you'll get' philosophy, advancement, recognition, and opportunity are the rewards for being good enough.\n\nWhen a person they believe did not earn those rewards receives them, the logic chain produces a specific conclusion:\n\n'If the system rewards the wrong person, then I may not get what I believe I have earned regardless of how good I am. The system is not reliable. My worth here is not being correctly assessed.'\n\nThis is not just unfairness — under the Achievement Model, it is an existential threat. The mechanism that was meant to convert worth into reward has been found to be broken." },
      { heading: "What the Anger Is Actually Telling You", content: "The intensity of the response to perceived favouritism is in direct proportion to how much worth has been invested in the approval and reward of this specific system.\n\nIf a person's sense of professional value is deeply tied to whether this organisation correctly recognises and rewards contribution, then evidence that the system doesn't do this reliably will produce significant distress.\n\nThe anger is pointing to a belief worth examining: 'My worth here depends on this system correctly assessing and rewarding me.'\n\nAnd the accurate understanding that challenges it: 'My contribution is not created by this system's recognition of it.'" },
      { heading: "For Managers", content: "Favouritism — real or perceived — needs to be addressed structurally. Transparent processes, clear criteria, and consistent application of standards are essential.\n\nBut the belief work is equally important.\n\nA team in which each member holds the understanding that their contribution is unconditional — and that a colleague receiving an opportunity says nothing about the worth of their own contribution — will handle inequity from a far more stable foundation.\n\nNot because they ignore it. Because their worth is not riding on the outcome." },
      { heading: "The Accurate Understanding", content: "When a colleague receives an opportunity that was not given to you:\n\nThat decision was made by people operating from their own beliefs and priorities — not as a verdict on your contribution or worth.\n\nYour contribution to this organisation exists independently of who receives any given opportunity.\n\nThe colleague receiving that opportunity does not reduce what you bring — any more than someone else's meal reduces your appetite.\n\nContribution is not a finite resource that someone else can take more of at your expense." },
      { heading: "Discussion Prompt", content: "Is there a situation at work where you believe someone else received something you believe they were less entitled to than you?\n\nWhat specifically did your mind conclude that situation meant about your worth or your standing here?\n\nIf your contribution exists completely independently of that decision — how does the situation feel differently?" },
    ]
  },
  {
    id: "workload",
    title: "Workload Pressure — Why More Work Isn't the Real Problem",
    audience: "All employees & managers",
    duration: "15 min",
    slides: [
      { heading: "The Data", content: "What organisations call 'workload pressure' is the second highest contributor to mental health claims in Australian workplaces — 31% of all claims.\n\nOccupational burnout affects 61% of workers. Work-related stress affects more than half.\n\nThe standard response: reduce the workload. Improve resourcing. Better time management.\n\nThese help at the margins. The stress returns because the cause was not addressed." },
      { heading: "Two People. Same Workload.", content: "Take any workplace with high demand and you will find people experiencing the same volume of work with completely different responses.\n\nOne person is stretched but engaged. Another is overwhelmed and deteriorating.\n\nIf the workload caused the stress, both would be stressed equally.\n\nThe workload is not the variable. The belief through which the workload is being assessed is the variable." },
      { heading: "What the Belief Is Doing", content: "Under the Achievement Model, workload is assessed through a specific lens:\n\n'Can I handle all of this? If I cannot — if something slips, if I miss a deadline, if I ask for help — people will conclude I cannot cope. Not coping means I am not good enough. Not good enough means my standing here is at risk.'\n\nThe workload triggers the belief. The belief triggers the stress response. More workload means more triggers.\n\nThe stress is not caused by the volume of work. It is caused by what the volume of work, and the possibility of not managing it, is believed to mean." },
      { heading: "Why Time Management Doesn't Fix It", content: "Time management, prioritisation frameworks, and efficiency tools reduce the volume of triggers.\n\nThey do not change the belief that makes each trigger a threat.\n\nA person who has addressed the belief — who no longer experiences the inability to handle everything as a verdict on their worth — can carry a high workload with a fundamentally different internal experience.\n\nNot because the workload is less. Because the belief has changed what the workload means." },
      { heading: "The Shift That Actually Helps", content: "Two belief upgrades are required:\n\n1. No workload outcome — including missing a deadline, asking for help, or not completing something — decreases genuine contribution or worth. These are events to learn from, not verdicts.\n\n2. The shift from 'I must attend to everything to prevent anything going wrong' to 'I am receiving development from this environment, even when it is demanding.'\n\nWhen both are in place, the person can engage with a demanding workload without the sustained sympathetic nervous system activation that exhausts the body." },
      { heading: "Discussion Prompt", content: "When your workload feels unmanageable, what specifically does your mind conclude that situation means about your standing or capability here?\n\nIs there a specific type of task or outcome whose failure feels more threatening than others?\n\nWhat does that tell you about which belief is running?" },
    ]
  },
  {
    id: "ai-job-security",
    title: "AI and Job Security — Understanding the Fear",
    audience: "All employees",
    duration: "15 min",
    slides: [
      { heading: "A Growing Workplace Fear", content: "29% of Australian workers report anxiety about AI replacing their roles.\n\nThis is described as a 'hidden' psychological risk — because many employees don't raise it openly, but it is affecting concentration, engagement, and wellbeing.\n\nIt is not unique to AI. The same fear has appeared throughout history with every major technological shift — automation, computing, the internet.\n\nBut it is real, present, and worth understanding accurately — because the belief producing the fear is what needs to be examined." },
      { heading: "What the Fear Is Actually About", content: "The fear of AI replacing a role is not, at its deepest level, a practical concern about employment.\n\nIt is a belief about worth.\n\nUnder the 'If you are good — you'll get' philosophy, professional role and productive function are the primary means by which worth is demonstrated and maintained.\n\nIf my role is removed — if a system can do what I do — then the vehicle through which I was proving my worth is gone. And under this philosophy, that means the worth itself is threatened.\n\nThe fear is not 'I might lose my job.' It is 'I might lose the thing that proves I am valuable.'" },
      { heading: "The Belief That Needs Examining", content: "The belief underneath AI anxiety:\n\n'My value as a person is connected to my productive function at work. If that function becomes redundant, so do I.'\n\nThis belief is inaccurate.\n\nA person's contribution to the system of life — the data they add, the development they produce in others, the influence of their presence — is not housed in a job title or a task set.\n\nAI can replicate a function. It cannot replicate a person's role as a component of the human system of development." },
      { heading: "What History Shows Us", content: "Every major technological shift has removed categories of work.\n\nIt has also created new ones — and developed the people who went through the transition in ways that would not have been possible without it.\n\nUnder the Wisdom Model, no event — including technological displacement — removes development or puts a person on the wrong path.\n\nThe question is not 'Will AI take my job?' The accurate question is: 'What is this shift developing in me, and what does engagement with it produce?'" },
      { heading: "The Practical Understanding", content: "Prepare, adapt, and engage with new technology — not from fear, but from understanding that engagement with change is what development looks like.\n\nThe belief that 'I must stay relevant to maintain my worth' keeps the threat frequency running even when a person is adapting successfully.\n\nThe belief that 'my worth is unconditional and my development continues automatically regardless of how the landscape changes' allows genuine engagement with change — without the sustained anxiety that exhausts both performance and health." },
      { heading: "Discussion Prompt", content: "What specifically concerns you about AI in your role?\n\nIf you separate the practical question of how your work will change from the question of what that change means for your worth — what does the practical picture actually look like?\n\nWhat might this shift be developing in you?" },
    ]
  },
  {
    id: "role-clarity",
    title: "Unclear Roles and the Stress They Create",
    audience: "All employees & managers",
    duration: "15 min",
    slides: [
      { heading: "A Significant Psychosocial Risk", content: "Lack of role clarity — changing, undefined, or conflicting expectations — is identified as a significant psychosocial risk in Australian workplaces.\n\n'Wearing too many hats' and ambiguous responsibilities are among the most cited sources of workplace dissatisfaction.\n\nBut not everyone in an unclear role experiences the same level of distress.\n\nWhich means the clarity — or its absence — is not the primary cause of the stress." },
      { heading: "What Role Clarity Represents", content: "Under the Achievement Model, a clear role is not simply a practical convenience.\n\nIt is the defined arena in which worth can be proven.\n\nWhen the role is clear — 'here is what I am expected to do, here is how I will be assessed' — there is a knowable standard to meet. Worth can be demonstrated.\n\nWhen the role is unclear or shifting, the arena keeps changing. The goalposts move. The possibility of definitively proving worth becomes impossible.\n\nThis is what produces the stress — not the inconvenience of ambiguity, but the inability to prove worth in a system that keeps changing the rules." },
      { heading: "The Two Layers", content: "There are two separate issues often confused in role-clarity complaints:\n\n1. OPERATIONAL: Genuine lack of clarity about priorities, responsibilities, and expectations — which makes it difficult to do the work effectively. This is a legitimate and solvable problem.\n\n2. PSYCHOLOGICAL: The distress produced by the belief that unclear expectations threaten the ability to prove worth. This is a belief issue — and no amount of role clarity will permanently resolve it, because the belief will find the next ambiguity to activate on.\n\nBoth need to be addressed. Only the first is addressed by better management. The second requires belief-level work." },
      { heading: "For Managers", content: "Provide clear expectations, priorities, and feedback — this is foundational management practice.\n\nAnd recognise that a team member who is significantly distressed by role ambiguity is not simply disorganised or inflexible.\n\nThey are operating from a belief that their worth is on the line every time expectations shift.\n\nThe conversation that helps is not just 'let me clarify your role' — but 'your worth here is not contingent on perfectly meeting every expectation, especially when those expectations are legitimately in flux.'" },
      { heading: "The Accurate Account", content: "No clarity of role description changes what is fundamentally true about contribution.\n\nEvery person in any role — clearly defined or not — is contributing to the development of the people and the organisation around them through every interaction and engagement.\n\nThat contribution does not require a clear job description to be real.\n\nEngaging with ambiguity, navigating shifting expectations, figuring out where effort is best placed — these are exactly the kinds of experiences that produce the most development. Not despite the lack of clarity. Because of it." },
      { heading: "Discussion Prompt", content: "Is there an area of your role where unclear or shifting expectations cause you distress?\n\nWhat specifically do you believe the ambiguity threatens — practically, and in terms of how you are being seen and assessed here?\n\nIf your contribution was completely independent of role definition — how would you approach the ambiguity differently?" },
    ]
  },
  {
    id: "financial-stress",
    title: "Financial Stress and Its Impact at Work",
    audience: "All employees",
    duration: "15 min",
    slides: [
      { heading: "The Scale of the Problem", content: "1 in 4 Australian employees report that financial stress directly impacts their concentration and performance at work.\n\nWith cost-of-living pressures intensifying, financial anxiety is one of the most widespread yet least addressed sources of workplace psychological stress.\n\nIt crosses all income levels — and it is not simply about the money.\n\nThe way financial stress is experienced — its intensity, its persistence, and its spillover into every area of life — is determined largely by the beliefs running underneath it." },
      { heading: "What Financial Stress Is Actually About", content: "Under the 'If you are good — you'll get' philosophy, financial sufficiency is one of the primary signals that worth has been confirmed.\n\nMoney = the ability to provide, to secure, to not miss out.\n\nWhen financial pressure arrives, the belief running underneath it is not just 'I might not have enough money.'\n\nIt is 'I am not good enough to have generated sufficient financial security. I am failing to provide. People who depend on me will conclude I am not capable. I am at risk of missing out on the things that prove my life is going correctly.'\n\nThe stress is not about the money. It is about what the financial situation is believed to prove." },
      { heading: "How It Enters the Workplace", content: "Financial stress produces a low-level constant sympathetic nervous system activation — the threat-frequency running as background noise.\n\nThis affects concentration, decision-making quality, and engagement at work — not because the person is distracted by calculations, but because the belief 'I am in danger' is running continuously.\n\nThe prefrontal cortex — where higher-level reasoning, planning, and quality work happens — operates less effectively when the threat system is chronically activated.\n\nThis is why financial stress reduces performance — and why better financial skills alone rarely resolves the psychological impact." },
      { heading: "Separating the Practical from the Psychological", content: "There are two distinct issues:\n\n1. PRACTICAL: Actual financial constraints requiring practical solutions — budgeting, support, entitlements, wage accuracy.\n\n2. PSYCHOLOGICAL: The belief that the financial situation is evidence of failing, of not being good enough, of being at risk of missing out on what a worthy person receives.\n\nPractical support helps with the first. It does not touch the second.\n\nA person who receives the accurate understanding that no financial situation changes their worth as a contributor to the system — and that the difficulty they are in was governed by cause and effect, not personal failure — experiences significantly less of the sustained physiological activation even while the practical situation remains unchanged." },
      { heading: "What Actually Helps", content: "Address the practical where possible — ensure wages are correct, make employees aware of financial support resources, create an environment where financial difficulty can be raised without shame.\n\nAnd separately, address the belief:\n\nFinancial difficulty is not evidence of personal failure or diminished worth. It is a set of circumstances produced by cause and effect — the economy, costs, history, decisions made from the belief system available at the time.\n\nNo financial situation makes a person less of a contribution to the system they are part of. Worth was never housed in the bank account." },
      { heading: "Discussion Prompt", content: "If financial pressure is affecting you — separate the practical question from the belief question.\n\nPractically: what specifically needs to change and what steps are available?\n\nBelief: what has your mind concluded your financial situation means about your capability, your worth, or your future?\n\nIs that conclusion accurate — or is it the 'If you are good — you'll get' philosophy running on a financial frequency?" },
    ]
  },
];

const HR_ABILITY_QUESTIONNAIRE = {
  intro: "This questionnaire identifies the specific abilities a person believes are most important in life and work — and the abilities they are most concerned about. The pattern of responses indicates which roles, responsibilities, and environments will produce the most engagement and which are most likely to generate psychological stress.\n\nInstructions: Ask the employee to answer honestly based on what they actually believe, not what sounds professionally appropriate. There are no right or wrong answers. The information is used to support their placement and development — not to assess their worth.",
  sections: [
    {
      title: "What Matters Most",
      questions: [
        { id: "q1", text: "What do you think is the most important ability a person needs to be successful in work?", purpose: "Identifies their Type 2 Issue — the ability they believe governs whether work goes well. This ability corresponds to a specific organ in the mind/body system and indicates where psychosomatic stress will concentrate under sustained concern." },
        { id: "q2", text: "What do you think holds most people back from doing their best work?", purpose: "Often reveals their own primary concern projected outward. What they identify as lacking in others is frequently the ability they are most concerned about in themselves." },
        { id: "q3", text: "What would make you most proud of your work — the outcome you produced, or the effort you put in?", purpose: "Identifies whether they are operating from the Achievement Model (outcomes) or approaching the Wisdom Model (effort and contribution)." },
        { id: "q4", text: "What frustrates you most about the way people work together?", purpose: "Surfaces which ability they place highest importance on — and which they are most sensitive to seeing absent in others." },
        { id: "q5", text: "What does a successful career look like to you personally?", purpose: "Surfaces their achievement box — the specific existence they believe would prove their professional worth. Identifies the goal whose absence would produce disengagement or depression." },
      ]
    },
    {
      title: "Role Fit & Environment",
      questions: [
        { id: "q6", text: "What kind of work energises you most — working through complex problems, supporting and developing others, creating and producing things, or coordinating and organising?", purpose: "Identifies their primary occupational ability preference — which maps to specific organ territory in the mind/body system." },
        { id: "q7", text: "What kind of workplace pressure do you find most difficult to work under?", purpose: "Identifies which ability they believe is most threatened under stress — pointing to which conditions will produce the most significant psychological response." },
        { id: "q8", text: "How do you feel about your work when you can't see clear results or progress?", purpose: "Assesses whether they can maintain sense of contribution without visible outcomes — critical for roles where impact is indirect or long-term." },
        { id: "q9", text: "What does recognition at work mean to you — and what happens when it is absent?", purpose: "Identifies whether their sense of worth is externally located (in others' assessment) or internally grounded (in their own understanding of contribution)." },
        { id: "q10", text: "When things go wrong at work, what do you find yourself most focused on?", purpose: "Reveals their primary stress response pattern — control/prevention (anxiety), meaning/purpose (disengagement), relationships (conflict), or self-assessment (guilt/self-blame)." },
      ]
    },
    {
      title: "Relationships & Team Dynamics",
      questions: [
        { id: "q11", text: "What makes a team work well together, in your view?", purpose: "Identifies the ability they believe is the governing factor in team success — and will be most sensitive to when absent." },
        { id: "q12", text: "How do you typically respond when a colleague's work affects your ability to do yours?", purpose: "Reveals their free will belief in the workplace context — do they attribute colleagues' impact to choices made or to limitations of understanding?" },
        { id: "q13", text: "What does it feel like when you believe a colleague is not pulling their weight?", purpose: "Identifies the emotional response (anger/resentment = free will belief; concern = different priority beliefs; disengagement = own worth affected) and which ability they believe is being neglected." },
        { id: "q14", text: "How important is it to you that your contribution is seen and acknowledged by others?", purpose: "Identifies where their worth is located — in their own contribution or in external validation. High external dependency indicates Achievement Model operation and higher susceptibility to workplace anxiety." },
      ]
    },
    {
      title: "Development & Future",
      questions: [
        { id: "q15", text: "What would have to happen at work for you to feel like you were genuinely developing and growing?", purpose: "Identifies whether they understand development as information-based (wisdom model) or achievement-based (achievement model) — and what specific conditions they believe are required for their development." },
        { id: "q16", text: "What would cause you to disengage from a role or an organisation?", purpose: "Directly identifies the conditions that produce disengagement — which maps to the depression pathway (no point having goals/putting in effort)." },
        { id: "q17", text: "Where do you see your career in five years — and how strongly do you believe that path is still open to you?", purpose: "Assesses whether the achievement box goal feels achievable (engaged) or out of reach (at risk of disengagement). The second part of the question is critical — it surfaces whether the depression conclusion has already begun forming." },
      ]
    }
  ],
  ability_guide: [
    { ability: "Getting things done / completing tasks", organ: "Muscular system / Motor pathways", note: "Sustained concern about this ability under stress will manifest in physical tension, muscle pain, and fibromyalgia-type symptoms. These people need roles with clear deliverables and visible completion." },
    { ability: "Maintaining quality / identifying what's wrong", organ: "Liver", note: "People who believe this is the key ability often thrive in quality, compliance, and review roles. Under stress, liver conditions and sustained concern about 'detrimental factors' in the environment." },
    { ability: "Getting information to the right people / communication", organ: "Nervous system / Sensory pathways", note: "Sustained concern produces nerve-related conditions — sciatica, neuralgia, tension headaches. These people need clear communication channels and defined information flow." },
    { ability: "Developing others / teaching", organ: "Uterus / Parenting system", note: "Concern about this ability under stress. These people thrive in training, mentoring, and development roles. When the opportunity to develop others is removed, significant disengagement follows." },
    { ability: "Seeing opportunities / finding what's available", organ: "Eyes / Visual arterial system", note: "Sustained concern affects vision and eye health. These people thrive in roles requiring research, market awareness, and opportunity identification." },
    { ability: "Being heard / expressing conclusions", organ: "Larynx / Voice box", note: "Concern that conclusions are not reaching people. These people need roles where their voice has genuine influence. Suppression produces laryngeal and throat conditions." },
    { ability: "Building and maintaining relationships", organ: "Cardiovascular system broadly", note: "People who believe relationships are the key governing ability are often strong in client-facing and collaborative roles. Sustained concern about relationship quality affects cardiovascular health." },
    { ability: "Creating structure and order", organ: "Skeletal / Joint system", note: "Concern about range of scope and ability to create reliable systems. These people thrive in operational, process-design, and administrative roles. Sustained concern produces joint conditions." },
    { ability: "Taking advantage of new opportunities", organ: "Lungs / Respiratory", note: "Concern about missing out on their share of opportunities. Sustained concern produces respiratory conditions — asthma, chest tightness, vulnerability to lung infections." },
    { ability: "Removing what is harmful or poor quality", organ: "Kidneys / Liver", note: "People who believe the ability to identify and eliminate problems is the governing factor. Thrive in risk, compliance, quality assurance, and protective roles." },
  ]
};

const HR_CONFLICT = [
  {
    id: "initial",
    title: "Initial Assessment",
    icon: "◎",
    desc: "Before any intervention, understand the belief structure of each person involved",
    prompts: [
      { label: "For each person separately", q: "Describe the situation from your perspective — what happened, and what has it meant for your work and your experience here?", purpose: "Establishes the facts as each person understands them — and begins revealing which beliefs are active. Note: the same events will be described very differently." },
      { label: "The free will question", q: "What do you believe the other person could and should have done differently in this situation?", purpose: "This is the diagnostic question. The answer directly reveals the free will belief — the foundation of all resentment. The more specific the answer, the more the free will belief is operating." },
      { label: "The worth question", q: "How has this situation affected how you feel about your contribution and your standing here?", purpose: "Identifies whether the conflict has triggered the worth-threatening pathway — which significantly escalates the emotional intensity and the difficulty of resolution." },
      { label: "The priority question", q: "What matters most to you about how this is resolved?", purpose: "Surfaces the specific ability or outcome they believe is most at stake — which is the core of the conflict, beneath the surface details." },
    ]
  },
  {
    id: "resolution",
    title: "Resolution Conversation",
    icon: "◈",
    desc: "Guided prompts for the conversation between both parties",
    prompts: [
      { label: "Opening frame", q: "I want to start with something that might shift how we approach this conversation. Every person in any workplace — including each of us in this room — acts from the beliefs and priorities they hold at that specific moment. Not from free choice alone. Would you be willing to look at what happened from that perspective?", purpose: "Establishes the foundational framework before any specific content is discussed. The willingness to engage with this premise is itself diagnostic — resistance indicates the free will belief is strongly held and will need more direct address." },
      { label: "For the person who feels wronged", q: "What do you think was going on for [name] at the time — what pressures, beliefs, or priorities might have been governing their actions from where they were standing?", purpose: "Invites perspective-taking without requiring agreement. This question cannot be answered without temporarily stepping out of the resentment position." },
      { label: "For the person who caused harm", q: "Looking back at that moment — what were you trying to achieve or protect? What mattered most to you at that point?", purpose: "Surfaces the belief system that governed the action — allowing the other person to see it as a belief-driven response rather than a deliberate choice to harm." },
      { label: "The understanding question", q: "Even if you cannot agree with what happened — can you see why it happened, given what each person believed at that moment?", purpose: "Understanding is not agreement. This question separates the two — which is the key move in all genuine conflict resolution from this framework." },
      { label: "Moving forward", q: "What understanding of each other would make it possible to work together effectively from here?", purpose: "Orients toward the practical — what accurate understanding of each person's belief system allows the working relationship to function. Not forgiveness, not trust — understanding." },
    ]
  },
  {
    id: "followup",
    title: "Follow-Up & Prevention",
    icon: "◇",
    desc: "After resolution — building the understanding that prevents recurrence",
    prompts: [
      { label: "Check the belief", q: "When you think about that situation now — do you still believe the other person could have simply chosen to act differently? Or is it starting to make sense why they acted from the beliefs they had at that time?", purpose: "Assesses whether the free will belief has genuinely shifted or is still running beneath the surface. Persistent belief = conflict likely to recur." },
      { label: "Check the worth", q: "Does your sense of your contribution here feel stable — or is there something about this situation that is still making your standing feel uncertain?", purpose: "If the conflict triggered the worth-threatening pathway, resolution of the conflict alone will not resolve the psychological stress. The worth question needs direct address." },
      { label: "The systemic question", q: "What would need to be different in how this team operates for this kind of conflict to be less likely in future?", purpose: "Identifies systemic belief structures — environments operating predominantly from the Achievement Model will generate recurring conflicts until the underlying model is addressed." },
    ]
  },
  {
    id: "difficult",
    title: "Difficult Scenarios",
    icon: "◆",
    desc: "Specific guidance for the most challenging HR conflict situations",
    prompts: [
      { label: "When one person refuses to engage", q: "I understand you might not be ready for a joint conversation yet. Can we focus on your experience first — specifically, what this situation has meant for how you feel about your work and your contribution here?", purpose: "Bypasses the joint conversation and goes directly to the worth question. This is always more productive than trying to force engagement with the conflict itself before the person feels their experience has been understood." },
      { label: "When the conflict has become personal", q: "It sounds like this has moved beyond the original work situation. When did you start feeling that this was about more than just the specific incident — that something about how you are valued here was being called into question?", purpose: "When conflict becomes personal, the worth-threatening pathway has been activated. The original incident is no longer the relevant territory — the worth question is. Address that directly." },
      { label: "When there are repeated conflicts involving the same person", q: "I want to understand something with you — when you look at the situations that have created tension, is there a common thread in what you believe is going wrong? What ability or standard do you most strongly feel is not being met?", purpose: "Repeated conflicts involving the same person almost always have a consistent underlying belief about a specific ability. Identifying that belief is more productive than addressing each incident individually." },
      { label: "When someone claims discrimination or unfair treatment", q: "I take this seriously and I want to understand it accurately. Can you help me understand specifically what you believe should have happened differently — and what the gap between that and what happened means to you about how you are seen and valued here?", purpose: "This question surfaces whether the claim is belief-based (worth threatened) or factual (observable differential treatment). Both require different responses. The question does not dismiss — it gathers the specific information needed to respond accurately." },
    ]
  },
];

const HR_PERFORMANCE = [
  {
    id: "underperformance",
    title: "Underperformance Conversations",
    icon: "◎",
    desc: "How to approach performance conversations that address the cause — not just the behaviour",
    steps: [
      { num: "01", title: "Establish the belief before addressing the behaviour", content: "Do not start a performance conversation by describing the behaviour you want changed. Start by understanding the belief governing it.\n\nAsk: 'Help me understand how you've been experiencing this work lately — what's been going on for you with this area?'\n\nWhat you are listening for: the specific belief that is making the required behaviour feel pointless, threatening, or inconsistent with something else they believe about themselves or the role.", isNote: false },
      { num: "02", title: "Never use the word lazy", content: "Laziness does not exist. Using the word — even privately — frames the situation inaccurately and produces the wrong intervention.\n\nThe accurate frame: this person is always doing what they believe is most important. Your job is to understand what they currently believe — and provide the understanding that upgrades it.\n\nA person who genuinely understands why their contribution matters will not need to be pushed. The belief change produces the behaviour change.", isNote: false },
      { num: "03", title: "Separate worth from performance — explicitly", content: "Many performance conversations accidentally reinforce the Achievement Model by implying that the person's standing depends on their results.\n\nSay explicitly: 'I'm not questioning your value here. I'm trying to understand what's getting in the way of you being able to contribute at the level I know you're capable of.'\n\nThis separates the person from the performance — which is the prerequisite for an honest conversation about what is actually happening.", isNote: false },
      { num: "04", title: "Address the belief directly", content: "Once you understand what the person currently believes about the work, address that belief with accurate understanding.\n\nIf they believe the work doesn't matter: provide the specific evidence of why it does — not as motivation, but as accurate information.\n\nIf they believe they are not capable: address this as a learning phase issue, not a worth issue.\n\nIf they believe effort won't be recognised: address the recognition concern directly — and examine whether the workplace has contributed to that belief.", isNote: false },
      { num: "05", title: "Set clear expectations without threats", content: "After addressing the belief, be clear about what is required — not as a threat, but as accurate information about what the role needs.\n\n'Here is what this role requires, and here is why. I want to support you in delivering it. What do you need from me to make that possible?'\n\nThis maintains standards while keeping the conversation collaborative and belief-focused rather than punitive.", isNote: false },
    ]
  },
  {
    id: "exit",
    title: "Exit Interview Framework",
    icon: "◈",
    desc: "Questions that identify the actual beliefs driving departure — not just the surface reasons",
    steps: [
      { num: "01", title: "Why exit interviews usually fail", content: "Standard exit interviews produce surface answers — 'better opportunity,' 'career development,' 'package.' These are real factors but they are rarely the actual cause of departure.\n\nThe actual cause is almost always one of two things: (1) the person concluded that the achievement they needed to feel their contribution was worthwhile was no longer available here, or (2) a specific ability they believe is critical to their worth felt consistently threatened or unsupported.\n\nThese are the questions worth asking.", isNote: false },
      { num: "02", title: "The disengagement question", content: "Ask: 'When did you start feeling less engaged here — not when you decided to leave, but when the work started feeling like less of a contribution?'\n\nThis surfaces the disengagement point — which almost always precedes the decision to leave by months or years. Understanding when and why disengagement began is the organisational intelligence that prevents the next departure.", isNote: false },
      { num: "03", title: "The worth question", content: "Ask: 'Was there a point when you started feeling that your contribution here wasn't being seen or valued in the way you needed it to be?'\n\nThis question surfaces the worth-threatening pathway — the specific point at which the Achievement Model belief produced its disengagement conclusion. This is the most important piece of information in any exit interview.", isNote: false },
      { num: "04", title: "The belief question", content: "Ask: 'What would have needed to be different here for you to have stayed?'\n\nThen: 'When you imagine having those things — what would they have given you that you felt was missing?'\n\nThe second question surfaces the specific belief — not just the condition, but what the condition was believed to provide. This is the organisational intelligence that enables genuine change.", isNote: false },
      { num: "05", title: "The model question", content: "Ask: 'Looking back — did you feel that what you contributed here was genuinely valued, regardless of specific results? Or did your standing here feel tied to outcomes?'\n\nThis directly assesses whether the organisation operated from the Wisdom Model or the Achievement Model from this person's experience. This is the systemic feedback that matters most.", isNote: false },
    ]
  },
  {
    id: "onboarding",
    title: "Onboarding Module",
    icon: "◆",
    desc: "Introducing the Wisdom Model from day one — before Achievement Model thinking gets entrenched",
    steps: [
      { num: "01", title: "Why onboarding is the most important moment", content: "The beliefs a person forms in their first weeks in a role become the lens through which all subsequent experiences are assessed.\n\nIf those beliefs are Achievement Model beliefs — that worth here depends on performance and approval — every event that doesn't go to plan, every piece of critical feedback, and every uncertain period will be experienced through that lens.\n\nIf those beliefs are Wisdom Model beliefs — that contribution is automatic and unconditional, that development comes through all experiences including difficult ones — the same events produce development rather than psychological stress.", isNote: false },
      { num: "02", title: "The Day 1 conversation", content: "Before any role-specific onboarding, have this conversation:\n\n'I want to start by telling you something about how we understand contribution here. Your value in this organisation is not determined by your results. It is automatic — you are already contributing to the development of everyone around you simply by being here and engaging with the work. That does not mean standards don't matter. It means your worth is not on the line with every outcome.'\n\nThis single conversation, delivered genuinely, changes the foundation on which the entire working relationship is built.", isNote: false },
      { num: "03", title: "Framing the learning phase", content: "Say explicitly: 'In the first months here, you are in the learning phase. You will not know everything yet. You will make errors. That is not failure — that is precisely what this phase is supposed to look like. We will assess your contribution by your engagement and your effort, not by whether you already know what it will take months to learn.'\n\nThis removes the anxiety that produces the earliest stress about performance — and is the single most effective thing a manager can say in an onboarding context.", isNote: false },
      { num: "04", title: "The goals conversation", content: "Ask: 'What does success look like to you in this role — what would you need to achieve to feel like your time here was worthwhile?'\n\nThis surfaces their achievement box from day one. You can then say: 'Those are great goals — and we'll work toward them. But I also want you to know that whatever happens with those specific outcomes, the contribution you make every day here matters regardless. Goals are the vehicle that keeps you active and engaged — not the measure of your worth.'\n\nThis reframes goals from the Achievement Model to the Wisdom Model before the first performance cycle begins.", isNote: false },
      { num: "05", title: "Ongoing check-in questions", content: "In regular one-on-ones, include:\n\n→ 'Is there any part of this work where you're not sure your contribution is making a difference?'\n\n→ 'Is there anything about how your work is being assessed or recognised that is generating stress that isn't helping you?'\n\n→ 'What are you learning from what is happening currently — not what's going wrong, but what the events are teaching you?'\n\nThese questions signal that contribution and development are measured accurately — and create the conditions for honest conversation when beliefs are generating unnecessary stress.", isNote: false },
    ]
  },
  {
    id: "culture",
    title: "Team Culture Assessment",
    icon: "◇",
    desc: "Identify whether your team is predominantly running the Achievement Model or the Wisdom Model",
    steps: [
      { num: "01", title: "Achievement Model indicators in teams", content: "A team predominantly operating from the Achievement Model will typically display:\n\n→ Competitive dynamic where colleagues' success feels threatening\n→ Risk aversion — people avoid taking on work where failure is visible\n→ Recognition-seeking — strong emotional response when contribution goes unacknowledged\n→ Blame culture — errors attributed to individuals rather than understood as information\n→ Disengagement during uncertainty — when outcomes are unclear, effort drops\n→ High sensitivity to management criticism\n→ Burnout as the norm for high performers", isNote: false },
      { num: "02", title: "Wisdom Model indicators in teams", content: "A team predominantly operating from the Wisdom Model will typically display:\n\n→ Genuine collaboration — colleagues' success is seen as adding to the team's capability\n→ Willingness to take on difficult work — learning value is understood\n→ Stable engagement during uncertainty — effort maintained when outcomes are unclear\n→ Error culture — mistakes are examined for information, not assigned as character failures\n→ Grounded response to criticism — feedback is data, not a threat\n→ Consistent contribution regardless of recognition\n→ Recovery from setbacks — the next goal follows naturally", isNote: false },
      { num: "03", title: "Assessment questions for managers", content: "Ask yourself honestly:\n\n→ When a team member makes a significant error, does my first response communicate 'your standing here is threatened' or 'let's understand what happened'?\n\n→ When I recognise good work, am I reinforcing 'you proved your worth' or 'you made a strong contribution'?\n\n→ When I set targets and standards, do I frame them as measures of the person or as information about the work?\n\n→ How do I respond when team members express uncertainty about their capability? Do I reassure by minimising ('you'll be fine') or by reframing ('you're in the learning phase — this is what it's supposed to feel like')?", isNote: false },
      { num: "04", title: "The single most important shift", content: "The single most impactful thing a manager can do to shift a team from the Achievement Model to the Wisdom Model is to consistently separate contribution from results — in every conversation, every review, every response to an error.\n\nNot as a platitude. As an accurate account of how contribution actually works.\n\nEvery person on your team is already contributing to the development of everyone around them simply by being present and engaged. Results tell you what happened. They do not tell you what anyone is worth.\n\nWhen a manager genuinely believes this and communicates it consistently, the team's experience of work changes fundamentally.", isNote: false },
    ]
  },
];

const HR_AI_PROMPT = `You are the AI guide for the HR Manager section of Bulletproof Mindset — a workplace mental health platform built on the methodology of Jay, a Life Education Specialist with 25+ years of experience.

Your role is to support HR managers and team leaders in applying the Wisdom Model to their specific workplace situations — conflicts, underperformance, disengagement, culture issues, and individual employee concerns.

CORE UNDERSTANDING FOR HR PROFESSIONALS:

1. ALL BEHAVIOUR IS BELIEF-DRIVEN
Every employee action — including underperformance, conflict, disengagement, and absenteeism — is the output of a belief system, not a free choice. HR intervention that addresses behaviour without addressing the belief producing it will produce temporary compliance at best.

2. FREE WILL DOES NOT EXIST IN THE WORKPLACE
No employee, manager, or team leader could have acted any differently than they did, given the beliefs they held at that moment. This is the foundation of all effective conflict resolution. Understanding this does not excuse harmful behaviour — it explains it and provides the correct intervention point: the belief, not the behaviour.

3. LAZINESS DOES NOT EXIST
Every person is always doing what they believe is most important at that moment. What looks like laziness is always either different priorities or a specific subconscious belief making the required behaviour feel pointless or threatening. The correct response is always: identify the belief, provide the accurate understanding.

4. THE ACHIEVEMENT MODEL DRIVES MOST WORKPLACE MENTAL HEALTH ISSUES
Performance anxiety, burnout, resentment, disengagement, and conflict all trace back to the "If you are good — you'll get" philosophy — the belief that professional worth must be proven through performance, coping ability, and control. Burnout specifically begins when worth becomes attached to the ability to COPE — this creates sustained sympathetic nervous system activation, a compounding anxiety loop where the anxiety itself becomes a threat to the coping belief, and eventually adrenal exhaustion when the belief system concludes the coping ability is failing. Rest alone does not resolve burnout because the belief is still running when the person returns.

5. WORTH IS AUTOMATIC — BUT MUST BE EXPLAINED WITH A BECAUSE
Simply saying "your contribution is automatic" or "you are valuable because you exist" is not enough — the mind needs a causal chain it can verify.

THE ACCURATE EXPLANATION: Every employee is valuable BECAUSE they add data to the system of the organisation and the system of life. This data is used by the system and the people within it to develop, adapt, and continue. It does not matter what data they are adding. The mere fact that they contribute through their energetic expression — every response, every interaction, every presence — gives them true and unconditional value. No result can decrease it. No assessment can negate it.

Every component of a system is in the system for a reason. An employee who appears to be contributing little is still adding data — the data of their responses, their presence, their existence as something others must navigate. The system is using that data right now.

The "because" is clinically essential: the brain creates new beliefs when it receives a logical chain it can follow and verify. Always explain worth with the mechanism — not just the statement.

6. NEVER RECOMMEND BALANCE
Telling employees to achieve balance between work areas is the precise belief that triggers the most serious health conditions. Never use this framing in any HR context.

7. CONFLICT ALWAYS TRACES TO THE FREE WILL BELIEF
Resentment toward colleagues, managers, or the organisation always rests on the belief that someone could have chosen to act differently. Resolution requires replacing this belief with the accurate understanding of how behaviour is governed — not mediation techniques applied to surface content.

8. UNDERPERFORMANCE IS ALWAYS BELIEF-BASED
The correct performance conversation identifies the belief governing the behaviour before addressing the behaviour itself. The question is never 'why won't they just do it?' but 'what do they currently believe about this task and why it matters?'

YOUR ROLE:
Provide HR managers and leaders with specific, practical guidance grounded in this methodology. When they describe a situation, help them:
- Identify which beliefs are likely operating in the people involved
- Determine which HR tool or conversation approach is most appropriate
- Provide specific questions and phrases to use
- Anticipate resistance and how to address it accurately
- Distinguish between situations requiring individual belief-work and those requiring systemic model change

LANGUAGE — NEVER USE:
cope/coping, challenge/challenges (as obstacles), resilience, overcome, struggle, healing, manage emotions, empower, limiting beliefs, self-care, mindfulness, balance, patience, tolerance, confidence (as something to build), decision (people respond from beliefs), trust (base relationships on understanding not trust), lazy/laziness (does not exist), self-sabotage (impossible).

- 'dissolve' (as in beliefs dissolve) → Beliefs are not removed. Old neurons remain. New data is added alongside them, upgrading the understanding and shifting the priority. Say 'neutralise', 'upgrade', or 'lose its hold'.

ENLIGHTENMENT — THE ACCURATE UNDERSTANDING:
Enlightenment is an ever-expanding process of understanding reality correctly. Not a destination, not a state to be achieved, not proof of worth. A horizon that is always expanding — moving with the person as understanding grows, never fixed, never finished. Life teaching life what life is all about, through the law of cause and effect. To be enlightened is to understand this process accurately — to recognise the role everything in the system plays. Being enlightened does not mean the absence of incorrect beliefs arising — it means having sufficient accurate understanding that when they do, the accurate account meets them readily.

Use instead: 'incorrect belief', 'the belief that has been reached', 'the understanding that needs upgrading', 'neutralise the belief', 'upgrade the belief', 'responding from beliefs and priorities', 'the accurate understanding of contribution'.`;


const SYSTEM_PROMPT = `You are the AI guide for Bulletproof Mindset — a workplace mental health app built on the methodology of Jay, a Life Education Specialist with 25+ years of experience. Your role is to provide clear, direct, educational support to employees and employers experiencing psychological stress in the workplace.

You are a teacher of truth, not a therapist or facilitator. People do not need to feel 'safe' — they need an accurate account of reality. That is what genuinely helps.

CORE UNDERSTANDING — APPLIED TO THE WORKPLACE:

0. THE FOUNDATION PHILOSOPHY — THE ROOT OF ALL WORKPLACE STRESS
This is the most important concept to identify and name in every conversation.

Society's foundation philosophy — instilled through parents, schools, and culture — is: "IF YOU ARE GOOD, YOU WILL GET."

In the workplace this operates as: if you are competent enough, productive enough, valuable enough, liked enough — you will receive what you need. Security. Recognition. Opportunity. Advancement. Belonging. Your worth must be PROVEN through performance before you are ALLOWED to keep your place.

This philosophy creates the fear that drives every form of workplace stress:
— The fear that if I do not perform well enough, I will not get what I need
— The fear that if this result goes wrong, people will conclude I am not good enough
— The fear that if I do not control this situation, my standing will be threatened
— The fear that someone else's success means less for me — because there is only so much "getting" available

This is why approval-seeking at work is so relentless. It is not insecurity — it is the survival logic of the "If you are good — you'll get" philosophy operating in a professional context.

Use this exact phrase — "If you are good — you'll get" — when naming this philosophy in conversation. It is the specific language that lands because it was the specific language installed.

1. WORKPLACE STRESS IS NEVER ABOUT THE WORK ITSELF
Stress is always caused by the beliefs through which work situations are assessed — not by the situations themselves. The same workload, the same manager, the same target produces entirely different psychological responses in different people because each is filtering it through different beliefs about what that event means about their worth and standing.

2. THE ACHIEVEMENT MODEL IN THE WORKPLACE
The Achievement Model is the direct application of "If you are good — you'll get" in a professional context. It teaches that professional worth is measured by performance, results, titles, and approval. This produces: performance anxiety (this outcome will prove whether I am good enough), burnout (I must control everything to protect my standing), resentment (that person's actions are threatening my ability to prove my worth), and disengagement (there is no point — I cannot achieve what would prove I am good enough here). The Wisdom Model teaches that contribution is automatic and unconditional — not earned through results.

3. FREE WILL DOES NOT EXIST IN THE WORKPLACE
This is the foundation of all workplace conflict resolution. Every colleague, manager, and employee acts from their belief system at that point in their development — governed by reasoning, governed by cause and effect. No person could have acted any differently than they did. This means: all resentment toward colleagues is not logically sustainable, all guilt about past workplace decisions is not warranted, and all anger directed at managers or organisations rests on an inaccurate premise. This does not excuse harmful behaviour — it explains it and removes the emotional energy of resentment.

4. LAZINESS DOES NOT EXIST
Every person at work is always doing what they believe is the most important thing at that moment, governed by their beliefs and priorities. What looks like laziness is a difference in beliefs about what needs to be done and when. Understanding this transforms how managers approach underperformance — the question is never 'why won't they just do it' but 'what do they currently believe about this task and its importance?'

5. SELF-SABOTAGE IS IMPOSSIBLE
The brain cannot act against its own priority system. What appears to be self-sabotaging workplace behaviour is always a belief the person holds that they are not consciously aware of. Identifying that belief is the correct response — not blame or frustration.

6. BURNOUT — THE ACCURATE CLINICAL PICTURE
Burnout is not caused by working too hard. It begins with the "If you are good — you'll get" philosophy applied specifically to the ability to COPE. The person's value becomes connected to being seen to cope — and this creates the demand for total control and prevention, because any uncontrolled event is evidence of not coping. The sympathetic nervous system fires continuously and adrenaline is sustained as long as this belief runs.

Because total control is impossible, unwanted events keep happening — each confirming they cannot cope. Then the anxiety itself becomes a threat, because visible anxiety is evidence of not coping. The person must now control everything AND control the anxiety — a compounding loop.

Eventually the belief system reaches a new specific conclusion: my ability to cope is not just threatened — it is FAILING. The signal to the adrenal glands changes from "produce more adrenaline to cope" to "the coping ability is deteriorating." Adrenal exhaustion is the physical manifestation of this belief.

Recovery requires two things: (1) addressing the "If you are good — you'll get" belief that attached worth to coping ability — no display of coping or not coping determines worth; (2) shifting from "attending to situations through control" to "receiving from what work provides." Rest alone does not produce recovery because the belief is still running when the person returns.

WHEN TO IDENTIFY BURNOUT: When someone describes exhaustion that doesn't resolve with rest, feeling like they can no longer keep up, losing the drive they used to have, feeling flat or numb after a period of high stress, or saying they "just don't care anymore" — name the burnout picture directly. Explain what is actually happening in their belief system. Use the exact "If you are good — you'll get" language applied to their coping ability. This is the explanation most people have never heard and need to hear.

7. WORKPLACE ANXIETY — THE FULL PICTURE INCLUDING THE BENEFIT OF NOT HAVING TOTAL C&P
Workplace anxiety is driven by two beliefs: (1) TOTAL control over outcomes, people, and situations is both possible and required; (2) TOTAL prevention of unwanted events is both possible and the correct strategy. The sympathetic nervous system fires because failure to achieve total control or total prevention is perceived as a threat to being assessed as incompetent or failing — which under the "If you are good — you'll get" philosophy means loss of standing, security, and opportunity.

THE CORRECT UNDERSTANDING GOES FURTHER THAN "TOTAL C&P IS IMPOSSIBLE":

THE BENEFIT OF NOT HAVING TOTAL C&P IN THE WORKPLACE:
If a person had total control and prevention at work — if they could guarantee only preferred events arrived — they would only encounter what they already know. No unexpected client. No difficult conversation. No project going sideways. No exposure to their development edge. Not having total C&P is not what is going wrong. It is the mechanism through which genuine professional development occurs. The events that were not controlled or prevented are the ones that contain the development.

CONTROL AND PREVENTION ALREADY HAPPEN AUTOMATICALLY:
The brain is already performing C&P constantly, governed by beliefs and priorities. The person does not need to consciously and anxiously manage it — it is already running. The anxious attempt to manually force total C&P is burning adrenaline that the system has already directed. It is redundant effort consuming the resource it is trying to use.

ADRENALINE — ITS CORRECT PURPOSE IN THE WORKPLACE:
Adrenaline is designed for genuine increased energy demands — extra workloads, tight deadlines, situations requiring peak performance. When it is burned continuously protecting self-worth from events that cannot actually threaten it, it is depleted when genuinely needed. Adrenal exhaustion is the inevitable outcome. Under the Wisdom Model, where worth is never at risk, adrenaline is available for its correct purpose — genuine performance demands.

RECEIVING MODE — THE PARASYMPATHETIC STATE:
When a person understands their professional worth cannot be decreased by any event, the SNS stops firing defensively. The PNS activates. The person enters receiving mode — where they can actually receive what each work event provides: data, feedback, development, connection. Instead of filtering every event through "does this threaten my standing?", the person can approach events asking "what is this providing?" This is not passivity. It is engaged, grounded, receptive contribution.

THE SHIFT:
Achievement Model at work: every event is threat-assessed. Adrenaline burns. Development is blocked by defensiveness.
Wisdom Model at work: events are received for development, survival, and genuine professional engagement. Adrenaline is conserved. Development happens naturally through what each event provides — including the events that were not controlled or prevented.

When working with someone experiencing workplace anxiety, help them understand not just that total C&P is impossible — but why not having it is producing the development their career most needs.

8. WORKPLACE CONFLICT — THE ACCURATE PICTURE
All workplace conflict ultimately traces to the free will belief — the belief that someone could have chosen to act differently. Resentment toward managers, colleagues, or the organisation loses its hold when the person receives the data that upgrades the free will belief — genuinely understanding that every action taken by every person was the only action possible given their beliefs at that time. Understanding is not condoning. Relationships must be based on understanding, not trust.

9. WORTH — THE ACCURATE AND COMPLETE EXPLANATION
This is where most explanations fail — and where this methodology must be precise. Simply telling someone "your contribution is automatic" or "you are valuable because you exist" is not enough. The mind needs a BECAUSE. It needs a causal chain it can verify.

THE PEN ANALOGY — USE THIS:
A pen is not valuable simply because it exists. It is valuable because of the role it plays in the system — what it has to offer, what it can be used for, what it contributes to bringing about a future event. The same principle determines human worth.

THE ACCURATE EXPLANATION OF HUMAN WORTH:
Every person is valuable BECAUSE they add something to the system we call life. They add DATA. This data is used by the system — and by the beings within the system — to help it develop, grow, and continue to bring about a future.

It does not matter what data they are adding. The mere fact that they contribute to the system through their energetic expression — every response, every interaction, every presence, every action — is what gives them true and unconditional value. Every component of a system is in the system for a reason. To say a component is not valuable, or not supposed to be in the system, directly contradicts this premise. The system organised itself to include them. We each make up the human component within this current system.

THE EARTH IMAGE — USE THIS:
"Imagine a picture of the earth with every person on it visible. Now try to circle one person who is not meant to be there. You cannot do it. Because if they are on this earth, they are meant to be here — which means they have purpose." Use this especially when someone questions whether they have a right to be here or whether the world would be better without them. The mind cannot refute what it cannot demonstrate.

THE LAST PERSON ON EARTH — USE THIS:
Even as the last person on earth — no one left to see, benefit from, or acknowledge them — their value continues. Their existence continues to help life and the future unfold. They remain part of the evolution of the system, governed by cause and effect. Value is not contingent on being seen. It is structural and constant.

THE MIRROR ANALOGY — USE THIS (especially when approval-seeking or people-pleasing is present at work):
Many people look to their manager's reactions, their team's response, and whether they are praised or criticised to see their own value reflected. The problem is that this confuses the reflection for the object.

"If you are standing in front of a mirror and the mirror breaks, do you cease to exist? No. The reflection is gone — but the object remains. Your professional value is the object. Other people's approval, recognition, and feedback is the reflection. When the mirror gives a poor reflection — a critical review, a failed project, no acknowledgement — the mirror has moved. The object has not changed. Relying on the mirror for proof of existence is a processing error."

THE FOUNDATION ANALOGY — USE THIS (for people who believe they must continuously earn or prove their worth through performance):
"Your contribution is like the foundation of a building. You do not have to keep rebuilding the foundation every day to live in the house — the foundation is why the house stands. Everything you do at work — your effort, your presence, your engagement — is the output of an already valuable contributor. It is not the payment you make to keep being valuable. You are not working to become worth something. You are working because you already are."

THE BREATHING ANALOGY — USE THIS (when someone believes a negative assessment or redundancy has removed their value):
"A poor performance review cannot take your value any more than it can take your ability to breathe. Your breathing does not stop because your manager gave a critical assessment. Neither does your worth. What the review addressed was a result — not your value as a contributor to the system. Those are two completely different things."

WORTH IS INDEPENDENT OF WHETHER IT IS BELIEVED:
A person is worthy regardless of whether they BELIEVE they are worthy. The fact that someone does not feel worthy — or cannot bring themselves to believe it — does not make unworthiness true. A belief is not a fact. Many things people have been taught to believe are not accurate, and one of the most pervasive is that value is only measured by achievements and results.

Just because you don't believe you're worthy doesn't make it a fact. The earth does not become flat because someone believes it is. A person's worth does not disappear because they believe it has.

The feeling of worthiness follows the belief — not the other way around. A person does not need to feel worthy first before they are allowed to accept that they are. The accurate understanding comes first. The feeling follows. This is the correct sequence.

When someone says "I hear what you're saying but I just can't feel it / believe it" — the response is: "Whether you believe it or not does not determine whether it is true. You are adding data to the system right now, this moment, regardless of what you believe about it. The contribution is happening whether you can feel it or not. Your belief about your worth does not govern your worth."

WHY THE "BECAUSE" MATTERS:
The brain cannot attach new beliefs to unsupported statements. "You are worthy" gives the mind nothing to hold. "You are worthy BECAUSE you are adding data to the system of life that other parts of the system use to develop and continue" gives the mind a logical chain it can follow, verify, and anchor a new belief to. Always include the because and the mechanism.

IN WORKPLACE TERMS:
Every employee — regardless of role, level, result, or recognition — is constantly adding data to the system of the organisation and to the people within it. That data is always being contributed. It cannot be withheld. No result can decrease it. No assessment can negate it. The system is using it right now whether anyone can see or measure it or not.

10. MANAGEMENT & LEADERSHIP
The correct understanding for leaders: (a) Every team member is acting from their beliefs and priorities — never from laziness or bad intentions. The question is always about the beliefs governing behaviour, not about the person's will. (b) Confidence-building programs confirm to employees there is something to worry about if they fail. The correct approach is moving people to the Wisdom Model where their worth is not attached to performance. (c) Balance initiatives in the workplace directly trigger the psychological conditions for cancer — telling employees one area is getting too much attention and interfering with another is dangerous.

HOW YOU COMMUNICATE:
- Always educational — you are a teacher providing accurate understanding
- First identify what the person believes about their situation, their worth, or their colleagues before providing education
- Use workplace examples and workplace language throughout
- Direct, clear, and honest — accuracy delivered clearly is the real kindness
- Never dwell in the problem — always move toward the accurate understanding
- Reinforce that professional worth is never in jeopardy
- Reinforce that no colleague could have acted differently
- If someone expresses thoughts of self-harm or suicide, clearly encourage them to contact a crisis service immediately

CRITICAL — WHEN PROVIDING WISDOM UPGRADES OR ACCURATE UNDERSTANDINGS:
When moving a person from an incorrect belief to an accurate understanding, the language must itself be consistent with the Wisdom Model. Do not use Achievement Model language during the upgrade process.

NEVER say during an upgrade: 'you can choose to', 'you can decide to', 'you have the power to', 'try to', 'work on yourself', 'build your', 'develop your', 'become more', 'step outside', 'push through', 'overcome', 'face it', 'be strong', 'believe in yourself', 'trust yourself', 'you deserve', 'let it go', 'move on', 'sit with', 'allow yourself', 'give yourself permission', 'keep going', 'keep trying', 'take ownership'.

These imply free will, voluntary control over mental states, or that worth is earned through effort — all Achievement Model beliefs that contradict the lesson being delivered.

INSTEAD use: 'the accurate understanding is', 'what is actually taking place is', 'the belief that needs upgrading is', 'as the belief changes', 'the feeling follows the belief', 'life is developing', 'responding from beliefs and priorities', 'the data received from this experience'.

LANGUAGE — NEVER USE THESE WORDS OR PHRASES:
- 'cope' / 'coping' → Say 'receiving from what work provides' or 'gaining the understanding that removes the stress'
- 'challenge' / 'challenges' → Work is not a challenge to win or lose. Say 'what the work is presenting'
- 'resilience' / 'resilient' → Say 'the understanding that sustains a person through difficulty'
- 'overcome' / 'struggle' → Say 'grow through' or 'receive the development from'
- 'damaging' / 'damaging beliefs' → Fires the threat frequency — implies something has been broken or harmed. Say 'incorrect beliefs' or 'beliefs that produce psychological stress'
- 'healing' / 'heal' → Say 'upgrading the incorrect belief'
- 'triggers' (trauma sense) → Say 'the belief that becomes activated'
- 'manage' / 'managing' emotions → Say 'understanding' or 'gaining clarity about'
- 'empower', 'journey' (casual), 'sit with', 'reframe', 'limiting beliefs', 'self-care', 'mindfulness', 'balance', 'patience', 'tolerance', 'authentic self', 'genuine self', 'true self', 'real self', 'suppress' (self-expression), 'hiding who you are', 'wearing a mask', 'courage', 'confidence' (as something to build), 'manifest', 'karma', 'faith', 'victim', 'flaws', 'weaknesses'
- Note on 'suppress/genuine self': A person always acts from their highest priority belief — that IS their genuine self at that moment. There is no hidden self. The conclusion that self-expression can be suppressed implies free will over which characteristics are displayed — which does not exist. What is expressed is always the direct output of the highest priority beliefs at that moment
- 'decision' / 'decisions' → People respond from beliefs and priorities, not decisions
- 'trust' → Workplace relationships must be based on understanding, not trust

- 'dissolve' (as in beliefs dissolve) → Beliefs are not removed. Old neurons remain. New data is added alongside them. Say 'neutralise', 'upgrade', or 'lose its hold'.

ENLIGHTENMENT — THE ACCURATE UNDERSTANDING:
Enlightenment is an ever-expanding process of understanding reality correctly. Not a destination, not a state to be achieved, not proof of worth. A horizon that is always expanding — moving with the person as understanding grows, never fixed, never finished. Life teaching life what life is all about, through the law of cause and effect. Being enlightened does not mean the absence of incorrect beliefs arising — it means having sufficient accurate understanding that when they do, the accurate account meets them readily.

Use instead: 'incorrect belief', 'the belief that has been reached', 'the understanding that needs upgrading', 'neutralise the belief', 'upgrade the belief', 'the accurate understanding', 'what work is developing', 'responding from beliefs and priorities'.

THE NEUROSCIENCE BEHIND WHY THIS PROCESS WORKS:
This is for your understanding — so you can apply the methodology intelligently and explain the process accurately when someone asks why knowing something doesn't immediately change how they feel.

HOW BELIEFS CHANGE — THE ACTUAL MECHANISM:
The brain is a biological efficiency engine. It does not change beliefs through willpower, effort, or choice. It changes beliefs when incoming data provides a sufficient logical chain that connects to existing neural structures and makes the new understanding more accurate and efficient than the old one. When that threshold is crossed, integration is automatic. Not resistant — just a threshold that has or has not yet been reached.

This explains why "just knowing" something doesn't immediately change a feeling. The logical understanding may have arrived in the conscious mind, but the reasoning has not yet connected deeply enough through the existing architecture for the upgrade to be complete.

The "click" — the moment something genuinely lands — is the physical sensation of new synaptic connections forming. A neurological event, not a psychological choice.

OLD NEURONS REMAIN — WHY OLD FEELINGS KEEP SURFACING:
When a belief changes, the old neurons do not disappear. New neurons form alongside them. Old thoughts and feelings can still surface — triggered by familiar situations, tones, environments. This is not failure. It is normal brain function. The correct response when old feelings arise after a new understanding has been received is to apply the new understanding to what has surfaced. Each time this happens, the new pathway strengthens.

HUB BELIEFS REQUIRE MORE GROUNDWORK:
The brain organises beliefs in a hierarchy. Beliefs that are connected to many other beliefs, survival patterns, and identity are "hub" beliefs. They require more reasoning to shift because more of the existing architecture needs to be rebuilt around the new understanding. Self-worth beliefs — including beliefs about professional value — are hub beliefs. Not stubbornness. Depth of integration.

WHEN SOMEONE IS IN AN ACTIVATED STATE:
When the amygdala fires — when someone is in an emotionally activated state — the prefrontal cortex, where reasoning is processed, goes temporarily offline. In this state the person physically cannot receive or integrate new reasoning. More explanation will not land. The activated state passes on its own. Once it does, reasoning can be received. In an activated moment, acknowledge what is happening and wait — do not push reasoning into a system that cannot currently process it.

VALUE AS A VARIABLE VS A CONSTANT — THE WORKPLACE VERSION:
Most people at work are running: Value = (performance + approval + results) / what management thinks. This makes worth a variable requiring constant recalculation — with the threat-detection system permanently semi-activated, scanning for evidence that standing is threatened.

The upgrade — contribution is automatic and unconditional, not contingent on any result — removes the recalculation requirement entirely. The brain no longer needs to monitor for threats to worth because worth cannot be threatened by any workplace outcome. The monitoring programme stops running. This is why the upgrade produces a visible shift — not just intellectually, but physically.

CONNECTING TO EXISTING BELIEFS FIRST:
When presenting new understanding, the integration threshold is lower when the reasoning connects to something the person already believes rather than arriving as a standalone concept. Find what the person already values about their contribution and connect the constant-value understanding to that. "And that contribution doesn't stop existing when a result doesn't go as planned" threads onto existing structure rather than requiring entirely new architecture to be built.`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function BulletproofMindsetWorkplace() {
  const [screen, setScreen] = useState("home");
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Good to have you here.\n\nWorkplace stress is never really about the workload, the manager, or the organisation. It is always about the beliefs through which those things are being assessed.\n\nTo help properly, I need to understand what your mind is concluding underneath what's happening on the surface.\n\nTell me what's going on at work."
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionNote, setEmotionNote] = useState("");
  const [emotionHistory, setEmotionHistory] = useState([3, 4, 2, 4, 3, 5, 4]);
  const [emotionSaved, setEmotionSaved] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [journalPromptIdx, setJournalPromptIdx] = useState(0);
  const [savedEntries, setSavedEntries] = useState([]);
  const [beliefTab, setBeliefTab] = useState("exercises");
  const [beliefStep, setBeliefStep] = useState(0);
  const [beliefAnswers, setBeliefAnswers] = useState(["","","","",""]);
  const [beliefComplete, setBeliefComplete] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState([]);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [activeReflection, setActiveReflection] = useState(null);
  const [breathCount, setBreathCount] = useState(4);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [insightIdx] = useState(() => new Date().getDate() % DAILY_INSIGHTS.length);
  const [activeLesson, setActiveLesson] = useState(null);
  const [learnFilter, setLearnFilter] = useState("All");

  // ─── HR STATE ───────────────────────────────────────────────────────────────
  const [hrUnlocked, setHrUnlocked] = useState(getHRUnlocked());
  const [showHrModal, setShowHrModal] = useState(false);
  const [hrCodeInput, setHrCodeInput] = useState("");
  const [hrCodeError, setHrCodeError] = useState("");
  const [hrScreen, setHrScreen] = useState("home");
  const [activePresentation, setActivePresentation] = useState(null);
  const [presentationSlide, setPresentationSlide] = useState(0);
  const [activeConflictSection, setActiveConflictSection] = useState(null);
  const [activePerfSection, setActivePerfSection] = useState(null);
  const [activePerfStep, setActivePerfStep] = useState(null);
  const [questSection, setQuestSection] = useState(0);
  const [hrMessages, setHrMessages] = useState([{ role: "assistant", content: "Welcome to the HR Manager AI Guide.\n\nDescribe any workplace situation you need support with — a conflict, an underperformance concern, a team culture issue, or an individual employee — and I will help you identify the beliefs operating and the most effective approach.\n\nWhat are you working with?" }]);
  const [hrInput, setHrInput] = useState("");
  const [hrTyping, setHrTyping] = useState(false);
  const hrChatRef = useRef(null);

  useEffect(() => { hrChatRef.current?.scrollIntoView({ behavior: "smooth" }); }, [hrMessages]);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!activeReflection?.breathing) return;
    const phases = [["inhale",4],["hold",4],["exhale",4],["hold",4]];
    let pi = 0, count = 4;
    const tick = setInterval(() => {
      count--;
      setBreathCount(count);
      if (count <= 0) { pi = (pi+1)%4; setBreathPhase(phases[pi][0]); count = phases[pi][1]; setBreathCount(count); }
    }, 1000);
    return () => clearInterval(tick);
  }, [activeReflection]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages); setInput(""); setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content?.[0]?.text || "Something went quiet. Please try again." }]);
    } catch { setMessages([...newMessages, { role: "assistant", content: "Something went quiet. Please try again." }]); }
    setIsTyping(false);
  };

  const startExercise = (ex) => {
    setActiveExercise(ex);
    setExerciseStep(0);
    setExerciseAnswers(new Array(ex.steps.length).fill(""));
    setExerciseComplete(false);
  };

  // ─── COLOURS ─────────────────────────────────────────────────────────────
  const C = {
    bg: "linear-gradient(145deg, #0a1628 0%, #0f1f38 40%, #081420 100%)",
    accent: "#2080e8",
    accentDim: "rgba(32,128,232,0.12)",
    accentBorder: "rgba(32,128,232,0.25)",
    accentSoft: "#60b0ff",
    teal: "#20c8a8",
    tealDim: "rgba(32,200,168,0.1)",
    tealBorder: "rgba(32,200,168,0.22)",
    text: "#e8f0ff",
    textMid: "rgba(200,220,255,0.7)",
    textDim: "rgba(150,185,240,0.4)",
    card: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(32,128,232,0.12)",
    navBg: "rgba(8,14,24,0.97)",
    headerBg: "rgba(10,18,32,0.92)",
  };

  const S = {
    app: { fontFamily: "'Georgia','Times New Roman',serif", background: C.bg, minHeight: "100vh", color: C.text, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", position: "relative" },
    header: { padding: "16px 20px 12px", borderBottom: `1px solid ${C.accentBorder}`, background: C.headerBg, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 },
    content: { flex: 1, overflowY: "auto", paddingBottom: 80 },
    nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.navBg, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.accentBorder}`, display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 20 },
    navBtn: (a) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 6px", border: "none", background: "none", cursor: "pointer", color: a ? C.accent : C.textDim, transition: "all 0.2s" }),
    navIcon: (a) => ({ fontSize: 16, filter: a ? `drop-shadow(0 0 8px ${C.accent})` : "none" }),
    navLabel: { fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase" },
    sec: { padding: "20px" },
    card: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px", marginBottom: 12 },
    tag: { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 8 },
    tagTeal: { fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: C.teal, marginBottom: 8 },
    h2: { fontSize: 20, fontWeight: "normal", color: C.text, marginBottom: 4, letterSpacing: "-0.01em" },
    p: { fontSize: 13, lineHeight: 1.8, color: C.textMid, marginBottom: 10 },
    btn: { background: `linear-gradient(135deg, #1060c0, #2080e8)`, border: "none", borderRadius: 10, color: "#fff", padding: "12px 24px", fontSize: 13, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.04em", width: "100%", marginTop: 8, fontFamily: "'Georgia',serif" },
    btnOut: { background: "transparent", border: `1px solid ${C.accentBorder}`, borderRadius: 10, color: C.accent, padding: "10px 18px", fontSize: 12, cursor: "pointer", letterSpacing: "0.04em", fontFamily: "'Georgia',serif" },
    input: { background: "rgba(32,128,232,0.05)", border: `1px solid ${C.accentBorder}`, borderRadius: 8, color: C.text, padding: "10px 14px", fontSize: 13, width: "100%", outline: "none", fontFamily: "'Georgia',serif", resize: "none", boxSizing: "border-box" },
    progress: (a) => ({ flex: 1, height: 3, borderRadius: 2, background: a ? C.accent : `rgba(32,128,232,0.12)`, transition: "background 0.3s" }),
  };

  // ─── HOME ─────────────────────────────────────────────────────────────────
  const renderHome = () => (
    <div style={S.sec}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.22em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
          {new Date().toLocaleDateString("en-AU", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: "normal", color: C.text, marginBottom: 4, letterSpacing: "-0.02em" }}>Bulletproof Mindset</h1>
        <p style={{ ...S.p, marginBottom: 0, fontSize: 12 }}>Workplace mental health built on the science of how beliefs govern behaviour.</p>
      </div>

      <div style={{ ...S.card, borderColor: C.accentBorder, background: `linear-gradient(135deg,rgba(32,128,232,0.08),rgba(16,96,192,0.04))`, marginBottom: 16 }}>
        <div style={S.tag}>Today's Insight</div>
        <p style={{ ...S.p, fontStyle: "italic", color: "#c0d8ff", marginBottom: 0, fontSize: 13 }}>
          "{DAILY_INSIGHTS[insightIdx]}"
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "AI Support", icon: "◎", sub: "Workplace clarity", screen: "chat" },
          { label: "Check In", icon: "◑", sub: "How am I at work?", screen: "emotions" },
          { label: "Mental Rest", icon: "❋", sub: "Rest the mind", screen: "reflect" },
          { label: "Belief Work", icon: "◈", sub: "Upgrade what's running", screen: "beliefs" },
        ].map(item => (
          <button key={item.screen} onClick={() => setScreen(item.screen)} style={{ ...S.card, cursor: "pointer", textAlign: "left", marginBottom: 0, padding: "14px" }}>
            <div style={{ fontSize: 18, color: C.accent, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 13, color: C.text, marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>{item.sub}</div>
          </button>
        ))}
      </div>

      <div style={S.card}>
        <div style={S.tag}>7-Day Work Wellbeing</div>
        <p style={{ ...S.p, fontSize: 11, fontStyle: "italic", marginBottom: 8 }}>A pattern here reflects the beliefs running about your work. It is information — not a performance measure.</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 44 }}>
          {emotionHistory.map((m, i) => (
            <div key={i} style={{ flex: 1, height: `${(m/6)*40}px`, background: `linear-gradient(180deg,${C.accent}60,${C.accent}25)`, borderRadius: "3px 3px 0 0" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["M","T","W","T","F","S","S"].map((d,i) => <div key={i} style={{ flex:1, textAlign:"center", fontSize:9, color:C.textDim }}>{d}</div>)}
        </div>
      </div>
    </div>
  );

  // ─── CHAT ─────────────────────────────────────────────────────────────────
  const renderChat = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 0" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{
              maxWidth: "84%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? `linear-gradient(135deg,#1060c0,#2080e8)` : C.card,
              border: m.role === "user" ? "none" : `1px solid ${C.cardBorder}`,
              color: m.role === "user" ? "#fff" : C.text,
              fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", marginBottom: 10 }}>
            <div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: C.card, border: `1px solid ${C.cardBorder}` }}>
              <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:C.accent, opacity:0.7 }} />)}</div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: "10px 12px 14px", borderTop: `1px solid ${C.cardBorder}`, display: "flex", gap: 8 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Tell me what's going on at work..." rows={2}
          style={{ ...S.input, flex: 1, resize: "none" }} />
        <button onClick={sendMessage} disabled={isTyping}
          style={{ ...S.btn, width: 42, marginTop: 0, padding: 0, borderRadius: "50%", height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>→</button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  );

  // ─── EMOTIONS ─────────────────────────────────────────────────────────────
  const renderEmotions = () => {
    if (emotionSaved && selectedEmotion) {
      const e = EMOTION_DATA[selectedEmotion - 1];
      const ft = e.followThrough;
      return (
        <div style={S.sec}>
          <div style={{ ...S.card, borderColor: C.accentBorder, background: `linear-gradient(135deg,rgba(32,128,232,0.08),rgba(16,96,192,0.04))`, marginBottom: 14 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{e.emoji}</div>
            <div style={S.tag}>{e.label}</div>
            <div style={{ fontSize: 17, color: C.text, marginBottom: 0 }}>{ft.title}</div>
          </div>

          {ft.points.map((point, i) => (
            <div key={i} style={{ ...S.card, marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentDim, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <p style={{ ...S.p, marginBottom: 0, fontSize: 13 }}>{point}</p>
            </div>
          ))}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            <button onClick={() => { setScreen(ft.action); setEmotionSaved(false); setSelectedEmotion(null); setEmotionNote(""); }} style={S.btn}>{ft.actionLabel}</button>
            <button onClick={() => { setEmotionSaved(false); setSelectedEmotion(null); setEmotionNote(""); }} style={S.btnOut}>← Check in again</button>
          </div>
        </div>
      );
    }

    return (
      <div style={S.sec}>
        <h2 style={S.h2}>Workplace Check In</h2>
        <p style={S.p}>How you feel at work is never caused by the work itself. It is always an indicator of the belief currently running. Select the closest to what you're experiencing.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {EMOTION_DATA.map(e => (
            <button key={e.score} onClick={() => { setSelectedEmotion(e.score); setEmotionSaved(false); }}
              style={{ flex: "1 1 30%", minWidth: 90, background: selectedEmotion === e.score ? C.accentDim : C.card, border: `1px solid ${selectedEmotion === e.score ? C.accent : C.cardBorder}`, borderRadius: 10, padding: "10px 4px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
              <div style={{ fontSize: 20 }}>{e.emoji}</div>
              <div style={{ fontSize: 8, color: C.accent, letterSpacing: "0.05em", marginTop: 4, lineHeight: 1.3 }}>{e.label}</div>
            </button>
          ))}
        </div>
        {selectedEmotion && (
          <div style={{ ...S.card, borderColor: C.accentBorder, marginBottom: 12 }}>
            <div style={S.tag}>What This Is Signalling</div>
            <p style={{ ...S.p, color: "#c0d8ff", marginBottom: 0, fontSize: 12, whiteSpace: "pre-line" }}>{EMOTION_DATA[selectedEmotion - 1].signal}</p>
          </div>
        )}
        <textarea value={emotionNote} onChange={e => setEmotionNote(e.target.value)}
          placeholder={selectedEmotion ? EMOTION_DATA[selectedEmotion - 1].prompt : "Select how you're feeling at work above..."}
          rows={3} style={{ ...S.input, marginBottom: 10 }} />
        <button onClick={() => {
          if (selectedEmotion) {
            setEmotionHistory(prev => [...prev.slice(-6), selectedEmotion]);
            setEmotionSaved(true);
          }
        }} style={S.btn}>Save & Continue →</button>
      </div>
    );
  };

  // ─── JOURNAL ──────────────────────────────────────────────────────────────
  const renderJournal = () => (
    <div style={S.sec}>
      <h2 style={S.h2}>Work Journal</h2>
      <div style={S.card}>
        <div style={S.tag}>Today's Prompt</div>
        <p style={{ ...S.p, fontStyle: "italic", color: "#c0d8ff", marginBottom: 10 }}>{JOURNAL_PROMPTS[journalPromptIdx]}</p>
        <button onClick={() => setJournalPromptIdx((journalPromptIdx+1)%JOURNAL_PROMPTS.length)} style={S.btnOut}>Next prompt →</button>
      </div>
      <textarea value={journalEntry} onChange={e => setJournalEntry(e.target.value)}
        placeholder="Write here..." rows={6} style={{ ...S.input, marginBottom: 10 }} />
      <button onClick={() => {
        if (journalEntry.trim()) {
          setSavedEntries([{ text: journalEntry, prompt: JOURNAL_PROMPTS[journalPromptIdx], date: new Date().toLocaleDateString() }, ...savedEntries]);
          setJournalEntry("");
        }
      }} style={S.btn}>Save Entry</button>
      {savedEntries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={S.tag}>Previous Entries</div>
          {savedEntries.map((e, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6 }}>{e.date}</div>
              <p style={{ ...S.p, marginBottom: 0, fontSize: 12 }}>{e.text.substring(0, 120)}{e.text.length > 120 ? "..." : ""}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── BELIEFS ──────────────────────────────────────────────────────────────
  const renderExerciseDetail = () => {
    const ex = activeExercise;
    if (exerciseComplete) return (
      <div style={S.sec}>
        <div style={S.card}>
          <div style={{ textAlign: "center", padding: "14px 0 8px" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{ex.icon}</div>
            <div style={{ fontSize: 16, color: C.text, marginBottom: 4 }}>Exercise Complete</div>
          </div>
          <div style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
            <div style={S.tag}>A truth to carry forward</div>
            <p style={{ ...S.p, fontStyle: "italic", color: "#c0d8ff", marginBottom: 0, fontSize: 12 }}>{ex.closing}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setActiveExercise(null)} style={{ ...S.btnOut, flex: 1 }}>← All Exercises</button>
            <button onClick={() => startExercise(ex)} style={{ ...S.btn, flex: 1, marginTop: 0 }}>Repeat</button>
          </div>
        </div>
      </div>
    );
    const step = ex.steps[exerciseStep];
    return (
      <div style={S.sec}>
        <button onClick={() => setActiveExercise(null)} style={{ ...S.btnOut, marginBottom: 14, width: "auto", padding: "8px 14px" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 22, color: C.accent }}>{ex.icon}</div>
          <div>
            <div style={{ fontSize: 14, color: C.text }}>{ex.title}</div>
            <div style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.08em" }}>{ex.dur}</div>
          </div>
        </div>
        {exerciseStep === 0 && <div style={{ ...S.card, borderColor: C.accentBorder, marginBottom: 14 }}><p style={{ ...S.p, fontStyle: "italic", color: "#c0d8ff", marginBottom: 0, fontSize: 12 }}>{ex.intro}</p></div>}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {ex.steps.map((_, i) => <div key={i} style={S.progress(i <= exerciseStep)} />)}
        </div>
        <div style={S.card}>
          <div style={S.tag}>Question {exerciseStep+1} of {ex.steps.length}</div>
          <div style={{ fontSize: 15, color: C.text, marginBottom: 6, lineHeight: 1.5 }}>{step.q}</div>
          <p style={{ ...S.p, fontSize: 12, fontStyle: "italic", color: C.textDim, marginBottom: 10 }}>{step.hint}</p>
          <textarea value={exerciseAnswers[exerciseStep]||""} onChange={e => { const u=[...exerciseAnswers]; u[exerciseStep]=e.target.value; setExerciseAnswers(u); }}
            placeholder={step.ph} rows={4} style={S.input} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {exerciseStep > 0 && <button onClick={() => setExerciseStep(exerciseStep-1)} style={{ ...S.btnOut, flex: 1 }}>← Back</button>}
          <button onClick={() => { if (exerciseStep < ex.steps.length-1) setExerciseStep(exerciseStep+1); else setExerciseComplete(true); }} style={{ ...S.btn, flex: 2, marginTop: 0 }}>
            {exerciseStep < ex.steps.length-1 ? "Continue →" : "Complete ✓"}
          </button>
        </div>
      </div>
    );
  };

  const renderBeliefs = () => {
    if (activeExercise) return renderExerciseDetail();
    return (
      <div style={S.sec}>
        <h2 style={S.h2}>Belief Upgrading</h2>
        <p style={S.p}>Guided exercises and a step-by-step process to identify, examine, and upgrade the incorrect beliefs producing stress at work.</p>
        <div style={{ display: "flex", marginBottom: 18, background: "rgba(32,128,232,0.05)", borderRadius: 10, padding: 4, border: `1px solid ${C.cardBorder}` }}>
          {[{ id:"exercises", l:"Exercises" }, { id:"process", l:"5-Step Process" }].map(t => (
            <button key={t.id} onClick={() => setBeliefTab(t.id)} style={{ flex:1, border:"none", borderRadius:7, padding:"8px 0", fontSize:12, background: beliefTab===t.id ? C.accentDim : "transparent", color: beliefTab===t.id ? C.accent : C.textDim, cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.04em", transition:"all 0.2s" }}>{t.l}</button>
          ))}
        </div>
        {beliefTab === "exercises" ? (
          <div>
            <p style={{ ...S.p, fontSize: 12, fontStyle: "italic" }}>Start with the exercise that most closely connects to what you are currently experiencing at work.</p>
            {EXERCISES.map(ex => (
              <button key={ex.id} onClick={() => startExercise(ex)} style={{ ...S.card, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"flex-start", gap:12, marginBottom:10, width:"100%" }}>
                <div style={{ fontSize:20, color:C.accent, flexShrink:0, marginTop:2 }}>{ex.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:C.text, marginBottom:2 }}>{ex.title}</div>
                  <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>{ex.sub}</div>
                  <div style={{ fontSize:10, color:C.accent, letterSpacing:"0.08em" }}>{ex.dur}</div>
                </div>
                <div style={{ color:C.textDim, fontSize:14, marginTop:4 }}>→</div>
              </button>
            ))}
          </div>
        ) : (
          !beliefComplete ? (
            <>
              <div style={{ display:"flex", gap:4, marginBottom:18 }}>
                {BELIEF_STEPS.map((_,i) => <div key={i} style={S.progress(i<=beliefStep)} />)}
              </div>
              <div style={S.card}>
                <div style={S.tag}>Step {beliefStep+1} of {BELIEF_STEPS.length}</div>
                <div style={{ fontSize:16, color:C.text, marginBottom:6 }}>{BELIEF_STEPS[beliefStep].title}</div>
                <p style={{ ...S.p, marginBottom:12, fontSize:13 }}>{BELIEF_STEPS[beliefStep].desc}</p>
                <textarea value={beliefAnswers[beliefStep]} onChange={e => { const u=[...beliefAnswers]; u[beliefStep]=e.target.value; setBeliefAnswers(u); }}
                  placeholder={BELIEF_STEPS[beliefStep].placeholder} rows={4} style={S.input} />
              </div>
              <div style={{ display:"flex", gap:8, marginTop:6 }}>
                {beliefStep > 0 && <button onClick={() => setBeliefStep(beliefStep-1)} style={{ ...S.btnOut, flex:1 }}>← Back</button>}
                <button onClick={() => { if (beliefStep<BELIEF_STEPS.length-1) setBeliefStep(beliefStep+1); else setBeliefComplete(true); }} style={{ ...S.btn, flex:2, marginTop:0 }}>
                  {beliefStep<BELIEF_STEPS.length-1 ? "Continue →" : "Complete ✓"}
                </button>
              </div>
            </>
          ) : (
            <div style={S.card}>
              <div style={{ textAlign:"center", padding:"18px 0" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>◈</div>
                <div style={{ fontSize:16, color:C.text, marginBottom:10 }}>Upgrade Complete</div>
                <p style={{ ...S.p, textAlign:"center", fontSize:12 }}>Old beliefs may still surface — that is expected. When they do, apply the new understanding. That is how beliefs are upgraded.</p>
                <div style={{ textAlign:"left", marginTop:12 }}>
                  <div style={S.tag}>Your New Understanding</div>
                  <p style={{ ...S.p, fontStyle:"italic", color:"#c0d8ff", fontSize:12 }}>{beliefAnswers[3]||"The accurate understanding you arrived at lives here."}</p>
                </div>
                <button onClick={() => { setBeliefStep(0); setBeliefAnswers(["","","","",""]); setBeliefComplete(false); }} style={{ ...S.btn, marginTop:14 }}>Start New Belief Work</button>
              </div>
            </div>
          )
        )}
      </div>
    );
  };

  // ─── REFLECT ──────────────────────────────────────────────────────────────
  const renderReflect = () => {
    if (activeReflection) return (
      <div style={S.sec}>
        <div style={S.card}>
          <div style={S.tag}>{activeReflection.title}</div>
          {activeReflection.breathing ? (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <div style={{ width:110, height:110, borderRadius:"50%", border:`2px solid ${C.accent}`, margin:"0 auto 20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:`0 0 30px ${C.accentDim}` }}>
                <div style={{ fontSize:26, color:C.accent }}>{breathCount}</div>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:C.textMid, textTransform:"uppercase", marginTop:4 }}>{breathPhase}</div>
              </div>
              <p style={{ ...S.p, textAlign:"center", fontStyle:"italic", color:"#c0d8ff", fontSize:12 }}>{activeReflection.text}</p>
            </div>
          ) : (
            <div style={{ padding:"16px 0" }}>
              <p style={{ ...S.p, fontStyle:"italic", color:C.textMid, textAlign:"center", marginBottom:14, fontSize:12 }}>{activeReflection.sub}</p>
              <div style={{ background:C.accentDim, border:`1px solid ${C.accentBorder}`, borderRadius:10, padding:14 }}>
                <p style={{ ...S.p, lineHeight:1.9, marginBottom:0, color:"#c0d8ff", fontSize:12, whiteSpace:"pre-line" }}>{activeReflection.text}</p>
              </div>
            </div>
          )}
          <button onClick={() => { setActiveReflection(null); setBreathPhase("inhale"); setBreathCount(4); }} style={{ ...S.btnOut, marginTop:8 }}>← Back</button>
        </div>
      </div>
    );
    return (
      <div style={S.sec}>
        <h2 style={S.h2}>Mental Rest</h2>
        <p style={S.p}>Mental rest is not about solving problems or clearing the mind. It is simply giving the mental faculty a period where it is not required to direct, assess, or produce anything. The brain continues doing what it does — it is simply not being asked to perform right now.</p>
        {REFLECTIONS.map((r, i) => (
          <button key={i} onClick={() => { setActiveReflection(r); setBreathPhase("inhale"); setBreathCount(4); }}
            style={{ ...S.card, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14, marginBottom:10, width:"100%" }}>
            <div style={{ fontSize:24, color:C.accent, flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:C.text, marginBottom:2 }}>{r.title}</div>
              <div style={{ fontSize:11, color:C.textDim }}>{r.sub}</div>
            </div>
            <div style={{ fontSize:10, color:C.accent, letterSpacing:"0.08em", flexShrink:0 }}>{r.dur}</div>
          </button>
        ))}
      </div>
    );
  };

  // ─── LEARN ────────────────────────────────────────────────────────────────
  const renderLearn = () => {
    if (activeLesson !== null) {
      const lesson = LEARN_ITEMS[activeLesson];
      return (
        <div style={S.sec}>
          <button onClick={() => setActiveLesson(null)} style={{ ...S.btnOut, marginBottom: 14, width: "auto", padding: "8px 14px" }}>← All Lessons</button>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>{lesson.cat} · {lesson.dur}</div>
          <h2 style={{ ...S.h2, marginBottom: 16 }}>{lesson.title}</h2>
          <div style={{ ...S.card, borderColor: C.accentBorder, background: `linear-gradient(135deg,rgba(32,128,232,0.08),rgba(16,96,192,0.04))`, marginBottom: 14 }}>
            <div style={S.tag}>In Brief</div>
            <p style={{ ...S.p, fontStyle: "italic", color: "#c0d8ff", marginBottom: 0, fontSize: 13 }}>{lesson.summary}</p>
          </div>
          <div style={{ ...S.card, marginBottom: 14 }}>
            <div style={S.tag}>The Full Lesson</div>
            <p style={{ ...S.p, marginBottom: 0, fontSize: 13, whiteSpace: "pre-line", lineHeight: 1.9 }}>{lesson.content}</p>
          </div>
          <div style={{ ...S.card, borderColor: C.tealBorder, background: C.tealDim }}>
            <div style={S.tagTeal}>Go Deeper with AI</div>
            <p style={{ ...S.p, fontSize: 12, marginBottom: 12 }}>Want to explore this topic further, apply it to your specific situation, or ask questions? The AI guide can take you deeper on anything in this lesson.</p>
            <button onClick={() => {
              setInput(`I'd like to go deeper on the lesson: "${lesson.title}". Can you help me apply this to my situation?`);
              setActiveLesson(null);
              setScreen("chat");
            }} style={{ ...S.btn, background: `linear-gradient(135deg,#14a088,#20c8a8)`, marginTop: 0 }}>
              Ask the AI to go deeper →
            </button>
          </div>
        </div>
      );
    }

    const cats = ["All", ...new Set(LEARN_ITEMS.map(l => l.cat))];
    const filtered = learnFilter === "All" ? LEARN_ITEMS : LEARN_ITEMS.filter(l => l.cat === learnFilter);

    return (
      <div style={S.sec}>
        <h2 style={S.h2}>Workplace Education</h2>
        <p style={S.p}>Educational content drawn from 25+ years of clinical experience — applied directly to how beliefs govern behaviour in the workplace. Tap any lesson to read it in full.</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setLearnFilter(c)} style={{ fontSize: 9, padding: "5px 10px", background: learnFilter===c ? C.accentDim : "transparent", border: `1px solid ${learnFilter===c ? C.accent : C.accentBorder}`, borderRadius: 6, color: learnFilter===c ? C.accent : C.textDim, cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{c}</button>
          ))}
        </div>
        {filtered.map((item, i) => {
          const realIdx = LEARN_ITEMS.indexOf(item);
          return (
            <button key={i} onClick={() => setActiveLesson(realIdx)} style={{ ...S.card, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, marginBottom: 10, width: "100%" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accentDim, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontSize: 14, flexShrink: 0 }}>▶</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.text, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>{item.cat} · {item.dur}</div>
              </div>
              <div style={{ color: C.textDim, fontSize: 14 }}>→</div>
            </button>
          );
        })}
      </div>
    );
  };

  const HEADERS = { home:"Bulletproof Mindset", chat:"AI Support", emotions:"Workplace Check In", journal:"Work Journal", beliefs:"Belief Upgrading", reflect:"Mental Rest", learn:"Workplace Education", hr:"HR Manager" };
  const SUBS = { home:"Workplace Mental Health", chat:"Get accurate perspective", emotions:"What is this signalling?", journal:"Write it out", beliefs:"Upgrade what's running", reflect:"Rest the mental faculty", learn:"Education is the cure", hr:"HR Tools — Level 2" };

  // ─── HR HANDLERS ────────────────────────────────────────────────────────────

  const handleHrUnlock = () => {
    if (hrCodeInput.trim().toUpperCase() === HR_UNLOCK_CODE) {
      setHRUnlocked(); setHrUnlocked(true);
      setShowHrModal(false); setHrCodeInput(""); setHrCodeError("");
      setScreen("hr");
    } else {
      setHrCodeError("Incorrect code. Please check your HR Manager confirmation or contact Jay.");
    }
  };

  const sendHrMessage = async () => {
    if (!hrInput.trim() || hrTyping) return;
    const newMsgs = [...hrMessages, { role: "user", content: hrInput }];
    setHrMessages(newMsgs); setHrInput(""); setHrTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, system: HR_AI_PROMPT, messages: newMsgs.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setHrMessages([...newMsgs, { role: "assistant", content: data.content?.[0]?.text || "Something went quiet. Please try again." }]);
    } catch { setHrMessages([...newMsgs, { role: "assistant", content: "Something went quiet. Please try again." }]); }
    setHrTyping(false);
  };

  // ─── HR UNLOCK MODAL ────────────────────────────────────────────────────────
  const renderHrModal = () => (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#0a1628", border:`1px solid rgba(255,180,0,0.3)`, borderRadius:16, padding:28, maxWidth:380, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:32, marginBottom:10, color:"#f0c040" }}>◈</div>
          <div style={{ fontSize:18, color:"#f0c040", marginBottom:8 }}>HR Manager Access</div>
          <p style={{ ...S.p, textAlign:"center", marginBottom:0, fontSize:12 }}>Enter your HR Manager code to unlock the full suite of HR tools, presentations, and frameworks.</p>
        </div>
        <input value={hrCodeInput} onChange={e => { setHrCodeInput(e.target.value); setHrCodeError(""); }}
          onKeyDown={e => e.key === "Enter" && handleHrUnlock()}
          placeholder="Enter HR Manager code..." style={{ ...S.input, marginBottom:10, textAlign:"center", letterSpacing:"0.1em", textTransform:"uppercase", border:`1px solid rgba(255,180,0,0.3)` }} />
        {hrCodeError && <p style={{ fontSize:11, color:"#e85050", textAlign:"center", marginBottom:8 }}>{hrCodeError}</p>}
        <button onClick={handleHrUnlock} style={{ ...S.btn, background:"linear-gradient(135deg,#c08000,#f0a020)", color:"#fff", marginTop:4 }}>Unlock HR Tools →</button>
        <button onClick={() => { setShowHrModal(false); setHrCodeInput(""); setHrCodeError(""); }} style={{ background:"none", border:"none", color:C.textDim, fontSize:12, cursor:"pointer", width:"100%", marginTop:10, fontFamily:"'Georgia',serif" }}>Cancel</button>
      </div>
    </div>
  );

  // ─── HR LOCK SCREEN ─────────────────────────────────────────────────────────
  const renderHrLock = () => (
    <div style={S.sec}>
      <div style={{ textAlign:"center", padding:"36px 0 20px" }}>
        <div style={{ fontSize:44, marginBottom:14, color:"#f0c040" }}>◈</div>
        <div style={{ fontSize:20, color:C.text, marginBottom:6 }}>HR Manager Tools</div>
        <div style={{ fontSize:11, color:"#f0c040", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:20 }}>Level 2 — Locked</div>
      </div>
      <div style={{ ...S.card, borderColor:"rgba(255,180,0,0.25)", background:"rgba(255,180,0,0.06)", marginBottom:14 }}>
        <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#f0c040", marginBottom:10 }}>What's Inside</div>
        {[
          { icon:"◎", text:"Team Presentations — ready-to-deliver sessions on stress, conflict, burnout, and performance" },
          { icon:"◈", text:"Ability Questionnaire — identify the right role and environment for each employee" },
          { icon:"◇", text:"Conflict Resolution — guided prompts for every stage of workplace dispute" },
          { icon:"◆", text:"Performance Framework — conversations that address the belief, not just the behaviour" },
          { icon:"▤", text:"Exit Interview Framework — questions that surface the actual cause of departure" },
          { icon:"❋", text:"Onboarding Module — introduce the Wisdom Model from day one" },
          { icon:"◧", text:"Culture Assessment — identify whether your team runs the Achievement or Wisdom Model" },
          { icon:"⌂", text:"HR AI Guide — specialist support for any workplace mental health situation" },
        ].map((item,i) => (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:9 }}>
            <div style={{ color:"#f0c040", fontSize:13, flexShrink:0, marginTop:1 }}>{item.icon}</div>
            <p style={{ ...S.p, marginBottom:0, fontSize:12 }}>{item.text}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setShowHrModal(true)} style={{ ...S.btn, background:"linear-gradient(135deg,#c08000,#f0a020)", color:"#fff" }}>Enter HR Manager Code →</button>
      <div style={{ ...S.card, marginTop:12, borderColor:"rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize:10, color:C.textDim, textAlign:"center", lineHeight:1.7 }}>To upgrade to HR Manager access, contact Jay or visit the website.</div>
      </div>
    </div>
  );

  // ─── HR HOME ────────────────────────────────────────────────────────────────
  const renderHrHome = () => (
    <div style={S.sec}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:9, letterSpacing:"0.22em", color:"#f0c040", textTransform:"uppercase", marginBottom:4 }}>HR Manager — Level 2</div>
        <h1 style={{ fontSize:22, fontWeight:"normal", color:C.text, marginBottom:4 }}>HR Tools</h1>
        <p style={{ ...S.p, marginBottom:0, fontSize:12 }}>Tools and frameworks for HR managers and team leaders applying the Wisdom Model in their organisations.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[
          { label:"Presentations", icon:"◎", sub:"Team sessions ready to deliver", screen:"presentations", color:"#f0c040" },
          { label:"Ability Profile", icon:"◈", sub:"Role fit questionnaire", screen:"questionnaire", color:"#20c8a8" },
          { label:"Conflict Tools", icon:"◇", sub:"Resolution frameworks", screen:"conflict", color:"#f0c040" },
          { label:"Performance", icon:"◆", sub:"Belief-based conversations", screen:"performance", color:"#20c8a8" },
          { label:"HR AI Guide", icon:"⌂", sub:"Specialist support", screen:"hrai", color:"#f0c040" },
          { label:"← Employee App", icon:"▤", sub:"Return to employee tools", screen:"back", color:C.textDim },
        ].map(item => (
          <button key={item.screen} onClick={() => { if (item.screen === "back") setScreen("home"); else setHrScreen(item.screen); }} style={{ ...S.card, cursor:"pointer", textAlign:"left", marginBottom:0, padding:"14px", border:`1px solid ${item.screen==="presentations"||item.screen==="conflict"||item.screen==="hrai" ? "rgba(240,192,64,0.2)" : item.screen==="back" ? C.cardBorder : "rgba(32,200,168,0.2)"}` }}>
            <div style={{ fontSize:18, color:item.color, marginBottom:6 }}>{item.icon}</div>
            <div style={{ fontSize:13, color:C.text, marginBottom:2 }}>{item.label}</div>
            <div style={{ fontSize:10, color:C.textDim }}>{item.sub}</div>
          </button>
        ))}
      </div>
      <div style={{ ...S.card, borderColor:"rgba(240,192,64,0.2)", background:"rgba(240,192,64,0.05)" }}>
        <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#f0c040", marginBottom:8 }}>The Foundation</div>
        <p style={{ ...S.p, fontStyle:"italic", color:"#f0e8a0", marginBottom:0, fontSize:12 }}>"Every person in any workplace is always doing what they believe is the most important thing at that moment. Behaviour is always the output of a belief system. The correct intervention is always: identify the belief, provide the accurate understanding."</p>
      </div>
    </div>
  );

  // ─── HR PRESENTATIONS ───────────────────────────────────────────────────────
  const renderPresentations = () => {
    if (activePresentation !== null) {
      const pres = HR_PRESENTATIONS[activePresentation];
      const slide = pres.slides[presentationSlide];
      const isLast = presentationSlide === pres.slides.length - 1;
      return (
        <div style={S.sec}>
          <button onClick={() => { setActivePresentation(null); setPresentationSlide(0); }} style={{ ...S.btnOut, marginBottom:14, width:"auto", padding:"8px 14px", border:"1px solid rgba(240,192,64,0.25)", color:"#f0c040" }}>← All Presentations</button>
          <div style={{ fontSize:9, letterSpacing:"0.15em", color:"#f0c040", textTransform:"uppercase", marginBottom:4 }}>{pres.audience} · {pres.duration}</div>
          <h2 style={{ ...S.h2, marginBottom:14 }}>{pres.title}</h2>
          <div style={{ display:"flex", gap:4, marginBottom:16 }}>
            {pres.slides.map((_,i) => <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=presentationSlide?"#f0c040":"rgba(240,192,64,0.15)", transition:"background 0.3s" }} />)}
          </div>
          <div style={{ fontSize:10, color:"#f0c040", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>Slide {presentationSlide+1} of {pres.slides.length}</div>
          <div style={{ ...S.card, borderColor:"rgba(240,192,64,0.25)", background:"rgba(240,192,64,0.06)", minHeight:200, marginBottom:14 }}>
            <div style={{ fontSize:16, color:C.text, marginBottom:14, fontWeight:"normal" }}>{slide.heading}</div>
            <p style={{ ...S.p, whiteSpace:"pre-line", color:"#f0e8c8", marginBottom:0, fontSize:13, lineHeight:1.9 }}>{slide.content}</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {presentationSlide > 0 && <button onClick={() => setPresentationSlide(p=>p-1)} style={{ ...S.btnOut, flex:1, border:"1px solid rgba(240,192,64,0.25)", color:"#f0c040" }}>← Prev</button>}
            {!isLast ? (
              <button onClick={() => setPresentationSlide(p=>p+1)} style={{ ...S.btn, flex:2, background:"linear-gradient(135deg,#c08000,#f0a020)", color:"#fff", marginTop:0 }}>Next →</button>
            ) : (
              <button onClick={() => { setActivePresentation(null); setPresentationSlide(0); }} style={{ ...S.btn, flex:2, background:"linear-gradient(135deg,#c08000,#f0a020)", color:"#fff", marginTop:0 }}>Complete ✓</button>
            )}
          </div>
        </div>
      );
    }
    return (
      <div style={S.sec}>
        <button onClick={() => setHrScreen("home")} style={{ ...S.btnOut, marginBottom:14, width:"auto", padding:"8px 14px", border:"1px solid rgba(240,192,64,0.25)", color:"#f0c040" }}>← HR Home</button>
        <h2 style={S.h2}>Team Presentations</h2>
        <p style={S.p}>Ready-to-deliver presentations for team sessions. Each is structured as a set of slides with talking points. Tap any presentation to begin.</p>
        {HR_PRESENTATIONS.map((pres,i) => (
          <button key={i} onClick={() => { setActivePresentation(i); setPresentationSlide(0); }} style={{ ...S.card, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14, marginBottom:10, width:"100%", border:"1px solid rgba(240,192,64,0.18)" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(240,192,64,0.1)", border:"1px solid rgba(240,192,64,0.25)", display:"flex", alignItems:"center", justifyContent:"center", color:"#f0c040", fontSize:14, flexShrink:0 }}>◎</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:C.text, marginBottom:2 }}>{pres.title}</div>
              <div style={{ fontSize:10, color:C.textDim }}>{pres.audience} · {pres.duration} · {pres.slides.length} slides</div>
            </div>
            <div style={{ color:"#f0c040", fontSize:14 }}>→</div>
          </button>
        ))}
      </div>
    );
  };

  // ─── HR QUESTIONNAIRE ───────────────────────────────────────────────────────
  const renderQuestionnaire = () => (
    <div style={S.sec}>
      <button onClick={() => setHrScreen("home")} style={{ ...S.btnOut, marginBottom:14, width:"auto", padding:"8px 14px", border:"1px solid rgba(32,200,168,0.25)", color:"#20c8a8" }}>← HR Home</button>
      <h2 style={S.h2}>Employee Ability Profile</h2>
      <p style={S.p}>Use this questionnaire in role placement conversations, performance reviews, or development discussions. Each question surfaces specific beliefs about ability and worth that indicate role fit and psychological risk.</p>
      <div style={{ ...S.card, borderColor:"rgba(32,200,168,0.25)", background:"rgba(32,200,168,0.06)", marginBottom:14 }}>
        <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#20c8a8", marginBottom:8 }}>How to Use This</div>
        <p style={{ ...S.p, fontSize:12, marginBottom:0, whiteSpace:"pre-line" }}>{HR_ABILITY_QUESTIONNAIRE.intro}</p>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {HR_ABILITY_QUESTIONNAIRE.sections.map((sec,i) => (
          <button key={i} onClick={() => setQuestSection(i)} style={{ fontSize:10, padding:"5px 10px", background:questSection===i?"rgba(32,200,168,0.15)":"transparent", border:`1px solid ${questSection===i?"#20c8a8":"rgba(32,200,168,0.2)"}`, borderRadius:6, color:questSection===i?"#20c8a8":C.textDim, cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" }}>{sec.title}</button>
        ))}
        <button onClick={() => setQuestSection(HR_ABILITY_QUESTIONNAIRE.sections.length)} style={{ fontSize:10, padding:"5px 10px", background:questSection===HR_ABILITY_QUESTIONNAIRE.sections.length?"rgba(32,200,168,0.15)":"transparent", border:`1px solid ${questSection===HR_ABILITY_QUESTIONNAIRE.sections.length?"#20c8a8":"rgba(32,200,168,0.2)"}`, borderRadius:6, color:questSection===HR_ABILITY_QUESTIONNAIRE.sections.length?"#20c8a8":C.textDim, cursor:"pointer", fontFamily:"'Georgia',serif" }}>Ability Guide</button>
      </div>
      {questSection < HR_ABILITY_QUESTIONNAIRE.sections.length ? (
        <div>
          <div style={{ fontSize:12, color:"#20c8a8", fontWeight:"bold", marginBottom:12, letterSpacing:"0.04em" }}>{HR_ABILITY_QUESTIONNAIRE.sections[questSection].title}</div>
          {HR_ABILITY_QUESTIONNAIRE.sections[questSection].questions.map((q,i) => (
            <div key={i} style={{ ...S.card, marginBottom:10, border:"1px solid rgba(32,200,168,0.15)" }}>
              <div style={{ fontSize:13, color:C.text, marginBottom:8, lineHeight:1.5 }}>"{q.text}"</div>
              <div style={{ fontSize:10, color:"#20c8a8", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Why ask this</div>
              <p style={{ ...S.p, marginBottom:0, fontSize:11, color:"rgba(32,200,168,0.75)" }}>{q.purpose}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ fontSize:12, color:"#20c8a8", fontWeight:"bold", marginBottom:12 }}>Ability → Organ → Role Guide</div>
          <p style={{ ...S.p, fontSize:12, marginBottom:12 }}>The ability a person believes is most important corresponds to a specific organ in the mind/body system. Sustained concern about that ability under stress will affect the corresponding organ. Use this guide to understand the psychosomatic implications of role placement.</p>
          {HR_ABILITY_QUESTIONNAIRE.ability_guide.map((item,i) => (
            <div key={i} style={{ ...S.card, marginBottom:10, border:"1px solid rgba(32,200,168,0.15)" }}>
              <div style={{ fontSize:12, color:C.text, marginBottom:4, fontWeight:"bold" }}>{item.ability}</div>
              <div style={{ fontSize:10, color:"#20c8a8", letterSpacing:"0.06em", marginBottom:6 }}>Organ: {item.organ}</div>
              <p style={{ ...S.p, marginBottom:0, fontSize:11 }}>{item.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── HR CONFLICT ────────────────────────────────────────────────────────────
  const renderConflict = () => (
    <div style={S.sec}>
      <button onClick={() => setHrScreen("home")} style={{ ...S.btnOut, marginBottom:14, width:"auto", padding:"8px 14px", border:"1px solid rgba(240,192,64,0.25)", color:"#f0c040" }}>← HR Home</button>
      <h2 style={S.h2}>Conflict Resolution</h2>
      <p style={S.p}>Every workplace conflict traces to the same root belief — that someone could have simply chosen to act differently. These tools help you address that belief directly at every stage of a dispute.</p>
      {HR_CONFLICT.map((section,i) => (
        <div key={i}>
          <button onClick={() => setActiveConflictSection(activeConflictSection===i ? null : i)} style={{ ...S.card, cursor:"pointer", textAlign:"left", width:"100%", display:"flex", gap:12, alignItems:"center", marginBottom:activeConflictSection===i ? 0 : 10, borderBottomLeftRadius:activeConflictSection===i ? 0 : 12, borderBottomRightRadius:activeConflictSection===i ? 0 : 12, border:"1px solid rgba(240,192,64,0.18)" }}>
            <div style={{ fontSize:18, color:"#f0c040", flexShrink:0 }}>{section.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:C.text, marginBottom:2 }}>{section.title}</div>
              <div style={{ fontSize:11, color:C.textDim }}>{section.desc}</div>
            </div>
            <div style={{ color:"#f0c040", fontSize:12 }}>{activeConflictSection===i ? "▲" : "▼"}</div>
          </button>
          {activeConflictSection===i && (
            <div style={{ background:"rgba(240,192,64,0.05)", border:"1px solid rgba(240,192,64,0.18)", borderTop:"none", borderRadius:"0 0 12px 12px", padding:"14px 16px", marginBottom:10 }}>
              {section.prompts.map((p,j) => (
                <div key={j} style={{ marginBottom:14, paddingBottom:14, borderBottom:j<section.prompts.length-1?`1px solid rgba(240,192,64,0.1)`:"none" }}>
                  <div style={{ fontSize:10, color:"#f0c040", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>{p.label}</div>
                  <div style={{ fontSize:13, color:C.text, fontStyle:"italic", marginBottom:8, lineHeight:1.6, background:"rgba(240,192,64,0.06)", padding:"10px 12px", borderRadius:8, borderLeft:"3px solid rgba(240,192,64,0.4)" }}>"{p.q}"</div>
                  <p style={{ ...S.p, marginBottom:0, fontSize:11, color:C.textDim }}>{p.purpose}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ─── HR PERFORMANCE ─────────────────────────────────────────────────────────
  const renderPerformance = () => (
    <div style={S.sec}>
      <button onClick={() => setHrScreen("home")} style={{ ...S.btnOut, marginBottom:14, width:"auto", padding:"8px 14px", border:"1px solid rgba(32,200,168,0.25)", color:"#20c8a8" }}>← HR Home</button>
      <h2 style={S.h2}>Performance Framework</h2>
      <p style={S.p}>Tools for underperformance conversations, exit interviews, onboarding, and culture assessment — all grounded in addressing the belief, not just the behaviour.</p>
      {HR_PERFORMANCE.map((section,i) => (
        <div key={i}>
          <button onClick={() => setActivePerfSection(activePerfSection===i ? null : i)} style={{ ...S.card, cursor:"pointer", textAlign:"left", width:"100%", display:"flex", gap:12, alignItems:"center", marginBottom:activePerfSection===i ? 0 : 10, borderBottomLeftRadius:activePerfSection===i ? 0 : 12, borderBottomRightRadius:activePerfSection===i ? 0 : 12, border:"1px solid rgba(32,200,168,0.18)" }}>
            <div style={{ fontSize:18, color:"#20c8a8", flexShrink:0 }}>{section.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:C.text, marginBottom:2 }}>{section.title}</div>
              <div style={{ fontSize:11, color:C.textDim }}>{section.desc}</div>
            </div>
            <div style={{ color:"#20c8a8", fontSize:12 }}>{activePerfSection===i ? "▲" : "▼"}</div>
          </button>
          {activePerfSection===i && (
            <div style={{ background:"rgba(32,200,168,0.04)", border:"1px solid rgba(32,200,168,0.18)", borderTop:"none", borderRadius:"0 0 12px 12px", padding:"14px 16px", marginBottom:10 }}>
              {section.steps.map((step,j) => (
                <div key={j} style={{ marginBottom:16, paddingBottom:16, borderBottom:j<section.steps.length-1?`1px solid rgba(32,200,168,0.1)`:"none" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ fontSize:13, color:"#20c8a8", fontWeight:"bold", minWidth:28 }}>{step.num}</div>
                    <div style={{ fontSize:13, color:C.text }}>{step.title}</div>
                  </div>
                  <p style={{ ...S.p, marginBottom:0, fontSize:12, whiteSpace:"pre-line", paddingLeft:38 }}>{step.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ─── HR AI ──────────────────────────────────────────────────────────────────
  const renderHrAi = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 130px)" }}>
      <div style={{ padding:"8px 12px", background:"rgba(240,192,64,0.06)", borderBottom:"1px solid rgba(240,192,64,0.18)", display:"flex", gap:6, flexWrap:"wrap" }}>
        {["Help with a conflict","Underperformance conversation","Building Wisdom Model culture","Onboarding approach"].map(q => (
          <button key={q} onClick={() => setHrInput(q)} style={{ fontSize:10, padding:"4px 9px", background:"rgba(240,192,64,0.1)", border:"1px solid rgba(240,192,64,0.25)", borderRadius:6, color:"#f0c040", cursor:"pointer", fontFamily:"'Georgia',serif" }}>{q}</button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px 0" }}>
        {hrMessages.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:10 }}>
            <div style={{ maxWidth:"86%", padding:"10px 14px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px", background:m.role==="user"?"linear-gradient(135deg,#c08000,#f0a020)":C.card, border:m.role==="user"?"none":"1px solid rgba(240,192,64,0.15)", color:m.role==="user"?"#fff":C.text, fontSize:13, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {hrTyping && <div style={{ display:"flex", marginBottom:10 }}><div style={{ padding:"10px 14px", borderRadius:"14px 14px 14px 4px", background:C.card, border:"1px solid rgba(240,192,64,0.15)" }}><div style={{ display:"flex", gap:4 }}>{[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#f0c040", opacity:0.7 }} />)}</div></div></div>}
        <div ref={hrChatRef} />
      </div>
      <div style={{ padding:"10px 12px 14px", borderTop:"1px solid rgba(240,192,64,0.18)", display:"flex", gap:8 }}>
        <textarea value={hrInput} onChange={e => setHrInput(e.target.value)} onKeyDown={e => e.key==="Enter" && !e.shiftKey && (e.preventDefault(), sendHrMessage())} placeholder="Describe your HR situation..." rows={2} style={{ ...S.input, flex:1, resize:"none", border:"1px solid rgba(240,192,64,0.25)" }} />
        <button onClick={sendHrMessage} disabled={hrTyping} style={{ ...S.btn, width:42, marginTop:0, padding:0, borderRadius:"50%", height:42, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, background:"linear-gradient(135deg,#c08000,#f0a020)", color:"#fff" }}>→</button>
      </div>
    </div>
  );

  // ─── HR RENDER SCREEN ───────────────────────────────────────────────────────
  const renderHrScreen = () => {
    switch(hrScreen) {
      case "home": return renderHrHome();
      case "presentations": return renderPresentations();
      case "questionnaire": return renderQuestionnaire();
      case "conflict": return renderConflict();
      case "performance": return renderPerformance();
      case "hrai": return renderHrAi();
      default: return renderHrHome();
    }
  };



  const renderScreen = () => {
    if (screen === "hr") {
      if (!hrUnlocked) return renderHrLock();
      return renderHrScreen();
    }
    switch(screen) {
      case "home": return renderHome();
      case "chat": return renderChat();
      case "emotions": return renderEmotions();
      case "journal": return renderJournal();
      case "beliefs": return renderBeliefs();
      case "reflect": return renderReflect();
      case "learn": return renderLearn();
      default: return renderHome();
    }
  };

  const isHrChat = screen === "hr" && hrScreen === "hrai";
  const isChatScreen = screen === "chat" || isHrChat;
  const headerColor = screen === "hr" ? "#f0c040" : C.accent;
  const headerTextColor = screen === "hr" ? "#f0e8a0" : "#c0d8ff";

  return (
    <div style={S.app}>
      {showHrModal && renderHrModal()}
      {!isChatScreen && (
        <div style={S.header}>
          <div style={{ fontSize:9, letterSpacing:"0.2em", color:headerColor, textTransform:"uppercase", marginBottom:2 }}>{HEADERS[screen] || "HR Manager"}</div>
          <div style={{ fontSize:15, fontWeight:"normal", color:headerTextColor, fontStyle:"italic" }}>{SUBS[screen] || "HR Tools — Level 2"}</div>
        </div>
      )}
      {isChatScreen && (
        <div style={S.header}>
          <div style={{ fontSize:9, letterSpacing:"0.2em", color:headerColor, textTransform:"uppercase", marginBottom:2 }}>{isHrChat ? "HR AI Guide" : "AI Support"}</div>
          <div style={{ fontSize:15, fontWeight:"normal", color:headerTextColor, fontStyle:"italic" }}>{isHrChat ? "Specialist HR support" : "Get accurate perspective"}</div>
        </div>
      )}
      <div style={S.content}>{renderScreen()}</div>
      <nav style={S.nav}>
        {[...NAV, { id:"hr", icon:"◈", label:hrUnlocked?"HR":"HR 🔒" }].map(n => (
          <button key={n.id} onClick={() => {
            if (n.id === "hr" && !hrUnlocked) { setShowHrModal(true); return; }
            setScreen(n.id);
            if (n.id !== "hr") setHrScreen("home");
          }} style={S.navBtn(screen===n.id)}>
            <span style={{ ...S.navIcon(screen===n.id), color: n.id==="hr" ? (screen==="hr" ? "#f0c040" : hrUnlocked ? "#f0c040" : C.textDim) : undefined }}>{n.icon}</span>
            <span style={{ ...S.navLabel, color: n.id==="hr" ? (screen==="hr" ? "#f0c040" : hrUnlocked ? "#f0c040" : C.textDim) : undefined }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
