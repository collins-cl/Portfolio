import { useState } from "react";
import { Screens } from "../../constants/Screens";
import "./MobileShowcase.scss";

// Each entry is one screen of one app. Drop clips or screenshots into
// /public/media and set `video` (mp4) or `cover` (png/jpg), e.g. "/media/duel.mp4".

const MobileShowcase = () => {
    const [activeId, setActiveId] = useState(null);
    const [revealed, setRevealed] = useState(false);

    const active =
        Screens.find((screen) => screen.id === activeId) ?? Screens[0];

    return (
        <div className="mobile-showcase" data-scroll-section>
            <div className="wrapper">
                <p className="head">Mobile apps i've built.</p>

                <p className="desc">
                    Real screens and interactions from apps i've shipped —
                    polished UI, buttery transitions, and the details that make
                    users stay.
                </p>

                <div
                    className="showcase"
                    onMouseLeave={() => setRevealed(false)}
                >
                    <div className="tracks" role="list">
                        {Screens.map((screen, index) => (
                            <button
                                key={screen.id}
                                type="button"
                                role="listitem"
                                className={`track${
                                    screen.id === activeId ? " is-active" : ""
                                }`}
                                onMouseEnter={() => {
                                    setActiveId(screen.id);
                                    setRevealed(true);
                                }}
                                onFocus={() => {
                                    setActiveId(screen.id);
                                    setRevealed(true);
                                }}
                                onClick={() => {
                                    setActiveId(screen.id);
                                    setRevealed(true);
                                }}
                            >
                                <span className="track__index">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="track__body">
                                    <span className="track__title">
                                        {screen.title}
                                    </span>

                                    <span className="track__meta">
                                        {screen.app} · {screen.tagline}
                                    </span>
                                </span>

                                <span className="track__chip">
                                    {screen.kind}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div
                        className={revealed ? "stage" : "stage is-idle"}
                        onMouseEnter={() => setRevealed(true)}
                    >
                        <div className="phone">
                            <div className="phone__island" />

                            <div className="phone__screen" key={active.id}>
                                {revealed && active.video ? (
                                    <video
                                        src={active.video}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                ) : revealed && active.cover ? (
                                    <img
                                        src={active.cover}
                                        alt={`${active.app} — ${active.title}`}
                                    />
                                ) : revealed ? (
                                    <div className="phone__placeholder">
                                        <span>Drop a clip or screenshot</span>
                                        <span className="phone__hint">
                                            video.mp4 or screen.png
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileShowcase;
