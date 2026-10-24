// A soft "tick" for picking things up. Synthesised so there's no
// audio file to load; the context is created on first use (a gesture).
let ctx = null;

export const playTick = () => {
    try {
        ctx ??= new (window.AudioContext || window.webkitAudioContext)();

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.04);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
    } catch {
        // Audio is a nicety; ignore browsers that block it.
    }
};
