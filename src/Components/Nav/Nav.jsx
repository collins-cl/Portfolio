import "../Nav/Nav.scss";
import SpotifyNowPlaying from "../NowPlayingSpotify/SpotifyNowPlaying";

const Nav = () => {
    return (
        <div className="nav" data-scroll-section>
            <div className="wrapper">
                <p className="logo">
                    <a href="/">KoleĦ</a>
                </p>

                <div className="aside">
                    <SpotifyNowPlaying />
                </div>
            </div>
        </div>
    );
};

export default Nav;
