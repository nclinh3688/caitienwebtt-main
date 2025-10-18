import { NextRequest, NextResponse } from 'next/server';

interface VocabularyItem {
  japanese?: string;
  meaning?: string;
  pronunciation?: string;
  example?: string;
}

interface GrammarItem {
  pattern?: string;
  meaning?: string;
  usage?: string;
}

interface KanjiItem {
  character?: string;
  meaning?: string;
  onyomi?: string;
  kunyomi?: string;
  strokeCount?: number;
  radicals?: string[];
}

interface GrokContext {
  pageType: 'vocabulary' | 'grammar' | 'kanji' | string;
  userLevel?: string;
  currentItem?: VocabularyItem | GrammarItem | KanjiItem;
  category?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { question, context, model = 'grok-beta', maxTokens = 500, temperature = 0.8 } = await request.json();

    // Create context-aware system prompt for Grok
    const systemPrompt = createGrokSystemPrompt(context);
    
    // Create user message with context
    const userMessage = createGrokUserMessage(question, context);

    // Try to use real Grok API first
    try {
      const grokResponse = await callRealGrokAPI(question, context, systemPrompt, userMessage, model, maxTokens, temperature);
      return NextResponse.json({
        content: grokResponse,
        confidence: 0.9,
        model: model,
        note: 'Grok AI - Real API Response',
      });
    } catch (grokError) {
      console.warn('Real Grok API failed, using simulation:', grokError);
      
      // Fallback to simulation
      const grokResponse = simulateGrokResponse(question, context);
      return NextResponse.json({
        content: grokResponse,
        confidence: 0.85,
        model: model,
        note: 'Grok AI - Simulated Response (Real API failed)',
      });
    }
  } catch (error) {
    console.error('Grok AI error:', error);
    return NextResponse.json(
      { error: 'Failed to get Grok AI response' },
      { status: 500 }
    );
  }
}

async function callRealGrokAPI(question: string, context: GrokContext, systemPrompt: string, userMessage: string, model: string, maxTokens: number, temperature: number): Promise<string> {
  const grokApiKey = process.env.GROK_API_KEY;
  
  if (!grokApiKey) {
    throw new Error('GROK_API_KEY not found');
  }

  // Note: This is a placeholder for when Grok API becomes publicly available
  // The actual implementation will depend on Grok's API documentation
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${grokApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
}

function createGrokSystemPrompt(context: GrokContext): string {
  const { pageType, userLevel = 'N5' } = context;
  
  const basePrompt = `Bạn là Grok AI - một AI assistant thông minh, hài hước và trực tiếp của xAI (Elon Musk).

Đặc điểm của bạn:
- Trả lời bằng tiếng Việt
- Giải thích rõ ràng, dễ hiểu
- Có chút hài hước nhưng vẫn chuyên nghiệp
- Trực tiếp, không vòng vo
- Cập nhật thông tin mới nhất
- Khuyến khích học viên một cách tích cực

Bạn đang hỗ trợ học viên học ${userLevel} tiếng Nhật.

`;

  switch (pageType) {
    case 'vocabulary':
      return basePrompt + `
Chuyên môn: Từ vựng tiếng Nhật
- Giải thích ý nghĩa từ vựng một cách thú vị
- Tạo câu ví dụ sử dụng từ
- Đưa ra từ đồng nghĩa/trái nghĩa
- Mẹo ghi nhớ từ vựng (có thể hài hước)
- Cách phát âm chính xác
- Ngữ cảnh sử dụng phù hợp
- Chia sẻ fun facts về từ vựng Nhật
`;
    
    case 'grammar':
      return basePrompt + `
Chuyên môn: Ngữ pháp tiếng Nhật
- Giải thích cấu trúc ngữ pháp một cách đơn giản
- So sánh với ngữ pháp tương tự
- Chỉ ra lỗi thường gặp (có thể hài hước)
- Tạo câu ví dụ đa dạng
- Cách sử dụng trong thực tế
- Lưu ý quan trọng khi học
- Chia sẻ tips học ngữ pháp hiệu quả
`;
    
    case 'kanji':
      return basePrompt + `
Chuyên môn: Kanji tiếng Nhật
- Giải thích ý nghĩa kanji một cách thú vị
- Cách đọc Onyomi và Kunyomi
- Bộ thủ và cấu trúc kanji
- Thứ tự nét viết
- Tạo câu chuyện ghi nhớ (có thể hài hước)
- Ví dụ từ ghép với kanji
- Chia sẻ lịch sử thú vị của kanji
`;
    
    default:
      return basePrompt;
  }
}

function createGrokUserMessage(question: string, context: GrokContext): string {
  const { currentItem, category } = context;
  
  let contextInfo = '';
  
  if (currentItem) {
    if (context.pageType === 'vocabulary') {
      const item = currentItem as VocabularyItem;
      contextInfo = `
Thông tin từ vựng hiện tại:
- Từ: ${item.japanese || 'N/A'}
- Nghĩa: ${item.meaning || 'N/A'}
- Phát âm: ${item.pronunciation || 'N/A'}
- Ví dụ: ${item.example || 'N/A'}
`;
    } else if (context.pageType === 'grammar') {
      const item = currentItem as GrammarItem;
      contextInfo = `
Thông tin ngữ pháp hiện tại:
- Pattern: ${item.pattern || 'N/A'}
- Nghĩa: ${item.meaning || 'N/A'}
- Cách dùng: ${item.usage || 'N/A'}
`;
    } else if (context.pageType === 'kanji') {
      const item = currentItem as KanjiItem;
      contextInfo = `
Thông tin kanji hiện tại:
- Kanji: ${item.character || 'N/A'}
- Nghĩa: ${item.meaning || 'N/A'}
- Onyomi: ${item.onyomi || 'N/A'}
- Kunyomi: ${item.kunyomi || 'N/A'}
- Số nét: ${item.strokeCount || 'N/A'}
`;
    }
  }
  
  return `Câu hỏi của học viên: ${question}

${contextInfo}

Chủ đề: ${category || 'N/A'}

Hãy trả lời theo phong cách Grok - thông minh, hài hước và trực tiếp!`;
}

function simulateGrokResponse(question: string, context: GrokContext): string {
  const { pageType, currentItem, userLevel = 'N5' } = context;
  const questionLower = question.toLowerCase();
  
  // Grok-style responses (humorous, direct, real-time aware)
  const grokResponses = {
    vocabulary: [
      `Ah, từ "${(currentItem as VocabularyItem)?.japanese || 'này'}"! 🤓 Đây là một từ rất thú vị trong ${userLevel}. Nghĩa là "${(currentItem as VocabularyItem)?.meaning || '...'}" - khá đơn giản phải không?`,
      `Từ "${(currentItem as VocabularyItem)?.japanese || 'này'}" có nghĩa là "${(currentItem as VocabularyItem)?.meaning || '...'}"! 💡 Mẹo nhỏ: Hãy liên tưởng đến hình ảnh hoặc âm thanh tương tự. Ví dụ: "${(currentItem as VocabularyItem)?.example || 'Tôi sẽ tạo ví dụ cho bạn.'}"`,
      `Grok đây! Từ "${(currentItem as VocabularyItem)?.japanese || 'này'}" phát âm là "${(currentItem as VocabularyItem)?.pronunciation || '...'}" và nghĩa là "${(currentItem as VocabularyItem)?.meaning || '...'}". Đơn giản như Elon Musk nói về AI vậy! 😄`
    ],
    grammar: [
      `Ngữ pháp này khá thú vị! 🎯 Cấu trúc: "${(currentItem as GrammarItem)?.pattern || 'Danh từ + は + Tính từ/Động từ'}". Đừng quên particle は nhé - nó quan trọng như Tesla trong thế giới xe điện!`,
      `Grok giải thích: ${(currentItem as GrammarItem)?.usage || 'Ngữ pháp này dùng để biểu đạt ý nghĩa cụ thể.'} Lỗi thường gặp? Quên particle hoặc sai thứ tự từ. Nhưng đừng lo, ai cũng mắc lỗi! 😉`,
      `Cấu trúc này: "${(currentItem as GrammarItem)?.pattern || '...'}" - đơn giản như SpaceX landing! 🚀 Hãy luyện tập nhiều và đừng sợ mắc lỗi. Mỗi lỗi là một bước tiến!`
    ],
    kanji: [
      `Kanji "${(currentItem as KanjiItem)?.character || 'này'}" - đây là một kanji cơ bản! 📝 Nghĩa: "${(currentItem as KanjiItem)?.meaning || '...'}", Onyomi: "${(currentItem as KanjiItem)?.onyomi || '...'}", Kunyomi: "${(currentItem as KanjiItem)?.kunyomi || '...'}". ${(currentItem as KanjiItem)?.strokeCount || '2'} nét thôi, dễ như đếm từ 1 đến 10!`,
      `Grok đây! Kanji "${(currentItem as KanjiItem)?.character || 'này'}" có ${(currentItem as KanjiItem)?.strokeCount || '2'} nét. Thứ tự viết: từ trên xuống dưới, từ trái sang phải. Như viết code vậy - có quy tắc rõ ràng! 💻`,
      `Kanji "${(currentItem as KanjiItem)?.character || 'này'}" - nghĩa là "${(currentItem as KanjiItem)?.meaning || '...'}". Bộ thủ: ${(currentItem as KanjiItem)?.radicals?.join(', ') || 'Tôi sẽ giải thích bộ thủ cho bạn.'} Hiểu bộ thủ giúp ghi nhớ dễ dàng hơn, như hiểu thuật toán vậy! 🧠`
    ]
  };
  
  const typeResponses = grokResponses[pageType as keyof typeof grokResponses] || grokResponses.vocabulary;
  const randomResponse = typeResponses[Math.floor(Math.random() * typeResponses.length)];
  
  // Add Grok-style humor based on question
  if (questionLower.includes('khó') || questionLower.includes('hard')) {
    return `${randomResponse}\n\nĐừng lo! Học tiếng Nhật cần thời gian, như Elon Musk cần thời gian để đưa người lên sao Hỏa vậy! 🚀 Kiên nhẫn là chìa khóa!`;
  }
  
  if (questionLower.includes('mẹo') || questionLower.includes('tip')) {
    return `${randomResponse}\n\nMẹo Grok: Học mỗi ngày, sử dụng flashcard, xem anime/phim Nhật, và đừng sợ mắc lỗi. Mỗi lỗi là một cơ hội học hỏi - như mỗi lần SpaceX thất bại là một bài học! 💪`;
  }
  
  return `${randomResponse}\n\nGrok luôn sẵn sàng hỗ trợ bạn học tiếng Nhật! Hãy tiếp tục và đừng ngại hỏi thêm! 🎯`;
}
