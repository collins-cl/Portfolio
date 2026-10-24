import "../SectionHead/SectionHead.scss";

// The "periodic element" header every section opens with.
const SectionHead = ({ number, symbol, title, meta, live, desc, as = "h2" }) => {
    const Title = as;

    return (
        <div className="section-head">
            <div className="section-head__row">
                <div className="element-tile" aria-hidden>
                    <span className="element-tile__top">
                        <span>{number}</span>
                        <span className="element-tile__mass">/06</span>
                    </span>
                    <span className="element-tile__symbol">{symbol}</span>
                </div>

                <div className="section-head__titles">
                    <Title className="section-head__title">{title}</Title>
                    <p className="section-head__meta">
                        {live && <span className="section-head__live" />}
                        {meta}
                    </p>
                </div>
            </div>

            {desc && <p className="section-head__desc">{desc}</p>}
        </div>
    );
};

export default SectionHead;
