import { X } from "lucide-react";
import {useStore} from '../store/store.js';

const SettingsModal = ( {setIsOpen}) => {

    const {settings, updateSettings, autoStartBreak, toggleAutoStartBreak} = useStore();

    return ( //implicit return of the JSX
        <div className="p-1">
            
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl w-[400px] max-w-full p-6 relative">
                    <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 mt-2 mr-2 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}>
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

                    <div className="flex items-center justify-between mt-6 ">
                        <span className="text-gray-500">Auto Start Breaks</span>
                        <button 
                            className={`w-12 h-10 w-18 rounded-full bg-gray-400 flex items-center shadow-md transform transition-transform ${
                                autoStartBreak ? ' bg-red-400' : 'translate-x-0'
                            }`}
                                onClick={toggleAutoStartBreak}>
                            <div className={`bg-white w-7 h-7 m-1 rounded-full shadow-md transform transition-transform ${
                                autoStartBreak ? 'translate-x-9' : 'translate-x-0 bg-red-400'
                            }`}>
                            </div> 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SettingsModal;