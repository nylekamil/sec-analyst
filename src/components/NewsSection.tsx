import React, { useState } from 'react';
import { NewsStory } from '@/types';
import { 
  Newspaper, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Plus, 
  Minus,
  Briefcase
} from 'lucide-react';

interface NewsSectionProps {
  news: NewsStory[];
  ticker: string;
}

export default function NewsSection({ news, ticker }: NewsSectionProps) {
  
  // Track which news item is expanded for sentiment details
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="border border-terminal-border bg-terminal-panel rounded-lg overflow-hidden font-mono text-xs">
      
      {/* SECTION HEADER */}
      <div className="bg-terminal-darker px-4 py-3 border-b border-terminal-border flex justify-between items-center select-none">
        <span className="text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
          <Newspaper className="h-4 w-4 text-terminal-cyan" />
          VI. SEC/FINANCE PUBLISHED FEED ({ticker})
        </span>
        <span className="text-terminal-cyan bg-terminal-cyan-glow border border-terminal-cyan/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
          SOURCE: YAHOO FINANCE NEWS FEED
        </span>
      </div>

      {/* ARTICLES LIST */}
      <div className="flex flex-col">
        {news && news.length > 0 ? (
          news.map((story) => {
            const isExpanded = expandedId === story.id;
            
            return (
              <div 
                key={story.id} 
                className="border-b border-terminal-border/50 last:border-b-0 hover:bg-terminal-darker/35 transition-colors duration-150"
              >
                
                {/* ARTICLE HEADER ROW */}
                <div 
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => toggleExpand(story.id)}
                >
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="text-slate-400 font-bold">{story.source}</span>
                      <span>&bull;</span>
                      <span>{story.date}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm leading-snug tracking-tight hover:text-terminal-cyan transition-colors">
                      {story.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-3 select-none">
                    <a 
                      href={story.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()} // Stop accordion toggle when clicking link
                      className="text-slate-500 hover:text-terminal-cyan p-1 border border-terminal-border rounded hover:border-terminal-cyan transition-colors"
                      title="Open Original Article Source"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    
                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* EXPANDED AI SENTIMENT AREA */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-terminal-darker/60 border-t border-terminal-border/20 flex flex-col gap-3">
                    
                    {/* ACCORDION DIVIDER HEADER */}
                    <div className="flex items-center gap-2 border-b border-terminal-border/30 pb-1.5 text-[10px] text-terminal-cyan tracking-wider font-bold">
                      <AlertCircle className="h-3.5 w-3.5" />
                      AI ANALYST SENTIMENT WRAP
                    </div>
                    
                    {story.sentimentAnalysis ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Positive & Negative list */}
                        <div className="flex flex-col gap-3 font-mono text-[11px]">
                          {/* Positive */}
                          <div>
                            <span className="text-terminal-green font-bold flex items-center gap-1 uppercase text-[9px] mb-1">
                              <Plus className="h-3 w-3" /> Positive Vectors
                            </span>
                            <ul className="list-disc pl-4 text-slate-400 flex flex-col gap-1">
                              {story.sentimentAnalysis.positiveDevelopments.map((p, idx) => (
                                <li key={idx} className="leading-relaxed">{p}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Negative */}
                          <div>
                            <span className="text-terminal-red font-bold flex items-center gap-1 uppercase text-[9px] mb-1">
                              <Minus className="h-3 w-3" /> Negative Overhangs
                            </span>
                            <ul className="list-disc pl-4 text-slate-400 flex flex-col gap-1">
                              {story.sentimentAnalysis.negativeDevelopments.map((n, idx) => (
                                <li key={idx} className="leading-relaxed">{n}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Investment Takeaway Box */}
                        <div className="bg-terminal-panel/50 border border-terminal-border/50 p-3 rounded flex flex-col gap-1.5 text-[11px]">
                          <span className="text-slate-500 font-bold uppercase text-[9px] flex items-center gap-1.5">
                            <Briefcase className="h-3 w-3 text-terminal-cyan" />
                            EQUITY INVESTMENT TAKEAWAY:
                          </span>
                          <p className="text-slate-300 italic font-sans leading-relaxed">
                            "{story.sentimentAnalysis.investmentImplications}"
                          </p>
                        </div>

                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[11px]">
                        AI News summarization pending or omitted for simulated headlines. Click again to check, or ensure OpenAI credentials are fully initialized.
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-500">
            No published news found for this ticker asset class.
          </div>
        )}
      </div>

    </div>
  );
}
