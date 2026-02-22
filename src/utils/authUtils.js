export const ADMIN_EMAILS = ['mdulin@gmail.com', 'adamjosephbritten@gmail.com'];

export const isAdmin = (user) => user && ADMIN_EMAILS.includes(user.email);

export const canEdit = (user, item) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (item?.authorId && user.uid === item.authorId) return true;
  return false;
};
