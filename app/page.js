'use client';
import TopAppBar from '@/components/TopAppBar';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LinearProgress, CircularProgress } from '@/components/progressbar';
import {
  getsessionactive,
  getuserdetails,
  getconvodetails,
  getchatdetails
} from './lib/appwrite';
import SideBar from '@/components/SideBar';
import { Sidebarctxprovider } from '@/components/sidebarcontext';
import Greetings from '@/components/greetings';
import { motion } from 'framer-motion';
import Promptfield from '@/components/Promptfield';
import Conversation from '@/components/conversation';
export default function Home() {
  const [session, setsession] = useState('loading');
  const [nameofuser, setNameofuser] = useState('');
  const [convo, setConvo] = useState([]);
  const [chatdet, setchatdet] = useState([])
  const [currentView, setCurrentView] = useState('initial'); // 'initial' or 'conversation'
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversationData, setConversationData] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const ses = async () => {
      const userdt = await getuserdetails();
      const convodet = await getconvodetails(userdt.name);
      if(pathname.length > 5){
        console.log(pathname.split('/')[1])
        const chatdt = await getchatdetails(pathname.split('/')[1])
        setchatdet(chatdt)
      }
      setConvo(convodet);
      const status = await getsessionactive();
      const details = await getuserdetails();
      setNameofuser(details.name);
      if (status) {
        setsession('active');

        // Check if we're already on a conversation page
        if (pathname !== '/' && pathname !== '') {
          const conversationId = pathname.slice(1); // Remove leading slash
          setCurrentConversationId(conversationId);
          setCurrentView('conversation');
          // You might want to load conversation data here if needed
        }
      } else {
        setsession('inactive');
        router.push('/login');
      }
    };
    ses();
  }, [pathname, router]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const currentPath = window.location.pathname;

      if (currentPath === '/' || currentPath === '') {
        // User navigated back to home
        setCurrentView('initial');
        setCurrentConversationId(null);
        setConversationData(null);
      } else {
        // User navigated to a conversation
        const conversationId = currentPath.slice(1);
        setCurrentConversationId(conversationId);
        setCurrentView('conversation');
        // You might want to load conversation data here
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle conversation start from Promptfield
  const handleConversationStart = (data) => {
    setConversationData(data);
    setCurrentConversationId(data.id);
    setCurrentView('conversation');

    // Refresh conversations list
    const refreshConvos = async () => {
      const userdt = await getuserdetails();
      const convodet = await getconvodetails(userdt.name);
      setConvo(convodet);
    };
    refreshConvos();
  };

  // Handle returning to initial state
  const handleBackToHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentView('initial');
    setCurrentConversationId(null);
    setConversationData(null);
  };

  // Handle sidebar conversation selection
  const handleConversationSelect = (conversationId) => {
    window.history.pushState({ conversationId }, '', `/${conversationId}`);
    setCurrentConversationId(conversationId);
    setCurrentView('conversation');
    // Load conversation data if needed
  };

  if (session === 'loading') {
    return (
      <>
        <LinearProgress />
        <section className='flex justify-center items-center w-full h-screen'>
          <CircularProgress />
        </section>
      </>
    );
  }

  if (session === 'active') {
    // Determine what to show in main content
    const shouldShowConversation =
      currentView === 'conversation' && currentConversationId;
    const shouldShowGreeting =
      currentView === 'initial' || !currentConversationId;

    return (
      <>
        <Sidebarctxprovider>
          <div className='lg:grid lg:grid-cols-[320px,1fr]'>
            {/**Side Bar */}
            <SideBar
              con={convo}
              user={pathname.split('/')[1]}
              onConversationSelect={handleConversationSelect}
              currentConversationId={currentConversationId}
              clearLoading={currentView === 'conversation'} // This will clear loading when conversation loads
            />
            <div className='h-dvh grid grid-rows-[max-content,minmax(0,1fr),max-content]'>
              {/**Top app bar */}
              <TopAppBar
                onBackToHome={
                  shouldShowConversation ? handleBackToHome : undefined
                }
              />

              {/**Main Content */}
              <div className='px-5 pb-5 flex flex-col overflow-y-auto'>
                <div className='max-w-[840px] w-full mx-auto grow'>
                  {shouldShowConversation ? (
                    <Conversation
                      conversationId={currentConversationId}
                      conversationData={conversationData}
                      convodt={convo}
                      chatdt={chatdet}
                    />
                  ) : (
                    <Greetings name={nameofuser} />
                  )}
                </div>
              </div>

              {/**Prompt field */}
              <div className='bg-light-background dark:bg-dark-background'>
                <div className='max-w-[870px] px-5 w-full mx-auto'>
                  <Promptfield
                    onConversationStart={handleConversationStart}
                    currentConversationId={currentConversationId}
                  />
                  <motion.p
                    initial={{ opacity: 0, translateY: '-4px' }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.2, delay: 0.8, ease: 'easeOut' }}
                    className='text-bodySmall text-center text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant p-3'
                  >
                    Phoenix may display inaccurate info, including about people,
                    so double-check responses.
                    <a
                      href='https://support.google.com/gemini?p=privacy_notice'
                      target='_blank'
                      className='inline underline ms-1'
                    >
                      Your privacy & Gemini Apps
                    </a>
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </Sidebarctxprovider>
      </>
    );
  }
}
