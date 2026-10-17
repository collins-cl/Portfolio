import "../Hero/Hero.scss";

const Hero = () => {
    return (
        <div className="hero" data-scroll-section>
            <div className="wrapper">
                <div className="section-1">
                    <h2 className="title">
                        Software <br />
                        Developer.
                    </h2>

                    <p className="desc">
                        Transforming ideas into real life products and solving
                        problems is my true passion.
                    </p>

                    <div className="flex-box">
                        <div>
                            Highly skilled at web design n development, mobile
                            app development and system design.
                        </div>

                        <div>
                            Over a three year experience in building products
                            for clients across continents.
                        </div>
                    </div>
                </div>
                <div className="section-2">
                    <div className="rectangle">?</div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
