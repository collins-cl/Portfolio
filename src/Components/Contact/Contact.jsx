import { PiEnvelopeSimple, PiFileText } from "react-icons/pi";
import { EMAIL, RESUME } from "../../constants/Site";
import SectionHead from "../SectionHead/SectionHead";
import "../Contact/Contact.scss";

const Contact = () => (
    <section className="contact" id="contact">
        <div className="contact__column" data-reveal>
            <SectionHead number="05" symbol="Hi." title="Say hello." meta="Contact" />

            <p className="contact__pitch">
                My inbox is always open. Whether it's a project, a question or a
                relevant job update — come share your ideas with me. I'll get
                back to you, probably faster than my builds compile.
            </p>

            <div className="contact__actions">
                <a className="contact__btn contact__btn--primary" href={`mailto:${EMAIL}`}>
                    <PiEnvelopeSimple aria-hidden />
                    Email me
                </a>
                <a className="contact__btn" href={RESUME} download>
                    <PiFileText aria-hidden />
                    Resume
                </a>
                <span className="contact__address">{EMAIL}</span>
            </div>
        </div>
    </section>
);

export default Contact;
