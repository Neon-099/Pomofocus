// Audio Test Utility for Pomofocus
// This utility helps test and debug audio functionality

export class AudioTester {
    constructor() {
        this.testResults = {
            soundFiles: {},
            audioContext: null,
            permissions: {},
            errors: []
        };
    }

    // Test if all sound files can be loaded
    async testSoundFiles(availableSounds) {
        console.log('🔊 Testing sound files...');
        
        for (const sound of availableSounds) {
            try {
                const audio = new Audio(sound.src);
                
                // Test if file can be loaded
                await new Promise((resolve, reject) => {
                    audio.addEventListener('canplaythrough', () => {
                        this.testResults.soundFiles[sound.id] = {
                            status: 'success',
                            duration: audio.duration,
                            src: sound.src
                        };
                        console.log(`✅ ${sound.label} (${sound.id}): Loaded successfully`);
                        resolve();
                    });
                    
                    audio.addEventListener('error', (e) => {
                        this.testResults.soundFiles[sound.id] = {
                            status: 'error',
                            error: e.message || 'Failed to load',
                            src: sound.src
                        };
                        console.error(`❌ ${sound.label} (${sound.id}): Failed to load`);
                        console.error(`   Path: ${sound.src}`);
                        console.error(`   Error:`, e);
                        reject(e);
                    });
                    
                    // Set timeout for loading
                    setTimeout(() => {
                        if (audio.readyState < 4) {
                            const error = new Error('Timeout loading audio');
                            this.testResults.soundFiles[sound.id] = {
                                status: 'timeout',
                                error: 'Timeout loading audio',
                                src: sound.src
                            };
                            console.warn(`⚠️ ${sound.label} (${sound.id}): Timeout loading`);
                            reject(error);
                        }
                    }, 5000);
                });
                
            } catch (error) {
                this.testResults.errors.push({
                    type: 'sound_file_test',
                    sound: sound.id,
                    error: error.message
                });
            }
        }
    }

    // Test audio context availability
    testAudioContext() {
        console.log('🎵 Testing Audio Context...');
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.testResults.audioContext = {
                    available: true,
                    type: window.AudioContext ? 'AudioContext' : 'webkitAudioContext'
                };
                console.log('✅ Audio Context: Available');
            } else {
                this.testResults.audioContext = {
                    available: false,
                    error: 'AudioContext not supported'
                };
                console.error('❌ Audio Context: Not supported');
            }
        } catch (error) {
            this.testResults.audioContext = {
                available: false,
                error: error.message
            };
            console.error('❌ Audio Context: Error -', error.message);
        }
    }

    // Test notification permissions
    testNotificationPermissions() {
        console.log('🔔 Testing Notification Permissions...');
        
        if ('Notification' in window) {
            this.testResults.permissions.notifications = {
                supported: true,
                permission: Notification.permission
            };
            console.log(`✅ Notifications: ${Notification.permission}`);
        } else {
            this.testResults.permissions.notifications = {
                supported: false,
                permission: 'not-supported'
            };
            console.log('❌ Notifications: Not supported');
        }
    }

    // Test playing a specific sound
    async testPlaySound(soundId, availableSounds, volume = 0.5) {
        console.log(`🎵 Testing sound playback: ${soundId}`);
        
        const sound = availableSounds.find(s => s.id === soundId);
        if (!sound) {
            console.error(`❌ Sound not found: ${soundId}`);
            return false;
        }

        try {
            const audio = new Audio(sound.src);
            audio.volume = volume;
            
            await audio.play();
            console.log(`✅ Successfully played: ${sound.label}`);
            
            // Stop after 2 seconds for testing
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 2000);
            
            return true;
        } catch (error) {
            console.error(`❌ Failed to play ${sound.label}:`, error);
            
            // Try fallback beep
            try {
                console.log('🔄 Trying fallback beep...');
                const context = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(context.destination);
                
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(volume * 0.3, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
                
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 1);
                
                console.log('✅ Fallback beep played successfully');
                return true;
            } catch (fallbackError) {
                console.error('❌ Fallback beep also failed:', fallbackError);
                return false;
            }
        }
    }

    // Run all tests
    async runAllTests(availableSounds) {
        console.log('🚀 Starting comprehensive audio tests...');
        console.log('=====================================');
        
        this.testAudioContext();
        this.testNotificationPermissions();
        await this.testSoundFiles(availableSounds);
        
        console.log('=====================================');
        console.log('📊 Test Results Summary:');
        console.log('Audio Context:', this.testResults.audioContext?.available ? '✅' : '❌');
        console.log('Notifications:', this.testResults.permissions.notifications?.supported ? '✅' : '❌');
        
        const soundResults = Object.values(this.testResults.soundFiles);
        const successfulSounds = soundResults.filter(r => r.status === 'success').length;
        console.log(`Sound Files: ${successfulSounds}/${soundResults.length} ✅`);
        
        if (this.testResults.errors.length > 0) {
            console.log('❌ Errors found:', this.testResults.errors.length);
            this.testResults.errors.forEach(error => {
                console.error(`  - ${error.type}: ${error.error}`);
            });
        }
        
        return this.testResults;
    }

    // Generate a report for debugging
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ...this.testResults
        };
    }
}

// Export a singleton instance
export const audioTester = new AudioTester();

// Helper function to test audio in console
export const testAudio = async (store) => {
    const { availableSounds, settings } = store.getState();
    const tester = new AudioTester();
    
    console.log('🎵 Quick Audio Test');
    console.log('Current settings:', settings);
    
    // Test current sound
    await tester.testPlaySound(settings.alarmSound, availableSounds, settings.alarmVolume);
    
    return tester.generateReport();
};