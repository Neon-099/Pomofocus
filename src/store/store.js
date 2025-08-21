import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {Brain, Coffee} from 'lucide-react';

// Icon mapping to avoid serialization issues with persist
const iconMap = {
    Brain,
    Coffee
};

export const useStore = create (
    persist ( //persist: when want to save it to local storage
        (set, get) => ({
        
        settings: {
            work: 25,
            shortBreak: 5,
            longBreak: 10,
            alarmSound: 'bell',
            alarmVolume: 0.5,
        }, 

        modes: {
            work: {
                duration: 25 * 60,
                label: 'Focus time',
                color: 'from-red-400 to-pink-500',
                bgColor: 'bg-gradient-to-br from-red-500 to-pink-50',
                iconName: 'Brain', 
            },
            shortBreak: {
                duration: 5 * 60,
                label: 'Short break',
                color: 'from-green-400 to-emerald-500',
                bgColor: 'bg-gradient-to-br from-green-500 to-emerald-50',
                iconName: 'Coffee',
            },
            longBreak: {
                duration: 10 * 60,
                label: 'Long break',
                color: 'from-yellow-400 to-cyan-500',
                bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-50',
                iconName: 'Coffee'
            }
        },

        availableSounds: [
            { id: 'bell', label: 'Bell', src: `/src/sounds/bell.mp3`},
            { id: "chime", label: "Chime", src: "/src/sounds/chimp.mp3" },
            { id: "beep", label: "Beep", src: "/src/sounds/beep.mp3" },
        ],

        // Helper function to get icon component
        getIcon: (iconName) => iconMap[iconName],

        initModes: () => {
            const {settings} = get();

            set({
                modes : {
                    work : {
                        duration: settings.work * 60,
                        label: 'Focus time',
                        color: 'from-red-400 to-pink-500',
                        bgColor: 'bg-gradient-to-br from-red-500 to-pink-50',
                        iconName: 'Brain', 
                    },
                    shortBreak: {
                        duration: settings.shortBreak * 60,
                        label: 'Short break',
                        color: 'from-green-400 to-emerald-500',
                        bgColor: 'bg-gradient-to-br from-green-500 to-emerald-50',
                        iconName: 'Coffee',
                    },
                    longBreak: {
                        duration: settings.longBreak * 60,
                        label: 'Long break',
                        color: 'from-yellow-400 to-cyan-500',
                        bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-50',
                        iconName: 'Coffee'
                    }
                }
            })
        },
        
        mode: 'work',
        isActive: false,
        session: 0,
        timeLeft: 25 * 60,
        autoStartBreak: false,
        audioRef: null,
        alarmVolume: 0.5, 

        //ACTIONS
        setTimeLeft: (newTime) => set({timeLeft: newTime}),

        updateSettings: (newSettings) => {
            const {modes, mode, isActive} = get();

            const updatedModes = {
                work: {
                    ...modes.work,
                    duration: newSettings.work * 60
                },
                shortBreak: {
                    ...modes.shortBreak,
                    duration: newSettings.shortBreak * 60
                },
                longBreak: {
                    ...modes.longBreak,
                    duration: newSettings.longBreak * 60
                }
            };

            // Update current timer if not active and settings changed for current mode
            const shouldUpdateTimer = !isActive && modes[mode] && 
                modes[mode].duration !== updatedModes[mode].duration;

            set({
                settings: newSettings,
                modes: updatedModes,
                ...(shouldUpdateTimer && { timeLeft: updatedModes[mode].duration })
            });
        },

        toggleTimer: () => set((state) => ({isActive: !state.isActive})),
        resetTimer: () => {
            const {modes, mode} = get();
            
            set({
                isActive: false,
                timeLeft: modes[mode].duration
            });
        },
        switchMode: (newMode) => {
            const {modes} = get();

            set ({
                isActive: false,
                mode: newMode,
                timeLeft: modes[newMode].duration
            })
        },

        handleTimerComplete: () => {
            const {modes, mode, session, autoStartBreak, availableSounds, settings} = get();
            
            // Stop the timer first
            set({ isActive: false });
            
            //PLAY CHOSEN SOUND - This should happen for ALL timer completions
            const selectedSound = availableSounds.find(
                sound => sound.id === settings.alarmSound
            );
            
            if(selectedSound) {
                try {
                    const audio = new Audio(selectedSound.src);
                    audio.volume = settings.alarmVolume;
                    
                    // Add event listeners for debugging
                    audio.addEventListener('canplaythrough', () => {
                        console.log('Audio can play through');
                    });
                    
                    audio.addEventListener('error', (e) => {
                        console.error('Audio error:', e);
                        console.error('Failed to load:', selectedSound.src);
                    });
                    
                    // Play the audio
                    audio.play().catch((error) => {
                        console.error('Audio play failed:', error);
                        // Fallback: try to play a simple beep
                        const context = new (window.AudioContext || window.webkitAudioContext)();
                        const oscillator = context.createOscillator();
                        const gainNode = context.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(context.destination);
                        
                        oscillator.frequency.value = 800;
                        gainNode.gain.setValueAtTime(settings.alarmVolume * 0.3, context.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
                        
                        oscillator.start(context.currentTime);
                        oscillator.stop(context.currentTime + 1);
                    });
                } catch (error) {
                    console.error('Error creating audio:', error);
                }
            }

            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
                const modeLabels = {
                    work: 'Focus time',
                    shortBreak: 'Short break',
                    longBreak: 'Long break'
                };
                
                new Notification(`${modeLabels[mode]} completed!`, {
                    body: mode === 'work' ? 'Time for a break!' : 'Time to get back to work!',
                    icon: '/favicon.ico'
                });
            }

            if(mode === 'work') {
                //increment each sessions and decide next break type based on the new count 
                const nextSession = session + 1;
                const nextMode = nextSession % 4 === 0 ? 'longBreak' : 'shortBreak';
                set({
                    session: nextSession,
                    mode: nextMode,
                    timeLeft: modes[nextMode].duration,
                    isActive: autoStartBreak
                });
             
            } else {
                //finished a break go back to work
                set({
                    mode: 'work',
                    timeLeft: modes.work.duration,
                    isActive: false
                });
            }
        },

        toggleAutoStartBreak: () => 
            set((state) => ({autoStartBreak: !state.autoStartBreak})),
    
        setAlarmSound : (newSound) => 
            set((state) => ({
                settings: { ...state.settings, alarmSound: newSound },
            })), 
        
        setAlarmVolume: (newVolume) => 
            set((state) => ({
                settings: { ...state.settings, alarmVolume: newVolume },
            })),


        }),
        {
            name: 'pomofocusStore'
        }   
    )
)