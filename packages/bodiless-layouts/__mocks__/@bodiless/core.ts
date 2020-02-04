export const useEditContext = jest.fn(() => ({ isEdit: true }));

const activateOnEffect = {
  setId: jest.fn(),
};
export const useActivateOnEffect = () => activateOnEffect;

export const useNode = jest.fn();
