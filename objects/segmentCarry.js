export default (n, segments) => {
  if (n > segments - 1) {
    return n % segments
  }
  return n
}
