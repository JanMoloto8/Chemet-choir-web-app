import Nav from '../components/Nav';
import { Search, Grid, List, Play, Download, Music, Calendar, User, Tag, TrendingUp, Filter, Plus, X, Upload } from 'lucide-react';
import '../css/Rep.css';
import { useState, useContext, useRef,useEffect } from 'react';
import SongCard from '../components/SongCard';
import { AuthContext } from "../context/AuthContext";
const getEmbeddedVideoURL = (url) => {
    if (!url) return null;

    // Extract the domain for easier matching
    const domain = new URL(url).hostname;

    // YouTube or YouTube-wrappers like ymusicapp
    if (
        domain.includes('youtube.com') ||
        domain.includes('youtu.be') ||
        domain.includes('ymusicapp.com')
    ) {
        let videoId;

        if (domain.includes('youtu.be')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else {
            videoId = new URL(url).searchParams.get('v');
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    }

    // TikTok
    if (url.includes('tiktok.com')) {
        return url.replace('www.tiktok.com', 'www.tiktok.com/embed');
    }

    return null;
};

export default function Rep() {
    const { user, token, logout } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [currentVideoLink, setCurrentVideoLink] = useState(null);


    const [newSong, setNewSong] = useState({
        title: '',
        songwriter: '',
        category: 'western',
        songKey: 'C',
        duration: '',
        tempo: '',
        tags: '',
        lyrics: '',
        notes: '',
        sheetMusic: null,
        videoLink: ''
    });

    const numCategories = 3;

    const filteredSongs = songs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.songwriter.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || song.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleInputChange = (field, value) => {
        setNewSong(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validatePDFFile = (file) => {
        if (!file) return true;

        if (file.type !== 'application/pdf') {
            alert('Please upload a valid PDF file.');
            return false;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('File size must be under 10MB.');
            return false;
        }

        return true;
    };

    const handleFileChange = (field, file) => {
        if (field === 'sheetMusic' && file && !validatePDFFile(file)) {
            return;
        }

        setNewSong(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reformatting the song data to match the required structure
        const newSongData = {
            title: newSong.title,
            songwriter: newSong.songwriter || "Unknown Artist",
            tempo: newSong.tempo || "120BPM",
            key: newSong.songKey,
            category: newSong.category,
            link: {
                youtube: newSong.videoLink.trim() ? newSong.videoLink : "",
                tiktok: newSong.videoLink.trim() ? newSong.videoLink : "",
            },
            status: "progress", // Assume the status is "complete" by default
        };

        try {
            // Sending the formatted data to the backend API
            const response = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/repertoire/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Assuming you have a token for authentication
                },
                body: JSON.stringify(newSongData),
            });

            const result = await response.json();

            if (response.ok) {
                // Update local state to include the new song
                setSongs(prev => [...prev, newSongData]);

                // Reset the form
                setNewSong({
                    title: '',
                    songwriter: '',
                    category: 'western',
                    songKey: 'C',
                    duration: '',
                    tempo: '',
                    tags: '',
                    lyrics: '',
                    notes: '',
                    sheetMusic: null,
                    videoLink: ''
                });

                setShowModal(false);
                alert('Song added successfully!');
            } else {
                alert('Failed to add song: ' + result.message);
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while adding the song.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setNewSong({
            title: '',
            songwriter: '',
            category: 'western',
            songKey: 'C',
            duration: '',
            tempo: '',
            tags: '',
            lyrics: '',
            notes: '',
            sheetMusic: null,
            videoLink: ''
        });
    };

const handlePlay = (songData) => {
    if (songData.videoLink.includes('tiktok.com')) {
        window.open(songData.videoLink, '_blank');
    } else if (songData.videoLink) {
        setCurrentVideoLink(songData.videoLink);
    } else {
        alert('No video link available for this song');
    }
};

    const handleDownload = (songData) => {
        if (songData.sheetMusicFile) {
            const url = URL.createObjectURL(songData.sheetMusicFile);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${songData.title}_sheet_music.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert('No sheet music file available for download');
        }
    };
        useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/repertoire/list");

                const data = await res.json();
                console.log(data.songs[0].category)
                if (data.success && data.songs) {
                    const formatted = data.songs.map(song => ({
                        id: song.id,
                        title: song.title,
                        songwriter: song.songwriter,
                        songKey: song.key || 'C',
                        tempo: song.tempo || '120BPM',
                        duration: song.duration || "0:00",
                        dateAdded: new Date(song.createdAt._seconds * 1000).toISOString().split("T")[0],
                        tags: song.tags || [],
                        category: song.category || [],
                        hasVideo: !!(song.link?.youtube || song.link?.tiktok),
                        hasSheetMusic: false,
                        videoLink: song.link?.youtube || song.link?.tiktok || ""
                    }));

                    setSongs(formatted);
                } else {
                    alert("Failed to fetch songs.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                alert("An error occurred while loading songs.");
            }
        };

        fetchSongs();
    }, [token]);

    return (
        <>
            <Nav />
            <div className="page-container">
                <div className="page-header1">
                    <h1 className='page-title1'>Song Repertoire</h1>

                    <div className="rep-stats-container">
                        <div className="rep-stat-item">
                            <Music className='rep-icon music-icon' />
                            <span>{filteredSongs.length} Songs</span>
                        </div>
                        <div className="rep-stat-item">
                            <Tag className='rep-icon tag-icon' />
                            <span>{numCategories} Categories</span>
                        </div>
                    </div>
                </div>

                <div className="filter-container">
                    <div className="rep-search">
                        <Search className='rep-icon search-icon' />
                        <input
                            type="text"
                            className="search-input"
                            placeholder='Search by title, songwriter, or tags...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="by-category">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="western">Western</option>
                            <option value="african">African</option>
                            <option value="stibili">Istibili</option>
                        </select>
                    </div>
                    {
                        user.role==="admin" &&(
                        <button
                        className="add-song-btn"
                        onClick={() => setShowModal(true)}>
                            <Plus className="rep-icon" />
                            Add New Song
                        </button>
                        )
                    }

                </div>

                <div className="song-grid">
                    {filteredSongs.map(song => (
                        <SongCard
                            key={song.id}
                            title={song.title}
                            songwriter={song.songwriter}
                            songKey={song.songKey}
                            duration={song.duration}
                            tempo={song.tempo}
                            dateAdded={song.dateAdded}
                            tags={song.tags}
                            category={song.category}
                            hasVideo={song.hasVideo}
                            hasSheetMusic={song.hasSheetMusic}
                            videoLink={song.videoLink}
                            onPlay={handlePlay}
                            onDownload={() => handleDownload(song)}
                        />
                    ))}

                    {filteredSongs.length === 0 && (
                        <div className="no-songs-message">
                            <Music className="rep-icon" />
                            <p>No songs found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Song</h2>
                                <button className="close-btn" onClick={closeModal}>
                                    <X className="rep-icon" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="title">Song Title *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={newSong.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="songwriter">Songwriter</label>
                                        <input
                                            type="text"
                                            id="songwriter"
                                            value={newSong.songwriter}
                                            onChange={(e) => handleInputChange('songwriter', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="category">Category *</label>
                                        <select
                                            id="category"
                                            value={newSong.category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                            required
                                        >
                                            <option value="western">Western</option>
                                            <option value="african">African</option>
                                            <option value="stibili">Istibili</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="songKey">Key</label>
                                        <select
                                            id="songKey"
                                            value={newSong.songKey}
                                            onChange={(e) => handleInputChange('songKey', e.target.value)}
                                        >
                                            <option value="C">C</option>
                                            <option value="C#">C#</option>
                                            <option value="D">D</option>
                                            <option value="Eb">Eb</option>
                                            <option value="E">E</option>
                                            <option value="F">F</option>
                                            <option value="F#">F#</option>
                                            <option value="G">G</option>
                                            <option value="Ab">Ab</option>
                                            <option value="A">A</option>
                                            <option value="Bb">Bb</option>
                                            <option value="B">B</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="duration">Duration (mm:ss)</label>
                                        <input
                                            type="text"
                                            id="duration"
                                            value={newSong.duration}
                                            onChange={(e) => handleInputChange('duration', e.target.value)}
                                            placeholder="3:45"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="tempo">Tempo (BPM)</label>
                                        <input
                                            type="text"
                                            id="tempo"
                                            value={newSong.tempo}
                                            onChange={(e) => handleInputChange('tempo', e.target.value)}
                                            placeholder="120BPM"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tags">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        id="tags"
                                        value={newSong.tags}
                                        onChange={(e) => handleInputChange('tags', e.target.value)}
                                        placeholder="e.g., gospel, contemporary, traditional"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="notes">Performance Notes</label>
                                    <textarea
                                        id="notes"
                                        rows="3"
                                        value={newSong.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        placeholder="Any special notes about tempo, key changes, performance instructions..."
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="videoLink">YouTube/TikTok Video Link (Optional)</label>
                                        <input
                                            type="url"
                                            id="videoLink"
                                            value={newSong.videoLink}
                                            onChange={(e) => handleInputChange('videoLink', e.target.value)}
                                            placeholder="https://www.youtube.com.... or https://www.tiktok.com/..."
                                        />
                                        <p className="input-help">
                                            Paste the full URL from YouTube or TikTok for audio/video reference
                                        </p>
                                    </div>

                                    <div className="form-group file-group">
                                        <label htmlFor="sheetMusic">Sheet Music (PDF)</label>
                                        <div
                                            className="file-input-wrapper"
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                id="sheetMusic"
                                                accept=".pdf"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange('sheetMusic', e.target.files[0])}
                                            />
                                            <div className="file-input-display">
                                                <Upload className="rep-icon" />
                                                <span>{newSong.sheetMusic ? newSong.sheetMusic.name : 'Choose PDF file'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        Add Song
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* === Embedded Video Modal === */}
                {currentVideoLink && (
                    <div className="modal-overlay" onClick={() => setCurrentVideoLink(null)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2>Now Playing</h2>
                                <button className="close-btn" onClick={() => setCurrentVideoLink(null)}>
                                    <X className="rep-icon" />
                                </button>
                            </div>

                            <div className="video-wrapper">
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={getEmbeddedVideoURL(currentVideoLink)}
                                    title="Video Player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
