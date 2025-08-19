'use client';
import React from 'react';
import { motion, stagger } from 'framer-motion';
import Iconsend from './Iconsend';
import { useRef, useCallback, useState } from 'react';
import { saveconvo, getuserdetails, getconvodetails } from '@/app/lib/appwrite';

const Promptfield = ({ onConversationStart, currentConversationId }) => {
  const inputField = useRef();
  const inputFieldContainer = useRef();
  const [placeholdershown, setplaceholdershown] = useState(true);
  const [ismultiline, setIsmultiline] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleinputchange = useCallback(() => {
    if (inputField.current.innerText === '\n') {
      inputField.current.innerHTML = '';
    }
    setplaceholdershown(!inputField.current.innerText);
    setIsmultiline(inputFieldContainer.current.clientHeight > 64);
    setInputValue(inputField.current.innerText.trim());
  }, []);

  const movecursortoend = useCallback(() => {
    const editableElm = inputField.current;
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(editableElm);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      inputField.current.innerText += e.clipboardData.getData('text');
      handleinputchange();
      movecursortoend;
    },
    [handleinputchange, movecursortoend],
  );

  const handlesubmit = useCallback(async () => {
    const currentInput = inputValue;

    if (!currentInput.trim()) return; // Don't submit empty prompts

    inputField.current.innerHTML = '';
    handleinputchange();

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentInput,
          request_type: 'user_prompt',
          conversationId: currentConversationId, // Include current conversation ID if continuing
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const dt = await getuserdetails();
      setResponse(data.reply || data.response || 'No response received');
      setPrompt(currentInput);
      
      if (data.title && dt.name && data) {
        // If this is a new conversation (no currentConversationId)
        if (!currentConversationId) {
          const savetodb = await saveconvo(
            data.title,
            dt.name,
            currentInput,
            data.reply || data.response,
          );
          
          if (savetodb && onConversationStart) {
            // Update URL without navigation
            window.history.pushState(
              { conversationId: savetodb.id },
              '',
              `/${savetodb.id}`
            );
            
            // Notify parent component
            onConversationStart({
              id: savetodb.id,
              title: data.title,
              prompt: currentInput,
              response: data.reply || data.response
            });
          }
        } else {
          // This is continuing an existing conversation
          // You might want to update the conversation here
          // and notify parent to refresh the conversation view
          if (onConversationStart) {
            onConversationStart({
              id: currentConversationId,
              title: data.title,
              prompt: currentInput,
              response: data.reply || data.response,
              isUpdate: true
            });
          }
        }
      }
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setResponse(
        'Sorry, there was an error processing your request. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [handleinputchange, inputValue, onConversationStart, currentConversationId]);

  const promptfieldvariant = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.4,
        delay: 0.4,
        ease: [0.05, 0.7, 0.1, 1],
      },
    },
  };
  
  const promptfieldchildvariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className={`prompt-field-container ${ismultiline ? 'rounded-large' : ''}`}
      variants={promptfieldvariant}
      initial='hidden'
      animate='visible'
      ref={inputFieldContainer}
    >
      <motion.div
        className={`prompt-field ${placeholdershown ? '' : 'after:hidden'}`}
        contentEditable={true}
        role='textbox'
        aria-multiline={true}
        aria-label='Enter a prompt here'
        data-placeholder='Enter a prompt here'
        variants={promptfieldchildvariant}
        ref={inputField}
        onInput={handleinputchange}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlesubmit();
          }
        }}
      />
      <Iconsend
        tittle={loading ? 'Sending...' : 'Submit'}
        size='large'
        classes={`ms-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        variants={promptfieldchildvariant}
        onClick={loading ? undefined : handlesubmit}
      />
      <div className='state-layer'></div>
    </motion.div>
  );
};

export default Promptfield;