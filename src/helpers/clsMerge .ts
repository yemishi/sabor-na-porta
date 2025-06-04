const clsMerge  = (className = "", fallback = "") => {
  const splitClasses = (str: string) => str.trim().split(/\s+/).filter(Boolean);

  const getPrefix = (cls: string) => {
    const parts = cls.split(":");
    const base = parts[parts.length - 1];
    return base.split("-")[0]; 
  };

  const currentClasses = splitClasses(className);
  const fallbackClasses = splitClasses(fallback);

  const existingPrefixes = new Set(currentClasses.map(getPrefix));

  const filteredFallback = fallbackClasses.filter((cls) => {
    const prefix = getPrefix(cls);
    return !existingPrefixes.has(prefix);
  });

  const merged = [...new Set([...currentClasses, ...filteredFallback])];

  return merged.join(" ");
};

export default clsMerge ;
