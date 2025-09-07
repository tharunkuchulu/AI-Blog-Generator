import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import ThemeToggle from '@/components/ThemeToggle';
import Header from '@/components/Header';
import InputSection from '@/components/InputSection';
import LoadingState from '@/components/LoadingState';
import BlogDisplay from '@/components/BlogDisplay';
import Footer from '@/components/Footer';

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [blogContent, setBlogContent] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');

  const handleGenerate = async (prompt: string, model: string) => {
    setIsLoading(true);
    setBlogContent('');
    setSelectedModel(model);
    setLastPrompt(prompt);

    try {
      const response = await fetch("https://ai-blog-generator-a522.onrender.com/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, model }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to generate blog");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) break;
        const chunk = decoder.decode(value, { stream: true });
        setBlogContent(prev => prev + chunk);
      }
    } catch (error) {
      console.error("Error generating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastPrompt && selectedModel) {
      handleGenerate(lastPrompt, selectedModel);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      
      <div className="container mx-auto px-4 py-12">
        <Header />
        
        <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
        
        {isLoading && <LoadingState />}
        
        {blogContent && !isLoading && (
          <BlogDisplay 
            content={blogContent} 
            title="AI Generated Blog"
            onRegenerate={handleRegenerate}
          />
        )}
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
