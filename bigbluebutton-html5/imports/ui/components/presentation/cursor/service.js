import Cursor from '/imports/ui/components/cursor/service';
import Users from '/imports/ui/local-collections/users-collection/users';

const getCurrentCursor = (cursorId) => {
  const cursor = Cursor.findOne({ _id: cursorId });
  if (cursor) {
    const { userId } = cursor;
    const user = Users.findOne({ userId }, { fields: { name: 1 } });
    if (user) {
      cursor.userName = user.name;
      return cursor;
    }
  }
  return false;
};

export default {
  getCurrentCursor,
};
