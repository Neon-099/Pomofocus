import { X } from "lucide-react";
import {useStore} from '../store/store.js';

const SettingsModal = ( {setIsOpen}) => {

    const {settings, updateSettings, 
        autoStartBreak, toggleAutoStartBreak,
        availableSounds, setAlarmSound, 
        setAlarmVolume } = useStore();

    return ( //implicit return of the JSX
        <div className="p-1">
            
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl w-[400px] max-w-full p-6 relative">
                    <button 
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={20}/>
                    </button>

                <h2 className="text-xl font-semibold pb-4 flex items-center justify-center border-b border-gray-300">Settings</h2>
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
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value >= 1 && value <= 60) {
                                    updateSettings({...settings, work: value});
                                } else if (e.target.value === '') {
                                    updateSettings({...settings, work: 25});
                                }
                            }}
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
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value >= 1 && value <= 30) {
                                    updateSettings({...settings, shortBreak: value});
                                } else if (e.target.value === '') {
                                    updateSettings({...settings, shortBreak: 5});
                                }
                            }}
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
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value >= 1 && value <= 60) {
                                    updateSettings({...settings, longBreak: value});
                                } else if (e.target.value === '') {
                                    updateSettings({...settings, longBreak: 15});
                                }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <span className="text-gray-700 font-medium">Auto Start Breaks</span>
                        <button 
                            className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 ${
                                autoStartBreak ? 'bg-red-400' : 'bg-gray-300'
                            }`}
                            onClick={toggleAutoStartBreak}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                autoStartBreak ? 'translate-x-6' : 'translate-x-0'
                            }`}>
                            </div> 
                        </button>
                    </div>


                    <div className="mt-4 flex justify-between items-center">
                        <label className="block mb-10">Alarm Sound:</label>
                        <div className="flex flex-col items-center pt-3 ">
                            <select
                            value={settings.alarmSound}
                            onChange={(e) => setAlarmSound(e.target.value)}
                            className="border rounded px-2 py-1"
                            >
                            {availableSounds.map((sound) => (
                                <option key={sound.id} value={sound.id}>
                                {sound.label}
                                </option>
                            ))}
                            </select>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.alarmVolume}
                                onChange={(e) => setAlarmVolume(parseFloat(e.target.value))}
                                className="w-29 "
                                />
                            <p className="text-sm text-gray-600 mt-1">
                                {Math.round(settings.alarmVolume * 100)}%
                            </p>
                        </div>
                        <button
  onClick={() => {
    const sound = availableSounds.find(s => s.id === settings.alarmSound);
    if (sound) {
      const audio = new Audio(sound.src);
      audio.volume = settings.alarmVolume;
      audio.play();
    }
  }}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Preview Sound
</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SettingsModal;