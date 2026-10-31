import type { ExhibitionEntry, ExhibitionYearGroup } from '@/lib/exhibitions'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ExhibitionsArchiveProps {
  groups: ExhibitionYearGroup[]
}

function meta(entry: ExhibitionEntry): string | null {
  const parts = [entry.kind, entry.venue].filter(Boolean)
  return parts.length ? parts.join(' · ') : null
}

function EntryRow({ entry }: { entry: ExhibitionEntry }) {
  const detail = meta(entry)
  const body = (
    <>
      <span className='block font-display text-xl leading-snug text-foreground md:text-2xl'>
        {entry.title}
      </span>
      {detail && (
        <span className='mt-1 block text-sm text-muted-foreground'>
          {detail}
        </span>
      )}
    </>
  )

  if (!entry.href) return <li className='py-4'>{body}</li>

  return (
    <li>
      <Link
        href={entry.href}
        className='group -mx-3 flex items-start justify-between gap-4 rounded-md px-3 py-4 transition-colors hover:bg-muted/60 focus-art'
      >
        <span>
          {body}
          <span className='mt-2 inline-block text-sm text-foreground underline decoration-gold decoration-1 underline-offset-4'>
            전시 기록 보기
          </span>
        </span>
        <ArrowRight
          className='mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground'
          aria-hidden='true'
        />
      </Link>
    </li>
  )
}

export function ExhibitionsArchive({ groups }: ExhibitionsArchiveProps) {
  return (
    <div>
      {groups.map((group) => (
        <section
          key={group.year ?? 'unknown'}
          aria-labelledby={`year-${group.year ?? 'unknown'}`}
          className='grid gap-2 border-t border-border py-8 md:grid-cols-[10rem_1fr] md:gap-8 md:py-10'
        >
          <h2
            id={`year-${group.year ?? 'unknown'}`}
            className='font-display text-2xl tabular-nums text-foreground md:text-3xl'
          >
            {group.year ?? '그 밖의 전시'}
          </h2>
          <ul className='divide-y divide-border/60'>
            {group.entries.map((entry, index) => (
              <EntryRow key={`${entry.title}-${index}`} entry={entry} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
