export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-neutral-600 md:text-left">
          &copy; {new Date().getFullYear()} 현대 서예가 이름 (Artist Name). All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
