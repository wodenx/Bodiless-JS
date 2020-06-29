export type ItemProps = {
  onAdd: () => void,
  onDelete: () => void,
  canDelete: () => boolean,
};

export type Data = {
  items?: string[],
};
