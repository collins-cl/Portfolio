import ImageGenScreen from "../assets/appScreens/imagegenscreengpt.PNG";
import ImageGenMov from "../assets/appScreens/imagegenvid.mp4";

export const Screens = [
    {
        id: 1,
        title: "ChatGpt ImageGen Screen",
        app: "ChatGPT",
        tagline: "Recreated the chatgpt image generation screen/drawer.",
        kind: "Screen",
        video: null,
        cover: ImageGenScreen,
    },
    {
        id: 2,
        title: "ChatGpt ImageGen Video",
        app: "ChatGPT",
        tagline: "Recreated the chatgpt image generation screen",
        stack: "React Native · Expo",
        kind: "video",
        video: ImageGenMov,
        cover: null,
    },
    {
        id: 3,
        title: "Live duel round",
        app: "SkillDuel",
        tagline: "1v1 knowledge duels",
        stack: "React Native · Expo",
        kind: "video",
        video: null,
        cover: null,
    },
    {
        id: 4,
        title: "Profile & XP",
        app: "SkillDuel",
        tagline: "1v1 knowledge duels",
        stack: "React Native · Expo",
        kind: "screen",
        video: null,
        cover: null,
    },
];
