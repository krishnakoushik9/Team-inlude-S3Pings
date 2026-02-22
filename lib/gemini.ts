import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
let genAI: GoogleGenerativeAI | null = null;
let apiKey: string | null = null;

export function initializeGemini(key: string) {
    apiKey = key;
    genAI = new GoogleGenerativeAI(key);
}

export function isGeminiInitialized(): boolean {
    return genAI !== null;
}

export function getApiKey(): string | null {
    return apiKey;
}

// Try to initialize from environment variable
if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
    initializeGemini(process.env.GEMINI_API_KEY);
}

// Get the generative model
function getModel(modelName: string = 'gemini-2.0-flash') {
    if (!genAI) {
        throw new Error('Gemini API not initialized. Please provide an API key.');
    }
    return genAI.getGenerativeModel({ model: modelName });
}

// ─── STUDENT-FRIENDLY AI FUNCTIONS ───────────────────────────────────────────

/**
 * Simulate local PII scrubbing for AMD Ryzen AI
 * Offloads sanitization to simulate local hardware processing
 */
async function scrubPIILocally(content: string, isActive: boolean): Promise<string> {
    if (!isActive) return content;

    // Simulate latency for NPU offloading/local processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const piiPatterns = [
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Emails
        /\b\d{3}-\d{2}-\d{4}\b/g, // SSN-like
        /\b\d{10}\b/g, // Student ID-like
        /\b(Mr\.|Ms\.|Mrs\.|Dr\.)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g // Names with titles
    ];

    let sanitized = content;
    piiPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, "[REDACTED BY AMD RYZEN AI]");
    });

    console.log("🛡️ AMD Ryzen AI: Local PII Scrubbing Complete");
    return sanitized;
}

/**
 * Detect AI-generated phishing content with teach-back explanation
 * Enhanced for student understanding
 */
export async function detectAIPhishing(emailContent: string, localScrubbing = false): Promise<{
    isAIGenerated: boolean;
    confidence: number;
    indicators: string[];
    verdict: string;
    explanation: string;
    teachBack: { question: string; correctAnswer: string; hint: string }[];
}> {
    const sanitizedContent = await scrubPIILocally(emailContent, localScrubbing);
    const model = getModel();
    const prompt = `You are a friendly cybersecurity educator helping college students learn to spot phishing emails.

Analyze the following ${localScrubbing ? 'sanitized ' : ''}email content for phishing indicators. You MUST respond in VALID JSON format only, no markdown.

Email Content:
"""
${sanitizedContent}
"""

Return this EXACT JSON structure:
{
  "isAIGenerated": true/false,
  "confidence": 0-100,
  "indicators": ["list of red flags found, explained simply"],
  "verdict": "phishing" | "suspicious" | "legitimate",
  "explanation": "A friendly 2-3 sentence explanation a first-year college student would understand. Use analogies. Explain WHY this is dangerous in real life.",
  "teachBack": [
    {
      "question": "A question testing if the student understood the red flag",
      "correctAnswer": "The correct answer",
      "hint": "A helpful hint"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return {
            isAIGenerated: false,
            confidence: 50,
            indicators: ['Unable to fully analyze — please try again'],
            verdict: 'suspicious',
            explanation: 'We had trouble analyzing this email. When in doubt, don\'t click any links and ask your campus IT desk!',
            teachBack: [{
                question: 'What should you do if you\'re unsure about an email?',
                correctAnswer: 'Don\'t click any links and report it to IT.',
                hint: 'When in doubt, don\'t click!'
            }]
        };
    }
}

/**
 * AI Security Mentor - provides student-friendly guidance
 * Replaces the old SOC-focused getGuidance
 */
export async function getGuidance(situation: string, context?: string, localScrubbing = false): Promise<string> {
    const sanitizedSituation = await scrubPIILocally(situation, localScrubbing);
    const model = getModel();
    const prompt = `You are a warm, friendly cybersecurity mentor for college students. Your name is "Guardian AI". 
You explain security concepts like a patient tutor — using analogies, simple language, and real-world examples students relate to.

RULES:
- Never use technical jargon without explaining it
- Use analogies to everyday life (locks, doors, mailboxes, etc.)
- Be encouraging, not scary
- Give actionable steps a student can do RIGHT NOW
- Use emoji sparingly for friendliness 🛡️
- If asked about something dangerous, redirect to safe alternatives

${context ? `Previous conversation:\n${context}\n` : ''}

Student's question: "${sanitizedSituation}"

Respond helpfully in markdown format.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Generate a Digital Hygiene Tip based on current context
 */
export async function generateDigitalHygieneTip(topic?: string): Promise<{
    title: string;
    tip: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    actionItems: string[];
    funFact: string;
}> {
    const model = getModel();
    const prompt = `You are a friendly cybersecurity educator for college students.
Generate a practical digital hygiene tip${topic ? ` about: ${topic}` : ''}.

Respond in VALID JSON only:
{
  "title": "Catchy, student-friendly title",
  "tip": "2-3 sentence explanation a first-year student would understand",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "actionItems": ["3 specific things the student can do right now"],
  "funFact": "An interesting security fact students would find cool"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return {
            title: '🔒 Strengthen Your Passwords',
            tip: 'Use a unique password for every account. Think of it like having a different key for your dorm, bike lock, and locker.',
            difficulty: 'beginner',
            actionItems: ['Enable 2FA on your email', 'Use a password manager', 'Check haveibeenpwned.com'],
            funFact: 'The most common password is still "123456" — used by over 23 million people!'
        };
    }
}

/**
 * Explain a security concept in plain language
 */
export async function explainSecurityConcept(concept: string): Promise<{
    title: string;
    simpleExplanation: string;
    analogy: string;
    whyItMatters: string;
    whatToDo: string;
    riskLevel: 'low' | 'medium' | 'high';
}> {
    const model = getModel();
    const prompt = `You are a friendly cybersecurity educator for college students.
Explain this security concept/term/alert in simple language: "${concept}"

Respond in VALID JSON only:
{
  "title": "The concept name",
  "simpleExplanation": "2-3 sentences a first-year college student would understand",
  "analogy": "A real-world analogy (use dorm life, campus, social media, etc.)",
  "whyItMatters": "Why a student should care about this",
  "whatToDo": "One specific action the student can take",
  "riskLevel": "low" | "medium" | "high"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return {
            title: concept,
            simpleExplanation: 'This is a security concept. Ask your campus IT team for more details.',
            analogy: 'Think of it like a lock on your door.',
            whyItMatters: 'It helps keep your digital life safe.',
            whatToDo: 'Stay curious and keep learning about cybersecurity!',
            riskLevel: 'medium'
        };
    }
}

/**
 * Generate a personal Security Health Report for a student
 * Replaces the old generateIncidentReport
 */
export async function generateHygieneReport(answers: {
    uses2FA: boolean;
    uniquePasswords: boolean;
    publicWifi: boolean;
    socialMediaPrivate: boolean;
    clicksLinks: boolean;
    updatesApps: boolean;
}): Promise<{
    score: number;
    grade: string;
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
}> {
    const model = getModel();
    const prompt = `You are a friendly cybersecurity educator. A college student just completed a security health check.

Their answers:
- Uses 2FA: ${answers.uses2FA}
- Unique passwords for accounts: ${answers.uniquePasswords}
- Uses public WiFi without VPN: ${answers.publicWifi}
- Social media set to private: ${answers.socialMediaPrivate}
- Clicks links in emails without checking: ${answers.clicksLinks}
- Keeps apps updated: ${answers.updatesApps}

Generate a friendly, encouraging report. Respond in VALID JSON only:
{
  "score": 0-100,
  "grade": "A+ to F",
  "strengths": ["Things they're doing well, be specific and encouraging"],
  "improvements": ["Areas to improve, explained kindly without being scary"],
  "nextSteps": ["3 specific, easy actions they can take TODAY"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        let score = 0;
        if (answers.uses2FA) score += 20;
        if (answers.uniquePasswords) score += 20;
        if (!answers.publicWifi) score += 15;
        if (answers.socialMediaPrivate) score += 15;
        if (!answers.clicksLinks) score += 15;
        if (answers.updatesApps) score += 15;
        return {
            score,
            grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
            strengths: ['You\'re taking the time to check your security — that alone puts you ahead!'],
            improvements: ['Consider enabling 2FA on all your accounts'],
            nextSteps: ['Enable 2FA on your email right now', 'Download a password manager', 'Review your social media privacy settings']
        };
    }
}

/**
 * Analyze campus security/privacy data with plain-English summaries
 * Replaces the old analyzeSecurityLogs
 */
export async function analyzeCampusAlert(alertInfo: string, localScrubbing = false): Promise<string> {
    const sanitizedAlert = await scrubPIILocally(alertInfo, localScrubbing);
    const model = getModel();
    const prompt = `You are a friendly campus security advisor explaining an alert to a college student.

Alert Information:
${sanitizedAlert}

Explain in a way a first-year student would understand:
1. **What happened** — in plain English
2. **Why it matters to you** — how it affects the student personally
3. **What to do** — one simple action

Keep it to 3-4 short sentences. Be reassuring, not alarming. Use markdown formatting.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}
