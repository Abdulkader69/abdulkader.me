module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/src/context/DesktopContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DesktopProvider",
    ()=>DesktopProvider,
    "useDesktop",
    ()=>useDesktop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wallpapers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/wallpapers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$accentColors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/accentColors.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const DEFAULT_SETTINGS = {
    darkMode: true,
    accent: "blue",
    wallpaperId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$wallpapers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wallpapers"][0].id,
    brightness: 100,
    dockSize: 48
};
const STORAGE_KEY = "mac-os-settings";
const DesktopContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function DesktopProvider({ children }) {
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SETTINGS);
    const [openApp, setOpenApp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [launchOrigin, setLaunchOrigin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setSettings((s)=>({
                    ...s,
                    ...JSON.parse(raw)
                }));
        } catch  {
        // ignore malformed storage
        }
        setHydrated(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hydrated) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [
        settings,
        hydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.documentElement.classList.toggle("dark", settings.darkMode);
    }, [
        settings.darkMode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const accent = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$accentColors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accentColors"].find((a)=>a.id === settings.accent) ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$accentColors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["accentColors"][0];
        document.documentElement.style.setProperty("--accent", accent.hex);
        document.documentElement.style.setProperty("--accent-soft", accent.soft);
    }, [
        settings.accent
    ]);
    const value = {
        ...settings,
        setDarkMode: (v)=>setSettings((s)=>({
                    ...s,
                    darkMode: v
                })),
        setAccent: (id)=>setSettings((s)=>({
                    ...s,
                    accent: id
                })),
        setWallpaperId: (id)=>setSettings((s)=>({
                    ...s,
                    wallpaperId: id
                })),
        setBrightness: (v)=>setSettings((s)=>({
                    ...s,
                    brightness: v
                })),
        setDockSize: (v)=>setSettings((s)=>({
                    ...s,
                    dockSize: v
                })),
        openApp,
        launchOrigin,
        launchApp: (id, origin = null)=>{
            setLaunchOrigin(origin);
            setOpenApp(id);
        },
        closeApp: ()=>setOpenApp(null)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DesktopContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/DesktopContext.tsx",
        lineNumber: 90,
        columnNumber: 10
    }, this);
}
function useDesktop() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(DesktopContext);
    if (!ctx) throw new Error("useDesktop must be used within DesktopProvider");
    return ctx;
}
}),
"[project]/src/lib/accentColors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accentColors",
    ()=>accentColors
]);
const accentColors = [
    {
        id: "blue",
        name: "Blue",
        hex: "#0A84FF",
        soft: "rgba(10,132,255,0.35)"
    },
    {
        id: "purple",
        name: "Purple",
        hex: "#BF5AF2",
        soft: "rgba(191,90,242,0.35)"
    },
    {
        id: "pink",
        name: "Pink",
        hex: "#FF375F",
        soft: "rgba(255,55,95,0.35)"
    },
    {
        id: "red",
        name: "Red",
        hex: "#FF453A",
        soft: "rgba(255,69,58,0.35)"
    },
    {
        id: "orange",
        name: "Orange",
        hex: "#FF9F0A",
        soft: "rgba(255,159,10,0.35)"
    },
    {
        id: "yellow",
        name: "Yellow",
        hex: "#FFD60A",
        soft: "rgba(255,214,10,0.35)"
    },
    {
        id: "green",
        name: "Green",
        hex: "#32D74B",
        soft: "rgba(50,215,75,0.35)"
    },
    {
        id: "graphite",
        name: "Graphite",
        hex: "#8E8E93",
        soft: "rgba(142,142,147,0.35)"
    }
];
}),
"[project]/src/lib/wallpapers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "wallpapers",
    ()=>wallpapers
]);
const wallpapers = [
    {
        id: 'sonoma',
        name: 'Sonoma Horizon',
        light: 'radial-gradient(circle at 30% 70%, #ffd194, transparent 50%), radial-gradient(circle at 70% 25%, #ff7eb3, transparent 50%), linear-gradient(135deg,#ff9a8b,#ff6a88,#ff99ac)',
        dark: 'radial-gradient(circle at 30% 70%, #3a1c71, transparent 50%), radial-gradient(circle at 70% 25%, #661a4a, transparent 50%), linear-gradient(135deg,#2b0a3d,#3a0f47,#1a0a2e)'
    },
    {
        id: 'sequoia',
        name: 'Sequoia',
        light: 'radial-gradient(circle at 20% 20%, #7fd6ff, transparent 45%), radial-gradient(circle at 80% 30%, #4f8cff, transparent 50%), radial-gradient(circle at 50% 85%, #1e3c72, transparent 55%), linear-gradient(160deg,#8fd3f4,#2b5876)',
        dark: 'radial-gradient(circle at 20% 20%, #16323f, transparent 45%), radial-gradient(circle at 80% 30%, #1c3b45, transparent 50%), radial-gradient(circle at 50% 85%, #0a0f1a, transparent 55%), linear-gradient(160deg,#141e30,#0a0f1a)'
    },
    {
        id: 'ventura',
        name: 'Ventura',
        light: 'radial-gradient(circle at 25% 25%, #f6d365, transparent 45%), radial-gradient(circle at 75% 75%, #fda085, transparent 50%), linear-gradient(160deg,#f6d365,#fda085)',
        dark: 'radial-gradient(circle at 25% 25%, #4a2708, transparent 45%), radial-gradient(circle at 75% 75%, #5c1f0a, transparent 50%), linear-gradient(160deg,#2b1305,#3e1a08)'
    },
    {
        id: 'monterey',
        name: 'Monterey',
        light: 'radial-gradient(circle at 30% 30%, #a1c4fd, transparent 50%), radial-gradient(circle at 70% 70%, #c2e9fb, transparent 50%), linear-gradient(150deg,#a1c4fd,#c2e9fb)',
        dark: 'radial-gradient(circle at 30% 30%, #12263d, transparent 50%), radial-gradient(circle at 70% 70%, #1b263b, transparent 50%), linear-gradient(150deg,#0d1b2a,#1b263b)'
    },
    {
        id: 'bigsur',
        name: 'Big Sur',
        light: 'radial-gradient(circle at 20% 40%, #ff6a6a, transparent 45%), radial-gradient(circle at 80% 60%, #ffb56a, transparent 50%), linear-gradient(160deg,#ff5f6d,#ffc371)',
        dark: 'radial-gradient(circle at 20% 40%, #55130f, transparent 45%), radial-gradient(circle at 80% 60%, #5c2b0e, transparent 50%), linear-gradient(160deg,#3a0d12,#4d1a0a)'
    },
    {
        id: 'peach',
        name: 'Peach',
        light: 'radial-gradient(circle at 15% 15%, #ffe3cf, transparent 55%), radial-gradient(circle at 85% 10%, #ffd7c9, transparent 50%), radial-gradient(circle at 70% 90%, #f8c9b8, transparent 55%), linear-gradient(150deg,#fde3d2,#f6c3ae)',
        dark: 'radial-gradient(circle at 15% 15%, #3a251c, transparent 55%), radial-gradient(circle at 85% 10%, #46281f, transparent 50%), radial-gradient(circle at 70% 90%, #2a1712, transparent 55%), linear-gradient(150deg,#2b1a14,#1d110d)'
    },
    {
        id: 'graphite-wave',
        name: 'Graphite Wave',
        light: 'radial-gradient(circle at 30% 30%, #e0e0e0, transparent 50%), radial-gradient(circle at 70% 70%, #b8c6db, transparent 50%), linear-gradient(160deg,#e0e0e0,#b8c6db)',
        dark: 'radial-gradient(circle at 30% 30%, #2b2d2e, transparent 50%), radial-gradient(circle at 70% 70%, #0f2027, transparent 50%), linear-gradient(160deg,#141517,#232526)'
    }
];
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__20fvug7._.js.map