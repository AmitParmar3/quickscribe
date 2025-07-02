//This page is now redundant, waiting for meet's approval to delete it.

// "use client" ;

// import React, { useState } from "react";
// import { CheckCircle, Loader2, Languages, Sparkles } from "lucide-react";
// import { useRouter } from "next/navigation";

// const stylePrompts = [
//   "sad",
//   "royal",
//   "genZ comedy",
//   "comedic",
//   "funny",
//   "millenial",
//   "custom",
// ];

// const languages = [
//   "Hindi",
//   "Spanish",
//   "French",
//   "German",
//   "Japanese",
//   "Korean",
// ];

// export default function SubtitleProcessor() {
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [selectedStyle, setSelectedStyle] = useState("");
//   const [customPrompt, setCustomPrompt] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const router = useRouter();

//   const handleProcess = () => {
//     setIsProcessing(true);
//     setProgress(0);

//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setIsProcessing(false);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 300);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-6">
//       <div className="border rounded-xl shadow-md p-6 space-y-4">
//         <h2 className="text-xl font-bold flex items-center gap-2">
//           <Sparkles className="w-5 h-5 text-purple-500" /> Subtitle Translator
//         </h2>

//         <div className="space-y-2">
//           <label className="text-sm font-medium flex items-center gap-2">
//             <Languages className="w-4 h-4" /> Select Language
//           </label>
//           <select
//             value={selectedLanguage}
//             onChange={(e) => setSelectedLanguage(e.target.value)}
//             className="w-full border rounded px-3 py-2 text-sm"
//           >
//             <option value="" disabled>
//               Choose language
//             </option>
//             {languages.map((lang) => (
//               <option key={lang} value={lang}>
//                 {lang}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium">Select Style</label>
//           <select
//             value={selectedStyle}
//             onChange={(e) => setSelectedStyle(e.target.value)}
//             className="w-full border rounded px-3 py-2 text-sm"
//           >
//             <option value="" disabled>
//               Choose tone or custom
//             </option>
//             {stylePrompts.map((style) => (
//               <option key={style} value={style}>
//                 {style}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedStyle === "custom" && (
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Custom Prompt</label>
//             <textarea
//               className="w-full border rounded px-3 py-2 text-sm"
//               placeholder="Write your custom translation prompt..."
//               value={customPrompt}
//               onChange={(e) => setCustomPrompt(e.target.value)}
//             />
//           </div>
//         )}

//         <button
//           onClick={handleProcess}
//           disabled={!selectedLanguage || !selectedStyle || isProcessing}
//           className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
//         >
//           Start Translation
//         </button>

//         {isProcessing && (
//           <div className="pt-4 space-y-2">
//             <div className="flex items-center gap-2 text-sm">
//               <Loader2 className="animate-spin w-4 h-4" /> Processing Translation...
//             </div>
//             <div className="w-full h-2 bg-gray-200 rounded">
//               <div
//                 className="h-full bg-green-500 rounded transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//             <div className="text-xs text-gray-500">{progress}% complete</div>
//           </div>
//         )}

//         {!isProcessing && progress === 100 && (
//           <div className="flex items-center gap-2 text-green-600 text-sm pt-4">
//             <CheckCircle className="w-4 h-4" /> Translation complete!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
