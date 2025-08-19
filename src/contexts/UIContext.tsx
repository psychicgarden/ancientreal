import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// UI State types
interface UIState {
  modals: {
    fractionalInvestment: boolean;
    propertyPurchase: boolean;
    mortgagePayment: boolean;
    cashOut: boolean;
    disclaimer: boolean;
  };
  panels: {
    chatBot: boolean;
    developer: boolean;
    mobileMenu: boolean;
  };
  activeTab: string;
  selectedProperty: any;
  selectedInvestment: any;
  loading: {
    [key: string]: boolean;
  };
  errors: {
    [key: string]: string | null;
  };
}

// UI Actions
type UIAction =
  | { type: 'OPEN_MODAL'; payload: { modal: keyof UIState['modals']; data?: any } }
  | { type: 'CLOSE_MODAL'; payload: { modal: keyof UIState['modals'] } }
  | { type: 'TOGGLE_PANEL'; payload: { panel: keyof UIState['panels'] } }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_SELECTED_PROPERTY'; payload: any }
  | { type: 'SET_SELECTED_INVESTMENT'; payload: any }
  | { type: 'SET_LOADING'; payload: { key: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { key: string; error: string | null } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_UI' };

// Initial state
const initialState: UIState = {
  modals: {
    fractionalInvestment: false,
    propertyPurchase: false,
    mortgagePayment: false,
    cashOut: false,
    disclaimer: false,
  },
  panels: {
    chatBot: false,
    developer: false,
    mobileMenu: false,
  },
  activeTab: 'overview',
  selectedProperty: null,
  selectedInvestment: null,
  loading: {},
  errors: {},
};

// Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: true,
        },
        selectedProperty: action.payload.data?.property || state.selectedProperty,
        selectedInvestment: action.payload.data?.investment || state.selectedInvestment,
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: false,
        },
      };

    case 'TOGGLE_PANEL':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.payload.panel]: !state.panels[action.payload.panel],
        },
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };

    case 'SET_SELECTED_PROPERTY':
      return {
        ...state,
        selectedProperty: action.payload,
      };

    case 'SET_SELECTED_INVESTMENT':
      return {
        ...state,
        selectedInvestment: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.loading,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };

    case 'RESET_UI':
      return initialState;

    default:
      return state;
  }
}

// Context
interface UIContextType {
  state: UIState;
  openModal: (modal: keyof UIState['modals'], data?: any) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  togglePanel: (panel: keyof UIState['panels']) => void;
  setActiveTab: (tab: string) => void;
  setSelectedProperty: (property: any) => void;
  setSelectedInvestment: (investment: any) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  clearErrors: () => void;
  resetUI: () => void;
  isLoading: (key: string) => boolean;
  getError: (key: string) => string | null;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider
interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const contextValue: UIContextType = {
    state,
    openModal: (modal, data) => dispatch({ type: 'OPEN_MODAL', payload: { modal, data } }),
    closeModal: (modal) => dispatch({ type: 'CLOSE_MODAL', payload: { modal } }),
    togglePanel: (panel) => dispatch({ type: 'TOGGLE_PANEL', payload: { panel } }),
    setActiveTab: (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    setSelectedProperty: (property) => dispatch({ type: 'SET_SELECTED_PROPERTY', payload: property }),
    setSelectedInvestment: (investment) => dispatch({ type: 'SET_SELECTED_INVESTMENT', payload: investment }),
    setLoading: (key, loading) => dispatch({ type: 'SET_LOADING', payload: { key, loading } }),
    setError: (key, error) => dispatch({ type: 'SET_ERROR', payload: { key, error } }),
    clearErrors: () => dispatch({ type: 'CLEAR_ERRORS' }),
    resetUI: () => dispatch({ type: 'RESET_UI' }),
    isLoading: (key) => Boolean(state.loading[key]),
    getError: (key) => state.errors[key] || null,
  };

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
};

// Hook
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};