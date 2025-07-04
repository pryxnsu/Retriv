import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css/github-markdown.css';

export function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className="prose max-w-none dark:prose-invert markdown text-[15px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
