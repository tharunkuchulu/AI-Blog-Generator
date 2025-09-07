import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (prompt: string, model: string) => void;
  isLoading: boolean;
}

const models = [
  { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek' },
  { id: 'openai/gpt-oss-20b:free', name: 'OpenAI (gpt-oss-20b)' },
  { id: 'moonshotai/kimi-k2:free', name: 'MoonshotAI (Kimi K2)' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen' }, // optional
  { id: 'mistral/mistral-small-24b-instruct-2501:free', name: 'Mistral Small' },
  { id: 'google/gemma-3n-e4b-it:free', name: 'Google Gemma 3n' },
];


const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const handleGenerate = () => {
    if (prompt.trim() && selectedModel) {
      onGenerate(prompt.trim(), selectedModel);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Model Selection */}
      <div className="space-y-2">
        <Label htmlFor="model-select" className="text-lg font-medium">
          Choose Model
        </Label>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger 
            id="model-select" 
            className="w-full h-10 text-sm glass-card glow-hover"
          >
            <SelectValue placeholder="Select an AI model..." />
          </SelectTrigger>
          <SelectContent className="glass-card">
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <Label htmlFor="prompt-input" className="text-lg font-medium">
          Your Idea
        </Label>
        <Textarea
          id="prompt-input"
          placeholder="Enter your idea here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] text-base glass-card glow-hover resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim() || !selectedModel || isLoading}
        className="w-full h-14 text-lg font-semibold gradient-bg hover:scale-105 hover:shadow-[0_0_25px_hsl(var(--gradient-start)/0.6)] transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        Generate Blog
      </Button>
    </div>
  );
};

export default InputSection;