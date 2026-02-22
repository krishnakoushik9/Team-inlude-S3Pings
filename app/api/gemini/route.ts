import { NextRequest, NextResponse } from 'next/server';
import {
    initializeGemini,
    isGeminiInitialized,
    detectAIPhishing,
    getGuidance,
    generateDigitalHygieneTip,
    explainSecurityConcept,
    generateHygieneReport,
    analyzeCampusAlert,
} from '@/lib/gemini';

// Initialize Gemini from environment if available
if (process.env.GEMINI_API_KEY && !isGeminiInitialized()) {
    initializeGemini(process.env.GEMINI_API_KEY);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, apiKey, ...data } = body;

        // Initialize with provided API key if not already initialized
        if (apiKey && !isGeminiInitialized()) {
            initializeGemini(apiKey);
        }

        if (!isGeminiInitialized()) {
            return NextResponse.json(
                { error: 'Gemini API not initialized. Please provide an API key.' },
                { status: 400 }
            );
        }

        let result: unknown;

        switch (action) {
            case 'detectPhishing':
                result = await detectAIPhishing(data.emailContent, data.localScrubbing);
                break;

            case 'getGuidance':
                result = await getGuidance(data.situation, data.context, data.localScrubbing);
                break;

            case 'generateTip':
                result = await generateDigitalHygieneTip(data.topic);
                break;

            case 'explainConcept':
                result = await explainSecurityConcept(data.concept);
                break;

            case 'generateHygieneReport':
                result = await generateHygieneReport(data.answers);
                break;

            case 'analyzeCampusAlert':
                result = await analyzeCampusAlert(data.alertInfo, data.localScrubbing);
                break;

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        initialized: isGeminiInitialized(),
        availableActions: [
            'detectPhishing',
            'getGuidance',
            'generateTip',
            'explainConcept',
            'generateHygieneReport',
            'analyzeCampusAlert',
        ],
    });
}
