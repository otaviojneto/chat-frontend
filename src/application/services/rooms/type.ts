export type Room = {
  id: string;
  name: string;
};

export type CreateDirectRoomBody = {
  userId: string;
};

export type CreateGroupRoomBody = {
  name: string;
};
