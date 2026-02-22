
import { NextRequest, NextResponse } from 'next/server';
import { getGuidance, isGeminiInitialized, initializeGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        // Ensure Gemini is initialized
        if (!isGeminiInitialized() && process.env.GEMINI_API_KEY) {
            initializeGemini(process.env.GEMINI_API_KEY);
        }

        const body = await req.json();
        const { message, context, localScrubbing } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        try {
            const aiResponse = await getGuidance(message, context, localScrubbing);
            return NextResponse.json({ response: aiResponse });
        } catch (geminiError: unknown) {
            const errMsg = geminiError instanceof Error ? geminiError.message : '';
            console.error('Gemini API Error:', geminiError);

            if (
                errMsg.includes('API key') ||
                errMsg.includes('API not initialized') ||
                !process.env.GEMINI_API_KEY
            ) {
                return NextResponse.json({
                    response: "I'm currently in offline mode. Here's a quick tip: Always check the sender's email address carefully — phishing emails often use addresses that look close to real ones, but with small typos. When in doubt, contact your campus IT desk! 🛡️"
                });
            }

            throw geminiError;
        }

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
