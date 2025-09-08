import '../css/SongCard.css'
import { Play, Download, Calendar, User, Tag, TrendingUp, Filter } from 'lucide-react';

export default function SongCard({ 
    title = "Untitled Song",
    songwriter = "Unknown Artist", 
    songKey = "C", 
    duration = "0:00", 
    tempo = "120BPM", 
    dateAdded = "2025-01-01",
    tags = [],
    category = "western",
    onPlay,
    onDownload,
    hasVideo = false,         
    hasSheetMusic = true,
    videoLink = ""             // Added videoLink prop
}) {

    const handlePlay = () => {
        if (onPlay) {
            // Pass the complete song data including videoLink
            onPlay({ 
                title, 
                songwriter, 
                songKey, 
                duration, 
                tempo, 
                videoLink,      
                hasVideo 
            });
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload({ title, songwriter, hasSheetMusic });
        }
    };

    // Format tags array into tag elements
    const renderTags = () => {
        if (tags.length === 0) {
            return <span className="tag">#{category.toUpperCase()}</span>;
        }
        
        return tags.map((tag, index) => (
            <span key={index} className="tag">
                #{tag.toUpperCase()}
            </span>
        ));
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        });
    };

    return (
        <div className="song-card">
            <div className="song-content">
                <h3 className="song-title" title={title}>
                    {title}
                </h3>
                <p className="song-writer">
                    <User className="icon user-icon"/>
                    {songwriter}
                </p>

                <div className="song-meta">
                    <div className="meta-row">
                        <span>Key: {songKey}</span>
                        <span>{duration}</span>
                    </div>
                    <div className="meta-row">
                        <span>Tempo: {tempo}</span>
                        <span>
                            <Calendar className='icon calendar-icon'/>
                            {formatDate(dateAdded)}
                        </span>
                    </div>
                </div>
                
                <div className="tags">
                    {renderTags()}
                </div>
                
                <div className="song-actions">
                    <button 
                        className={`play-btn ${!hasVideo ? 'disabled' : ''}`}
                        onClick={handlePlay}
                        disabled={!hasVideo}
                        title={hasVideo ? 'Play video' : 'No video link available'}
                    >
                        <Play className='icon play-icon'/>
                        Play
                    </button>
                    <button 
                        className={`download-btn ${!hasSheetMusic ? 'disabled' : ''}`}
                        onClick={handleDownload}
                        disabled={!hasSheetMusic}
                        title={hasSheetMusic ? 'Download sheet music' : 'No sheet music available'}
                    >
                        <Download className='icon download-icon'/>
                    </button>
                </div>
            </div>
        </div>
    );
}