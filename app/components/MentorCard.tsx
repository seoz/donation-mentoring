import { Mentor } from '@/types/mentor';
import { MapPin, Briefcase, Building2, Linkedin, Calendar, Mail, Clock, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { Language } from '@/utils/i18n';
import { ensureProtocol } from '@/utils/helpers';
import { useState } from 'react';

interface MentorCardProps {
  mentor: Mentor;
  lang: Language;
  onClick: (mentor: Mentor) => void;
}

export default function MentorCard({ mentor, lang, onClick }: MentorCardProps) {
  const [imageError, setImageError] = useState(false);
  const name = lang === 'en' ? mentor.name_en : mentor.name_ko;
  const description = lang === 'en' ? mentor.description_en : mentor.description_ko;
  const position = lang === 'en' ? mentor.position_en : mentor.position_ko;
  const location = lang === 'en' ? mentor.location_en : mentor.location_ko;
  const company = lang === 'en' ? mentor.company_en : mentor.company_ko;

  // Fallback if current language is empty
  const displayName = name || mentor.name_en || mentor.name_ko || 'No Name';
  const displayDescription = description || mentor.description_en || mentor.description_ko || '';
  const displayPosition = position || mentor.position_en || mentor.position_ko || '';
  const displayLocation = location || mentor.location_en || mentor.location_ko || '';
  const displayCompany = company || mentor.company_en || mentor.company_ko || '';

  return (
    <div
      onClick={() => onClick(mentor)}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full
        border border-warm-100 hover:border-primary-200
        shadow-sm hover:shadow-xl
        transition-all duration-300 ease-out
        hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-64 w-full bg-warm-100 flex-shrink-0 overflow-hidden">
        {mentor.picture_url && !imageError ? (
          <>
            <Image
              src={mentor.picture_url}
              alt={displayName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={mentor.picture_url.includes('supabase.co')}
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-warm-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-warm-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-warm-200 flex items-center justify-center">
                <span className="text-2xl text-warm-400">👤</span>
              </div>
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-display text-warm-900 mb-2 group-hover:text-primary-700 transition-colors">
          {displayName}
        </h3>

        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center text-sm font-medium text-warm-700">
            <Briefcase size={15} className="mr-2 text-primary-500 flex-shrink-0" />
            <span className="truncate">{displayPosition}</span>
          </div>
          {displayCompany && (
            <div className="flex items-center text-sm text-warm-600">
              <Building2 size={15} className="mr-2 text-primary-400 flex-shrink-0" />
              <span className="truncate">{displayCompany}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-warm-500">
            <MapPin size={15} className="mr-2 text-warm-400 flex-shrink-0" />
            <span className="truncate">{displayLocation}</span>
          </div>

          {/* Session info */}
          {(mentor.session_time_minutes || mentor.session_price_usd) && (
            <div className="flex items-center gap-4 pt-2 mt-1 border-t border-warm-100">
              {mentor.session_time_minutes && (
                <div className="flex items-center text-sm font-medium text-secondary-600">
                  <Clock size={14} className="mr-1.5 text-secondary-500 flex-shrink-0" />
                  <span>{mentor.session_time_minutes} min</span>
                </div>
              )}
              {mentor.session_price_usd && (
                <div className="flex items-center text-sm font-medium text-secondary-600">
                  <DollarSign size={14} className="mr-1.5 text-secondary-500 flex-shrink-0" />
                  <span>{mentor.session_price_usd.toFixed(0)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-warm-600 text-sm line-clamp-4 mb-4 flex-grow leading-relaxed">
          {displayDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.tags && mentor.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100"
            >
              {tag}
            </span>
          ))}
          {mentor.tags && mentor.tags.length > 4 && (
            <span className="px-2.5 py-1 bg-warm-100 text-warm-500 text-xs font-medium rounded-full">
              +{mentor.tags.length - 4}
            </span>
          )}
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-warm-100 mt-auto">
          {mentor.linkedin_url && (
            <a
              href={ensureProtocol(mentor.linkedin_url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-warm-500 hover:text-[#0A66C2] transition-colors"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
          )}
          {mentor.calendly_url && (
            <a
              href={ensureProtocol(mentor.calendly_url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-warm-500 hover:text-primary-600 transition-colors"
            >
              <Calendar size={15} />
              Book
            </a>
          )}
          {mentor.email && (
            <a
              href={`mailto:${mentor.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-warm-500 hover:text-primary-600 transition-colors"
            >
              <Mail size={15} />
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
