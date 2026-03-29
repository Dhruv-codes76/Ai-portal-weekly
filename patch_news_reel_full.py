import re

with open('frontend/src/components/NewsReelItem.tsx', 'r') as f:
    content = f.read()

# 1. Update text styles to remove truncation and show full title/summary
content = content.replace('line-clamp-3 ', '')
content = content.replace('line-clamp-2', '')

# Ensure text takes up necessary space and is readable
content = content.replace('className="text-[26px] sm:text-3xl font-bold font-sans tracking-tight text-white leading-tight"', 'className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white leading-tight"')

# 2. Add Heart icon import since we're replacing "Read" with "Like"
if 'Heart' not in content:
    content = content.replace('Share2, MessageCircle, ChevronUp, ExternalLink, ChevronDown', 'Share2, MessageCircle, ChevronUp, ChevronDown, Heart')

# 3. Update the floating action bar to "Youtube Shorts" style: Like, Chat, Share
# Remove ExternalLink (Read) button and replace with Like
old_read_button = """{news.sourceLink && (
                            <a
                                href={news.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                                onClick={handleInteraction}
                            >
                                <ExternalLink className="w-5 h-5" />
                                <span className="text-[9px] font-semibold mt-0.5 tracking-wider">READ</span>
                            </a>
                        )}"""

new_like_button = """<button
                            className="flex flex-col items-center justify-center text-white active:scale-90 transition-transform group"
                            onClick={() => {
                                handleInteraction();
                                // Add like logic here if needed
                            }}
                        >
                            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Heart className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-semibold mt-1 drop-shadow-md">Like</span>
                        </button>"""

content = content.replace(old_read_button, new_like_button)

# Update Chat button to Youtube style
old_chat_button = """<button
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                            onClick={() => {
                                setShowComments(true);
                                handleInteraction();
                            }}
                        >
                            <MessageCircle className="w-5 h-5 fill-transparent" />
                            <span className="text-[9px] font-semibold mt-0.5 tracking-wider">CHAT</span>
                        </button>"""

new_chat_button = """<button
                            className="flex flex-col items-center justify-center text-white active:scale-90 transition-transform group"
                            onClick={() => {
                                setShowComments(true);
                                handleInteraction();
                            }}
                        >
                            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <MessageCircle className="w-7 h-7 fill-white/20" />
                            </div>
                            <span className="text-xs font-semibold mt-1 drop-shadow-md">Chat</span>
                        </button>"""

content = content.replace(old_chat_button, new_chat_button)

# Update Share button to Youtube style
old_share_button = """<button
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                            onClick={toggleShare}
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="text-[9px] font-semibold mt-0.5 tracking-wider">SHARE</span>
                        </button>"""

new_share_button = """<button
                            className="flex flex-col items-center justify-center text-white active:scale-90 transition-transform group"
                            onClick={toggleShare}
                        >
                            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Share2 className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-semibold mt-1 drop-shadow-md">Share</span>
                        </button>"""

content = content.replace(old_share_button, new_share_button)

# Adjust image height and text area height so text fits without truncation
# Currently top is 55% and bottom is 45%. Let's give more room to text: top 40%, bottom 60%.
# And add overflow-y-auto to the text area so it's scrollable if very long.
content = content.replace('h-[55%]', 'h-[40%]')
content = content.replace('top-[55%]', 'top-[40%]')
content = content.replace('h-[45%]', 'h-[60%]')
content = content.replace('flex-1 flex flex-col justify-end overflow-hidden', 'flex-1 flex flex-col justify-end overflow-y-auto custom-scrollbar')

with open('frontend/src/components/NewsReelItem.tsx', 'w') as f:
    f.write(content)
