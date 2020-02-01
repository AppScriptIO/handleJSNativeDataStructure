function escapeWithBackslash(string) {
  // escape using JSON.stringify
  let jsonString = JSON.stringify(String(string))
  let escapedString = jsonString.substring(1, jsonString.length - 1)
  return escapedString
}
