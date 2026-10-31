'use client'

import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { Artist } from '@/lib/types'
import { Instagram, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ArtistClientProps {
  artist: Artist
}

/** '@id', 'id', 'https://instagram.com/id/' 어느 형태로 와도 계정 이름만 뽑는다. */
function instagramHandle(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '')
}

/** 빈 줄로 문단을 나누고, '* ' 로 시작하는 줄은 목록으로 묶는다. */
function BioText({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean)
  return (
    <div className='space-y-4 text-foreground/85 leading-relaxed'>
      {blocks.map((block, index) => {
        const lines = block.split('\n').map(line => line.trim())
        if (lines.every(line => /^[*•-]\s+/.test(line))) {
          return (
            <ul key={index} className='space-y-1'>
              {lines.map(line => (
                <li key={line} className='flex gap-3'>
                  <span aria-hidden='true' className='mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-gold' />
                  {line.replace(/^[*•-]\s+/, '')}
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className='whitespace-pre-line'>
            {block}
          </p>
        )
      })}
    </div>
  )
}

export default function ArtistClient({ artist }: ArtistClientProps) {
  const renderSection = (
    title: string,
    content: string[] | string | undefined
  ) => {
    if (!content || (Array.isArray(content) && content.length === 0))
      return null

    return (
      <section className='grid gap-3 border-t border-border py-6 md:grid-cols-[10rem_1fr] md:gap-8'>
        <h3 className='font-display text-lg text-foreground'>{title}</h3>
        {Array.isArray(content) ? (
          <ul className='space-y-2'>
            {content.map((item, index) => (
              <li key={index} className='text-muted-foreground leading-relaxed tabular-nums'>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
            {content}
          </p>
        )}
      </section>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />

      <main className='container-art pb-24 pt-10 md:pt-16'>
        <header className='mb-10 md:mb-14'>
          <p className='text-eyebrow'>Artist</p>
          <h1 className='mt-3 font-display text-4xl md:text-6xl text-foreground'>
            작가 소개
          </h1>
        </header>

        {/* 메인 콘텐츠 */}
        <div className='grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16'>
          {/* 왼쪽: 프로필 섹션 */}
          <div className='space-y-6'>
            {/* 프로필 이미지: 모바일에서는 작게, 데스크탑에서는 크게 보이도록 반응형 Tailwind 클래스 적용 */}
            <div className='relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-muted'>
                <Image
                  src={
                    artist.profileImageUrl || '/Images/Artist/artist-large.jpg'
                  }
                  alt={artist.name}
                  fill
                  sizes='(max-width: 1024px) 80vw, 33vw'
                  className='object-cover'
                  priority
                />
              </div>
          </div>

          {/* 오른쪽: 상세 정보 섹션 */}
          <div className='space-y-6'>
            {/* 이름/인스타그램/이메일/전화번호 블록을 오른쪽 최상단에 추가 */}
            <div className='text-left space-y-2'>
              <h2 className='font-display text-3xl text-foreground'>
                {artist.name}
              </h2>
              {/* 연락처 정보: 항상 세로로 나열 */}
              <div className='flex flex-col gap-2 mt-2'>
                {/* 인스타그램 */}
                {artist.socialLinks?.instagram && (
                  <div className='flex items-center gap-2'>
                    <Instagram className='h-5 w-5 text-muted-foreground' aria-hidden='true' />
                    <Link
                      href={`https://instagram.com/${instagramHandle(artist.socialLinks.instagram)}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-art'
                    >
                      @{instagramHandle(artist.socialLinks.instagram)}
                      <span className='sr-only'> (인스타그램, 새 창)</span>
                    </Link>
                  </div>
                )}
                {/* 이메일 */}
                {artist.email && (
                  <div className='flex items-center gap-2'>
                    <Mail className='h-5 w-5 text-muted-foreground' aria-hidden='true' />
                    <Link
                      href={`mailto:${artist.email}`}
                      className='text-base text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-art'
                    >
                      {artist.email}
                    </Link>
                  </div>
                )}
                {/* 전화번호 */}
                {artist.phone && (
                  <div className='flex items-center gap-2'>
                    <Phone className='h-5 w-5 text-muted-foreground' aria-hidden='true' />
                    <Link
                      href={`tel:${artist.phone}`}
                      className='text-base text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-art'
                    >
                      {artist.phone}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* 작가 소개 */}
            {artist.bio && (
              <div className='border-t border-border pt-6'>
                <BioText text={artist.bio} />
              </div>
            )}

            {/* 작품 철학 */}
            {artist.philosophy && (
              <div className='border-t border-border pt-6'>
                <h3 className='mb-3 font-display text-lg text-foreground'>
                  작품 철학
                </h3>
                <p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                  {artist.philosophy}
                </p>
              </div>
            )}

            {/* 경력 */}
            {artist.statement && (
              <div className='border-t border-border pt-6'>
                <h3 className='mb-3 font-display text-lg text-foreground'>
                  작가 노트
                </h3>
                <p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                  {artist.statement}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className='mt-16 border-b border-border'>
          {/* 학력 */}
          {renderSection('학력', artist.education)}

          {/* 전시 */}
          {renderSection('전시', artist.exhibitions)}

          {/* 수상 */}
          {renderSection('수상', artist.awards)}

          {/* 강의 */}
          {renderSection('강의 경력', artist.teachingExperience)}

          {/* 출판 */}
          {renderSection('출판', artist.publications)}

          {/* 소속 */}
          {renderSection('소속', artist.memberships)}

          {/* 컬렉션 */}
          {renderSection('컬렉션', artist.collections)}
        </div>
      </main>
    </div>
  )
}
