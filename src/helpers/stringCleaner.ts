export function stringCleaner(dirtyString: string): string {
  if (!dirtyString || typeof dirtyString !== 'string') throw new Error('StringCleanerError: input must be a string');
  return dirtyString.replace(/[|&;$%@"<>()+,]/g, '');
}
