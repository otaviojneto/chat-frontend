export type Room = {
  id: string;
  name: string;
};

export type CreateDirectRoomBody = {
  targetUserId: string;
};

export type CreateGroupRoomBody = {
  name: string;
};
