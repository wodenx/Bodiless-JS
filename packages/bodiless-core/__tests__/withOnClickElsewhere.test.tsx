import React, { FC, EventHandler } from 'react';
import { mount } from 'enzyme';
import withOnClickElsewhere from '../src/withOnClickElsewhere';

describe('withOnClickElsewhere', () => {
  // Technique for mocking global document listener:
  // see https://medium.com/@DavideRama/testing-global-event-listener-within-a-react-component-b9d661e59953
  const mockDocumentListenerMap = new Map<string, EventHandler<any>>();

  let mockDocumentAddEventListener: any;
  let mockDocumentRemoveEventListener: any;

  const triggerMockDocumentLIstener = (type: string, e: any) => {
    if (mockDocumentListenerMap.has(type)) {
      mockDocumentListenerMap.get(type)!(e);
    }
  };

  // Pass a synthetic click event to our mock document listener.
  const MockDocumentTrigger: FC = ({ children }) => {
    const onClick = (e: any) => triggerMockDocumentLIstener('click', e);
    return (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    );
  };

  const Inner = withOnClickElsewhere('div');

  const Test = (props: any) => (
    <MockDocumentTrigger>
      <div id="outer">
        <Inner id="inner" {...props} />
      </div>
    </MockDocumentTrigger>
  );

  const onClickElsewhere = jest.fn();
  const onClick = jest.fn();
  const onClickOutside = jest.fn();

  beforeAll(() => {
    mockDocumentAddEventListener = jest
      .spyOn(document, 'addEventListener')
      .mockImplementation((type, listener) => {
        mockDocumentListenerMap.set(type, listener as EventListener);
      });
    mockDocumentRemoveEventListener = jest
      .spyOn(document, 'removeEventListener')
      .mockImplementation((type, listener) => {
        if (mockDocumentListenerMap.get(type) === listener) {
          mockDocumentListenerMap.delete(type);
        }
      });
  });

  afterAll(() => {
    mockDocumentAddEventListener.mockRestore();
    mockDocumentRemoveEventListener.mockRestore();
  });

  beforeEach(() => {
    onClickElsewhere.mockClear();
    onClick.mockClear();
    onClickOutside.mockClear();
    mockDocumentListenerMap.clear();
  });

  it('does not fire when click inside', () => {
    const wrapper = mount((
      <Test onClickElsewhere={onClickElsewhere} onClick={onClick} />
    ));
    wrapper.find('div#inner').simulate('click');
    expect(onClick).toBeCalledTimes(1);
    expect(onClickElsewhere).not.toBeCalled();
  });

  it('fires when click outside', () => {
    const wrapper = mount(
      <Test onClickElsewhere={onClickElsewhere} onClick={onClick} />,
    );
    wrapper.find('div#outer').simulate('click');
    expect(onClick).toBeCalledTimes(0);
    expect(onClickElsewhere).toBeCalledTimes(1);
  });
});
