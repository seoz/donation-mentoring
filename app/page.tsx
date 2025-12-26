'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Mentor } from '@/types/mentor';
import MentorCard from '@/app/components/MentorCard';
import { translations, Language } from '@/utils/i18n';
import { ensureProtocol, getMentorDisplay, scrollToElement, shuffleArray } from '@/utils/helpers';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Briefcase, MapPin, Building2, Linkedin, Calendar, Mail } from 'lucide-react';

export default function Home() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<Language>('ko');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const fetchMentors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]); // Ensure mentors array is empty on error
    } else {
      // Randomly shuffle mentors for even distribution
      const shuffledMentors = shuffleArray(data || []);
      setMentors(shuffledMentors);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter(mentor => {
    const query = search.toLowerCase();
    
    // Language filtering
    const supportedLangs = (mentor.languages || []).map(l => l.toLowerCase());
    const isKorean = lang === 'ko';
    
    // Strict filtering: Mentors must explicitly contain the selected language
    const matchesLang = isKorean 
      ? supportedLangs.some(l => l.includes('korean') || l.includes('한국어') || l.includes('ko'))
      : supportedLangs.some(l => l.includes('english') || l.includes('영어') || l.includes('en'));

    // If language data is missing or doesn't match, hide the mentor
    if (!matchesLang) return false;

    const tags = mentor.tags || [];
    const allText = [
      mentor.name_en, mentor.name_ko,
      mentor.location_en, mentor.location_ko,
      mentor.position_en, mentor.position_ko,
      ...tags
    ].filter(Boolean).join(' ').toLowerCase();

    return allText.includes(query);
  });

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-warm-50 pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-warm-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <h1 className="text-xl sm:text-2xl font-display text-warm-900">{t.title}</h1>

            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
              <nav className="flex items-center gap-1 sm:gap-2">
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToElement('about');
                  }}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all"
                >
                  {t.navAbout}
                </a>
                <a
                  href="#values"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToElement('values');
                  }}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all"
                >
                  {t.navValues}
                </a>
                <a
                  href="#how-to-donate"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToElement('how-to-donate');
                  }}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all"
                >
                  {t.navHowTo}
                </a>
                <a
                  href="#search-mentors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToElement('search-mentors');
                  }}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all"
                >
                  {t.navMentors}
                </a>
              </nav>

              <div className="flex items-center gap-3 border-l pl-3 border-warm-200">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="text-xs sm:text-sm font-medium text-warm-600 bg-warm-50 border border-warm-200 rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="ko">🇰🇷 KO</option>
                  <option value="en">🇺🇸 EN</option>
                </select>

                <Link
                  href="/admin"
                  className="text-xs sm:text-sm font-medium text-warm-500 hover:text-primary-600 transition-colors"
                >
                  {t.viewAdmin}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="relative bg-gradient-warm py-16 sm:py-20 scroll-mt-20 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary-200/20 rounded-full blur-3xl animate-pulse-soft" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div className="animate-fade-in-up opacity-0 stagger-1">
              <h2 className="text-2xl sm:text-3xl font-display text-warm-900 mb-4">{t.mentoringTitle}</h2>
              <p className="text-warm-600 leading-relaxed text-lg">
                {t.mentoringDesc}
              </p>
            </div>
            <div className="animate-fade-in-up opacity-0 stagger-2">
              <h2 className="text-2xl sm:text-3xl font-display text-warm-900 mb-4">{t.donationMentoringTitle}</h2>
              <p className="text-warm-600 leading-relaxed text-lg">
                {t.donationMentoringDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="bg-white py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div className="bg-secondary-50 rounded-2xl p-8 border border-secondary-100">
              <h2 className="text-2xl sm:text-3xl font-display text-warm-900 mb-6">{t.mentorValueTitle}</h2>
              <ul className="space-y-4">
                {t.mentorValuePoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-500 text-white text-xs flex items-center justify-center mr-3 mt-0.5">✓</span>
                    <span className="text-warm-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <h2 className="text-2xl sm:text-3xl font-display text-warm-900 mb-6">{t.menteeValueTitle}</h2>
              <ul className="space-y-4">
                {t.menteeValuePoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center mr-3 mt-0.5">✓</span>
                    <span className="text-warm-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Donate Section */}
      <section id="how-to-donate" className="py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg border border-warm-100 p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-display text-warm-900 mb-10 text-center">
              {t.howToDonate}
            </h2>
            <ol className="space-y-5 max-w-3xl mx-auto">
              {t.howToDonateSteps.map((step, index) => {
                // Find URL pattern like (https://...)
                const urlMatch = step.match(/\(https?:\/\/[^)]+\)/);
                if (urlMatch) {
                  const url = urlMatch[0].slice(1, -1); // Remove parentheses
                  const parts = step.split(urlMatch[0]);
                  return (
                    <li key={index} className="flex items-start group">
                      <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl font-bold text-sm mr-4 mt-0.5 shadow-md group-hover:scale-110 transition-transform">
                        {index + 1}
                      </span>
                      <span className="text-lg text-warm-700 leading-relaxed pt-1.5">
                        {parts[0]}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 underline decoration-primary-300 underline-offset-2"
                        >
                          ({url})
                        </a>
                        {parts[1]}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={index} className="flex items-start group">
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl font-bold text-sm mr-4 mt-0.5 shadow-md group-hover:scale-110 transition-transform">
                      {index + 1}
                    </span>
                    <span className="text-lg text-warm-700 leading-relaxed pt-1.5">
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Hero / Search */}
      <div id="search-mentors" className="relative bg-gradient-hero py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-accent-500/20 rounded-full blur-xl animate-pulse-soft" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white mb-6 animate-fade-in-up">
            {t.subtitle}
          </h2>
          <div className="mt-8 relative max-w-xl mx-auto animate-fade-in-up opacity-0 stagger-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-warm-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border-2 border-white/20 rounded-2xl leading-5 bg-white/95 backdrop-blur-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 text-base shadow-lg transition-all"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-warm-500">{t.loading}</p>
          </div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMentors.map((mentor, index) => (
              <div
                key={mentor.id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${Math.min(index * 100, 800)}ms` }}
              >
                <MentorCard
                  mentor={mentor}
                  lang={lang}
                  onClick={(m) => setSelectedMentor(m)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-warm-500 text-lg">{t.noMentors}</p>
          </div>
        )}
      </main>

      {/* Detail Popup Modal */}
      {selectedMentor && (() => {
        const display = getMentorDisplay(selectedMentor, lang);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-warm-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMentor(null)}></div>

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-scale-in">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg"
                >
                  <X size={22} className="text-warm-600" />
                </button>
              </div>

              <div className="relative h-72 w-full bg-warm-100 shrink-0 overflow-hidden">
                {selectedMentor.picture_url && !imageErrors.has(selectedMentor.picture_url) ? (
                  <>
                    <Image
                      src={selectedMentor.picture_url}
                      alt={display.name}
                      fill
                      className="object-cover"
                      unoptimized={selectedMentor.picture_url.includes('supabase.co')}
                      onError={() => setImageErrors(prev => new Set(prev).add(selectedMentor.picture_url!))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-warm-900/40 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-warm-400 text-lg">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-display text-warm-900 mb-3">{display.name}</h2>
                  <div className="flex flex-col gap-2 text-warm-600">
                    <div className="flex items-center text-lg">
                      <Briefcase className="mr-2 text-primary-500 w-5 h-5" />
                      <span className="font-medium">{display.position}</span>
                    </div>
                    {display.company && (
                      <div className="flex items-center text-lg">
                        <Building2 className="mr-2 text-primary-500 w-5 h-5" />
                        <span>{display.company}</span>
                      </div>
                    )}
                    <div className="flex items-center text-warm-500">
                      <MapPin className="mr-2 text-warm-400 w-5 h-5" />
                      <span>{display.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedMentor.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-100">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose max-w-none text-warm-600 mb-8 whitespace-pre-line leading-relaxed">
                  {display.description}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-warm-100">
                  {selectedMentor.calendly_url && (
                    <a
                      href={ensureProtocol(selectedMentor.calendly_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 flex-1 px-6 py-3.5 btn-primary font-semibold rounded-xl"
                    >
                      <Calendar size={20} />
                      <span>Book Session</span>
                    </a>
                  )}
                  {selectedMentor.email && (
                    <a
                      href={`mailto:${selectedMentor.email}`}
                      className="flex items-center justify-center gap-2 flex-1 px-6 py-3.5 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all"
                    >
                      <Mail size={20} />
                      <span>Email Mentor</span>
                    </a>
                  )}
                  {selectedMentor.linkedin_url && (
                    <a
                      href={ensureProtocol(selectedMentor.linkedin_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 flex-1 px-6 py-3.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
