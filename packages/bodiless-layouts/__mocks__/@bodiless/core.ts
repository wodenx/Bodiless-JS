const editContext = {
  activate: jest.fn(),
  isEdit: true,
};

export const useEditContext = jest.fn(() => editContext);

const activateOnEffect = {
  setId: jest.fn(),
};
export const useActivateOnEffect = () => activateOnEffect;

export const useNode = jest.fn();
