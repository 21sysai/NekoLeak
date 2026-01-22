
/**
 * Parses the technical size string from the API into a structured array.
 * Input format: "360P : 29mb | 480P : 44mb | 720P : 98mb"
 */
export const parseSizeString = (sizeStr: string | undefined) => {
  if (!sizeStr) return [];
  return sizeStr
    .split('|')
    .map((item) => {
      const parts = item.split(':');
      if (parts.length < 2) return null;
      const [resolution, size] = parts.map((s) => s.trim());
      return { resolution, size };
    })
    .filter((s): s is { resolution: string; size: string } => s !== null && !!s.resolution && !!s.size);
};

/**
 * Parses the info string: "Dilihat 32204 kali / Wednesday, March 12th, 2025"
 */
export const parseInfoString = (infoStr: string | undefined) => {
  if (!infoStr) return { views: 'N/A', date: 'Pending' };
  const parts = infoStr.split('/');
  return {
    views: parts[0]?.trim() || 'N/A',
    date: parts[1]?.trim() || 'Pending',
  };
};
