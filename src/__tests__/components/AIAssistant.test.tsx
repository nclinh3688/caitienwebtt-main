import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AIAssistant } from '@/components/ui/AIAssistant'

// Mock the AI API
jest.mock('@/lib/ai', () => ({
  generateAIResponse: jest.fn().mockResolvedValue({
    response: 'Test AI response',
    success: true
  })
}))

describe('AIAssistant Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders AI Assistant interface', () => {
    render(<AIAssistant />)
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument()
  })

  it('handles user input and displays response', async () => {
    render(<AIAssistant />)
    
    const input = screen.getByPlaceholderText(/ask a question/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test question' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Test AI response')).toBeInTheDocument()
    })
  })

  it('shows loading state during AI processing', async () => {
    render(<AIAssistant />)
    
    const input = screen.getByPlaceholderText(/ask a question/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test question' } })
    fireEvent.click(sendButton)
    
    expect(screen.getByText(/thinking/i)).toBeInTheDocument()
  })

  it('handles AI errors gracefully', async () => {
    const { generateAIResponse } = require('@/lib/ai')
    generateAIResponse.mockRejectedValueOnce(new Error('AI service unavailable'))
    
    render(<AIAssistant />)
    
    const input = screen.getByPlaceholderText(/ask a question/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test question' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
