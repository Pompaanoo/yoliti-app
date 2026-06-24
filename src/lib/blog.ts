// Contenido del blog migrado del sitio original de Yoliti.
// El cuerpo de cada artículo es HTML confiable (propio) que se
// renderiza dentro de un contenedor .article-body (ver globals.css).

export type BlogCategory = "practice" | "self" | "trauma";

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  image: string;
  excerpt: string;
  date: string;
  readMin: number;
  featured?: boolean;
  content: string;
}

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  practice: "Práctica Clínica",
  self: "Autoconocimiento",
  trauma: "Trauma",
};

export const CATEGORY_BADGE: Record<BlogCategory, string> = {
  practice: "bg-primary/10 text-primary",
  self: "bg-accent/10 text-accent",
  trauma: "bg-neutral/10 text-neutral",
};

export const AUTHOR = {
  name: "Yoliti Osorio, PhD",
  role: "Directora académica · Psicóloga clínica",
  initials: "YO",
  bio: "Doctora en Psicología Clínica con más de 20 años trabajando con comunidades latinas en Estados Unidos. Fundadora de Yoliti Academy y supervisora clínica certificada.",
};

export const POSTS: BlogPost[] = [
  {
    slug: "understanding-emotional-triggers",
    title: "Understanding Emotional Triggers: Why We React the Way We Do",
    category: "self",
    image:
      "https://yolitiacademy.com/wp-content/uploads/2026/03/pexels-photo-745045-745045-scaled.jpg",
    excerpt:
      "Learn what emotional triggers are, why they happen, and how greater awareness can help you respond with more clarity and intention.",
    date: "17 abr 2024",
    readMin: 5,
    featured: true,
    content: `
      <p>Emotional triggers are stimuli — a word, a tone of voice, a memory, a situation — that activate a strong, often disproportionate emotional response. Understanding why we react the way we do is one of the most powerful steps toward emotional intelligence and psychological wellbeing.</p>
      <h2>What Is an Emotional Trigger?</h2>
      <p>An emotional trigger is anything that provokes an intense emotional reaction, often rooted in past experiences. When something in the present reminds our nervous system of a past threat, loss, or unmet need, the brain responds as if that original event is happening again — even when it isn't.</p>
      <p>These reactions can range from mild irritability to full emotional flooding. What makes triggers so challenging is that they often operate beneath conscious awareness, hijacking our responses before we have a chance to think.</p>
      <blockquote>"Between stimulus and response there is a space. In that space is our power to choose our response." — Viktor Frankl</blockquote>
      <h2>The Neuroscience Behind Triggers</h2>
      <p>At the biological level, emotional triggers activate the amygdala — the brain's threat-detection center. When the amygdala perceives danger (real or symbolic), it initiates a fight-flight-freeze response, flooding the body with stress hormones before the prefrontal cortex — responsible for rational thinking — even has time to process what's happening.</p>
      <p>This explains why triggered reactions often feel automatic and beyond our control. They are, in a neurological sense, survival responses. The challenge is learning to recognize them and create enough pause to respond intentionally.</p>
      <h2>Common Origins of Emotional Triggers</h2>
      <p>Triggers are typically rooted in one or more of the following:</p>
      <ul>
        <li><strong>Childhood experiences</strong> — early messages about safety, love, or worth that became encoded as emotional patterns</li>
        <li><strong>Traumatic events</strong> — experiences that overwhelmed our capacity to process at the time they occurred</li>
        <li><strong>Unmet needs</strong> — recurring feelings of not being seen, heard, valued, or respected</li>
        <li><strong>Core beliefs</strong> — deep assumptions about ourselves and others that filter how we interpret experiences</li>
      </ul>
      <h2>Recognizing Your Own Triggers</h2>
      <p>The first step toward managing emotional triggers is becoming aware of them. This requires developing what psychologists call <em>interoceptive awareness</em> — the ability to notice physical sensations in the body that signal an emotional response is building.</p>
      <p>Common physical signs of being triggered include: a racing heart, tightness in the chest or throat, shallow breathing, a sudden urge to withdraw or attack, or a feeling of dissociation or unreality.</p>
      <h3>A Practical Exercise: The STOP Technique</h3>
      <p>When you notice these physical signs, try the STOP technique:</p>
      <ul>
        <li><strong>S</strong> — Stop what you're doing</li>
        <li><strong>T</strong> — Take a breath</li>
        <li><strong>O</strong> — Observe what you're feeling without judgment</li>
        <li><strong>P</strong> — Proceed with intention rather than reaction</li>
      </ul>
      <h2>Why This Matters for Mental Health Professionals</h2>
      <p>For therapists and clinicians, understanding personal emotional triggers is not just a self-care practice — it is an ethical responsibility. Unexamined triggers can lead to countertransference reactions that compromise therapeutic effectiveness and client safety.</p>
      <p>In cultural and bilingual contexts, triggers may also be shaped by experiences of migration, discrimination, or intergenerational trauma. Recognizing how these dynamics live in the body — in both clinician and client — is essential for culturally responsive care.</p>
      <h2>Conclusion</h2>
      <p>Emotional triggers are not signs of weakness — they are signals from our nervous system, shaped by our history. By learning to recognize and work with our triggers, we expand our capacity to respond rather than react, to choose rather than be driven. This is the heart of emotional intelligence, and it begins with curiosity and compassion toward ourselves.</p>
    `,
  },
  {
    slug: "signs-emotionally-overloaded",
    title: "Signs You May Be Emotionally Overloaded and How to Respond",
    category: "self",
    image:
      "https://yolitiacademy.com/wp-content/uploads/2026/03/pexels-photo-6532531-6532531-scaled.jpg",
    excerpt:
      "Emotional overload can affect the way we think, feel, and respond to everyday life. Learn how to recognize the signs and respond with care.",
    date: "17 abr 2024",
    readMin: 7,
    content: `
      <p>Emotional overload can affect the way we think, feel, and respond to everyday life. In a world that demands constant connectivity and performance, many people — including mental health professionals — find themselves operating beyond their emotional capacity without realizing it. Learning to recognize the early signs of emotional overload is the first step toward restoring balance.</p>
      <h2>What Is Emotional Overload?</h2>
      <p>Emotional overload occurs when the volume or intensity of emotional demands exceeds our current capacity to process and regulate them. It is not simply feeling "stressed" — it is a state in which our internal resources are depleted and our ability to function effectively is compromised.</p>
      <p>Unlike acute stress, emotional overload often builds gradually. It may develop over weeks or months of accumulated demands — relational, professional, or personal — until the system reaches a breaking point.</p>
      <blockquote>"Emotional exhaustion is the body's signal that something important has been ignored for too long."</blockquote>
      <h2>Warning Signs to Watch For</h2>
      <p>Recognizing the signs of emotional overload early allows us to respond with care rather than crisis intervention. Common signs include:</p>
      <h3>Cognitive Signs</h3>
      <ul>
        <li>Difficulty concentrating or making decisions</li>
        <li>Racing thoughts or an inability to "turn off" mentally</li>
        <li>Forgetting things you normally remember with ease</li>
        <li>Feeling mentally foggy or disconnected from reality</li>
      </ul>
      <h3>Emotional Signs</h3>
      <ul>
        <li>Feeling irritable, short-tempered, or emotionally reactive over small things</li>
        <li>Persistent sadness, numbness, or emotional flatness</li>
        <li>Feeling overwhelmed by situations that would normally feel manageable</li>
        <li>A sense of helplessness or loss of meaning</li>
      </ul>
      <h3>Physical Signs</h3>
      <ul>
        <li>Disrupted sleep — difficulty falling asleep, staying asleep, or waking unrefreshed</li>
        <li>Chronic fatigue that rest does not seem to resolve</li>
        <li>Headaches, digestive issues, or muscle tension with no clear medical cause</li>
        <li>A lowered immune response — getting sick more frequently</li>
      </ul>
      <h3>Behavioral Signs</h3>
      <ul>
        <li>Withdrawing from relationships or activities you normally enjoy</li>
        <li>Increased use of food, alcohol, screens, or other numbing behaviors</li>
        <li>Difficulty being present in conversations or interactions</li>
        <li>Procrastinating on important tasks or feeling paralyzed about what to do next</li>
      </ul>
      <h2>How to Respond When You Notice These Signs</h2>
      <p>The most important thing when you recognize emotional overload is not to push through — it is to slow down. Here are evidence-based strategies for responding:</p>
      <h3>1. Name What You're Experiencing</h3>
      <p>Research by neuroscientist Matthew Lieberman shows that simply labeling an emotion — "I am overwhelmed," "I feel depleted" — activates the prefrontal cortex and reduces amygdala reactivity. Naming your state is not weakness; it is the beginning of regulation.</p>
      <h3>2. Reduce Input Before Adding Output</h3>
      <p>When overloaded, many people try to solve their way out — more planning, more problem-solving, more effort. Instead, begin by reducing demands: turn off notifications, cancel a non-essential commitment, give yourself permission to rest.</p>
      <h3>3. Reconnect with the Body</h3>
      <p>Somatic practices such as slow diaphragmatic breathing, progressive muscle relaxation, or gentle movement help discharge stress hormones and bring the nervous system back toward regulation. Even five minutes of intentional breathing can shift your physiological state meaningfully.</p>
      <h3>4. Reach Out — Don't Isolate</h3>
      <p>Emotional overload often pushes us toward isolation at precisely the moment when connection is most healing. Reach out to a trusted person, a therapist, or a support group. Social co-regulation is one of the most powerful tools for emotional recovery.</p>
      <h2>A Special Note for Clinicians</h2>
      <p>Mental health professionals are particularly vulnerable to emotional overload due to the cumulative weight of vicarious trauma, compassion fatigue, and the relational demands of clinical work. Recognizing overload in yourself is not a sign of inadequacy — it is a sign that you are human, and that you care.</p>
      <p>Regular supervision, peer consultation, and personal therapy are not luxuries for clinicians — they are professional necessities. Modeling self-care is also one of the most powerful things a therapist can do for their clients.</p>
      <h2>Conclusion</h2>
      <p>Emotional overload is not a character flaw — it is a signal worth listening to. When we learn to recognize the signs early and respond with self-compassion rather than self-criticism, we build the internal capacity to care for ourselves and those we serve more sustainably. Your emotional wellbeing matters — not just for you, but for everyone your life touches.</p>
    `,
  },
  {
    slug: "trauma-informed-learning",
    title: "Why Trauma-Informed Learning Matters in Mental Health Education",
    category: "trauma",
    image:
      "https://yolitiacademy.com/wp-content/uploads/2026/03/pexels-photo-6683491-6683491-scaled.jpg",
    excerpt:
      "Trauma-informed learning helps create safer, more supportive educational environments that make learning more meaningful and durable.",
    date: "17 abr 2024",
    readMin: 6,
    content: `
      <p>Trauma is not a rare or exceptional experience — it is woven into the fabric of many people's lives. For students and practitioners in the mental health field, this reality raises an important question: does our educational approach account for the fact that learners themselves may carry unresolved trauma? Trauma-informed learning offers a framework for saying yes.</p>
      <h2>What Is Trauma-Informed Learning?</h2>
      <p>Trauma-informed learning applies the principles of trauma-informed care — safety, trustworthiness, choice, collaboration, and empowerment — to the educational environment itself. Rather than treating the classroom or training program as a neutral space, it acknowledges that learning can be disrupted, complicated, or even retraumatizing when the emotional context is not taken into account.</p>
      <p>This approach does not require educators to become therapists. Rather, it asks them to design learning experiences that are sensitive to the presence of trauma, reduce unnecessary stress, and build the conditions in which deeper learning can take place.</p>
      <blockquote>"You cannot teach a traumatized nervous system — you must first help it feel safe enough to learn."</blockquote>
      <h2>Why It Matters in Mental Health Education Specifically</h2>
      <p>Students entering the mental health field often do so because of personal experiences with suffering, loss, or the desire to understand themselves and others more deeply. Research consistently shows that a significant proportion of mental health trainees have personal histories of trauma, depression, or anxiety.</p>
      <p>When training programs ignore this reality, several problems emerge:</p>
      <ul>
        <li>Vicarious traumatization can go unaddressed, building until it affects clinical performance and wellbeing</li>
        <li>Students may feel shame about their own struggles, reinforcing the stigma they are training to help dismantle</li>
        <li>Learning about trauma without adequate support can trigger personal material that interferes with integration</li>
        <li>Trainees who never experience trauma-informed care firsthand are less equipped to offer it to their clients</li>
      </ul>
      <h2>The Six Core Principles in an Educational Context</h2>
      <h3>1. Safety</h3>
      <p>Learners must feel physically and emotionally safe to engage fully. This means creating predictable structures, clear expectations, and environments where mistakes are treated as learning opportunities rather than sources of shame.</p>
      <h3>2. Trustworthiness and Transparency</h3>
      <p>Instructors and programs that communicate clearly — about goals, expectations, and processes — build the trust necessary for deeper learning. Hidden agendas and unclear evaluation criteria undermine the sense of safety that learning requires.</p>
      <h3>3. Peer Support</h3>
      <p>Cohort models, peer consultation groups, and structured reflection practices build the relational connections that buffer against the isolating effects of difficult material. Knowing others share your experience reduces shame and builds resilience.</p>
      <h3>4. Collaboration and Mutuality</h3>
      <p>Trauma-informed learning flattens unnecessary power hierarchies. When educators model humility, acknowledge the limits of their knowledge, and genuinely value student contributions, they create the conditions for honest engagement.</p>
      <h3>5. Empowerment and Choice</h3>
      <p>Offering learners meaningful choices — in how they engage, how they demonstrate learning, how they pace their exposure to difficult content — honors their agency and reduces the helplessness that trauma so often produces.</p>
      <h3>6. Cultural, Historical, and Gender Issues</h3>
      <p>Trauma does not exist outside of context. A trauma-informed educational approach acknowledges how systemic forces — racism, colonialism, gender-based violence, migration — shape the traumatic experiences of learners and the populations they will serve.</p>
      <h2>Implications for Bilingual and Multicultural Training</h2>
      <p>For clinicians preparing to work with Spanish-speaking and Latino communities, trauma-informed learning carries specific weight. Many clients in these communities carry intergenerational trauma shaped by migration, political violence, discrimination, and acculturation stress. Clinicians who have been trained in trauma-informed environments are better equipped to create the kind of therapeutic safety these clients need.</p>
      <h2>Conclusion</h2>
      <p>Trauma-informed learning is not a soft addition to mental health education — it is a structural necessity. When we design training environments that recognize and respond to the whole person of the learner, we produce clinicians who are more self-aware, more resilient, and more capable of the deeply relational work that effective therapy requires. The quality of mental health care begins in how we train the people who provide it.</p>
    `,
  },
  {
    slug: "5-ways-online-training",
    title:
      "5 Ways Online Psychology Training Can Strengthen Your Professional Practice",
    category: "practice",
    image: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-3.jpg",
    excerpt:
      "Online psychology training can help students and professionals keep growing with more flexibility, accessibility, and real-world relevance.",
    date: "17 abr 2024",
    readMin: 9,
    content: `
      <p>The landscape of professional development has changed dramatically. Online psychology training is no longer a second-best option — for many clinicians, it has become the most effective, flexible, and relevant way to grow their skills. Here are five concrete ways it can strengthen your practice, whether you're early in your career or a seasoned professional.</p>
      <h2>1. Flexible Learning That Fits a Clinician's Schedule</h2>
      <p>Clinical work is demanding. Between sessions, documentation, supervision, and self-care, finding time for ongoing training can feel impossible. Online platforms remove the logistical barriers — no commute, no fixed schedule, no missed sessions because a client ran late.</p>
      <p>The ability to learn at your own pace is particularly valuable for the kind of deep, integrative learning that professional development requires. You can pause, rewatch, and revisit material until it genuinely connects with your clinical experience — something a one-day workshop rarely allows.</p>
      <blockquote>"The best continuing education doesn't interrupt practice. It deepens it."</blockquote>
      <h2>2. Access to Specialized Content You Can't Find Locally</h2>
      <p>One of the most significant advantages of online training is access to specialized expertise that may not exist in your geographic area. For bilingual and multicultural clinicians, this is especially meaningful.</p>
      <p>Training in areas like Spanish-language clinical vocabulary, cultural formulation, trauma-informed care for immigrant populations, or clinical supervision across linguistic contexts is simply not available in most local markets. Online platforms make this specialized knowledge accessible regardless of where you practice.</p>
      <ul>
        <li>CEU-accredited courses in niche clinical areas</li>
        <li>Training by instructors with lived and clinical experience in your target population</li>
        <li>Content developed specifically for bicultural and bilingual practitioners</li>
      </ul>
      <h2>3. Immediate Application to Real Cases</h2>
      <p>The most effective professional training creates a tight feedback loop between learning and practice. When you complete a module on a Wednesday afternoon and see a relevant client on Thursday morning, the learning has immediate clinical application.</p>
      <p>This proximity between training and practice accelerates integration in ways that a conference attended months ago rarely can. Skills learned in context — and applied immediately — become part of your clinical instinct faster and more durably.</p>
      <h2>4. Building a Framework for Reflective Practice</h2>
      <p>Quality online training doesn't just deliver information — it asks questions. What did you notice in yourself? How does this connect to cases you're currently carrying? What assumptions are you bringing to this material?</p>
      <p>This reflective structure builds the metacognitive habits that distinguish excellent clinicians from competent ones. Over time, the practice of asking "why am I responding this way?" becomes automatic — in training and in the session room.</p>
      <h3>Reflection Prompts That Strengthen Clinical Thinking</h3>
      <ul>
        <li>What assumptions did I bring to this client's presentation?</li>
        <li>Where did I feel pulled to do something different from what I was trained to do?</li>
        <li>What cultural factors might be shaping what I'm interpreting as a clinical symptom?</li>
        <li>What would my supervisor say about this case?</li>
      </ul>
      <h2>5. Community and Peer Learning Across Borders</h2>
      <p>Online training increasingly includes community features — discussion forums, peer consultation groups, live Q&A sessions, and cohort-based learning. For many clinicians who practice in relative isolation, this connection to a professional community is as valuable as the content itself.</p>
      <p>Learning alongside peers who are navigating similar clinical challenges normalizes difficulty, reduces professional loneliness, and exposes you to diverse perspectives that enrich your own clinical thinking. A colleague in Puerto Rico, Chile, or Spain may approach a shared case concept in a way that opens new possibilities for your work in Miami or Los Angeles.</p>
      <h2>What to Look for in an Online Psychology Training Program</h2>
      <p>Not all online training is created equal. As you evaluate your options, consider:</p>
      <ul>
        <li><strong>Accreditation:</strong> Are CEUs recognized by your licensing board and relevant professional organizations?</li>
        <li><strong>Instructor credentials:</strong> Do the instructors have both clinical expertise and experience with your target population?</li>
        <li><strong>Content depth:</strong> Does the training go beyond information to build genuine competence?</li>
        <li><strong>Cultural responsiveness:</strong> Is the content attentive to the populations you serve?</li>
        <li><strong>Community:</strong> Does the platform offer peer connection and consultation, or only passive content consumption?</li>
      </ul>
      <h2>Conclusion</h2>
      <p>Online psychology training, when designed thoughtfully, is not a compromise — it is an opportunity. The flexibility, accessibility, and depth of specialized content available online make it one of the most powerful tools in a clinician's ongoing development. The question is not whether to learn online, but how to choose the training that will most meaningfully advance your work with the clients who trust you with their care.</p>
    `,
  },
  {
    slug: "role-of-self-awareness",
    title: "The Role of Self-Awareness in Becoming a Better Therapist",
    category: "self",
    image:
      "https://yolitiacademy.com/wp-content/uploads/2026/03/pexels-photo-4101143-4101143-scaled.jpg",
    excerpt:
      "Self-awareness is a key part of effective therapeutic work. It helps therapists respond with greater clarity, presence, and ethical sensitivity.",
    date: "17 abr 2024",
    readMin: 7,
    content: `
      <p>Self-awareness is often described as the foundation of effective therapy — and for good reason. What we carry into the therapy room, our assumptions, our reactions, our unresolved experiences, shapes what we see, what we miss, and how we respond. Developing a deeper knowledge of oneself is not simply personal enrichment for therapists. It is a clinical responsibility.</p>
      <h2>What Is Clinical Self-Awareness?</h2>
      <p>Clinical self-awareness is the ongoing practice of examining how your own inner world — your emotions, beliefs, cultural background, personal history, and biases — influences your therapeutic work. It goes beyond introspection to include awareness of how you show up in relationship with clients: what you notice, what you avoid, when you feel comfortable and when you feel destabilized.</p>
      <p>This kind of awareness is dynamic. It is not something you achieve once and carry forward unchanged — it requires continuous attention, especially as you encounter new client presentations, new life experiences, and new cultural contexts.</p>
      <blockquote>"The therapist who does not know themselves risks using therapy to work out their own conflicts at the client's expense."</blockquote>
      <h2>Why Self-Awareness Improves Clinical Outcomes</h2>
      <p>The research on therapist self-awareness consistently links it to better clinical outcomes. Here's why:</p>
      <h3>It Reduces the Impact of Countertransference</h3>
      <p>Countertransference — the emotional reactions a therapist has toward a client — is inevitable. What matters is whether the therapist can notice it and use it reflectively, rather than act on it unreflectively. A self-aware therapist can ask: "Why am I feeling protective of this client?" or "Why am I eager to end this session early?" — and use those questions as clinical data.</p>
      <h3>It Expands the Therapist's Range</h3>
      <p>Therapists who are unaware of their own triggers and blind spots unconsciously narrow the therapeutic space — steering away from topics that feel threatening, overreacting to client behaviors that resonate with their own history, or subtly pushing clients toward conclusions that ease the therapist's own discomfort. Greater self-awareness expands the range of what can be held and explored in session.</p>
      <h3>It Models the Work</h3>
      <p>Therapy asks clients to do something profoundly difficult: to look honestly at themselves and their patterns. Therapists who are engaged in that same process — through personal therapy, supervision, and ongoing reflection — bring an embodied credibility to that invitation. Clients can sense the difference.</p>
      <h2>Self-Awareness in Cross-Cultural Practice</h2>
      <p>For clinicians who work across cultural differences — particularly with Latino and Spanish-speaking clients — self-awareness takes on additional dimensions. Cultural humility requires not only knowing your own cultural background and values, but actively examining how they create expectations, judgments, and blind spots in your clinical work.</p>
      <p>Questions worth sitting with regularly include:</p>
      <ul>
        <li>What does my cultural background lead me to assume about family relationships, emotional expression, or help-seeking?</li>
        <li>How do power dynamics related to race, language, or immigration status show up in my therapeutic relationships?</li>
        <li>Am I able to hold space for worldviews that differ significantly from my own without pathologizing or minimizing them?</li>
        <li>How does working in a non-dominant language affect my sense of clinical confidence, and how does that affect the client?</li>
      </ul>
      <h2>Practical Ways to Develop Self-Awareness as a Clinician</h2>
      <h3>Personal Therapy</h3>
      <p>There is no substitute for being in the client's chair. Personal therapy — especially ongoing, depth-oriented work — develops the kind of self-knowledge that supervision and training alone cannot provide. Many clinicians find that personal therapy continues to be one of their most significant sources of professional growth throughout their careers.</p>
      <h3>Clinical Supervision</h3>
      <p>Good supervision is not only case consultation — it is a relational process that holds space for the therapist's inner experience. A supervisor who asks "What did you notice in yourself during that moment?" is offering something more than feedback on technique.</p>
      <h3>Reflective Writing</h3>
      <p>Keeping a clinical journal — not notes on clients, but reflections on your own reactions, questions, and growth edges — builds the habit of self-observation. Even ten minutes of writing after a difficult session can reveal patterns that would otherwise remain unconscious.</p>
      <h3>Peer Consultation</h3>
      <p>Regular consultation with trusted colleagues creates the conditions for honest reflection. When you can say "I don't know what happened in that session" or "I think I made a mistake" in a safe professional relationship, you create the space to learn from your clinical experience rather than repeat it.</p>
      <h2>Conclusion</h2>
      <p>Self-awareness is not a destination — it is a lifelong orientation. The therapists who serve their clients most effectively are not those who have resolved all their own struggles, but those who remain genuinely curious about themselves: their reactions, their assumptions, their growing edges. That ongoing curiosity, cultivated with care, is one of the most powerful therapeutic tools available.</p>
    `,
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
