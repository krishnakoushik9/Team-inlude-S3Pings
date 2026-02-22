// ─── COURSE DATA: 3 Modules × 3 Lessons each ─────────────────────────────────
// Each lesson has markdown notes and a quiz with multiple-choice questions.

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface Lesson {
    title: string;
    notes: string;
    quiz: QuizQuestion[];
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    color: string;
    icon: string; // lucide icon name
    lessons: Lesson[];
    badge: string;
}

export const courseModules: CourseModule[] = [
    // ════════════════════════════════════════════════════════════════════════
    // MODULE 1: PHISHING 101
    // ════════════════════════════════════════════════════════════════════════
    {
        id: 'phishing-101',
        title: 'Phishing 101: The Basics',
        description: 'Learn the fundamental psychology of phishing and how to spot "too good to be true" offers.',
        color: '#88C0D0',
        icon: 'Mail',
        badge: 'Phish Hunter',
        lessons: [
            {
                title: 'Anatomy of a Phishing Email',
                notes: `# Anatomy of a Phishing Email

Phishing emails are designed to **trick you** into giving away personal information. Let's break down what makes them work.

## The 5 Key Parts Attackers Exploit

- **From Address** — Looks like \`support@paypa1.com\` instead of \`support@paypal.com\`. Notice the \`1\` instead of \`l\`.
- **Subject Line** — Creates panic: *"Your account will be suspended!"*
- **Body Text** — Uses urgency, fear, or excitement to bypass your thinking.
- **Call to Action** — A link or button that sends you to a **fake website**.
- **Attachments** — May contain malware disguised as invoices or documents.

## Real-World Example

> **Subject:** Urgent — Verify your student email NOW  
> **From:** admin@university-verify.net  
> **Body:** Click here within 24 hours or lose access to your .edu email.

This is phishing because:
1. The domain \`university-verify.net\` is **not** your university's real domain.
2. The 24-hour deadline creates **artificial urgency**.
3. Real IT departments don't threaten to delete your email via a random link.

## Quick Rule of Thumb

> **If an email asks you to click a link and enter a password, STOP.** Go directly to the website by typing the URL yourself.

---
*Tip: Hover over any link to see where it actually goes before clicking.*`,
                quiz: [
                    {
                        question: 'You receive an email from "admin@university-verify.net" asking you to reset your password. What should you do?',
                        options: [
                            'Click the link immediately — it says urgent',
                            'Forward it to all your classmates as a warning',
                            'Go to your university website directly by typing the URL yourself',
                            'Reply asking if it\'s real'
                        ],
                        correctIndex: 2,
                        explanation: 'Never click links in suspicious emails. Instead, go directly to the official website by typing the URL in your browser. The domain "university-verify.net" is NOT a real university domain.'
                    },
                    {
                        question: 'What is the easiest way to check if a link in an email is fake?',
                        options: [
                            'Click it and see what happens',
                            'Hover over it to see the actual URL',
                            'Check if the email has a logo',
                            'See if it was sent at night'
                        ],
                        correctIndex: 1,
                        explanation: 'Hovering over a link reveals the actual URL in your browser\'s status bar. Phishing emails often show one URL in the text but link to a completely different (malicious) site.'
                    },
                    {
                        question: 'Which of these sender addresses is most likely phishing?',
                        options: [
                            'library@youruniversity.edu',
                            'registrar@youruniversity.edu',
                            'security@g00gle-verify.com',
                            'helpdesk@youruniversity.edu'
                        ],
                        correctIndex: 2,
                        explanation: 'The address "security@g00gle-verify.com" uses zeroes instead of the letter "o" and is NOT a real Google domain. This is a classic phishing technique called typosquatting.'
                    }
                ]
            },
            {
                title: 'Urgency & Pressure Tactics',
                notes: `# Urgency & Pressure Tactics

Phishing works because it **bypasses your logical brain** and triggers an emotional response. Let's understand how.

## The Psychology Behind It

Attackers use three main emotional triggers:

### 1. 🔴 Fear
> *"Your account has been compromised! Change your password NOW or lose all your data."*

This makes you panic and click without thinking.

### 2. 🟡 Greed / Excitement
> *"Congratulations! You've won a $500 Amazon gift card! Claim NOW!"*

If it sounds too good to be true, it **is** too good to be true.

### 3. 🟠 Authority
> *"This is IT Security. We need you to verify your identity immediately."*

Attackers impersonate people you trust — professors, IT staff, or your bank.

## How to Beat Pressure Tactics

1. **Pause for 10 seconds** — Take a breath. Urgency is manufactured.
2. **Ask yourself:** "Would my university/bank really contact me this way?"
3. **Verify independently** — Call the organization using a number from their official website, NOT from the email.
4. **Talk to someone** — If unsure, ask a friend or your campus IT desk.

## The "Would a Real Person Do This?" Test

| Legitimate Communication | Phishing Red Flag |
|--|--|
| Gives you time to respond | "Act in 24 hours or else!" |
| Uses your real name | "Dear User" or "Dear Student" |
| Comes from official domain | Uses look-alike domains |
| Doesn't ask for passwords | Demands login credentials |

---
*Remember: No legitimate organization will ever ask for your password via email.*`,
                quiz: [
                    {
                        question: 'An email says "Your scholarship expires in 2 hours — click here to renew." What emotional trigger is being used?',
                        options: [
                            'Greed',
                            'Fear and urgency',
                            'Curiosity',
                            'Sadness'
                        ],
                        correctIndex: 1,
                        explanation: 'The tight deadline ("2 hours") creates artificial urgency and fear of losing something valuable (scholarship). Real scholarship offices give you plenty of time and use official channels.'
                    },
                    {
                        question: 'You get an email: "Congratulations! You\'ve won a free MacBook!" What type of tactic is this?',
                        options: [
                            'Fear-based',
                            'Authority-based',
                            'Greed / excitement-based',
                            'Guilt-based'
                        ],
                        correctIndex: 2,
                        explanation: 'This uses greed and excitement. You didn\'t enter any contest, so there\'s nothing to win. If it sounds too good to be true, it IS too good to be true.'
                    },
                    {
                        question: 'What is the best first step when you receive a suspicious email that claims to be from your university IT?',
                        options: [
                            'Click the link to check if the page looks real',
                            'Delete the email immediately',
                            'Pause, then contact IT through their official website or phone number',
                            'Forward it to everyone in your class'
                        ],
                        correctIndex: 2,
                        explanation: 'Always verify independently. Contact the organization through a known, trusted channel (like their official website or phone number), not through any link or number provided in the suspicious email.'
                    },
                    {
                        question: 'A legitimate email from your university will most likely:',
                        options: [
                            'Address you as "Dear User"',
                            'Give you a reasonable timeframe to respond',
                            'Ask you to verify your password via a link',
                            'Come from a Gmail address'
                        ],
                        correctIndex: 1,
                        explanation: 'Real university communications use your actual name, give reasonable deadlines, come from official .edu domains, and never ask for passwords via email links.'
                    }
                ]
            },
            {
                title: 'Detecting Fake Links',
                notes: `# Detecting Fake Links

The link is the most dangerous part of a phishing email. Here's how to spot a fake one.

## How to Read a URL

A URL has a structure: \`https://subdomain.domain.extension/path\`

The **domain** is what matters most. It's the part right before the extension:

- \`https://login.paypal.com/account\` → Domain is **paypal.com** ✅
- \`https://paypal.login-secure.com/account\` → Domain is **login-secure.com** ❌

> The real domain is always the **last two parts** before the first \`/\`.

## Common Tricks Attackers Use

### 1. Lookalike Domains
- \`g00gle.com\` (zeros instead of o's)
- \`microsofft.com\` (double f)
- \`arnazon.com\` (rn looks like m)

### 2. Subdomain Tricks
- \`paypal.com.evil-site.org\` — the real domain here is **evil-site.org**

### 3. URL Shorteners
- \`bit.ly/x7Hk9\` — You can't see where it goes. Use [CheckShortURL](https://checkshorturl.com) to expand it first.

### 4. Homograph Attacks
Some characters from other alphabets look identical to English:
- Cyrillic \`а\` vs Latin \`a\`
- These can make \`аpple.com\` look identical to \`apple.com\`

## Your Checklist Before Clicking

- [ ] Does the domain match the organization's real domain?
- [ ] Is it HTTPS? (Look for the 🔒 icon)
- [ ] Did you hover to check the actual URL?
- [ ] Were you expecting this link?

---
*Pro tip: When in doubt, type the URL manually into your browser instead of clicking.*`,
                quiz: [
                    {
                        question: 'In the URL "https://paypal.com.secure-login.net/verify", what is the actual domain?',
                        options: [
                            'paypal.com',
                            'secure-login.net',
                            'verify',
                            'https'
                        ],
                        correctIndex: 1,
                        explanation: 'The real domain is always the last two parts before the first "/". Here, "secure-login.net" is the actual domain. "paypal.com" is just a subdomain used to trick you.'
                    },
                    {
                        question: 'Which URL is the safest to click?',
                        options: [
                            'http://arnazon.com/deals',
                            'https://amazon.com/deals',
                            'https://amazon-deals.totallylegit.com/sale',
                            'bit.ly/freeStuff2024'
                        ],
                        correctIndex: 1,
                        explanation: 'Only "https://amazon.com/deals" uses the real Amazon domain with HTTPS. The "arnazon" URL uses rn to mimic m. URL shorteners hide the real destination. The third option\'s real domain is "totallylegit.com".'
                    },
                    {
                        question: 'What is a "homograph attack"?',
                        options: [
                            'Sending the same email to many people',
                            'Using characters from other alphabets that look identical to English letters',
                            'Creating a fake social media profile',
                            'Guessing someone\'s password'
                        ],
                        correctIndex: 1,
                        explanation: 'Homograph attacks use visually identical characters from different alphabets (like Cyrillic "а" vs Latin "a") to create URLs that look legitimate but point to malicious sites.'
                    }
                ]
            }
        ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // MODULE 2: PRIVACY PROFESSIONAL
    // ════════════════════════════════════════════════════════════════════════
    {
        id: 'privacy-pro',
        title: 'Privacy Professional',
        description: 'Master your digital footprint. Learn how to audit your social media and system settings.',
        color: '#B48EAD',
        icon: 'Eye',
        badge: 'Privacy Pro',
        lessons: [
            {
                title: 'Auditing Permissions',
                notes: `# Auditing Your App Permissions

Every app on your phone and browser asks for permissions. Most people tap "Allow" without thinking. Let's fix that.

## Why Permissions Matter

When you give an app access to your camera, microphone, location, or contacts, you're giving it the ability to:
- **Record you** without your knowledge
- **Track your location** 24/7
- **Read your contacts** and sell them to advertisers

## Permission Audit Checklist

### On Your Phone
1. **iOS:** Settings → Privacy & Security → review each category
2. **Android:** Settings → Apps → Permissions Manager

### Key Permissions to Review

| Permission | Who SHOULD have it | Who SHOULDN'T |
|--|--|--|
| Camera | Video call apps | Flashlight apps, games |
| Location | Maps, ride-sharing | Social media (usually), games |
| Microphone | Voice call apps | Shopping apps, news apps |
| Contacts | Messaging apps | Games, calculators |

### In Your Browser
- Go to \`chrome://settings/content\` (Chrome) or \`about:preferences#privacy\` (Firefox)
- Review which sites have access to camera, mic, location, and notifications

## The "Least Privilege" Principle

> Only give an app the **minimum permissions** it needs to function. A flashlight app does NOT need your location.

## Action Items
1. Spend 5 minutes right now auditing your phone permissions
2. Revoke anything that looks unnecessary
3. Set a monthly reminder to re-check

---
*Rule: If you can't figure out why an app needs a permission, it probably doesn't.*`,
                quiz: [
                    {
                        question: 'A flashlight app asks for access to your contacts, camera, and location. What should you do?',
                        options: [
                            'Allow all — it probably needs them',
                            'Deny all extra permissions — a flashlight only needs the camera flash',
                            'Allow just the camera and deny the rest',
                            'Uninstall your phone'
                        ],
                        correctIndex: 1,
                        explanation: 'A flashlight app only needs access to the camera flash (or no special permissions at all on modern phones). Requesting contacts and location is a major red flag — the app is likely harvesting your data.'
                    },
                    {
                        question: 'What is the "Principle of Least Privilege"?',
                        options: [
                            'Only use apps made by big companies',
                            'Give apps the minimum permissions they need to function',
                            'Never install any apps',
                            'Always use the paid version of apps'
                        ],
                        correctIndex: 1,
                        explanation: 'The Principle of Least Privilege means only granting the minimum access needed. This limits the damage if an app is compromised or malicious.'
                    },
                    {
                        question: 'Where can you review which websites have access to your camera in Chrome?',
                        options: [
                            'The Windows Control Panel',
                            'chrome://settings/content',
                            'The Chrome Web Store',
                            'You can\'t — Chrome doesn\'t track this'
                        ],
                        correctIndex: 1,
                        explanation: 'In Chrome, navigate to chrome://settings/content (or Settings → Privacy and Security → Site Settings) to see and manage which websites have permissions for camera, microphone, location, and more.'
                    }
                ]
            },
            {
                title: 'Minimizing Your Footprint',
                notes: `# Minimizing Your Digital Footprint

Your **digital footprint** is everything the internet knows about you. Let's shrink it.

## Two Types of Footprints

### Active Footprint
Things you **intentionally** share:
- Social media posts and photos
- Online reviews and comments
- Forum posts and blog entries

### Passive Footprint
Things collected **without you realizing**:
- Cookies that track you across websites
- Your IP address logs
- Search history and browsing patterns
- Metadata in photos (GPS location, device info)

## Quick Wins to Reduce Your Footprint

### 1. Social Media Audit
- Google yourself — see what comes up
- Set profiles to **private**
- Remove old posts you wouldn't want an employer to see
- Disable location tagging on posts

### 2. Search Engine Privacy
- Use **DuckDuckGo** instead of Google for sensitive searches
- Clear your search history regularly
- Disable "Web & App Activity" tracking in your Google Account

### 3. Browser Hygiene
- Use browser extensions like **uBlock Origin** to block trackers
- Clear cookies weekly or use **Firefox containers**
- Use incognito/private mode for sensitive browsing

### 4. Photo Metadata
Before sharing photos online:
- Strip EXIF data (location, camera info) using tools like [ExifCleaner](https://exifcleaner.com)
- iOS/Android: Disable location in camera settings

## The "Future Employer" Test

> Before posting anything online, ask yourself: **"Would I be comfortable if my future employer saw this?"**

---
*Fact: Data brokers collect and sell personal information from public profiles. Reducing your footprint limits their access.*`,
                quiz: [
                    {
                        question: 'What is a "passive" digital footprint?',
                        options: [
                            'Posts you deliberately share on social media',
                            'Data collected about you without you actively sharing it',
                            'A fake online identity',
                            'Your resume on LinkedIn'
                        ],
                        correctIndex: 1,
                        explanation: 'Your passive digital footprint includes data collected without your active participation — like cookies tracking your browsing, IP address logs, and metadata in photos you upload.'
                    },
                    {
                        question: 'What does EXIF data in a photo potentially reveal?',
                        options: [
                            'Your email password',
                            'The GPS location where the photo was taken',
                            'Your social media followers',
                            'How many times the photo was viewed'
                        ],
                        correctIndex: 1,
                        explanation: 'EXIF data can contain GPS coordinates, timestamp, camera/phone model, and other metadata. This means sharing a photo could reveal your exact location. Always strip EXIF data before sharing sensitive images.'
                    },
                    {
                        question: 'Which search engine is known for NOT tracking your searches?',
                        options: [
                            'Google',
                            'Bing',
                            'DuckDuckGo',
                            'Yahoo'
                        ],
                        correctIndex: 2,
                        explanation: 'DuckDuckGo is a privacy-focused search engine that does not track your searches, build a profile of you, or sell your data to advertisers.'
                    },
                    {
                        question: 'What is the "Future Employer Test"?',
                        options: [
                            'A job interview technique',
                            'Asking if you\'d be comfortable with a future employer seeing your online content',
                            'A cybersecurity certification exam',
                            'A way to check if a job posting is legitimate'
                        ],
                        correctIndex: 1,
                        explanation: 'The Future Employer Test is a simple mental check: before posting anything online, consider whether you\'d be comfortable if a potential employer saw it. This helps you maintain a professional digital presence.'
                    }
                ]
            },
            {
                title: 'Privacy-Preserving Tools',
                notes: `# Privacy-Preserving Tools

Now that you understand the threats, here are **real tools** you can use to protect yourself.

## Essential Privacy Tools

### 🔒 Password Managers
Stop reusing passwords. Use a password manager to generate and store unique passwords.

- **Bitwarden** (free, open-source) — Best for students
- **1Password** — Premium option with family sharing
- **KeePassXC** — Offline, for maximum security

### 🌐 VPN (Virtual Private Network)
Encrypts your internet traffic so your ISP and network admins can't see what you're browsing.

- **ProtonVPN** — Free tier available, no-logs policy
- **Mullvad** — Anonymous sign-up, accepts cash payments
- Use your **university's VPN** for campus resources

> **Warning:** Free VPNs (especially on app stores) often sell your data. If you're not paying, YOU are the product.

### 🛡️ Browser Extensions
- **uBlock Origin** — Block ads and trackers
- **Privacy Badger** (EFF) — Automatically blocks invisible trackers
- **HTTPS Everywhere** — Forces encrypted connections

### 📧 Email Privacy
- **ProtonMail** — End-to-end encrypted email
- **SimpleLogin** — Create email aliases to avoid sharing your real address
- Use \`+\` aliases: \`yourname+shopping@gmail.com\` to track who sells your data

### 🔐 Two-Factor Authentication (2FA)
- Use **authenticator apps** (Authy, Google Authenticator) instead of SMS
- SMS 2FA is better than nothing, but can be intercepted via SIM swapping
- **Hardware keys** (YubiKey) are the gold standard

## Tool Setup Priority

1. **Today:** Install a password manager and migrate your top 5 accounts
2. **This week:** Enable 2FA on email, banking, and social media
3. **This month:** Set up a VPN and browser privacy extensions

---
*Remember: Privacy isn't about having something to hide — it's about having the right to choose what you share.*`,
                quiz: [
                    {
                        question: 'Why are free VPNs from app stores often dangerous?',
                        options: [
                            'They make your internet too fast',
                            'They often log and sell your browsing data',
                            'They are illegal to use',
                            'They only work on weekdays'
                        ],
                        correctIndex: 1,
                        explanation: 'Many free VPNs monetize by logging your browsing data and selling it to advertisers or data brokers. Remember: if you\'re not paying for the product, YOU are the product.'
                    },
                    {
                        question: 'What is the most secure form of two-factor authentication?',
                        options: [
                            'SMS text message codes',
                            'Email verification',
                            'Hardware security keys (like YubiKey)',
                            'Security questions'
                        ],
                        correctIndex: 2,
                        explanation: 'Hardware security keys are the most secure 2FA method because they require physical possession of the device and are immune to phishing and SIM-swapping attacks.'
                    },
                    {
                        question: 'What is the purpose of email aliases like "yourname+shopping@gmail.com"?',
                        options: [
                            'They create a new email account',
                            'They let you track which service leaked or sold your email',
                            'They make your email load faster',
                            'They encrypt your emails automatically'
                        ],
                        correctIndex: 1,
                        explanation: 'Using +aliases lets you give each service a unique email. If you start getting spam at "yourname+shopping@gmail.com", you know exactly which service shared your email address.'
                    }
                ]
            }
        ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // MODULE 3: WIFI & NETWORK WISDOM
    // ════════════════════════════════════════════════════════════════════════
    {
        id: 'wifi-wisdom',
        title: 'WiFi & Network Wisdom',
        description: 'Understand the risks of public WiFi and how to use campus networks securely.',
        color: '#A3BE8C',
        icon: 'Wifi',
        badge: 'WiFi Wizard',
        lessons: [
            {
                title: 'The Evil Twin Attack',
                notes: `# The Evil Twin Attack

An **Evil Twin** is a fake WiFi network that mimics a legitimate one. It's one of the most common attacks on campus.

## How It Works

1. Attacker sets up a WiFi hotspot with the **same name** as your campus WiFi (e.g., "CampusWiFi")
2. Your phone **automatically connects** to the stronger signal
3. All your internet traffic now flows through the **attacker's device**
4. They can see everything: passwords, messages, bank logins

## Why It's So Effective

- Your phone remembers WiFi networks and **auto-connects** to known names
- You can't tell the difference between the real network and the fake one
- It's trivially easy to set up — a laptop and free software is all it takes

## Real Scenario

> You're studying in the campus coffee shop. You see "CampusWiFi_Free" and connect. Everything seems normal. But an attacker at the next table created that network. Every website you visit, every login you enter — they see it all.

## How to Protect Yourself

### 1. Forget Open Networks
- Go to your WiFi settings and **forget** networks you don't use regularly
- Disable **auto-join** for public networks

### 2. Use Your University's Secure WiFi
- Connect to networks that use **WPA2/WPA3 Enterprise** (requires your student login)
- These are verified and encrypted — Evil Twins can't replicate the certificate

### 3. Always Use a VPN
- Even on trusted networks, a VPN encrypts your traffic end-to-end
- Your university likely provides a free VPN — check the IT website

### 4. Watch for HTTPS
- Look for the 🔒 padlock icon in your browser
- If a site shows a certificate warning on public WiFi, **disconnect immediately**

---
*Tip: If a WiFi network doesn't require a password, assume someone could be watching.*`,
                quiz: [
                    {
                        question: 'What is an "Evil Twin" attack?',
                        options: [
                            'A virus that clones your files',
                            'A fake WiFi network that mimics a legitimate one to intercept traffic',
                            'Two hackers working together',
                            'A phishing email sent twice'
                        ],
                        correctIndex: 1,
                        explanation: 'An Evil Twin is a rogue WiFi access point that uses the same name as a legitimate network. When you connect, all your traffic passes through the attacker\'s device.'
                    },
                    {
                        question: 'Why does your phone automatically connect to Evil Twin networks?',
                        options: [
                            'Because the attacker hacked your phone',
                            'Because your phone remembers WiFi names and auto-joins the strongest matching signal',
                            'Because Evil Twins use special frequencies',
                            'Because you accepted a terms of service'
                        ],
                        correctIndex: 1,
                        explanation: 'Your phone stores a list of previously connected WiFi names. When it sees a matching name, it auto-connects to the strongest signal — which could be the Evil Twin, not the real network.'
                    },
                    {
                        question: 'What type of campus WiFi is resistant to Evil Twin attacks?',
                        options: [
                            'Open WiFi with no password',
                            'WiFi with a simple shared password',
                            'WPA2/WPA3 Enterprise (requiring student login with certificate verification)',
                            'Any WiFi that says "Secure" in its name'
                        ],
                        correctIndex: 2,
                        explanation: 'WPA2/WPA3 Enterprise networks use certificate-based authentication that can\'t be replicated by an attacker. Your device can verify it\'s connecting to the real network, not a fake one.'
                    }
                ]
            },
            {
                title: 'VPN vs. Encryption',
                notes: `# VPN vs. Encryption: What's the Difference?

These terms are thrown around a lot. Let's clarify what each actually does.

## Encryption (HTTPS)

When you visit a website with \`https://\` (notice the **s**), the data between your browser and the website is **encrypted**.

- ✅ Protects: the **content** of what you're viewing (login forms, messages)
- ❌ Doesn't hide: **which websites** you visit (your ISP and network admin can still see you visited \`facebook.com\`)

Think of HTTPS like a **sealed envelope** — nobody can read the letter inside, but they can see who you're mailing it to.

## VPN (Virtual Private Network)

A VPN creates an **encrypted tunnel** between your device and a VPN server.

- ✅ Protects: which websites you visit (your ISP sees traffic to the VPN, not the final destination)
- ✅ Protects: your data on public WiFi
- ❌ Doesn't protect: what you do **after** the VPN server (the VPN provider can potentially see your traffic)

Think of a VPN like a **private courier** — nobody sees what you're sending or where it's going, but the courier (VPN provider) knows.

## When to Use What

| Situation | HTTPS Alone | VPN Needed? |
|--|--|--|
| Browsing on campus WiFi | Usually OK | Recommended |
| Public coffee shop WiFi | Not enough | **Yes, always** |
| Accessing campus resources | Via official portal | Use university VPN |
| Online banking | Essential | Adds extra protection |
| Browsing at home | Usually fine | Optional, improves privacy |

## Key Takeaway

> **HTTPS** encrypts what you say. **VPN** hides who you're talking to. Use both for maximum protection.

## Common VPN Myths

- ❌ "A VPN makes me anonymous" — Your VPN provider can see your traffic
- ❌ "A VPN protects me from malware" — It doesn't; use antivirus for that
- ❌ "I need VPN at all times" — Home networks are usually safe enough

---
*Remember: HTTPS is the minimum. VPN is the extra layer for untrusted networks.*`,
                quiz: [
                    {
                        question: 'What does HTTPS encrypt?',
                        options: [
                            'Which websites you visit',
                            'The content of data between your browser and the website',
                            'Your IP address',
                            'Your WiFi password'
                        ],
                        correctIndex: 1,
                        explanation: 'HTTPS encrypts the data (content) exchanged between your browser and the website, like login credentials and messages. However, your ISP can still see which domains you visit.'
                    },
                    {
                        question: 'In the "sealed envelope" analogy, what does a VPN do that HTTPS doesn\'t?',
                        options: [
                            'It seals the envelope better',
                            'It hides who you\'re sending the envelope to',
                            'It makes the envelope waterproof',
                            'It delivers the envelope faster'
                        ],
                        correctIndex: 1,
                        explanation: 'HTTPS (the sealed envelope) protects the contents, but observers can see the destination. A VPN (private courier) hides both the contents AND the destination from observers on your network.'
                    },
                    {
                        question: 'When is using a VPN most critical?',
                        options: [
                            'When browsing at home on your personal WiFi',
                            'When connected to public WiFi at a coffee shop',
                            'When using your phone\'s mobile data',
                            'When watching YouTube videos'
                        ],
                        correctIndex: 1,
                        explanation: 'Public WiFi is the most dangerous network to use without a VPN because you share the network with strangers, any of whom could be running an Evil Twin or packet-sniffing attack.'
                    },
                    {
                        question: 'Which of these VPN claims is a MYTH?',
                        options: [
                            'A VPN encrypts your internet traffic',
                            'A VPN hides your browsing from your ISP',
                            'A VPN makes you completely anonymous online',
                            'A VPN is useful on public WiFi'
                        ],
                        correctIndex: 2,
                        explanation: 'A VPN does NOT make you completely anonymous. The VPN provider can see your traffic, websites can still use cookies and fingerprinting, and your online accounts identify you.'
                    }
                ]
            },
            {
                title: 'Secure Browsing Habits',
                notes: `# Secure Browsing Habits

Good security starts with how you browse the web every day. Here are practical habits every student should adopt.

## Essential Habits

### 1. Check for HTTPS Everywhere
- Always look for the 🔒 padlock icon before entering any information
- **Never** enter passwords or personal data on HTTP (non-secure) pages
- Be extra cautious if the padlock is **broken** or shows a ⚠️ warning

### 2. Keep Your Browser Updated
Your browser is your front door to the internet. Keep it locked:
- Enable **automatic updates** in your browser settings
- Update immediately when prompted — updates patch security vulnerabilities
- Use a modern browser: Chrome, Firefox, Brave, or Edge

### 3. Be Smart with Extensions
- Only install extensions from **official stores** (Chrome Web Store, Firefox Add-ons)
- Review permissions before installing — does a coupon extension really need access to all your data?
- **Fewer is better** — each extension is a potential attack surface

### 4. Use Strong, Unique Passwords
- Never reuse passwords across sites
- Use a **password manager** (Bitwarden is free and excellent)
- Enable **2FA** on every account that offers it

### 5. Public Computer Safety
On shared or library computers:
- Always use **incognito/private** mode
- **Never** save passwords in the browser
- **Log out** of everything when done
- Don't access banking or sensitive accounts

## Browser Security Settings to Enable

### Chrome
- Settings → Privacy & Security → Enhanced Protection
- Block third-party cookies
- Enable "Always use secure connections" (HTTPS-Only Mode)

### Firefox
- Settings → Privacy & Security → Enhanced Tracking Protection: Strict
- Enable HTTPS-Only Mode

## The "Coffee Shop Checklist"

Before browsing on public WiFi:
- [ ] VPN connected?
- [ ] Browser up to date?
- [ ] Only visiting HTTPS sites?
- [ ] Not accessing banking/sensitive accounts?
- [ ] Private/incognito mode for logins?

---
*Security is a habit, not a one-time setup. Practice these daily until they become second nature.*`,
                quiz: [
                    {
                        question: 'You need to check your bank account on a public library computer. What should you do?',
                        options: [
                            'Open the browser normally and log in',
                            'Avoid it entirely — don\'t access banking on public computers',
                            'Use incognito mode and it\'s completely safe',
                            'Ask the librarian for permission first'
                        ],
                        correctIndex: 1,
                        explanation: 'Never access banking or other highly sensitive accounts on shared/public computers. These machines may have keyloggers, browser extensions that record data, or cached sessions from previous users.'
                    },
                    {
                        question: 'Why should you keep browser extensions to a minimum?',
                        options: [
                            'They slow down your computer too much',
                            'Each extension is a potential security vulnerability and attack surface',
                            'They use too much storage space',
                            'They make websites look ugly'
                        ],
                        correctIndex: 1,
                        explanation: 'Every browser extension has access to some of your browsing data. Malicious or compromised extensions can steal passwords, inject ads, or track your activity. Install only what you truly need from official stores.'
                    },
                    {
                        question: 'What does "HTTPS-Only Mode" in your browser do?',
                        options: [
                            'Makes your browser faster',
                            'Blocks all websites',
                            'Forces your browser to only connect to websites using encrypted HTTPS connections',
                            'Installs a VPN automatically'
                        ],
                        correctIndex: 2,
                        explanation: 'HTTPS-Only Mode tells your browser to always prefer encrypted connections. If a website doesn\'t support HTTPS, the browser will warn you before connecting over the insecure HTTP protocol.'
                    }
                ]
            }
        ]
    }
];
