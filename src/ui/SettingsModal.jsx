import { X } from "lucide-react";

const SettingsModal = ( {setIsOpen, work, shortBreak, longBreak, updateSettingsWork, updateSettingsShort, updateSettingsLong} ) => {

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
                            value={work}
                            onChange={updateSettingsWork}
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
                            value={shortBreak}
                            onChange={updateSettingsShort}
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
                            value={longBreak}
                            onChange={updateSettingsLong}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SettingsModal;