import '../css/SongCard.css'
import { Play, Download,Calendar, User, Tag, TrendingUp, Filter } from 'lucide-react';

export default function SongCard(){

    return(
        <div className="song-card">
            <div className="song-content">
                <h3 className="song-title">
                    Song Title
                </h3>
                <p className="song-writer">
                    <User className="icon user-icon"/>
                    John Doe
                </p>

                <div className="song-meta">
                    <div className="meta-row">
                        <span>Key: C</span>
                        <span>3:30</span>
                    </div>
                    <div className="meta-row">
                        <span>Temp: 76BPM</span>
                        <span>
                            <Calendar className='icon calendar-icon'/>
                            2025-07-29
                        </span>
                    </div>
                </div>
                <div className="tags">
                    <span className="tag">#Western</span>
                </div>
                <div className="song-actions">
                    <button className="play-btn">
                        <Play className='icon play-icon'/>
                        Play
                    </button>
                    <button className="download-btn">
                        <Download className='icon download-icon'/>
                    </button>
                </div>
            </div>
        </div>
    )
}