"use client";

import { useRef, useState } from "react";
import { SKILL_COUNT, SKILL_GROUPS } from "../../constants/Projects";
import SectionHead from "../SectionHead/SectionHead";
import "../Skills/Skills.scss";

const listOf = (items) =>
    items.length > 1
        ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
        : items[0];

const tooltipFor = (element, group) => ({
    title: element.name,
    body: element.uses ? `Used in ${listOf(element.uses)}.` : element.note,
    meta: element.uses
        ? `${element.uses.length} PROJECT${element.uses.length > 1 ? "S" : ""} · ${group.symbol}`
        : group.label.toUpperCase(),
});

const pairs = (elements) => {
    const rows = [];

    for (let i = 0; i < elements.length; i += 2) {
        rows.push(elements.slice(i, i + 2));
    }

    return rows;
};

let elementNumber = 0;
const NUMBERED = SKILL_GROUPS.map((group) => ({
    ...group,
    elements: group.elements.map((element) => ({
        ...element,
        number: element.placeholder ? "—" : String(++elementNumber).padStart(2, "0"),
    })),
}));

const Skills = () => {
    const tableRef = useRef(null);
    const [tip, setTip] = useState(null);

    const track = (element, group) => (event) => {
        const rect = tableRef.current.getBoundingClientRect();

        setTip({
            ...tooltipFor(element, group),
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            flip: event.clientX > window.innerWidth - 260,
        });
    };

    return (
        <section className="skills split" id="skills">
            <div className="skills__intro split__intro" data-reveal>
                <SectionHead
                    number="01"
                    symbol="Sk."
                    title="Skills."
                    meta={`${SKILL_GROUPS.length} groups · ${SKILL_COUNT} elements`}
                    desc="Over the years I've built products for companies and individuals across continents — from marketing websites to complex apps, always chasing fast, elegant and accessible experiences."
                />

                <div className="legend">
                    <p className="legend__label">What I build</p>
                    <ul className="legend__rows">
                        {SKILL_GROUPS.map((group) => (
                            <li key={group.symbol}>
                                <span className="legend__swatch" style={{ background: group.color }} />
                                <strong>{group.symbol}</strong>
                                <span>{group.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="periodic" ref={tableRef} onPointerLeave={() => setTip(null)}>
                {NUMBERED.map((group, groupIndex) => (
                    <div className="periodic__group" key={group.symbol} data-reveal style={{ "--i": groupIndex }}>
                        <div className="periodic__head">
                            <strong>{group.symbol}</strong>
                            <span>{group.label}</span>
                        </div>

                        {pairs(group.elements).map((row, rowIndex) => (
                            <div className="periodic__row" key={rowIndex}>
                                {row.map((element) => (
                                    <div
                                        key={element.name}
                                        className={`element${element.dark ? " element--dark" : ""}${element.placeholder ? " element--next" : ""}`}
                                        style={element.dark || element.placeholder ? undefined : { background: group.color }}
                                        tabIndex={0}
                                        aria-label={`${element.name}. ${tooltipFor(element, group).body}`}
                                        onPointerEnter={track(element, group)}
                                        onPointerMove={track(element, group)}
                                        onPointerLeave={() => setTip(null)}
                                    >
                                        <span className="element__number">{element.number}</span>
                                        <span className="element__symbol">{element.symbol}</span>
                                        <span className="element__name">{element.name}</span>
                                    </div>
                                ))}
                                {row.length === 1 && <div className="element element--empty" aria-hidden />}
                            </div>
                        ))}
                    </div>
                ))}

                {tip && (
                    <div
                        className={`skill-tip${tip.flip ? " is-flipped" : ""}`}
                        style={{ left: tip.x, top: tip.y }}
                        aria-hidden
                    >
                        <strong>{tip.title}</strong>
                        <p>{tip.body}</p>
                        <span>{tip.meta}</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
