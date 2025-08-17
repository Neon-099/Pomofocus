import React, {useState, useEffect, useRef} from 'react';
import {Play, Pause, Settings, RotateCcw, Coffee, Brain} from 'lucide-react';

const Home = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work');
    const [session, setSession] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        work: 25,
        shortBreak: 5,
        longBreak: 15,
    });

    const intervalRef = useRef();
    const audioRef = useRef();

    const modes = {
        work : {
            duration: settings.work * 60,
            label: 'Focus time',
            color: 'from-red-400 to-pink-500',
            bgColor: 'bg-gradient-to-br from-red-500 to-pink-50',
            icon: Brain, 
        },
        shortBreak: {
            duration: settings.shortBreak * 60,
            label: 'Short break',
            color: 'from-green-400 to-emerald-500',
            bgColor: 'bg-gradient-to-br from-green-500 to-emerald-50',
            icon: Coffee,
        },
        longBreak: {
            duration: settings.longBreak * 60,
            label: 'Long break',
            color: 'from-yellow-400 to-cyan-500',
            bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-50',
            icon: Coffee
        }
    };

    useEffect(() => {
        if(isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }  else if (timeLeft === 0) {
            handleTimerComplete();
        }   else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, timeLeft]);

        const handleTimerComplete = () => {
            setIsActive(false);     //to stop ticking the timer/sounds
        
        if(audioRef.current) {
            audioRef.current.play().catch(() => {});
        }
            
        if(mode === 'work') {
            //increment each sessions and decide next break type based on the new count 
            setSession((prev) => {
                const next = prev + 1; //compute the previous to avoid inaccurate of data count
                const nextMode = next % 4 === 0 ? 'longBreak' : 'shortBreak';
                setMode(nextMode);
                setTimeLeft(modes[nextMode].duration);  //reset (to fully break the duration count)
                return next;
            }); 
        } else {
            //finished a break go back to work
            setMode('work');
            setTimeLeft(modes.work.duration);
        }
    };

    //CONTROLS
    const toggleTimer = () => setIsActive((v) => !v);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(modes[mode].duration);
    }

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(modes[newMode].duration)
    };

    //UPDATE THE SETTINGS
    const updateSettings = (newSettings) => {
        setSettings(newSettings);

        const updatedModes = {
            work: {...modes.work, duration: newSettings.work * 60},
            shortBreak: {...modes.shortBreak, duration: newSettings.shortBreak * 60 },
            longBreak: {...modes.longBreak, duration: newSettings.longBreak * 60 }, 
        };

        //AND IF PAUSE, reflect new duration immediately in the current mode
        if(!isActive) {
            setTimeLeft(updatedModes[mode].duration);
        }
    }

    //UI updates
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const durations = modes[mode].duration || 1;
    const progress = ((durations - timeLeft) / durations) * 100;

    const currentMode = modes[mode];
    const IconComponent = currentMode.icon;

    return (
        <div className={`min-h-screen transition-all duration-100 ${currentMode.bgColor}`}>
            {/*BACKGROUND AUDIO*/}
            <audio ref={audioRef} preload='auto' 
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
                        {Object.entries(modes).map(([key, modeData]) => (
                            <button 
                                key={key}
                                onClick={() => switchMode(key)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                    mode === key 
                                        ? `bg-gradient-to-r ${modeData.color} text-white shadow-md transform scale-105`
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}>
                                    <modeData.icon className='w-5 h-5 inline-block mr-2'/>
                                    {modeData.label}
                            </button>
                        ))}
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
                                    <stop offset='0%' className={`${currentMode.color.includes('red') ? `stop-red-400` : currentMode.color.includes('green') ? `stop-green-400` : `stop-blue-400`}`} />
                                    <stop offset="100%" className={`${currentMode.color.includes('pink') ? 'stop-pink-500' : currentMode.color.includes('emerald') ? 'stop-emerald-500' : 'stop-cyan-500'}`}/>                
                                </linearGradient>
                            </defs>
                        </svg>

                        {/*TIMER CONTENT*/}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <IconComponent className='w-10 h-10 text-gray-600 mb-2' />
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
                                className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentMode.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center`}
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

                        {/*SETTINGS MODAL*/}
                        {showSettings && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 animate-in slide-in-from-top duration-300">
                             <h3 className="text-xl font-bold text-gray-800 mb-4">Timer Settings</h3>
              
                            <div className="space-y-4">
                                <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Work Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.work}
                                    onChange={(e) => updateSettings({...settings, work: parseInt(e.target.value) || 25})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                />
                                </div>
                                
                                <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Short Break (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={settings.shortBreak}
                                    onChange={(e) => updateSettings({...settings, shortBreak: parseInt(e.target.value) || 5})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                />
                                </div>
                                
                                <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Long Break (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.longBreak}
                                    onChange={(e) => updateSettings({...settings, longBreak: parseInt(e.target.value) || 15})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                                </div>
                            </div>
                        </div>
                        )}

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
                 </div>
            </div>
        </div>
    )
}


export default Home;