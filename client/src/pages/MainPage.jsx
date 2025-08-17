import '../css/MainPage.css'
import Nav from '../components/Nav.jsx'
import StatCard from '../components/StatCard.jsx';

function MainPage(){

    return(
        <>
        <Nav></Nav>
        <section className="greeting">
            <h1 className="welcome-title">Good evening, John! 🎵</h1>
            <p className="welcome-subtitle">Ready for tonight's rehearsal? The Christmas Concert is just around the corner!</p>
            <div className="status-indicator">
                <i className="fas fa-calendar-alt"></i>
                Next: Christmas Concert in 12 days
            </div>
        </section>

        <div className="stats-section">
            <div className="stats-grid">
                <StatCard number={"4"} label={"Songs completed"}/>
                <StatCard number={"90%"} label={"Rehearsals Attended"}/>
                <StatCard number={"5"} label={"Upcoming events"}/>              
                <StatCard number={"#3"} label={"Choir Ranking"}/>                
            </div>
        </div>
        </>
    );
}

export default MainPage