import { createContext, useContext } from "react";

export const TermsContext = createContext({} as { terms: any[], setTerms: Function });
export const useTerms = () => useContext(TermsContext);

export default TermsContext;
