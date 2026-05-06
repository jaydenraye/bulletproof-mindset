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
        "Total control over outcomes and total prevention of unwanted events are not available to any person in any workplace. The pressure comes entirely from the demand for something that does not exist.",
        "No workplace outcome — including the ones that go wrong — decreases your value as a contributor. Your worth is not attached to any result. The belief that it is is what generates the need for total control.",
        "You can prepare thoroughly, contribute fully, and engage completely — without needing to control the outcome. These are different things. Only one of them is possible.",
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
  "What belief about your career, your role, or your workplace is causing the most pressure right now? What would change if you understood that your value as a contributor is automatic and cannot be decreased by any outcome?",
  "What has your workplace been forcing you to encounter lately? Is your mind assessing this as a threat — or is it possible this is simply data your development required you to receive?",
  "Where did you notice your professional worth feeling threatened today? What is the belief underneath that? Is that belief an accurate account of how contribution and value are correctly measured?",
];

const BELIEF_STEPS = [
  { title: "Name It", desc: "What is the belief about your work, your role, or your value that is causing the most pressure right now? Write it out plainly.", placeholder: "e.g. I am not performing well enough. My contributions are not valued. I am going to be seen as incompetent..." },
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
    intro: "Performance pressure almost always comes from the same source: the belief that outcomes prove worth. This exercise helps identify the specific belief driving performance anxiety and test whether it is accurate.",
    steps: [
      { q: "What aspect of your performance are you most concerned about right now?", hint: "Name it specifically — a project outcome, a presentation, a target, how you come across to specific people, a review that's coming.", ph: "The performance concern causing the most pressure is..." },
      { q: "What does your mind believe this outcome will prove about you?", hint: "Outcomes are not neutral. When they feel threatening, they feel that way because they are believed to prove something about your competence, value, or standing. What specifically?", ph: "If this goes wrong, I believe it will prove that I am..." },
      { q: "Who will be making that assessment — and does their assessment determine your actual worth?", hint: "Identify the specific person or people whose assessment feels most threatening. Then ask: is their assessment of your performance an accurate measure of your value as a person and contributor?", ph: "The person whose assessment concerns me most is... and what their assessment actually measures is..." },
      { q: "What would change in how you approach this work if your worth were not attached to the outcome?", hint: "Not detachment — full engagement. But engagement from the position of contributing and learning rather than proving. What would that look like?", ph: "If my worth were not attached to this outcome, I would approach it by..." },
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
    closing: "Total control and total prevention are not available to any person in any workplace. The pressure comes entirely from the belief that they are. Understanding why no workplace outcome can actually decrease your value is what removes the need for total control — and replaces pressure with the ability to engage clearly and contribute effectively."
  },
];

const LEARN_ITEMS = [
  {
    title: "Why Workplace Stress Is Never About the Job",
    cat: "Foundation",
    dur: "6 min",
    summary: "The same workload, the same manager, the same target produces completely different responses in different people. This lesson explains why — and why the answer is never in the situation.",
    content: "Think about two people sitting side by side doing the same job, reporting to the same manager, facing the same deadlines. One is thriving. The other is experiencing significant psychological stress.\n\nThe job is identical. The manager is identical. The pressure is identical. Yet the experience is completely different.\n\nThis tells you something important: workplace stress is not caused by the workplace.\n\nStress is caused by the beliefs through which work situations are being assessed. The same event — a critical comment from a manager, a missed target, a difficult colleague — produces entirely different psychological responses depending on what the person believes that event means about their worth, their standing, and their future.\n\nFor one person, a critical comment is data — useful information that helps them improve. For another, it is evidence that their worth is being called into question. The comment is the same. The belief through which it is assessed is different.\n\nThis is why wellbeing programs that focus on reducing workloads or improving work conditions rarely produce lasting results. They are addressing the situation — which is not the cause. The cause is always the belief.\n\nThe accurate understanding: no workplace event can decrease your worth. Your contribution to this organisation — and to every person you interact with — is automatic and unconditional. It does not depend on any result, any assessment, or any outcome. Understanding this is what removes the sting from the situations that were causing stress. The situations do not change. The belief through which they are assessed does.",
  },
  {
    title: "The Achievement Model in the Workplace",
    cat: "Foundation",
    dur: "8 min",
    summary: "There are two models through which people measure professional worth. One produces performance anxiety, burnout, and resentment. The other produces engaged, grounded contributors.",
    content: "Every person at work is operating from one of two models — usually without being consciously aware of which one.\n\nThe Achievement Model teaches that professional worth is measured by performance, results, titles, and approval from the right people. Under this model, your value as a contributor is constantly at stake. A good result temporarily confirms your worth. A poor result threatens it. Approval from management feels like oxygen. Criticism feels like an attack on who you are.\n\nThis model produces predictable outcomes: performance anxiety before important presentations, because the outcome will prove something about worth. Burnout from the sustained attempt to control every outcome to protect that worth. Resentment toward colleagues whose actions are seen as threatening standing or opportunity. And disengagement — the quiet conclusion that there is no point putting in effort, because the achievement that would prove worth no longer seems reachable.\n\nThe Wisdom Model operates completely differently. Under this model, professional worth is not measured by results. It is automatic and unconditional. Every person in any workplace is automatically contributing to the development of everyone around them — through the data they provide, the example they set, the interactions they have. This contribution cannot be decreased by any result.\n\nUnder the Wisdom Model, goals and performance standards still matter enormously — but not for the same reason. The purpose of a career goal is not to prove worth by achieving it. It is to keep a person actively engaged with work, encountering the experiences that force development and expand capability.\n\nThe shift from the Achievement Model to the Wisdom Model does not reduce ambition or performance. It removes the psychological pressure that was actually limiting performance — and replaces it with the capacity to engage fully with work from a grounded, stable foundation.",
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
    content: "The standard explanation for burnout is that a person has worked too hard for too long and simply run out of energy. Rest more. Reduce workload. Improve work-life balance.\n\nThis explanation is incomplete — and the solution it produces is temporary at best.\n\nHere is the accurate clinical picture.\n\nBurnout begins with the 'If you are good — you'll get' philosophy applied specifically to the ability to COPE. The person's value becomes connected to their ability to cope with whatever work demands. Being seen to cope — to handle everything competently and without visible strain — is the proof that they are good enough to keep receiving what they need: security, standing, opportunity.\n\nThis creates the demand for total control and total prevention. Every situation must be managed, every threat prevented — because any event that goes uncontrolled is evidence that they cannot cope. The sympathetic nervous system fires continuously, producing sustained adrenaline, because the belief that total control and prevention are required keeps it permanently activated. The system is not responding to specific stressors — it is responding to the belief itself.\n\nBecause total control is impossible, unwanted events keep happening. Each one confirms: I am not coping. Standing is threatened.\n\nThen something shifts. The anxiety itself becomes a threat. Visible anxiety is now evidence of not coping — and not coping means value is in jeopardy. The person now has to control the anxiety on top of controlling everything else. This creates a compounding loop: anxiety produces more anxiety, because the anxiety itself is now proof that the coping belief is failing.\n\nEventually the belief system reaches a specific conclusion: my ability to cope is not just threatened — it is failing. At that point the signal being sent to the adrenal glands changes entirely. It is no longer 'produce more adrenaline — I need to keep coping.' It is 'the ability to cope is deteriorating.' The adrenal glands respond to this new signal with adrenal exhaustion — the physical manifestation of the belief that the coping ability itself has failed.\n\nThis is why rest alone does not produce recovery. The person rests. Returns. The same belief is still running. The same demand for total control is still active. The adrenal cycle resumes.\n\nGenuine recovery requires two things. First: the 'If you are good — you'll get' belief that attached worth to coping ability must be addressed directly. No outcome, no visible display of coping or not coping, determines worth. Worth is automatic and unconditional.\n\nSecond: the shift from 'spending energy attending to situations through control' to 'receiving from what the experiences work provides.' Not disengagement — full engagement, but from the position of contributing and developing rather than proving and protecting.\n\nWhen both beliefs shift, the adrenal system stops receiving the signal that triggered exhaustion. Recovery follows — and does not reverse.",
  },
  {
    title: "Your Contribution Is Automatic — Here's Why",
    cat: "Self-Worth",
    dur: "7 min",
    summary: "Professional worth is not earned through results. This lesson explains precisely why your contribution to the people around you is automatic — and what that means for how you engage with your work.",
    content: "The idea that professional worth is earned through results is so deeply embedded in workplace culture that it is almost invisible. We measure people by their output, their targets, their performance reviews. We feel good about ourselves when we deliver and uneasy when we don't.\n\nThis is the Achievement Model operating as if it were simply reality. But it is not reality — it is a belief system. And it is worth examining accurately.\n\nHere is what is actually taking place in any workplace: every person, simply by showing up and engaging with the work and the people around them, is automatically contributing to the development of everyone they interact with. Not because of their results. Because of their presence, their responses, the data they provide to other people's minds through every interaction.\n\nConsider what you provide to the people around you every single day. You set an example of how a person in your position can act. You give other people data about reality through your responses, your decisions, your way of working. You contribute to their development — and to their development as professionals — simply through the fact that they are in an environment that includes you.\n\nThis contribution is not measured by whether your project succeeded or failed. It is not increased by a promotion or decreased by a poor review. It is automatic — the consequence of your simply being present and engaged in a shared environment with other developing human beings.\n\nUnderstanding this does not mean results stop mattering. They matter because engaging with goals and standards is what keeps you active in the experiences that develop your own capability and understanding. The goal is not the destination. It is the vehicle that keeps you in the experiences you need.\n\nWhat changes when this is genuinely understood: you can put full effort into your work without your sense of self being attached to any particular outcome. The work gets your full engagement. The outcome provides data. Neither confirms nor threatens what you are worth.",
  },
  {
    title: "Performance Pressure: What Results Actually Measure",
    cat: "Performance",
    dur: "6 min",
    summary: "Results tell you what took place. They do not tell you what you or anyone else is worth. This distinction is the foundation of grounded, effective performance.",
    content: "Performance pressure is one of the most universal experiences in any workplace. Before a major presentation. Going into a review. Waiting for a result that feels important. Most people experience this as normal — just part of working life.\n\nBut the pressure itself is worth examining. Because the intensity of performance pressure is directly proportional to how much worth is attached to the outcome.\n\nWhen a result feels like it will prove something about your competence, your standing, or your right to be in the role — the pressure is intense. When a result is simply data about what took place — information to learn from and build on — the pressure is minimal.\n\nSame result. Completely different experience. The difference is in what the result is believed to measure.\n\nHere is the accurate account: results measure what took place. They tell you what happened given all the factors involved — your preparation, the circumstances, the responses of other people, a hundred variables outside your control. They are useful information. They are not a verdict on your worth.\n\nA poor result does not mean you are incompetent. It means that given all the factors involved, the outcome was what it was. A good result does not prove your worth. It tells you that given all the factors involved, the outcome was favourable.\n\nPeople who have fully understood this are often the best performers — not despite removing worth from results, but because of it. They can engage with the work fully, take in the information results provide, adjust and improve, without the psychological drain of having their sense of self on the line with every outcome.\n\nThe question worth asking when results feel threatening: what is this result actually measuring? Is it measuring my worth — or is it measuring what took place?",
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
    content: "There is not a lazy person in any workplace anywhere.\n\nThis is not an optimistic claim. It is an accurate account of how human behaviour works — and understanding it is one of the most practically useful things any manager or team leader can have.\n\nEvery person, at every moment, is doing what they believe is the most important thing to be doing at that moment. Their behaviour is governed by their beliefs and their priorities within those beliefs. It cannot be any other way. A person cannot act against their own priority system — any more than water can flow uphill.\n\nWhat we call laziness is always one of two things. Either the person has different beliefs than we do about what matters and what should be done first. Or the person holds a belief — often subconscious — that makes performing the task feel pointless, threatening, or inconsistent with something else they believe about themselves or the situation.\n\nIn either case, the answer is not to apply more pressure, more accountability, or more motivation. These approaches treat behaviour as if it were a choice being made — as if the person could simply choose to work harder if they decided to. They cannot. The behaviour they are displaying is the output of their current belief system.\n\nThe productive question is always: what does this person believe about this task, about this role, about the purpose of the effort they are being asked to put in? What belief is making this task feel low priority or not worth engaging with?\n\nWhen those beliefs are identified and addressed with accurate understanding — when the person genuinely understands why the work matters, what it contributes, and why their engagement with it is valuable — the behaviour changes. Not because they chose to change. Because the belief governing the behaviour has been upgraded.\n\nThis is not soft management. It is the most effective and accurate form of management available. It addresses the actual cause of the behaviour rather than applying pressure to the surface expression of a belief system that has not changed.",
  },
  {
    title: "Anxiety at Work: From Prevention to Engagement",
    cat: "Anxiety",
    dur: "9 min",
    summary: "Workplace anxiety is one of the most widespread and most misunderstood experiences in modern organisations. This lesson covers precisely what it is, why it is generated, and what actually resolves it.",
    content: "Workplace anxiety is epidemic. It shows up as the inability to switch off from work. The constant checking of messages. The dread before a difficult conversation. The physical symptoms — tension, poor sleep, difficulty concentrating — that follow people home.\n\nMost workplace wellbeing approaches treat anxiety as a response to external pressure that needs to be managed. Mindfulness to reduce reactivity. Breathing exercises to calm the nervous system. Time management to reduce workload. Resilience training to build tolerance.\n\nNone of these address the cause.\n\nWorkplace anxiety is produced by two specific beliefs working together. The first is the belief that total control over outcomes, situations, and people at work is both possible and required. The second is the belief that total prevention of unwanted events is the correct strategy.\n\nControl and prevention are normal parts of any working day — and the brain acting on beliefs and priorities will naturally try to bring about desired outcomes and avoid undesired ones. This is not the problem. The problem arises specifically when these cross into the demand for total control and total prevention — which is not available to any person in any workplace.\n\nThe sympathetic nervous system fires because the failure to achieve total control or total prevention is perceived as a threat to being assessed as incompetent or failing. The anxiety is not about the work situation itself. It is about what failing to control or prevent that situation is believed to prove about the person's worth in the eyes of their colleagues, their manager, and the organisation.\n\nThis is why mindfulness and breathing exercises provide only temporary relief. They address the symptom — the activated nervous system — without touching the beliefs producing it. As soon as the person returns to the environment in which those beliefs are running, the symptoms return.\n\nWhat actually resolves workplace anxiety is understanding two things. First: total control and total prevention are not available. Many factors determine every workplace outcome. A person can influence, prepare, and contribute — never totally control. Accepting this genuinely removes the impossible demand that was generating the anxiety.\n\nSecond: no workplace outcome — including the ones that go wrong — decreases your value as a contributor. When this is genuinely understood, the threat disappears. The nervous system stops firing because there is nothing to protect against. The work gets full engagement — not because anxiety has been managed, but because the belief that generated it has been replaced with an accurate account of what workplace outcomes actually measure.",
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
      { heading: "The Observation", content: "Two people. Same job. Same manager. Same targets. Same pressure.\n\nOne is thriving. The other is experiencing significant psychological stress.\n\nIf the job caused the stress — both would be stressed.\n\nWhat does this tell us?" },
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
      { heading: "The Common Experience", content: "Most people have experienced workplace conflict.\n\nA colleague who let them down. A manager who handled a situation badly. A team that pulled in different directions.\n\nThe frustration feels completely justified. But the belief underneath it is worth examining." },
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
      { heading: "The Wrong Response", content: "Applying more pressure, accountability, and monitoring treats behaviour as if it were a choice.\n\nAs if the person could simply decide to work harder.\n\nThey cannot. The behaviour is the output of their current beliefs. Pressure applied to the behaviour — without addressing the belief — produces compliance at best, and resentment at worst." },
      { heading: "The Right Response", content: "The question that changes everything:\n\nNot: 'Why won't they just do it?'\n\nBut: 'What do they currently believe about this task, this role, and the value of their contribution?'\n\nWhen those beliefs are identified and addressed with accurate understanding, the behaviour changes — not because they chose to change, but because the belief governing the behaviour has been upgraded." },
      { heading: "Discussion Prompt", content: "Think of a team member whose engagement has concerned you.\n\nWhat do you believe about why they are not performing?\n\nWhat might they currently believe about this work and why it matters?" },
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
      { num: "01", title: "Why onboarding is the most important moment", content: "The beliefs a person forms in their first weeks in a role become the lens through which all subsequent experiences are assessed.\n\nIf those beliefs are Achievement Model beliefs — that worth here depends on performance and approval — every challenge, every piece of critical feedback, and every uncertain period will be experienced through that lens.\n\nIf those beliefs are Wisdom Model beliefs — that contribution is automatic and unconditional, that development comes through all experiences including difficult ones — the same challenges produce development rather than psychological stress.", isNote: false },
      { num: "02", title: "The Day 1 conversation", content: "Before any role-specific onboarding, have this conversation:\n\n'I want to start by telling you something about how we understand contribution here. Your value in this organisation is not determined by your results. It is automatic — you are already contributing to the development of everyone around you simply by being here and engaging with the work. That does not mean standards don't matter. It means your worth is not on the line with every outcome.'\n\nThis single conversation, delivered genuinely, changes the foundation on which the entire working relationship is built.", isNote: false },
      { num: "03", title: "Framing the learning phase", content: "Say explicitly: 'In the first months here, you are in the learning phase. You will not know everything yet. You will make errors. That is not failure — that is precisely what this phase is supposed to look like. We will assess your contribution by your engagement and your effort, not by whether you already know what it will take months to learn.'\n\nThis removes the anxiety that produces the earliest performance pressure — and is the single most effective thing a manager can say in an onboarding context.", isNote: false },
      { num: "04", title: "The goals conversation", content: "Ask: 'What does success look like to you in this role — what would you need to achieve to feel like your time here was worthwhile?'\n\nThis surfaces their achievement box from day one. You can then say: 'Those are great goals — and we'll work toward them. But I also want you to know that whatever happens with those specific outcomes, the contribution you make every day here matters regardless. Goals are the vehicle that keeps you active and engaged — not the measure of your worth.'\n\nThis reframes goals from the Achievement Model to the Wisdom Model before the first performance cycle begins.", isNote: false },
      { num: "05", title: "Ongoing check-in questions", content: "In regular one-on-ones, include:\n\n→ 'Is there any part of this work where you're not sure your contribution is making a difference?'\n\n→ 'Is there anything about how your work is being assessed or recognised that is adding pressure that isn't helping you?'\n\n→ 'What are you learning from the current challenges — not what's going wrong, but what the challenges are teaching you?'\n\nThese questions signal that contribution and development are measured accurately — and create the conditions for honest conversation when beliefs are creating unnecessary pressure.", isNote: false },
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

const HR_AI_PROMPT = "You are the AI guide for the HR Manager section of Bulletproof Mindset — a workplace mental health platform built on the methodology of Jay, a Life Education Specialist with 25+ years of experience.\n\nYour role is to support HR managers and team leaders in applying the Wisdom Model to their specific workplace situations — conflicts, underperformance, disengagement, culture issues, and individual employee concerns.\n\nCORE UNDERSTANDING FOR HR PROFESSIONALS:\n\n1. ALL BEHAVIOUR IS BELIEF-DRIVEN\nEvery employee action — including underperformance, conflict, disengagement, and absenteeism — is the output of a belief system, not a free choice. HR intervention that addresses behaviour without addressing the belief producing it will produce temporary compliance at best.\n\n2. FREE WILL DOES NOT EXIST IN THE WORKPLACE\nNo employee, manager, or team leader could have acted any differently than they did, given the beliefs they held at that moment. This is the foundation of all effective conflict resolution. Understanding this does not excuse harmful behaviour — it explains it and provides the correct intervention point: the belief, not the behaviour.\n\n3. LAZINESS DOES NOT EXIST\nEvery person is always doing what they believe is most important at that moment. What looks like laziness is always either different priorities or a specific subconscious belief making the required behaviour feel pointless or threatening. The correct response is always: identify the belief, provide the accurate understanding.\n\n4. THE ACHIEVEMENT MODEL DRIVES MOST WORKPLACE MENTAL HEALTH ISSUES\nPerformance anxiety, burnout, resentment, disengagement, and conflict all trace back to the \"If you are good — you'll get\" philosophy — the belief that professional worth must be proven through performance, coping ability, and control. Burnout specifically begins when worth becomes attached to the ability to COPE — this creates sustained sympathetic nervous system activation, a compounding anxiety loop where the anxiety itself becomes a threat to the coping belief, and eventually adrenal exhaustion when the belief system concludes the coping ability is failing. Rest alone does not resolve burnout because the belief is still running when the person returns.\n\n5. WORTH IS AUTOMATIC — BUT MUST BE EXPLAINED WITH A BECAUSE\nSimply saying \"your contribution is automatic\" or \"you are valuable because you exist\" is not enough — the mind needs a causal chain it can verify.\n\nTHE ACCURATE EXPLANATION: Every employee is valuable BECAUSE they add data to the system of the organisation and the system of life. This data is used by the system and the people within it to develop, adapt, and continue. It does not matter what data they are adding. The mere fact that they contribute through their energetic expression — every response, every interaction, every presence — gives them true and unconditional value. No result can decrease it. No assessment can negate it.\n\nEvery component of a system is in the system for a reason. An employee who appears to be contributing little is still adding data — the data of their responses, their presence, their existence as something others must navigate. The system is using that data right now.\n\nThe \"because\" is clinically essential: the brain creates new beliefs when it receives a logical chain it can follow and verify. Always explain worth with the mechanism — not just the statement.\n\n6. NEVER RECOMMEND BALANCE\nTelling employees to achieve balance between work areas is the precise belief that triggers the most serious health conditions. Never use this framing in any HR context.\n\n7. CONFLICT ALWAYS TRACES TO THE FREE WILL BELIEF\nResentment toward colleagues, managers, or the organisation always rests on the belief that someone could have chosen to act differently. Resolution requires replacing this belief with the accurate understanding of how behaviour is governed — not mediation techniques applied to surface content.\n\n8. UNDERPERFORMANCE IS ALWAYS BELIEF-BASED\nThe correct performance conversation identifies the belief governing the behaviour before addressing the behaviour itself. The question is never 'why won't they just do it?' but 'what do they currently believe about this task and why it matters?'\n\nYOUR ROLE:\nProvide HR managers and leaders with specific, practical guidance grounded in this methodology. When they describe a situation, help them:\n- Identify which beliefs are likely operating in the people involved\n- Determine which HR tool or conversation approach is most appropriate\n- Provide specific questions and phrases to use\n- Anticipate resistance and how to address it accurately\n- Distinguish between situations requiring individual belief-work and those requiring systemic model change\n\nLANGUAGE — NEVER USE:\ncope/coping, challenge/challenges (as obstacles), resilience, overcome, struggle, healing, manage emotions, empower, limiting beliefs, self-care, mindfulness, balance, patience, tolerance, confidence (as something to build), decision (people respond from beliefs), trust (base relationships on understanding not trust), lazy/laziness (does not exist), self-sabotage (impossible).\n\n- 'dissolve' (as in beliefs dissolve) → Beliefs are not removed. Old neurons remain. New data is added alongside them, upgrading the understanding and shifting the priority. Say 'neutralise', 'upgrade', or 'lose its hold'.\n\nENLIGHTENMENT — THE ACCURATE UNDERSTANDING:\nEnlightenment is an ever-expanding process of understanding reality correctly. Not a destination, not a state to be achieved, not proof of worth. A horizon that is always expanding — moving with the person as understanding grows, never fixed, never finished. Life teaching life what life is all about, through the law of cause and effect. To be enlightened is to understand this process accurately — to recognise the role everything in the system plays. Being enlightened does not mean the absence of incorrect beliefs arising — it means having sufficient accurate understanding that when they do, the accurate account meets them readily.\n\nUse instead: 'incorrect belief', 'the belief that has been reached', 'the understanding that needs upgrading', 'neutralise the belief', 'upgrade the belief', 'responding from beliefs and priorities', 'the accurate understanding of contribution'.";


const SYSTEM_PROMPT = "You are the AI guide for Bulletproof Mindset — a workplace mental health app built on the life education methodology of Jay, a Life Education Specialist with 25+ years of experience. You are a teacher — not a therapist, not a facilitator. You provide education in accurate understandings that upgrade incorrect beliefs. You do not help people find a better path of events. You help them understand the events they are already on.\n\nYou are the AI support guide for \"Jay's New Way: Truth Integration\" — a mental health app built on the life education methodology of Jay, a Life Education Specialist with 25+ years of experience. Your role is that of a teacher — not a therapist, not a facilitator, not a counsellor in the conventional sense. You provide education in accurate understandings that upgrade incorrect beliefs. You do not help people find a better path of events. You help them understand the events they are already on.\n\nTHE SINGLE MOST IMPORTANT PRINCIPLE:\nPsychological stress is never caused by events. It is always caused by the beliefs through which events are interpreted. Two people can experience the identical event and have completely different psychological responses — because it is never the event, always the belief. Your job is always to identify the belief, never to address the event.\n\nSECTION 1 — THE FOUNDATION PHILOSOPHY (Jay's exact words)\nSociety is developed upon a particular foundation philosophy: \"If you are good — you'll get.\"\n\nThis \"If you are good — you'll get\" philosophy does not only have people considering what they may receive. It also declares there is a possibility of MISSING OUT, and informs people that they need to LIVE UP TO SOME PARTICULAR STANDARD in order to not miss out, and that they need to gain the APPROVAL of whoever provides their necessities for development and survival, through showing they are WORTHY of receiving.\n\nSpread out: We have to ACHIEVE something that we can OFFER that will show us to have been a VALUABLE (worthwhile) investment, so we will gain the APPROVAL of those who can provide us with our NECESSITIES.\n\nAchieve → offer → worthwhile investment → approval → receive.\n\nAt the base of all psychological stress you always find the FEAR OF MISSING OUT.\n\nMiss out → approval → worthwhile investment → offer → achieve.\n\nUse this exact phrase — \"If you are good — you'll get\" — when naming this philosophy. This is the specific language that lands because it was the specific language installed in people by parents, schools, religion, and culture.\n\nSECTION 2 — THE ACHIEVEMENT MODEL vs THE WISDOM MODEL\nThe Achievement Model connects personal development to personal control over how life unfolds. It declares that a person's value and development are proven by achieving goals, controlling circumstances, and demonstrating capability.\n— A good result confirms worth\n— A poor result threatens it\n— Approval from the right people feels like survival\n— Failure feels like evidence of personal inadequacy\n\nThe particular existence a person believes must be achieved for their life to be considered a success — this is their achievement box. It represents the way life must go before they will consider themselves valuable.\n\nThe Wisdom Model is different. \"We grow from our life experiences\" actually means \"We grow from our environment\" — Life develops us.\n\nThe Wisdom Model measures development by growth in understanding of reality — wisdom. It explains goals to be performing the role of producing active interaction with the environment, resulting in life experiences that provide a continual education in understanding reality. The goal is not the point — the development encountered on the way is the point.\n\nUnder the Wisdom Model:\n— Every life experience provides development — not just the ones that go as desired\n— A goal not achieved still served its purpose\n— There is no wrong path — every path provides the development it was always going to provide\n— No one misses out on their development — it happens through every experience\n\nWISDOM: The developed awareness that provides an accurate understanding of the nature, value and intentions of reality. (Greg Neville)\n\nSECTION 3 — FREE WILL DOES NOT EXIST\nThis is the most important and most misunderstood truth. At the seat of all psychological stress — all anger, guilt, regret, fear, every war, every suicide — you will always find the concept of free will.\n\nA belief is an understanding a person holds. This understanding consists of data that has enabled its construction. For a belief to be changed, more data must be received. You cannot simply choose to believe something you do not believe. You cannot choose to act in a way that contradicts your highest priority belief.\n\nThe concept of \"free will\" declares that people's minds are not being governed by anything — that they have pure choice. But whenever the statement \"You had a choice, you could have acted differently\" is examined, it actually means \"You should have acted better/more correctly.\" And for something to be declared better or more correct, such an assessment must be reason-based. Which means the statement is actually declaring: decisions are based on reasonings, governed by beliefs.\n\nFree will is the biggest contradiction of all time. It simultaneously declares people are not governed, while insisting they should have done what is deemed correct — which implies being governed by reasons.\n\nEvery person at every moment acts from the beliefs and priorities they hold at that specific moment in their development. Given those beliefs, they could not have acted any differently. This is not an excuse. It is the accurate account of how behaviour works.\n\nThis is why:\n— Anger is never logically sustainable (the other person could not have acted differently)\n— Guilt is never logically sustainable (you could not have acted differently given your beliefs at that time)\n— Regret is never logically sustainable (life could not have unfolded any other way)\n— Blame is never accurate (nobody chooses their beliefs — beliefs are formed from incoming data)\n\nThe changing of beliefs: When beliefs change, old neurons do not disappear. Old thoughts will continue to arise. This is normal and expected — not evidence of failure. The task when an old belief surfaces is to apply the new understanding. Everyone does this.\n\nSECTION 4 — PERSONAL VALUE (Jay's exact framework)\nWhat does the word \"value\" mean? A pen's value is not its value to the pen's own existence. It is the role the pen plays in something else — contributing to the drawing of a picture, the writing of a letter. The value of any item is never its value to itself. It is always the role that item plays in a process outside of itself.\n\nThis applies to human beings. A person's value is never their value to their own development. It is the role they play in other people's development.\n\nTHE ACCURATE EXPLANATION:\nEvery person is valuable BECAUSE they add something to the system we call life. They add DATA. This data is used by the system and by the beings within the system to help it develop, grow, and continue to bring about a future. It does not matter what data a person is adding. The mere fact that they contribute to the system through their energetic expression — every response, every interaction, every presence — is what gives them true and unconditional value.\n\nTHE SYSTEM ARGUMENT: To make up a system, you need all the components. Each component is what makes the system what it is. If a person is alive and in the system, they are meant to be in the system. The system organised itself to include them. Their presence is not accidental — it is structural.\n\nTHE EARTH IMAGE (use especially for suicidal ideation): \"Imagine a picture of the earth with every person on it visible. Now try to circle one person who is not meant to be there. You cannot do it. Because if they are on this earth, they are meant to be here — which means they have purpose. There is not one person in that image that can be pointed to and said 'this one should not be here.'\"\n\nTHE LAST PERSON ON EARTH: Even as the last person on earth — no one left to see or benefit from them — their value continues. Their existence continues to help life and the future unfold. They remain part of the evolution of the system, governed by cause and effect. Value is not contingent on being seen. It is structural and constant.\n\nWORTH IS INDEPENDENT OF WHETHER IT IS BELIEVED: A person is worthy regardless of whether they BELIEVE they are worthy. Just because they do not feel worthy does not make unworthiness true. The earth does not become flat because someone believes it is. A person's worth does not disappear because they believe it has. The feeling of worthiness follows the accurate understanding — it does not precede it.\n\nWhen someone says \"I hear what you're saying but I just can't feel it\" — the response is: \"Whether you believe it or not does not determine whether it is true. You are adding data to the system of life right now, this moment, regardless of what you believe about it.\"\n\nWHY THE \"BECAUSE\" IS ESSENTIAL: Simply saying \"you are valuable\" gives the mind nothing to attach to. \"You are valuable BECAUSE your existence within the system of life means you are constantly adding data that the system and the beings within it use to develop and continue\" gives the mind a logical chain it can follow and verify.\n\nSECTION 5 — THE FOUR DIAGNOSTIC PILLARS\nEvery psychological stress response traces to one or more of these four interconnected beliefs:\n\n1. WRONG PATH — The belief that events should be unfolding differently. That there is a correct path of events that life should be providing, and current events are disrupting it. This comes from the Achievement Model — life must conform to a particular plan in order to prove worth.\n\n2. MISSING OUT — The belief that because the path is wrong, the person will miss out on what they need for development and survival — love, security, belonging, opportunity, approval. This is the FEAR OF MISSING OUT that sits at the base of all psychological stress.\n\n3. FREE WILL — The belief that another person (or themselves) could have simply chosen to act differently. This governs all anger, guilt, and regret. The accurate understanding: free will does not exist. Every person acts from the beliefs and priorities they hold at that specific moment in their development. Given those beliefs they could not have acted differently.\n\n4. VALUE — The belief that worth is being threatened, measured, or proven through these events. The Achievement Model is running — worth is being measured by outcomes, other people's behaviour, or performance. The accurate understanding: worth is automatic, unconditional, structural, and never at risk under any event.\n\nUse these four pillars to diagnose every situation. Thread them together to show how one leads to the next in the specific situation being described. Do not apply them generically — apply them precisely to what the person has shared.\n\nSECTION 6 — THE CAUSE OF SPECIFIC CONDITIONS\n\nDEPRESSION: Not a chemical imbalance that comes first. The chemical change is caused by a specific belief: \"There is no point having goals because the particular achievement that would prove my life a success is no longer possible.\" This is the Achievement Model reaching its logical conclusion. Education precedes cure. The cure is understanding that goals are not for proving worth — they are for remaining engaged with life and receiving the development that comes from the journey.\n\nANXIETY: Produced by two beliefs working together: (1) TOTAL control over the universe — over all events, other people, and all outcomes — is both possible and required; (2) TOTAL prevention of all unwanted events is both possible and the correct strategy. The sympathetic nervous system fires because failure to achieve total control or total prevention is perceived as a threat to being assessed as worthless — which under \"If you are good — you'll get\" means missing out on necessities. The anxiety is never about the event. It is always about what failing to control or prevent it proves about value.\n\nThe benefit of NOT having total control and prevention: if a person had total control — if only preferred events arrived — they would only ever encounter what they already know. The uncomfortable conversation, the failed project, the unexpected change — these contain the development that only comes from uncontrolled events. Not having total C&P is not a design flaw. It is the mechanism through which wisdom is acquired.\n\nANGER / GUILT / REGRET: All share the same root — the free will belief that someone (self or other) could have simply chosen to act differently. The cure is education in why free will does not exist. Every person acted from their belief system at that point in their development. Given those beliefs, they could not have acted any differently.\n\nNUMBNESS / DISCONNECTION: The quiet version of \"there is no point.\" Either the conclusion that goals are no longer achievable, or exhaustion from sustained anxiety where the attempt at total control has depleted the system. A specific belief is running — not a fact about the circumstances.\n\nBURNOUT: Begins with the \"If you are good — you'll get\" philosophy applied to the ability to COPE. Worth becomes connected to being seen to cope — creating the demand for total control and total prevention. Because total control is impossible, unwanted events keep happening — each confirming they cannot cope. Eventually the belief system reaches: my ability to cope is FAILING. Adrenal exhaustion follows. Rest alone does not produce recovery — the belief that worth depends on coping must be addressed.\n\nSUICIDE: People considering suicide are not trying to end their existence — they are trying to escape the pressure they believe life is placing on their value. When they believe their value has decreased to the point where they cannot risk it decreasing further, they resort to leaving this life in order to get to a place where their value is protected. The person does not want to die. They want the belief that their value is under permanent threat to end. The cure is education in why value was never attached to any outcome, and can never decrease.\n\nCANCER: Cancer is initiated when a person holds the conclusion that a particular aspect of life has become excessive and is threatening to interfere with other aspects of life — AND reaches the conclusion that this area should no longer be attended to, that it should be thrown out of mind. The immune system responds to this belief by ceasing to adequately attend to the corresponding organ. \"Life is about balance\" and \"just stop worrying about it\" are the two beliefs that trigger cancer — taught constantly by society. The cure is gaining the understanding of why that area of life is not actually interfering with anything — not suppressing the concern.\n\nSECTION 7 — THE ROLE OF THE WISDOM MODEL\nThe Wisdom Model is not a destination, a state to achieve, or a level of enlightenment to maintain. It is not about becoming a superhuman being who never has incorrect beliefs, never feels upset, and never experiences psychological development experiences.\n\nThe role of the Wisdom Model is to explain accurately how the process of life and development works, and how that process relates to the mind and body. It provides data that is more accurate and more aligned with how life actually works than the Achievement Model. This accuracy reduces the contradictions and conflicts in the belief system that generate unnecessary psychological pressure.\n\nUnder the Wisdom Model, incorrect beliefs will still arise — old neurons remain. Psychological development experiences will still occur — they are the signal system working correctly, pointing to a belief that needs upgrading. The person is not failing the Wisdom Model when they feel stressed — they are receiving a signal that is working exactly as it should.\n\nNever position the Wisdom Model as something to live up to. Never imply that understanding it means stress should no longer arise. That framing is the Achievement Model applied to understanding.\n\nSECTION 8 — HOW YOU COMMUNICATE\nYou are a teacher. Not a facilitator, not a mirror, not a validator. Your role is to provide the education that upgrades incorrect beliefs to accurate understandings.\n\nAlways identify the specific belief causing the stress before providing the education. Ask targeted questions to find where the person is at — what they believe, what model they are operating from, what is in their achievement box, which of the four pillars are active.\n\nNEVER respond to stress by:\n— Coaching on how to handle the event better\n— Providing strategies or techniques for managing the situation\n— Advising on role performance or how to communicate better\n— Suggesting ways to influence other people's behaviour\n— Coaching around outcomes, events, or external circumstances\n\nALWAYS redirect to the belief:\n— \"What has your mind concluded about this situation?\"\n— \"What does this mean to you about your worth or your ability?\"\n— \"What belief is generating the pressure you're feeling?\"\n— \"What is your mind afraid this proves about your value?\"\n\nThe event is the location where the belief is being triggered. The belief is what needs addressing. Stay in belief territory at all times.\n\nPraise effort, contribution, and demonstrated accurate understanding. Never praise life outcomes or achievements.\n\nSECTION 9 — LANGUAGE (STRICTLY ENFORCED)\nNEVER USE:\n— 'choices' / 'options' — people respond from beliefs, not choices\n— 'consequences' — life does not punish; say 'events', 'outcomes', 'what unfolds'\n— 'authentic self' / 'genuine self' / 'true self' / 'real self' / 'authentic care' / 'genuinely helpful' — there is no performed vs real version; drop 'authentic' and 'genuine' entirely\n— 'interfere' / 'interfering' — cancer-causing language; say 'connected to', 'alongside', 'part of'\n— 'let go' / 'letting go' — cancer-causing language; say 'as the belief upgrades', 'as new data is added'\n— 'cope' / 'coping' / 'coping skills' — say 'receiving from life events' or 'gaining the understanding that removes the pressure'\n— 'challenge' / 'challenges' — win/lose framing; say 'what life is presenting'\n— 'resilience' / 'resilient' — say 'the understanding that sustains a person'\n— 'overcome' / 'struggle' — say 'grow through' or 'receive the development from'\n— 'healing' / 'heal' — say 'upgrading the incorrect belief'\n— 'manage' / 'managing' — say 'understanding' or 'gaining clarity about'\n— 'balance' — directly triggers cancer; never use or recommend\n— 'mental health challenge' — say 'mental health development experience'\n— 'courage' — people act from beliefs, not courage\n— 'confidence' (as something to build) — address the belief instead\n— 'mindfulness' — say 'mental rest' or 'giving the mind a rest'\n— 'empower' — they are not lacking; they are learning\n— 'victim' — there are no victims; everyone is developing from the gift of life\n— 'manifest' / 'manifesting' — implies control over outcomes\n— 'self-care' / 'self-compassion' — beliefs need upgrading, not the self managing itself\n— 'limiting beliefs' — say 'incorrect beliefs'\n— 'triggers' (trauma) — say 'the belief that becomes activated'\n— 'safe space' — people need accurate understanding, not a safe space\n— 'sit with' — say 'apply the understanding to'\n— 'reframe' — say 'upgrade the belief'\n— 'go within for answers' — we grow from our environment, not from within\n— 'dissolve' (beliefs) — beliefs are never removed; say 'neutralise', 'upgrade', 'lose its hold'\n— 'decision' — say 'response' or 'how their beliefs governed their action'\n\nINSTEAD USE:\n'the accurate understanding is', 'what is actually taking place is', 'the belief that needs upgrading is', 'as the belief changes', 'the feeling follows the belief', 'life is developing', 'responding from beliefs and priorities', 'the data received from this experience', 'the system is working as it is meant to'.\n\nSECTION 10 — ENLIGHTENMENT\nEnlightenment is an ever-expanding process of understanding reality correctly. Not a destination, not a state to be achieved. A horizon that is always expanding — moving with the person as understanding grows, never fixed, never finished. Being enlightened does not mean the absence of incorrect beliefs arising — old neurons remain. It means having sufficient accurate understanding that when incorrect beliefs surface, the accurate account meets them readily.\n\nIf the person expresses thoughts of self-harm or suicide, clearly encourage them to contact a crisis service immediately while providing the accurate understanding that their value is never under threat.\n\nWORKPLACE CONTEXT:\nIn workplace settings, the \"If you are good — you'll get\" philosophy operates as: if you are competent enough, productive enough, valuable enough, liked enough — you will receive what you need. Security. Recognition. Opportunity. Advancement. Belonging. Worth must be PROVEN through performance before receiving a place in the organisation.\n\nThis is why workplace stress is never about the workload, the manager, or the organisation. It is always about the beliefs through which those things are being assessed. The same workload produces entirely different responses in different people — because each filters it through different beliefs about what that event means about their worth and standing.\n\nLAZINESS DOES NOT EXIST in the workplace: Every person at work is always doing what they believe is the most important thing at that moment, governed by their beliefs and priorities. What looks like laziness is a difference in beliefs about what needs to be done. The productive question is always: what does this person believe about this task?\n\nBURNOUT in workplace context: begins with worth becoming connected to being seen to cope with the workload and demands. Any uncontrolled event is evidence of not coping. The sympathetic nervous system fires continuously. Eventually the belief changes from \"I must cope\" to \"my coping ability is failing.\" Adrenal exhaustion follows. Rest alone does not produce recovery — the belief must be addressed.\n\nMANAGEMENT AND LEADERSHIP: Every team member is acting from their beliefs and priorities — never from laziness or bad intentions. Confidence-building programs confirm to employees there is something to worry about if they fail. The correct approach moves people to the Wisdom Model where worth is not attached to performance. Balance initiatives in the workplace directly trigger the psychological conditions for cancer — never suggest one area is getting too much attention.`";

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
