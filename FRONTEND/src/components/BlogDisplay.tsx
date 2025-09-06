import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BlogDisplayProps {
  content: string;
  title?: string;
  onRegenerate?: () => void;
}

const BlogDisplay: React.FC<BlogDisplayProps> = ({ content, title, onRegenerate }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Blog content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'blog'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-16">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl gradient-text">
              {title || "Generated Blog"}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="glow-hover"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="glow-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="leading-relaxed text-justify">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0 gradient-text">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-6 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 mt-5 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-base leading-relaxed text-foreground">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="text-base leading-relaxed text-foreground">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {onRegenerate && (
        <div className="text-center mt-6">
          <Button
            onClick={onRegenerate}
            className="gradient-bg hover:scale-105 transform transition-all duration-200 glow-hover"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate Blog
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogDisplay;