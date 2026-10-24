import {
    PiEnvelopeSimple,
    PiFileText,
    PiGithubLogo,
    PiInstagramLogo,
    PiLinkedinLogo,
} from "react-icons/pi";
import { EMAIL, RESUME, SOCIALS } from "../../constants/Site";
import "../Intro/Intro.scss";

const scrollToId = (id) =>
    document.getElementById(id)?.scrollIntoView({ block: "start" });

// Underlined word + thumbnail; both react to hover as one link.
const InlineLink = ({ word, thumb, initials, label, onClick, href }) => (
    <a
        className="ilink"
        href={href}
        aria-label={label}
        onClick={(event) => {
            if (!onClick) return;
            event.preventDefault();
            onClick();
        }}
    >
        <span className="ilink__word">{word}</span>
        {initials ? (
            <span className="ilink__thumb ilink__thumb--photo" aria-hidden>
                {initials}
            </span>
        ) : (
            <img
                className="ilink__thumb"
                src={thumb}
                alt=""
                width={58}
                height={36}
            />
        )}
    </a>
);

const Chip = ({ href, icon, label, i, download, external = true }) => (
    <a
        className="chip load-item"
        style={{ "--i": i }}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download}
    >
        {icon}
        {label}
    </a>
);

const Intro = ({ onFilter }) => {
    const openWork = (filter) => {
        onFilter(filter);
        scrollToId("work");
    };

    return (
        <section className="intro" id="top">
            <div className="intro__column">
                <h1 className="intro__lead">
                    <span
                        className="intro__line load-item"
                        style={{ "--i": 1 }}
                    >
                        Hi, I'm{" "}
                        <InlineLink
                            word="Collins"
                            thumb="/media/collage/profile-thumbb.jpg"
                            href="#contact"
                            label="Collins — say hello"
                            onClick={() => scrollToId("contact")}
                        />
                        , a software developer who
                    </span>{" "}
                    <span
                        className="intro__line load-item"
                        style={{ "--i": 2 }}
                    >
                        turns ideas into real-life products. For the past
                    </span>{" "}
                    <span
                        className="intro__line load-item"
                        style={{ "--i": 3 }}
                    >
                        three years I've been building{" "}
                        <InlineLink
                            word="web apps"
                            thumb="/media/collage/thumb-web.jpg"
                            href="#work"
                            label="web apps — see web work on the bench"
                            onClick={() => openWork("web")}
                        />
                        ,
                    </span>{" "}
                    <span
                        className="intro__line load-item"
                        style={{ "--i": 4 }}
                    >
                        <InlineLink
                            word="mobile apps"
                            thumb="/media/collage/thumb-mobile.jpg"
                            href="#motion"
                            label="mobile apps — see them in motion"
                            onClick={() => scrollToId("motion")}
                        />{" "}
                        and the odd{" "}
                        <InlineLink
                            word="web3"
                            thumb="/media/collage/thumb-web3.jpg"
                            href="#work"
                            label="web3 — see web3 work"
                            onClick={() => openWork("web3")}
                        />{" "}
                        experiment
                    </span>{" "}
                    <span
                        className="intro__line load-item"
                        style={{ "--i": 5 }}
                    >
                        for clients across continents.
                    </span>
                </h1>

                <div className="intro__sub">
                    <p className="intro__bio load-item" style={{ "--i": 6 }}>
                        I care about clean interfaces, buttery transitions and
                        the small details that make people stay. Most days
                        you'll find me deep in Next.js, React Native and Expo —
                        usually with something on repeat in the background.
                    </p>

                    <p className="intro__links">
                        <span className="load-item" style={{ "--i": 7 }}>
                            Grab my
                        </span>
                        <Chip
                            href={RESUME}
                            i={8}
                            external={false}
                            download
                            icon={<PiFileText aria-hidden />}
                            label="Resume"
                        />
                        <span className="load-item" style={{ "--i": 9 }}>
                            & find me on
                        </span>
                        <Chip
                            href={SOCIALS.github}
                            i={10}
                            icon={<PiGithubLogo aria-hidden />}
                            label="GitHub"
                        />
                        <Chip
                            href={SOCIALS.x}
                            i={11}
                            icon={
                                <span className="chip__x" aria-hidden>
                                    𝕏
                                </span>
                            }
                            label="X"
                        />
                        <Chip
                            href={SOCIALS.linkedin}
                            i={12}
                            icon={<PiLinkedinLogo aria-hidden />}
                            label="LinkedIn"
                        />
                        <span className="load-item" style={{ "--i": 13 }}>
                            and
                        </span>
                        <Chip
                            href={SOCIALS.instagram}
                            i={14}
                            icon={<PiInstagramLogo aria-hidden />}
                            label="Instagram"
                        />
                    </p>

                    <p className="intro__links">
                        <span className="load-item" style={{ "--i": 15 }}>
                            Or just say hi via
                        </span>
                        <Chip
                            href={`mailto:${EMAIL}`}
                            i={16}
                            external={false}
                            icon={<PiEnvelopeSimple aria-hidden />}
                            label="Email"
                        />
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Intro;
