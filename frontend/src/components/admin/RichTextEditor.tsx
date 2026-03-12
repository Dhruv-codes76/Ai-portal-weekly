"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { 
    Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, 
    Image as ImageIcon, Link as LinkIcon, Unlink, Search 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-foreground underline decoration-foreground/30 hover:decoration-foreground transition-all cursor-pointer font-bold',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Write something amazing...',
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-lg dark:prose-invert focus:outline-none min-h-[400px] max-w-none p-6 text-foreground font-sans leading-relaxed',
            },
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle Search for Internal Links
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }
            
            setSearching(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/search/suggestions?q=${searchQuery}`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setSearching(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    if (!isMounted || !editor) return (
        <div className="border border-border bg-background p-6 min-h-[400px] animate-pulse">
            <div className="h-4 bg-muted w-1/4 mb-4 rounded" />
            <div className="h-4 bg-muted w-full mb-2 rounded" />
            <div className="h-4 bg-muted w-full mb-2 rounded" />
        </div>
    );

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setInternalLink = (url: string) => {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        setIsLinkModalOpen(false);
        setSearchQuery("");
    };

    const setExternalLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border border-border bg-background transition-all">
            {/* Toolbar */}
            <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-muted/20 sticky top-0 z-10">
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBold().run()} 
                    active={editor.isActive('bold')}
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleItalic().run()} 
                    active={editor.isActive('italic')}
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleUnderline().run()} 
                    active={editor.isActive('underline')}
                >
                    <span className="font-serif underline font-bold text-xs">U</span>
                </MenuButton>
                
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                    active={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                    active={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="w-4 h-4" />
                </MenuButton>
                
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBulletList().run()} 
                    active={editor.isActive('bulletList')}
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                    active={editor.isActive('orderedList')}
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                    active={editor.isActive('blockquote')}
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>
                
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                
                <MenuButton onClick={addImage}>
                    <ImageIcon className="w-4 h-4" />
                </MenuButton>
                
                <MenuButton 
                    onClick={() => setIsLinkModalOpen(true)}
                    active={editor.isActive('link')}
                >
                    <Search className="w-4 h-4" />
                </MenuButton>
                
                <MenuButton onClick={setExternalLink}>
                    <LinkIcon className="w-4 h-4" />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <div className="relative">
                <EditorContent editor={editor} />
                
                {/* Internal Link Modal */}
                {isLinkModalOpen && (
                    <div className="absolute top-12 left-2 right-2 bg-background border border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest">Link to Internal Content</h4>
                            <button onClick={() => setIsLinkModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search tools or news..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm mb-2"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {searching && <div className="p-2 text-xs italic text-muted-foreground">Searching Catalog...</div>}
                            {!searching && searchQuery.length >= 2 && suggestions.length === 0 && (
                                <div className="p-2 text-xs text-muted-foreground">No matches found.</div>
                            )}
                            {suggestions.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setInternalLink(s.url)}
                                    className="w-full p-2 text-left hover:bg-foreground hover:text-background flex justify-between items-center transition-colors"
                                >
                                    <span className="text-sm font-bold">{s.title}</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-70">{s.type}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="border-t border-border p-2 bg-muted/10 flex justify-between items-center px-4">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Rich Content Mode Enabled
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    {editor.storage.characterCount?.words?.() || 0} words
                </div>
            </div>
        </div>
    );
}

function MenuButton({ onClick, active, children }: { onClick: () => void, active?: boolean, children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 transition-all hover:bg-foreground hover:text-background ${active ? "bg-foreground text-background" : "text-foreground"}`}
        >
            {children}
        </button>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    )
}
