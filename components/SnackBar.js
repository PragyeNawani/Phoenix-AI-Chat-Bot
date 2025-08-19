import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const SnackBar = ({snackbar}) => {
  const snackbarvariants = {
    hidden: {scaleY:0},
    visible: {
      scaleY: 1,
      transition:{
        duration: 0.2,
        ease: [0.05, 0.7, 0.1, 1],

      }
    }
  }
  const snackbarchildvariant ={
    hidden : {opacity: 0},
    visible: {opacity: 1}
  }
  return (  
    <AnimatePresence>
    {snackbar.open && (
      <motion.div variants={snackbarvariants} initial='hidden' animate='visible' exit={{opacity: 0, transition: {duraton: 0.15, ease:'easeOut'}}} className={`snackbar ${snackbar.type}`}>
        <motion.span variants={snackbarchildvariant} transition={{duraton :0.2, delay:0.1, ease: 'easeOut'}}>{snackbar.message}</motion.span>
      </motion.div>
    )}
    </AnimatePresence>
  )
}

export default SnackBar
