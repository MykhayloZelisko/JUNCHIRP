export function getPaginationPages(
  current: number,
  total: number,
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  const visiblePages = new Set<number>();
  visiblePages.add(1);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) {
      visiblePages.add(i);
    }
  }
  visiblePages.add(total);
  const sortedPages = Array.from(visiblePages).sort((a, b) => a - b);
  let lastPage = 0;
  for (const page of sortedPages) {
    if (lastPage && page - lastPage > 1) {
      pages.push('ellipsis');
    }
    pages.push(page);
    lastPage = page;
  }
  return pages;
}
