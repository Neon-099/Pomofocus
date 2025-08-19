import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {Brain, Coffee} from 'lucide-react';


export const useStore = create (
    persist ( //persist: when want to save it to local storage
        (set, get) => ({
        
        settings: {
            work: 25,
            shortBreak: 5,
            longBreak: 10,
        }, 

        modes: {},


        initModes: () => {
            const {settings} = get();

            set({
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
            })
        },
        
        mode: 'work',
        isActive: false,
        session: 0,
        timeLeft: 25 * 60,
        audioRef: null,

        //ACTIONS
        setTimeLeft: (newTime) => set({timeLeft: newTime}),

        updateSettings: (newSettings) => {
            const {modes, mode, isActive, } = get(); //to read the current state inside the store (ACCESS MULTIPLE STATE AT ONCE)

            const updatedModes = {
                work: {duration: newSettings.work * 60},
                shortBreak: {duration: newSettings.shortBreak * 60 },
                longBreak: {duration: newSettings.longBreak * 60 }, 
            };

            set({
                settings: newSettings,
                modes: updatedModes,
            });
        },

        toggleTimer: () => set((state) => ({isActive: !state.isActive})),
        resetTimer: () => {
            const {modes, mode, autoStartBreak} = get();
            
            autoStartBreak,
            set({
                timeLeft: modes[mode].duration})
        },
        switchMode: (newMode) => {
            const {modes, mode} = get();

            set ({
                isActive: false,
                mode: newMode,
                timeLeft: modes[mode].duration
            })
        },

        handleTimerComplete: () => {
            const {modes, mode, session} = get();

            if(mode === 'work') {
            //increment each sessions and decide next break type based on the new count 
                const nextSession = session + 1; //compute the previous to avoid inaccurate of data count
                const nextMode = nextSession % 4 === 0 ? 'longBreak' : 'shortBreak';
          
                set({
                    session: nextSession,
                    mode: nextMode,
                    timeLeft: modes[mode].duration,
                    autoStartBreak,
                })  
            } else {
                //finished a break go back to work
                set ({
                    mode: 'work',
                    timeLeft: modes.work.duration
                })
            }
        },

        autoStartBreak: false,

        toggleAutoStartBreak: () => 
            set((state) => ({autoStartBreak: !state.autoStartBreak})),
        }),


        {
            name: 'pomofocusStore'
        }   
    )
)
