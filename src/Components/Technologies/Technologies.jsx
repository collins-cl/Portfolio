import { Langs } from "../LanguagesDummy";
import "../Technologies/Technologies.scss";

const Technologies = () => {
    const data = Langs;
    return (
        <div className="technologies" data-scroll-section>
            <div className="wrapper">
                <p className="head">What I Work With.</p>

                <p className="desc">
                    Over the years, I&apos;ve built products for companies and
                    individuals around continents ranging from marketing
                    websites to complex solutions and enterprise apps with focus
                    on fast, elegant and accessible user experiences.
                </p>

                <div className="speciality">
                    <p className="title">What i build.</p>

                    <div className="content">
                        <div className="container">
                            <div className="box">
                                <span>Fe.</span>
                                <p>Frontend Applications</p>
                            </div>
                            <div className="box">
                                <span>Mb.</span>
                                <p>Mobile Applications</p>
                            </div>
                            <div className="box">
                                <span>Web3.</span>

                                <p>Web3 Applications</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="skill">
                    <div className="header">
                        <p className="title">Technologies i work with.</p>

                        <span className="line" aria-hidden="true" />

                        <span className="count">{data.length} tools</span>
                    </div>

                    <div className="list">
                        {data.map((item) => (
                            <div key={item.id} className="box" data-scroll>
                                <img src={item.image.src} alt={item.Type} />

                                <p>{item.Type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Technologies;
