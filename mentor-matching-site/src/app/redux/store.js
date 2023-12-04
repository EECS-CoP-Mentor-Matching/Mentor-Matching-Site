import { combineReducers, configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: reducers,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// const persistor = persistStore(store);

export { store, /* persistor */ };