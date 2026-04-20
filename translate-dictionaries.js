import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const SOURCE_LANG = 'en';
const LOCALES_DIR = path.join( __dirname, 'public', 'locales' );
const TRANSLATION_FILE = 'translation.json';
const REQUEST_DELAY = 300;

const LOCALE_TO_GTLANG = {
    ae: 'ar',
    am: 'hy',
    au: 'en',
    be: 'nl',
    bz: 'en',
    ca: 'en',
    cz: 'cs',
    de: 'de',
    dk: 'da',
    ee: 'et',
    en: 'en',
    es: 'es',
    fi: 'fi',
    fr: 'fr',
    ge: 'ka',
    gr: 'el',
    hk: 'zh-HK',
    hu: 'hu',
    il: 'he',
    in: 'hi',
    it: 'it',
    jp: 'ja',
    kg: 'ky',
    kr: 'ko',
    kz: 'kk',
    mn: 'mn',
    np: 'ne',
    pk: 'ur',
    sa: 'ar',
    se: 'sv',
    sg: 'en',
    th: 'th',
    tr: 'tr',
    tw: 'zh-TW',
    ua: 'uk',
    us: 'en',
    vn: 'vi',
};

const getTargetLanguages = () =>
{
    const folders = fs.readdirSync( LOCALES_DIR, { withFileTypes: true } );
    return folders
        .filter( ( d ) => d.isDirectory() && d.name !== SOURCE_LANG )
        .filter( ( d ) => fs.existsSync( path.join( LOCALES_DIR, d.name, TRANSLATION_FILE ) ) )
        .map( ( d ) => d.name );
};

const extractStrings = ( obj, path = [] ) =>
{
    const results = [];
    for ( const [ key, value ] of Object.entries( obj ) )
    {
        const currentPath = [ ...path, key ];
        if ( typeof value === 'string' )
        {
            results.push( { path: currentPath, value } );
        } else if ( typeof value === 'object' && value !== null )
        {
            results.push( ...extractStrings( value, currentPath ) );
        }
    }
    return results;
};

const setValueByPath = ( obj, path, value ) =>
{
    let current = obj;
    for ( let i = 0; i < path.length - 1; i++ )
    {
        const key = path[ i ];
        if ( !( key in current ) ) current[ key ] = {};
        current = current[ key ];
    }
    current[ path[ path.length - 1 ] ] = value;
};

const translateText = async ( text, gtLang ) =>
{
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${ SOURCE_LANG }&tl=${ gtLang }&dt=t&q=${ encodeURIComponent( text ) }`;

    const response = await fetch( url );
    if ( !response.ok ) throw new Error( `HTTP ${ response.status }` );

    const data = await response.json();
    return (
        data?.[ 0 ]
            ?.map( ( item ) => item[ 0 ] )
            .filter( Boolean )
            .join( '' ) || text
    );
};

const translateLanguage = async ( sourceData, strings, locale, existingData ) =>
{
    const gtLang = LOCALE_TO_GTLANG[ locale ];
    if ( !gtLang )
    {
        console.log( `  Skipping: no Google Translate mapping for "${ locale }"` );
        return existingData || sourceData;
    }

    if ( gtLang === SOURCE_LANG )
    {
        console.log( `  Skipping: ${ locale } maps to same language as source (${ SOURCE_LANG })` );
        return structuredClone( sourceData );
    }

    const translated = structuredClone( existingData || sourceData );

    for ( let i = 0; i < strings.length; i++ )
    {
        const { path, value } = strings[ i ];

        if ( /^\{[\w()]+\}$/.test( value ) ) continue;

        try
        {
            const translatedText = await translateText( value, gtLang );
            setValueByPath( translated, path, translatedText );

            if ( ( i + 1 ) % 10 === 0 )
            {
                console.log( `  Progress: ${ i + 1 }/${ strings.length }` );
            }

            await new Promise( ( resolve ) => setTimeout( resolve, REQUEST_DELAY ) );
        } catch ( error )
        {
            console.error( `  Error translating "${ path.join( '.' ) }": ${ error.message }` );
        }
    }

    return translated;
};

const languages = getTargetLanguages();
const sourceFile = path.join( LOCALES_DIR, SOURCE_LANG, TRANSLATION_FILE );
const sourceData = JSON.parse( fs.readFileSync( sourceFile, 'utf-8' ) );
const strings = extractStrings( sourceData );

console.log( `Source: ${ SOURCE_LANG } (${ strings.length } strings)` );
console.log( `Target languages (${ languages.length }): ${ languages.join( ', ' ) }` );
console.log( '---' );

for ( let i = 0; i < languages.length; i++ )
{
    const lang = languages[ i ];
    const outputFile = path.join( LOCALES_DIR, lang, TRANSLATION_FILE );

    let existingData;
    try
    {
        existingData = JSON.parse( fs.readFileSync( outputFile, 'utf-8' ) );
    } catch
    {
        existingData = null;
    }

    console.log( `[${ i + 1 }/${ languages.length }] ${ lang } → ${ LOCALE_TO_GTLANG[ lang ] || '?' }...` );

    const translated = await translateLanguage( sourceData, strings, lang, existingData );
    fs.writeFileSync( outputFile, JSON.stringify( translated, null, 4 ) );
    console.log( `  Saved: ${ outputFile }` );
}

console.log( 'Done!' );