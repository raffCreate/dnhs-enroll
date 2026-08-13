export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-heading text-sm font-semibold text-foreground">
            Dimasalang National High School
          </span>
          <span className="text-xs text-muted-foreground">
            Poblacion, Dimasalang, Masbate · Founded 1952
          </span>
          <span className="mt-2 text-xs text-muted-foreground">
            CSS Strand Online Enrollment · This does not replace the
            school&apos;s official enrollment process.
          </span>
        </div>
      </div>
    </footer>
  );
}
