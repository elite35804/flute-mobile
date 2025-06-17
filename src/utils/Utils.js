import AsyncStorage from '@react-native-community/async-storage';
import {get} from "lodash";
import {Images} from "@/styles";

export const defaultAvatar = function (user) {
    let thumb = null;
    const random_avatar = Math.random() >= 0.5;
    if (user.avatar) {
        thumb = {uri: user.avatar};
    } else {
        if (get(user, 'gender', 'MALE') === "MALE") {
            thumb  = random_avatar ? Images.avatar_male_1 : Images.avatar_male_2;
        } else {
            thumb = random_avatar ? Images.avatar_female_1: Images.avatar_female_2;
        }
    }
    return thumb;
};

class UtilService {
    static async saveLocalStringData(key, strValue) {
        await AsyncStorage.setItem('@zyon:' + key, strValue);
        return true;
    }

    static async saveLocalObjectData(key, obj) {
        await AsyncStorage.setItem('@zyon:' + key, JSON.stringify(obj));
    }

    static async getLocalStringData(key) {
        let ret = await AsyncStorage.getItem('@zyon:' + key);
        return ret;
    }

    static async getLocalObjectData(key) {
        let ret = await AsyncStorage.getItem('@zyon:' + key);
        if (ret != null) {
            return JSON.parse(ret);
        } else {
            return null;
        }
    }

    static async removeLocalObjectData(key) {
        let ret = await AsyncStorage.removeItem('@zyon:' + key);
        return true;
    }

    static toRad(Value) {
        return Value * Math.PI / 180;
    }

    static getDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = this.toRad(lat2 - lat1);
        var dLon = this.toRad(lon2 - lon1);
        var lat1 = this.toRad(lat1);
        var lat2 = this.toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

}

export default UtilService;
