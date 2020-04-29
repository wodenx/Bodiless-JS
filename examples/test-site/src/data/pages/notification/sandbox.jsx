import React, { useContext, useState, useEffect, useCallback, createContext } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <Parent>
        <Child />
      </Parent>
    </div>
  );
}

const FooContext = createContext();

const Child = () => {
  const setFoo = useContext(FooContext);
  const [myFoo, setMyFoo] = useState('Bar');
  useEffect(() => setFoo(myFoo), [setFoo, myFoo]);
  const update = useCallback(() => setMyFoo(Math.random()), [setMyFoo]);
  return (
    <div>
      <button type="button" onClick={update}>Click to change</button>
    </div>
  );
}

const Parent = ({ children }) => {
  const [ foo, setFoo ] = useState('Empty');
  return (
    <div>
    <div>Foo is {foo}</div>
    <div>
      <FooContext.Provider value={setFoo}>
        {children}
      </FooContext.Provider>
    </div>
    </div>
  );
}

