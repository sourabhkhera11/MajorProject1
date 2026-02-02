import { Gender } from "./enums";
const phoneRegex = /^\+[1-9]\d{9,13}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isPhone(contact : string):boolean{
    return phoneRegex.test(contact) 
}

export function isEmail(email : string):boolean{
    return emailRegex.test(email)
}

export function isGender(gender : string):boolean{
    return Object.values(Gender).includes(gender as Gender);
}

export function isDOB(dob : Date):boolean{
    return dob <  new Date();
}

export function isInterests(interest : string[]):boolean{
    return  interest.length!=0;
}
