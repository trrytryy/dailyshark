import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import be from '../../public/locales/be/translation.json';
import bz from '../../public/locales/bz/translation.json';
import ca from '../../public/locales/ca/translation.json';
import cz from '../../public/locales/cz/translation.json';
import de from '../../public/locales/de/translation.json';
import en from '../../public/locales/en/translation.json';
import fr from '../../public/locales/fr/translation.json';
import ind from '../../public/locales/in/translation.json';
import it from '../../public/locales/it/translation.json';
import pk from '../../public/locales/pk/translation.json';
import us from '../../public/locales/us/translation.json';
import vn from '../../public/locales/vn/translation.json';
import se from '../../public/locales/se/translation.json';
import sg from '../../public/locales/sg/translation.json';
import au from '../../public/locales/au/translation.json';
import dk from '../../public/locales/dk/translation.json';
import jp from '../../public/locales/jp/translation.json';
import kr from '../../public/locales/kr/translation.json';
import hk from '../../public/locales/hk/translation.json';
import am from '../../public/locales/am/translation.json';
import ee from '../../public/locales/ee/translation.json';
import fi from '../../public/locales/fi/translation.json';
import ge from '../../public/locales/ge/translation.json';
import hu from '../../public/locales/hu/translation.json';
import kg from '../../public/locales/kg/translation.json';
import kz from '../../public/locales/kz/translation.json';
import np from '../../public/locales/np/translation.json';
import tr from '../../public/locales/tr/translation.json';
import ua from '../../public/locales/ua/translation.json';
import ae from '../../public/locales/ae/translation.json';
import es from '../../public/locales/es/translation.json';
import mn from '../../public/locales/mn/translation.json';
import sa from '../../public/locales/sa/translation.json';
import th from '../../public/locales/th/translation.json';
import tw from '../../public/locales/tw/translation.json';
import gr from '../../public/locales/gr/translation.json';
import il from '../../public/locales/il/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            be: { translation: be },
            bz: { translation: bz },
            ca: { translation: ca },
            cz: { translation: cz },
            de: { translation: de },
            en: { translation: en },
            fr: { translation: fr },
            in: { translation: ind },
            it: { translation: it },
            pk: { translation: pk },
            us: { translation: us },
            vn: { translation: vn },
            se: { translation: se },
            sg: { translation: sg },
            au: { translation: au },
            dk: { translation: dk },
            jp: { translation: jp },
            kr: { translation: kr },
            hk: { translation: hk },
            am: { translation: am },
            ee: { translation: ee },
            fi: { translation: fi },
            ge: { translation: ge },
            hu: { translation: hu },
            kg: { translation: kg },
            kz: { translation: kz },
            np: { translation: np },
            tr: { translation: tr },
            ua: { translation: ua },
            ae: { translation: ae },
            es: { translation: es },
            mn: { translation: mn },
            sa: { translation: sa },
            th: { translation: th },
            tw: { translation: tw },
            gr: { translation: gr },
            il: { translation: il },
        },
        fallbackLng: 'en',
        supportedLngs: ['be', 'bz', 'ca', 'cz', 'de', 'en', 'fr', 'in', 'it', 'pk', 'us', 'vn', 'se', 'sg', 'au', 'dk', 'jp', 'kr', 'hk', 'am', 'ee', 'fi', 'ge', 'hu', 'kg', 'kz', 'np', 'tr', 'ua', 'ae', 'es', 'mn', 'sa', 'th', 'tw', 'gr', 'il'],
        // supportedLngs: ['en'],
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
