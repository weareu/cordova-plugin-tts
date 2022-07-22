/*

    Cordova Text-to-Speech Plugin
    https://github.com/vilic/cordova-plugin-tts

    by VILIC VANE
    https://github.com/vilic

    MIT License

*/
'use strict';

const ERR_INVALID_OPTIONS = "ERR_INVALID_OPTIONS";
const ERR_NOT_INITIALIZED = "ERR_NOT_INITIALIZED";
const ERR_ERROR_INITIALIZING = "ERR_ERROR_INITIALIZING";
const ERR_UNKNOWN = "ERR_UNKNOWN";

const Say = require('say').Say
// automatically pick platform
const say = new Say();

//Fix Cordova Electron 3.0 Args Bug. Electron context bridge uses ... for receiving args. This causes
//args to be nested in another array when sent, this is not like other platform args and makes plugin compatibility hard. 
// This may change in future so we'll handle it here.
function getArgs(args) {
    if(Array.isArray(args) && args.length === 1 && Array.isArray(args[0])) {
        return args[0];
    }
    else {
        return args;
    }
}

exports.speak = function(args) {
    args = getArgs(args);

    if(args.length === 0) {
        return Promise.reject(ERR_INVALID_OPTIONS);   
    }
    else {
        args = args[0];
    }

    let text;
    let locale;
    let rate;
    let voice;

    if (!args.text) {
        return Promise.reject(ERR_INVALID_OPTIONS);
    } else {
        text = args.text;
    }

    if (!args.locale) {
        locale = 'en-US';
    } else {
        locale = args.locale;
    }

    if (!args.rate) {
        rate = 1.0;
    } else {
        rate = parseFloat(args.rate);
    }

    //Locale is not used. Say does support voices but this depends on platform and only windows support listing voices.
    //Mac and Windows tie Voices to Locales, but since I cannot list them (especially with locales) we'll use defaults.
    if (!args.voice) {
        voice = null; //use default for platform
    } else {
        voice = args.voice;
    }

    return new Promise(function(resolve, reject) {
        say.speak(text, voice, rate, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};
