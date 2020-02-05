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

const contextMenuFormInner = jest.fn();
export const contextMenuForm = jest.fn(() => contextMenuFormInner);
