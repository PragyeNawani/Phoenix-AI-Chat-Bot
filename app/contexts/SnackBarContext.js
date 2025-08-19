"use client"
import { createContext, useState, useRef, useCallback, useMemo } from "react";
import SnackBar from "@/components/SnackBar";

const initialCtxValue = {
    snackbar: {
        open: false,
        message: '',
        type: 'info',
    },
    showSnackbar: (message, type='info', timeOut = 5000) => {},
    hideSnackbar: () => {},
}

export const SnackBarContext = createContext(initialCtxValue)

const SnackBarProvider = ({children}) => { 
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'info'
    })
    const timeoutRef = useRef()
    //Show Snackbar
    const ShowSnackbar = useCallback(
      (message, type = 'info', timeOut = 5000) => {
        //Clear  any existing timeout to prevent overlap
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        //Set the new snackbar message and type
        setSnackbar({open: true, message , type})
        //Auto-hide the snackbar after timeOut
        timeoutRef.current = setTimeout(() => {
            setSnackbar((prev) => { 
                return { ...prev, open:false}
             })
        }, timeOut);
      },
      [],
    )
    //hide SNackbar manually (if needed)
    const HideSnackbar = useCallback(
      () => {
        //Clear  any existing timeout to prevent overlap
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        //Set the new snackbar message and type
        setSnackbar({open: false, message:'' , type: 'info'})
      },
      [],
    )
    
    //Memoize the context value to prevent unnecessary re-renders
    const snackbarCtxValue = useMemo(() => {
        return {ShowSnackbar, HideSnackbar}
    }, [ShowSnackbar, HideSnackbar])
    return(
        <SnackBarContext.Provider value={snackbarCtxValue}>
            {children}
            <SnackBar snackbar={snackbar}/>
        </SnackBarContext.Provider>
    )
 }

export default SnackBarProvider;