import {storage} from "../firebase/index";
import HTMLReactParser from "html-react-parser";
import {functions} from '../firebase';
import {config} from '../const/config';
import crypto from "crypto";


/**
 * When user select an image file from his local directory, upload it to Firebase Storage, get download URL,
 * and set the URL to the src property of img tag for displaying the thumbnail.
 * @param {string} id The identifier of input tag for uploading files
 */

export const attachFiles = (id, type) => {
    if (type === 'remove') {
        return document.getElementById(id).removeEventListener('change', () => null);
    } else if (type === 'add') {
        document.getElementById(id).addEventListener("change", (event)=> {
            const file = event.target.files;
            // @ts-ignore
            let blob = new Blob(file, { type: "image/jpeg" });

            // Generate random 16 digits strings
            const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const N=16;
            const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n%S.length]).join('')

            const uploadRef = storage.ref('images').child(fileName);
            const uploadTask = uploadRef.put(blob);
            uploadTask.on('state_changed', (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                // Handle unsuccessful uploads
                console.error("Failed to upload file. ERROR: ", error);
            }, () => {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    document.getElementById(`${id}-thumb`).setAttribute('src', downloadURL);
                });
            });
        });
    }

};

/**
 * send Email
 * @param to
 * @param title
 * @param body
 * @param retryCount
 * @returns {Promise<void>}
 */
export const sendEmail = async(to, title, body, retryCount) => {
    try {
        functions.httpsCallable('sendEmail')({
            "apiKey": config().common.mailApiKey,
            "sender": config().common.sender,
            "to": to,
            "title": title,
            "body": body
        });
    } catch(e) {
        if (!retryCount || retryCount === 3) {
            console.error("メールの送信に失敗しました。");
            return;
        }
        await sleep(1000 + 1000 * retryCount);
        await sendEmail(to, title, body, retryCount + 1);
    }
};


/**
 * Convert Carriage Return and Line Feed into <br> tag.
 * @param {string} text The row text
 * @returns {void | string | never} The formatted text
 */
export const returnCodeToBr = (text) => {
    if (text === "") {
        return text
    } else {
        return HTMLReactParser(text.replace(/\r?\n/g, '<br/>'))
    }
};


/**
 * Convert datetime into the String.
 * @param {Date} dt
 * @returns {string} "YYYY-MM-DD"
 */
export const dateToString = (dt) => {
    return dt.getFullYear() + '-'
        + ('00' + (dt.getMonth()+1)).slice(-2) + '-'
        + ('00' + dt.getDate()).slice(-2)
};


/**
 * Convert datetime into the String.
 * @param {Date} dt
 * @returns {string} "YYYY-MM-DD"
 */
export const datetimeToString = (dt) => {
    return dt.getFullYear() + '-'
        + ('00' + (dt.getMonth()+1)).slice(-2) + '-'
        + ('00' + dt.getDate()).slice(-2) + ' '
        + ('00' + dt.getHours()).slice(-2) + ':'
        + ('00' + dt.getMinutes()).slice(-2) + ':'
        + ('00' + dt.getSeconds()).slice(-2)
};


/**
 * Validate input email
 * @param email
 * @returns {boolean}
 */
export const isValidEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(email)
}

/**
 * sleep
 * @param msec
 * @returns {Promise<any>}
 */
export const sleep = (msec) => {
    return new Promise(function(resolve) {
        setTimeout(function() {resolve()}, msec);
    })
}

const CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const generateRandomChar = (len) => {
    let result = "";
    let cl = CHARACTERS.length;
    for(let i=0; i<len; i++){
        result += CHARACTERS[Math.floor(Math.random()*cl)]; // Math.randomは0 ~ 1未満
    }
    return result;
}

const ENCRYPTION_KEY = "HH95XH7sYAbznRBJSUE9W8RQxzQIGSpy";
const BUFFER_KEY = "RfHBdAR5RJHqp5wm";
const ENCRYPT_METHOD = "aes-256-cbc";
const ENCODING = "hex";
export const getEncryptedString = (target) => {
    let iv = Buffer.from(BUFFER_KEY)
    let cipher = crypto.createCipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(target)

    encrypted = Buffer.concat([encrypted, cipher.final()])

    return encrypted.toString(ENCODING);
}

export const getDecryptedString = (target) => {
    let iv = Buffer.from(BUFFER_KEY)
    let encryptedText = Buffer.from(target, ENCODING)
    let decipher = crypto.createDecipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString();
}
