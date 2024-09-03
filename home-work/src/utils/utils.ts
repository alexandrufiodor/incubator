import bcrypt from 'bcrypt'

export const verifyId = (id: string): boolean => {
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
  return id.length === 24 && checkForHexRegExp.test(id);
}

export  const getPagination = async (reqPage: string, reqLimit: string, collection: any) => {
  const page = parseInt(reqPage, 10) || 1;
  const limit = parseInt(reqLimit, 10) || 10;
  const offset = (page - 1) * limit;
  const totalItems = await collection.countDocuments({});
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, page, totalPages, offset, limit };
}

export const getPaginationWithFilter = async (reqPage: string, reqLimit: string, collection: any, filter: any) => {
  const page = parseInt(reqPage, 10) || 1;
  const limit = parseInt(reqLimit, 10) || 10;
  const offset = (page - 1) * limit;

  const totalItems = await collection.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, page, totalPages, offset, limit };
}


export async function comparePassword(enteredPassword: string, storedPasswordHash: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, storedPasswordHash);
}
