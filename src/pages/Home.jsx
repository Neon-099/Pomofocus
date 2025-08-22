import React, {useState, useEffect, useRef} from 'react';
import {Play, Pause, Settings, RotateCcw, Coffee, Brain, AlarmClock} from 'lucide-react';
import SettingsModal from '../components/SettingsModal.jsx';
import {useStore} from '../store/store.js';

const Home = () => {
    const [showSettings, setShowSettings] = useState(false);

    const {modes, 
        mode,  session,
        timeLeft, isActive,
        toggleTimer, resetTimer,
        setTimeLeft, handleTimerComplete,
        switchMode, initModes, getIcon,
        resetDailySession,} = useStore();
    
    const intervalRef = useRef();

    useEffect(() => { //to initialize the modes
        initModes();
    }, []);
        
    useEffect(() => {
        requestNotificationPermission();

        if(isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        }  else if (timeLeft === 0) {
            handleTimerComplete();   //to stop ticking the timer/sounds
        }   else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, timeLeft]);

    //UI updates
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }


    const currentMode = modes?.[mode]; //safe check
    const durations = currentMode?.duration || 1;
    const progress = ((durations - timeLeft) / durations) * 100;

    const IconComponent = currentMode?.iconName ? getIcon(currentMode.iconName) : null;


    //ENABLE NOTIFICATIONS
    const requestNotificationPermission = () => {
        if('Notification' in window) {
            Notification.requestPermission().then((permission) => {
                if(permission === 'granted') {
                    console.log('Notification permission granted!');
                } else {
                    console.log('Notification blocked');
                }
            });
        } else {
            console.log('This browser does not support notifications');
        }
    }

    //RESET DAILY SESSION
    useEffect(() => {
        const now = new Date();
        const msUntilMidnight = 
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

        const timer  = setTimeout(() => {
          resetDailySession();
        }, msUntilMidnight);

        return () => clearTimeout(timer);
    },[]);

    return (
        <div className={`min-h-screen transition-all duration-100 ${currentMode?.bgColor || 'bg-gradient-to-br from-red-500 to-pink-50'}`}>
            {/*BACKGROUND AUDIO*/}
            <audio  preload='auto' 
                src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBTWB0fPDeyUCLYPD8NSEOAYcabrq4Z1NFQ1Jr+Pt5mMbBTWAy/OhayECG2++8gA=" type="audio/wav">
            </audio>

            <div className='container mx-auto px-4 py-8'>
                 {/*HEADER*/}
                 <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Pomofocus
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Stay focused, takes break, be productive.
                    </p>
                 </div>

                 {/*MODE TABS*/}
                 <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-2xl p-2 shadow-lg inline-flex">
                        {Object.entries(modes).map(([key, modeData]) => {
                            const ModeIcon = modeData.iconName ? getIcon(modeData.iconName) : null;
                            return (
                                <button 
                                    key={key}
                                    onClick={() => switchMode(key)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                        mode === key 
                                            ? `bg-gradient-to-r ${modeData.color} text-white shadow-md transform scale-105`
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}>
                                        {ModeIcon && <ModeIcon className='w-5 h-5 inline-block mr-2'/>}
                                        {modeData.label}
                                </button>
                            );
                        })}
                    </div>
                 </div>

                 {/*MAIN TIMER*/}
                 <div className="max-w-md mx-auto">
                    {/*TIMER CIRCLE*/}
                    <div className="relative w-80 h-80 mx-auto mb-8">
                        <svg className="w-full h-full transform rotate-90" viewBox='0 0 100 100'>
                            {/*BACKGROUND CIRCLE*/}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="8"
                            />
                            {/*PROGRESS CIRCLE*/}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                    <stop offset='0%' className={`${currentMode?.color?.includes('red') ? `stop-red-400` : currentMode?.color?.includes('green') ? `stop-green-400` : `stop-blue-400`}`} />
                                    <stop offset="100%" className={`${currentMode?.color?.includes('pink') ? 'stop-pink-500' : currentMode?.color?.includes('emerald') ? 'stop-emerald-500' : 'stop-cyan-500'}`}/>                
                                </linearGradient>
                            </defs>
                        </svg>

                        {/*TIMER CONTENT*/}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {IconComponent && <IconComponent className='w-10 h-10 text-gray-600 mb-2' />}
                            <div className="text-5xl font-bold text-gray-800 mb-2">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-gray-600 font-medium">
                                Session {session + 1}
                            </div>
                        </div>
                    </div>

                        {/*CONTROLS BUTTONS*/}
                        <div className="flex justify-center space-x-4 mb-8 mt-7">
                            <button 
                                onClick={toggleTimer}
                                className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentMode?.color || 'from-red-400 to-pink-500'} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center`}
                                >
                                    {isActive ? <Pause className='w-8 h-8'/> : <Play className='w-8 h-8 ml-1'/>}
                            </button>

                            <button
                                onClick={resetTimer}
                                className='w-16 h-16 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 flex items-center justify-center group'
                                >
                                    <RotateCcw className="w-6 h-6 text-gray-600 group-hover:rotate-180 transition-transform duration-300" />
                            </button>

                            <button 
                                onClick={() => setShowSettings(!showSettings)}
                                className='w-16 h-16 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 flex items-center justify-center group'
                                >
                                    <Settings className="w-6 h-6 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/*STATS*/}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Todays Progress</h3>
                            <div className="flex justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-800">{session}</div>
                                    <div className="text-gray-600">Completed Sessions</div>
                                </div>
                            </div>
                        </div>
                        {showSettings &&  (
                            <SettingsModal 
                            setIsOpen={setShowSettings }
                            />
                        )}
                 </div>
            </div>
        </div>
    )
}


export default Home;