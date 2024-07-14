
export const verifyId = (id: string): boolean => {
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
  return id.length === 24 && checkForHexRegExp.test(id);
}
