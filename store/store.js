import {createStore, combineReducers, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const clientID = process.env.W_CLIENTID;

const apiInitialState = {
  token: null,
  clientID: clientID,
  authorized: false
};

const apiActionTypes = {
  setToken: 'SET_API_TOKEN',
  setClientID: 'SET_API_CLIENT_ID',
  setAuthorized: 'SET_API_AUTHORIZED'
};

const wApi = (state = apiInitialState, action) => {
  switch (action.type) {
    case apiActionTypes.setClientID:
      return {...state, clientID: action.clientID};
    case apiActionTypes.setToken:
      return {...state, token: action.token};
    case apiActionTypes.setAuthorized:
      return {...state, authorized: action.authorized};
    default:
      return state;
  }
};

export const setApiToken = (token) => dispatch => {
  return {
    ...dispatch({type: apiActionTypes.setToken, token: token}),
    ...dispatch({type: apiActionTypes.setAuthorized, authorized: true})
  };
};

export const removeApiToken = () => dispatch => {
  return {
    ...dispatch({type: apiActionTypes.setToken, token: null}),
    ...dispatch({type: apiActionTypes.setAuthorized, authorized: false})
  };
};

export const setApiClientID = (clientid) => dispatch => {
  return dispatch({type: apiActionTypes.setClientID, clientID: clientid});
};

const settingInitialState = {
  target: null,
  template: null
};

const settingsActionTypes = {
  setTemplate: 'SET_TEMPLATE',
  setTarget: 'SET_TARGET'
};

const settings = (state = settingInitialState, action) => {
  switch (action.type) {
    case settingsActionTypes.setTemplate:
      return {...state, template: action.listID};
    case settingsActionTypes.setTarget:
      return {...state, target: action.listID};
    default:
      return state;
  }
};

export const setTargetList = (listID) => dispatch => {
  try {
    const lid = parseInt(listID);
    return dispatch({type: settingsActionTypes.setTarget, listID: lid});
  } catch (error) {
    console.error(error);
  }
};

export const setTemplateList = (listID) => dispatch => {
  try {
    const lid = parseInt(listID);
    return dispatch({type: settingsActionTypes.setTemplate, listID: lid});
  } catch (error) {
    console.error(error);
  }
};

const wDataInitialState = {
  lists: null,
  templateListItems: []
};

const wDataActionTypes = {
  setLists: 'SET_W_LISTS',
  setTemplateListItems: 'SET_W_TEMPLATE'
};

const wData = (state = wDataInitialState, action) => {
  switch (action.type) {
    case wDataActionTypes.setLists:
      return {...state, lists: action.lists};
    case wDataActionTypes.setTemplateListItems:
      return {...state, templateListItems: action.items};
    default:
      return state;
  }
};

export const setUserLists = (lists) => dispatch => {
  return dispatch({type: wDataActionTypes.setLists, lists: lists});
};

export const setTemplateItems = (items) => dispatch => {
  return dispatch({type: wDataActionTypes.setTemplateListItems, items: items});
};

const localListInitialState = {
  items: [],
  initial: true
};

const localListActionTypes = {
  setItems: 'SET_LIST_ITEMS',
  removeItem: 'REMOVE_LIST_ITEM'
};

const localList = (state = localListInitialState, action) => {
  switch (action.type) {
    case localListActionTypes.setItems:
      return {...state, items: action.items, initial: false};
    case localListActionTypes.removeItem:
      if ((action.index < 0) || (action.index >= state.items.length)) {
        return state;
      } else {
        return {
          ...state,
          items: [...state.items.slice(0, action.index),
            ...state.items.slice(action.index + 1)]
        };
      }
    default:
      return state;
  }
};

export const setItems = (items) => dispatch => {
  return dispatch({type: localListActionTypes.setItems, items: items});
};

export const removeItem = (index) => dispatch => {
  return dispatch({type: localListActionTypes.removeItem, index: index});
};

const papInitialState = {
  neededIngredients: null,
  currentIngredients: {},
  recipes: {},
  initial: true,
  authString: '',
  authorized: false
};

const papActions = {
  setNeeded: 'SET_NEEDED_INGREDIENTS',
  setCurrent: 'SET_CURRENT_INGREDIENTS',
  removeItem: 'REMOVE_INGREDIENT',
  setAuthString: 'SET_AUTH_STRING',
  removeAuthString: 'REMOVE_AUTH_STRING',
  setRecipes: 'SET_RECIPES'
};

const papStore = (state = papInitialState, action) => {
  switch (action.type) {
    case papActions.setNeeded:
      return {...state, neededIngredients: action.items};
    case papActions.setRecipes:
      return {...state, recipes: action.recipes};
    case papActions.setCurrent:
      return {...state, currentIngredients: action.items, initial: false};
    case papActions.setAuthString:
      return {...state, authString: action.auth, authorized: true};
    case papActions.removeAuthString:
      return {...state, authString: '', authorized: false};
    case papActions.removeItem:
      let recipe = state.currentIngredients[action.uid];
      if (!recipe) return state;

      if ((action.index < 0) || (action.index >= recipe.ingredients.length)) {
        return state;
      } else {
        recipe = {
          ...recipe,
          ingredients: [...recipe.ingredients.slice(0, action.index),
            ...recipe.ingredients.slice(action.index + 1)]
        };
        return {
          ...state,
          currentIngredients: {
            ...state.currentIngredients,
            [action.uid]: recipe
          }
        };
      }
    default:
      return state;
  }
};

export const setNeededIngredients = (items) => dispatch => {
  return dispatch({type: papActions.setNeeded, items: items});
};

export const setRecipes = (recipes) => dispatch => {
  return dispatch({type: papActions.setRecipes, recipes: recipes});
};

export const setCurrentIgredients = (items) => dispatch => {
  return dispatch({type: papActions.setCurrent, items: items});
};

export const removeIngredient = (uid, index) => dispatch => {
  return dispatch({type: papActions.removeItem, index: index, uid: uid});
};

export const setAuthString = (username, password) => dispatch => {
  return dispatch({type: papActions.setAuthString, auth: {username: username, password: password}});
};

export const removeAuthString = () => dispatch => {
  return dispatch({type: papActions.removeAuthString});
};

const reducer = combineReducers({
  wApi,
  settings,
  wData,
  localList,
  papStore
});

const persistedReducer = persistReducer(persistConfig, reducer);

export default () => {
  const composeEnhancers = composeWithDevTools({});
  let store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));
  let persistor = persistStore(store);
  return { store, persistor };
};
