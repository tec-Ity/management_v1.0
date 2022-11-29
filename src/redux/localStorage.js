export const loadState = () => {
  // We need the try block because user may not permit our accessing localStorage.
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      // The key 'state' does not exist.
      return undefined; // Let our reducer initialize the app.
    }

    return JSON.parse(serializedState);
  } catch (error) {
    //console.log(error);
    return undefined; // Let our reducer initialize the app.
  }
};

export const saveState = (key, value) => {
  try {
    // Serialize the state. Redux store is recommended to be serializable.
    if (!key) return;
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.log(error);
  }
};
