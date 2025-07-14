// Ensure React and ReactDOM are available globally from CDN
// This script assumes React, ReactDOM, and Babel are loaded in index.html
// For example:
// <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
// <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
// <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

const { useState, useEffect, useCallback } = React;

// Function to show a custom message box (modal)
const showMessage = (message, type = 'info') => {
    const modal = document.getElementById('messageModal');
    const messageText = document.getElementById('messageText');
    const closeButton = document.getElementById('closeModal');

    if (!modal || !messageText || !closeButton) {
        console.error("Message modal elements not found. Falling back to console log.");
        console.log(`Message (${type}): ${message}`);
        return;
    }

    modal.style.display = 'flex'; // Use flex to center content
    messageText.textContent = message;
    messageText.className = `text-lg text-center p-4 rounded-md ${
        type === 'success' ? 'bg-green-600 text-white' :
        type === 'error' ? 'bg-red-600 text-white' :
        'bg-blue-600 text-white'
    }`;

    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
};

// Main App Component
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    // Initial stories data as a fallback, in case stories.json fetch fails or is not present
    const [stories, setStories] = useState([
      {
        "id": "clockwork-sparrow",
        "title": "The Clockwork Sparrow",
        "subtitle": "A Victorian inventor finds a message from the future.",
        "thumbnailUrl": "https://placehold.co/600x350/5D6D7E/ffffff?text=Clockwork+Sparrow",
        "foreword": "This story explores the delicate balance between fate and free will, inspired by a peculiar antique clock.",
        "storyText": "In the bustling heart of Victorian London, Master Elias Thorne, a horologist of eccentric genius, completed his latest marvel: a life-sized clockwork sparrow. Its feathers shimmered with polished brass, and its eyes, tiny rubies, held an uncanny glint. Elias wound its delicate mechanism, expecting a chirp, a flutter. Instead, a faint, metallic whisper emanated from its beak, a voice not of gears and springs, but of static and a distant, desperate plea. 'The Convergence... prevent... the temporal cascade...' Elias, a man of logic and precision, felt a shiver that had nothing to do with the damp London air. The sparrow began to glow, its brass plumage humming with an unseen energy, and a single, crystalline tear, impossibly warm, rolled from its ruby eye. He knew, with a certainty that defied all reason, that his latest invention had just delivered a message not from his workshop, but from a future teetering on the brink of collapse."
      },
      {
        "id": "neon-rain-ancient-streets",
        "title": "Neon Rain, Ancient Streets",
        "subtitle": "A cyberpunk detective uncovers an ancient Roman secret.",
        "thumbnailUrl": "https://placehold.co/600x350/6C5B7B/ffffff?text=Neon+Rain",
        "foreword": "This neo-noir tale delves into the echoes of history found in a futuristic metropolis, where ancient secrets refuse to stay buried.",
        "storyText": "The neon signs of Neo-Rome dripped across the rain-slicked cobblestones, reflecting a dizzying kaleidoscope of corporate logos and illicit data streams. Kaelen, a synth-enhanced private eye, pulled his trench coat tighter, the collar bristling with hidden sensors. His latest case: a missing data-broker, last seen near the ruins of the Colosseum, now a skeletal shell against the hyper-modern skyline. As he navigated the ancient aqueducts, repurposed as glowing data conduits, Kaelen stumbled upon a hidden chamber beneath the old Forum. It wasn't a forgotten server farm, but a perfectly preserved Roman villa, untouched by centuries of urban sprawl. On a marble table, a holographic projection flickered, depicting a toga-clad figure manipulating intricate, glowing symbols – symbols identical to the data-broker's last known encrypted message. The rain outside intensified, a symphony of liquid light, as Kaelen realized the true nature of the 'data-broker' and the 'missing' information: a time-traveling conspiracy woven into the very fabric of Rome, from its ancient foundations to its dazzling, dystopian future."
      },
      {
        "id": "whispering-library",
        "title": "The Whispering Library",
        "subtitle": "Books from every era share secrets in a library outside time.",
        "thumbnailUrl": "https://placehold.co/600x350/4CAF50/ffffff?text=Whispering+Library",
        "foreword": "A journey into a timeless archive, where every book holds a universe of possibilities and forgotten histories.",
        "storyText": "Elara found the library by accident, stepping through a shimmering archway that appeared in a forgotten alley. Inside, shelves stretched into an impossible infinity, filled with books bound in everything from ancient papyrus to shimmering, malleable alloys. There were no librarians, only a soft, pervasive hum – the collective murmur of countless voices. Each book, when touched, would whisper its contents directly into her mind, a symphony of narratives from every conceivable era. A leather-bound tome from the 18th century recounted a duel fought with words, while a crystal tablet from the 30th detailed the ethics of sentient AI. As she wandered deeper, a particular section pulsed with a faint, melancholic light. Here, books from timelines that never fully came to be hummed with unfulfilled potential. A diary from a world where magic triumphed over science, a history text from a reality where dinosaurs never died out. Elara realized this wasn't just a library; it was a nexus, a repository of every possible past, present, and future, each story a fragile echo in the vast, whispering silence."
      }
    ]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [githubToken, setGithubToken] = useState('');
    const [repoOwner, setRepoOwner] = useState('TemporalScribe'); // Your GitHub username
    const [repoName, setRepoName] = useState('temporal-echoes-website'); // Your NEW repository name

    // Effect to load stories from stories.json
    useEffect(() => {
        const fetchStories = async () => {
            try {
                // Use window.location.origin to ensure a fully qualified URL
                const response = await fetch(window.location.origin + '/stories.json');
                if (!response.ok) {
                    if (response.status === 404) {
                        // If stories.json not found, use the initial hardcoded stories
                        // and display a message that new stories can be added in Admin Mode.
                        showMessage("No stories.json found. Using default stories. You can add new stories in Admin Mode.", "info");
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setStories(data); // Update with fetched stories
                }
            } catch (e) {
                console.error("Error loading stories.json:", e);
                setError("Failed to load stories. Please try again later.");
                // Keep initial stories if fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchStories();

        // Handle hash changes for navigation
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash === 'admin') {
                setIsAdminMode(true);
                setCurrentPage('admin');
            } else if (hash) {
                setIsAdminMode(false);
                const foundStory = stories.find(story => story.id === hash);
                if (foundStory) {
                    setCurrentPage('story');
                    setSelectedStory(foundStory);
                } else {
                    setCurrentPage('home');
                    setSelectedStory(null);
                }
            } else {
                setIsAdminMode(false);
                setCurrentPage('home');
                setSelectedStory(null);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Call on initial load

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [stories.length]);

    // Function to save stories to GitHub
    const saveStoriesToGithub = async (newStoriesData) => {
        if (!githubToken) {
            showMessage("GitHub Personal Access Token is required to save stories. Please enter it in Admin Mode.", "error");
            return false;
        }

        const filePath = 'stories.json';
        const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        try {
            // Get current file SHA to update it
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            let sha = null;
            if (response.ok) {
                const data = await response.json();
                sha = data.sha;
            } else if (response.status !== 404) { // If not 404, it's another error
                throw new Error(`Failed to fetch current stories.json SHA: ${response.statusText}`);
            }

            // Encode the new stories data to Base64
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(newStoriesData, null, 2))));

            const commitMessage = sha ? 'Update stories.json via website admin' : 'Create stories.json via website admin';

            const payload = {
                message: commitMessage,
                content: content,
                sha: sha // Include SHA for updates, omit for new file creation
            };

            const putResponse = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(payload)
            });

            if (!putResponse.ok) {
                const errorData = await putResponse.json();
                throw new Error(`Failed to save stories: ${putResponse.statusText} - ${errorData.message || 'Unknown error'}`);
            }

            showMessage("Stories saved successfully to GitHub!", "success");
            setStories(newStoriesData); // Update local state
            setLoading(true); // Trigger re-fetch to ensure GitHub Pages updates
            setError(null);
            // Small delay to allow GitHub Pages to pick up the change
            setTimeout(() => {
                window.location.reload(); // Force page reload to get latest from GitHub Pages
            }, 5000); // Wait 5 seconds
            return true;
        } catch (e) {
            console.error("Error saving stories to GitHub:", e);
            showMessage(`Failed to save stories: ${e.message}. Check your token and permissions.`, "error");
            return false;
        }
    };


    const navigateToStory = useCallback((storyId) => {
        window.location.hash = storyId;
        const foundStory = stories.find(story => story.id === storyId);
        if (foundStory) {
            setCurrentPage('story');
            setSelectedStory(foundStory);
        } else {
            setCurrentPage('home');
            setSelectedStory(null);
        }
    }, [stories]);

    const navigateToHome = useCallback(() => {
        window.location.hash = '';
        setCurrentPage('home');
        setSelectedStory(null);
    }, []);

    const toggleAdminMode = useCallback(() => {
        if (isAdminMode) {
            window.location.hash = ''; // Exit admin mode, go home
        } else {
            window.location.hash = 'admin'; // Enter admin mode
        }
    }, [isAdminMode]);

    const Header = () => (
        <header className="bg-gray-800 shadow-lg py-4 px-6 md:px-12">
            <nav className="container mx-auto flex justify-between items-center">
                <a href="javascript:void(0);" onClick={navigateToHome} className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-all duration-300">
                    Temporal Echoes
                </a>
                <ul className="flex space-x-6">
                    <li><a href="javascript:void(0);" onClick={navigateToHome} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">Home</a></li>
                    <li><a href="javascript:void(0);" onClick={() => { /* Placeholder */ }} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">Stories</a></li>
                    <li><a href="javascript:void(0);" onClick={() => { /* Placeholder */ }} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">About</a></li>
                    <li><a href="javascript:void(0);" onClick={() => { /* Placeholder */ }} className="text-gray-300 hover:text-blue-400 text-lg font-medium transition-colors duration-300">Contact</a></li>
                    <li>
                        <button onClick={toggleAdminMode} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300">
                            {isAdminMode ? 'Exit Admin' : 'Admin'}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );

    const Footer = () => (
        <footer className="bg-gray-800 py-8 px-6 md:px-12 text-center text-gray-400">
            <div className="container mx-auto">
                <p>&copy; 2025 Temporal Echoes. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="javascript:void(0);" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                    <a href="javascript:void(0);" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                </div>
            </div>
        </footer>
    );

    const HomePage = ({ stories, navigateToStory, loading, error }) => (
        <>
            <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <img src="https://placehold.co/1920x600/34495e/ffffff?text=Time+Slip+Background" alt="Abstract time-slip background" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="relative z-20 p-8 max-w-4xl mx-auto bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                        Where Moments Transcend Time
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Explore a collection of AI-assisted flash fiction, weaving tales of past, present, and future in a single, captivating breath.
                    </p>
                    <a href="javascript:void(0);" onClick={() => navigateToStory(stories[0]?.id || '')} className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                        Begin Your Journey
                    </a>
                </div>
            </section>

            <section className="py-16 px-6 md:px-12 bg-gray-900">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-12">Featured Echoes</h2>
                    {loading && <p className="text-center text-xl text-gray-400">Loading stories...</p>}
                    {error && <p className="text-center text-xl text-red-400">{error}</p>}
                    {!loading && !error && stories.length === 0 && (
                        <p className="text-center text-xl text-gray-400">No stories found. You can add them in Admin Mode!</p>
                    )}
                    {!loading && !error && stories.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.slice(0, 3).map(story => (
                                <div key={story.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2">
                                    <img src={story.thumbnailUrl} alt={`${story.title} thumbnail`} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold text-white mb-2">{story.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{story.subtitle}</p>
                                        <a href="javascript:void(0);" onClick={() => navigateToStory(story.id)} className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300">Read More &rarr;</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-12">
                        <a href="javascript:void(0);" onClick={() => { /* Placeholder */ }} className="inline-block bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                            View All Stories
                        </a>
                    </div>
                </div>
            </section>
        </>
    );

    const StoryPage = ({ story, navigateToHome }) => {
        useEffect(() => {
            const disableRightClick = (e) => { e.preventDefault(); };
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
            document.addEventListener('contextmenu', disableRightClick);
            return () => {
                document.removeEventListener('contextmenu', disableRightClick);
                document.body.style.userSelect = '';
                document.body.style.webkitUserSelect = '';
                document.body.style.mozUserSelect = '';
                document.body.style.msUserSelect = '';
            };
        }, [story]);

        if (!story) {
            return <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">Story not found.</div>;
        }

        // Render storyText, converting \\n\\n back to actual newlines for display
        // Also convert **text** to <b>text</b> and *text* to <i>text</i> for basic formatting
        const formattedStoryText = story.storyText
            .replace(/\\n\\n/g, '\n\n') // Paragraph breaks
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
            .replace(/\*(.*?)\*/g, '<i>$1</i>'); // Italics

        return (
            <div className="py-16 px-6 md:px-12 bg-gray-900 min-h-screen">
                <div className="container mx-auto max-w-3xl bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 border border-gray-700">
                    <button onClick={navigateToHome} className="mb-8 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 flex items-center">
                        &larr; Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">{story.title}</h1>
                    <p className="text-xl text-gray-400 mb-6">{story.subtitle}</p>
                    {story.foreword && (
                        <div className="text-lg text-gray-400 italic mb-6 p-4 border-l-4 border-blue-500 bg-gray-700 rounded-r-lg">
                            <p>{story.foreword}</p>
                        </div>
                    )}
                    {story.thumbnailUrl && (
                        <img src={story.thumbnailUrl} alt={`${story.title} cover`} className="w-full h-64 object-cover rounded-lg mb-8 shadow-md" />
                    )}
                    {/* Use dangerouslySetInnerHTML to render HTML from formattedStoryText */}
                    <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap" style={{ userSelect: 'none' }} dangerouslySetInnerHTML={{ __html: formattedStoryText }}>
                    </div>
                </div>
            </div>
        );
    };

    const AdminPage = ({ githubToken, setGithubToken, stories, saveStoriesToGithub, navigateToHome }) => {
        const [newStoryTitle, setNewStoryTitle] = useState('');
        const [newStorySubtitle, setNewStorySubtitle] = useState('');
        const [newStoryForeword, setNewStoryForeword] = useState('');
        const [newStoryText, setNewStoryText] = useState('');
        const [newStoryThumbnailUrl, setNewStoryThumbnailUrl] = useState('https://placehold.co/600x350/E0BBE4/ffffff?text=New+Story+Image');

        const handleAddStory = async () => {
            if (!newStoryTitle || !newStoryText) {
                showMessage("Title and Story Text are required.", "error");
                return;
            }

            const newId = newStoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
            if (stories.some(story => story.id === newId)) {
                showMessage("A story with this title already exists. Please choose a different title.", "error");
                return;
            }

            const newStory = {
                id: newId,
                title: newStoryTitle,
                subtitle: newStorySubtitle,
                thumbnailUrl: newStoryThumbnailUrl,
                foreword: newStoryForeword,
                // Store newlines as \\n\\n for paragraphs and \\n for single line breaks
                // Now also handle **bold** and *italics* using simple Markdown-like syntax
                storyText: newStoryText
                    .replace(/\n\n/g, '\\n\\n') // Convert blank lines to paragraph breaks
                    .replace(/\n/g, '\\n')     // Convert single newlines to line breaks
            };

            const updatedStories = [...stories, newStory];
            const success = await saveStoriesToGithub(updatedStories);
            if (success) {
                setNewStoryTitle('');
                setNewStorySubtitle('');
                setNewStoryForeword('');
                setNewStoryText('');
                setNewStoryThumbnailUrl('https://placehold.co/600x350/E0BBE4/ffffff?text=New+Story+Image');
            }
        };

        return (
            <div className="py-16 px-6 md:px-12 bg-gray-900 min-h-screen">
                <div className="container mx-auto max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 border border-gray-700">
                    <button onClick={navigateToHome} className="mb-8 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 flex items-center">
                        &larr; Back to Home
                    </button>
                    <h1 className="text-4xl font-extrabold text-white mb-8">Admin Panel</h1>

                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold text-white mb-4">GitHub Personal Access Token (PAT)</h2>
                        <p className="text-gray-300 mb-4">
                            To save stories, you need a GitHub Personal Access Token with 'repo' scope.
                            This token is stored only in your browser and never sent to our servers.
                        </p>
                        <input
                            type="password"
                            placeholder="Enter your GitHub PAT here"
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                            className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                            <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                How to create a PAT (select 'repo' scope)
                            </a>
                        </p>
                    </div>

                    <div className="mb-8 p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold text-white mb-4">Add New Story</h2>
                        <div className="mb-4">
                            <label htmlFor="storyTitle" className="block text-gray-300 text-sm font-bold mb-2">Title:</label>
                            <input
                                type="text"
                                id="storyTitle"
                                value={newStoryTitle}
                                onChange={(e) => setNewStoryTitle(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                                placeholder="e.g., The Whispering Library"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="storySubtitle" className="block text-gray-300 text-sm font-bold mb-2">Subtitle:</label>
                            <input
                                type="text"
                                id="storySubtitle"
                                value={newStorySubtitle}
                                onChange={(e) => setNewStorySubtitle(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                                placeholder="e.g., Books from every era share secrets."
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="storyForeword" className="block text-gray-300 text-sm font-bold mb-2">Foreword (Optional):</label>
                            <textarea
                                id="storyForeword"
                                value={newStoryForeword}
                                onChange={(e) => setNewStoryForeword(e.target.value)}
                                rows="3"
                                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                                placeholder="e.g., A journey into a timeless archive..."
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="storyThumbnail" className="block text-gray-300 text-sm font-bold mb-2">Thumbnail Image URL (Optional):</label>
                            <input
                                type="text"
                                id="storyThumbnail"
                                value={newStoryThumbnailUrl}
                                onChange={(e) => setNewStoryThumbnailUrl(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                                placeholder="e.g., https://placehold.co/600x350/E0BBE4/ffffff?text=New+Story+Image"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="storyText" className="block text-gray-300 text-sm font-bold mb-2">Story Text:</label>
                            <textarea
                                id="storyText"
                                value={newStoryText}
                                onChange={(e) => setNewStoryText(e.target.value)}
                                rows="10"
                                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                                placeholder="Paste your story content here. Use a blank line between paragraphs for formatting."
                            ></textarea>
                            <p className="text-sm text-gray-400 mt-1">
                                Use an empty line (press Enter twice) to create new paragraphs.
                                For **bold** text, use two asterisks before and after. For *italics*, use one asterisk before and after.
                            </p>
                        </div>
                        <button
                            onClick={handleAddStory}
                            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
                        >
                            Add & Save Story
                        </button>
                    </div>

                    <div className="p-6 bg-gray-700 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold text-white mb-4">Existing Stories</h2>
                        {stories.length === 0 ? (
                            <p className="text-gray-400">No stories added yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {stories.map(story => (
                                    <li key={story.id} className="bg-gray-900 p-3 rounded-md border border-gray-600 text-gray-300 flex justify-between items-center">
                                        <span>{story.title} (ID: {story.id})</span>
                                        {/* Future: Add edit/delete buttons here */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 antialiased">
            <Header />
            <main>
                {loading && <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">Loading stories...</div>}
                {error && <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">{error}</div>}
                {!loading && !error && (
                    <>
                        {currentPage === 'home' && (
                            <HomePage stories={stories} navigateToStory={navigateToStory} loading={loading} error={error} />
                        )}
                        {currentPage === 'story' && selectedStory && (
                            <StoryPage story={selectedStory} navigateToHome={navigateToHome} />
                        )}
                        {currentPage === 'admin' && (
                            <AdminPage
                                githubToken={githubToken}
                                setGithubToken={setGithubToken}
                                stories={stories}
                                saveStoriesToGithub={saveStoriesToGithub}
                                navigateToHome={navigateToHome}
                            />
                        )}
                    </>
                )}
            </main>
            <Footer />

            {/* Message Modal Structure (Hidden by default) */}
            <div id="messageModal" class="modal">
                <div class="modal-content">
                    <span class="close-button" id="closeModal">&times;</span>
                    <p id="messageText" class="text-center"></p>
                </div>
            </div>
        </div>
    );
};

// Mount the App component to the 'root' div in index.html
// This part is crucial and needs to be outside the App component in script.js
// It will be called once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
    } else {
        console.error("Root element not found. React app cannot mount.");
    }
});
