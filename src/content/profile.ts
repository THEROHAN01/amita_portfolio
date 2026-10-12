export const profile = {
  name: "Amita Hendre",
  initials: "AH",
  role: "Graphic & UI/UX Designer",
  summary:
    "A multi-disciplinary designer with 5+ years of experience creating clear and effective visual solutions across branding, marketing, and digital platforms.",
  summaryLong:
    "A multi-disciplinary designer with 5+ years of experience creating clear and effective visual solutions across branding, marketing, and digital platforms. Combines creativity with usability to deliver designs that are visually engaging and easy to navigate.",
  location: "New Sangvi, Pune",
  status: "Available for work",
  email: "amitahendre510@gmail.com",
  phone: { display: "+91 97626 25471", href: "tel:+919762625471" },
  behance: { href: "https://www.behance.net/amita_hendre", display: "behance.net/amita_hendre" },
  cv: { href: "/Amita_Hendre_CV_2026.pdf", file: "Amita_Hendre_CV_2026.pdf" },
} as const;

/** The splash cycles the name through these scripts. */
export const nameInScripts: readonly (readonly [name: string, language: string])[] = [
  ["अमिता हेंद्रे", "Marathi"],
  ["अमिता हेन्द्रे", "Hindi"],
  ["অমিতা হেন্দ্রে", "Bengali"],
  ["અમિતા હેન્દ્રે", "Gujarati"],
  ["ಅಮಿತಾ ಹೇಂದ್ರೆ", "Kannada"],
  ["அமிதா ஹேந்த்ரே", "Tamil"],
  ["అమిత హేంద్రే", "Telugu"],
  ["ਅਮਿਤਾ ਹੇਂਦਰੇ", "Punjabi"],
  ["アミタ・ヘンドレ", "Japanese"],
  ["아미타 헨드레", "Korean"],
  ["أميتا هندري", "Arabic"],
  ["Амита Хендре", "Russian"],
  ["Αμίτα Χέντρε", "Greek"],
];
