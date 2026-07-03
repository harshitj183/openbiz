module.exports = {
  twMerge: function () {
    // simple merge: join class strings and collapse multiple spaces
    return Array.from(arguments)
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  },
};
