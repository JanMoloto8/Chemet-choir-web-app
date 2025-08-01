import Nav from '../components/Nav';
import { Search, Grid, List, Play, Download, Music, Calendar, User, Tag, TrendingUp, Filter } from 'lucide-react';
import '../css/Rep.css'
import { useState } from 'react';
import SongCard from '../components/SongCard';

export default function Rep(){
    const [numSongs,setNumSongs] =useState(0);
    const [searchTerm,setSearchTerm] = useState("");
    const numCategories = 3;
    return(
        <>
        <Nav/>
        <div className="page-container">
            <div className="page-header1">
                <h1 className='page-title1'>Song Repertoire</h1>

                <div className="rep-stats-container">
                    <div className="rep-stat-item">
                        <Music className='rep-icon music-icon' />
                        <span>{numSongs} Songs</span>
                    </div>
                    <div className="rep-stat-item">
                        <Tag className='rep-icon tag-icon'/>
                        <span>{numCategories} Categories</span>
                    </div>
                </div>
            </div>

            <div className="filter-container">
                 <div className="rep-search">
                    <Search className='rep-icon search-icon '/>
                    <input 
                    type="text" 
                    className="search-input"
                    placeholder='Search by title,songwriter,or tags...'
                    value={searchTerm}
                    onChange={(e)=>{e.target.value}}
                     />
                 </div>

                 <div className="by-category">
                    <select name="" id="">
                        <option value="all">All</option>
                        <option value="western">Western</option>
                        <option value="african">African</option>
                        <option value="stibili">Istibili</option>
                    </select>
                 </div>
            </div>
            
            <div className="song-grid">
                <SongCard/>
                <SongCard/>
                <SongCard/>
            </div>
        </div>
        </>
    );
}