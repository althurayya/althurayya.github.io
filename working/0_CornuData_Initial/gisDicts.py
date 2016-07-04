import glob, re, os, shutil, sys, math

# gisDicts.py
# dictionaries for transformations 

# define replacement with dictionaries
def dictReplace(text, dic):
    for i, j in dic.items():
        text = text.replace(j, i)
    return text

def dictReplaceRE(text, dic):
    for i, j in dic.items():
        text = re.sub(r"[%s]" % j, r"%s" % i, text)
    return text

def dictReplaceRev(text, dic):
    for i, j in dic.items():
        text = text.replace(i, j)
    return text

def dictReplaceRevRE(text, dic):
    for i, j in dic.items():
        text = re.sub(r"[%s]" % i, r"%s" % j, text)
    return text

translitToArabicRE = {
    'ء'  : 'ʾ',
    'ا'  : 'Āā',
    'ب'  : 'Bb',
    'ة'  : 'ŧ',
    'ت'  : 'Tt',
    'ث'  : 'Ṯṯ',
    'ج'  : 'JjǦǧ',
    'ح'  : 'Ḥḥ',
    'خ'  : 'Ḫḫ',
    'د'  : 'Dd',
    'ذ'  : 'Ḏḏ',
    'ر'  : 'Rr',
    'ز'  : 'Zz',
    'س'  : 'Ss',
    'ش'  : 'Šš',
    'ص'  : 'Ṣṣ',
    'ض'  : 'Ḍḍ',
    'ط'  : 'Ṭṭ',
    'ظ'  : 'Ẓẓ',
    'ع'  : 'ʿ',
    'غ'  : 'Ġġ',
    'ف'  : 'Ff',
    'ق'  : 'Qq',
    'ك'  : 'Kk',
    'ل'  : 'Ll',
    'م'  : 'Mm',
    'ن'  : 'Nn',
    'ه'  : 'Hh',
    'و'  : 'WwŪū',
    'ى'  : 'á',
    'ي'  : 'YyĪī',
}

codeToTranslit = {
    # quick codes
    'ʿ'  : '*`',  # *`, deprecated "` 
    'ʾ'  : '*\'', # *', deprecated "'
    #'á'  : '"o',
    #'á'  : '"y',
    'ã'  : '~a',
    'á'  : ':a',
    'ā'  : '_a',
    'ḥ'  : '*h',
    'ṣ'  : '*s',
    'ḍ'  : '*d',
    'ṭ'  : '*t',
    'ẓ'  : '*z',
    'ū'  : '_u',
    'ī'  : '_i',
    'Ā'  : '_A',
    'Ḥ'  : '*H',
    'Ṣ'  : '*S',
    'Ḍ'  : '*D',
    'Ṭ'  : '*T',
    'Ẓ'  : '*Z',
    'Ū'  : '_U',
    'Ī'  : '_I',
    # one-letter transcription
    'Š'  : '^S',
    'š'  : '^s',
    'Č'  : '^C',
    'č'  : '^c',
    'Ṯ'  : '_T',
    'ṯ'  : '_t',
    'Ḫ'  : '_H',
    'ḫ'  : '_h',
    'Ġ'  : '*G',
    'ġ'  : '*g',
    'Ǧ'  : '^G',
    'ǧ'  : '^g',
    'Ḏ'  : '_D',
    'ḏ'  : '_d',
    #'ŧ'  : '"t',
    'ŧ'  : ':t',
    # european letters
    'é'  : "\\'e",
    }

translitToSimple = {
    'ʿ'  : '',
    'ʾ'  : '',
    'ã'  : 'a',
    'á'  : 'a',
    'ā'  : 'a',
    'ḥ'  : 'h',
    'ṣ'  : 's',
    'ḍ'  : 'd',
    'ṭ'  : 't',
    'ẓ'  : 'z',
    'ū'  : 'u',
    'ī'  : 'i',
    'Ā'  : 'A',
    'Ḥ'  : 'H',
    'Ṣ'  : 'S',
    'Ḍ'  : 'D',
    'Ṭ'  : 'T',
    'Ẓ'  : 'Z',
    'Ū'  : 'U',
    'Ī'  : 'I',
    'Š'  : 'Sh',
    'š'  : 'sh',
    'Č'  : 'Ch',
    'č'  : 'ch',
    'Ṯ'  : 'Th',
    'ṯ'  : 'th',
    'Ḫ'  : 'Kh',
    'ḫ'  : 'kh',
    'Ġ'  : 'Gh',
    'Ǧ'  : 'J',
    'ǧ'  : 'j',
    'ġ'  : 'gh',
    'Ḏ'  : 'Dh',
    'ḏ'  : 'dh',
    'ŧ'  : '',
    }

translitToUS = {
    # Translit : US,
    'ʿ'  : 'ʿ',
    'ʾ'  : 'ʾ',
    'ã'  : 'ā',
    'á'  : 'ā',
    'ā'  : 'ā',
    'ḥ'  : 'ḥ',
    'ṣ'  : 'ṣ',
    'ḍ'  : 'ḍ',
    'ṭ'  : 'ṭ',
    'ẓ'  : 'ẓ',
    'ū'  : 'ū',
    'ī'  : 'ī',
    'Ā'  : 'Ā',
    'Ḥ'  : 'Ḥ',
    'Ṣ'  : 'Ṣ',
    'Ḍ'  : 'Ḍ',
    'Ṭ'  : 'Ṭ',
    'Ẓ'  : 'Ẓ',
    'Ū'  : 'Ū',
    'Ī'  : 'Ī',
    'Š'  : 'Sh',
    'š'  : 'sh',
    'Č'  : 'Ch',
    'č'  : 'ch',
    'Ṯ'  : 'Th',
    'ṯ'  : 'th',
    'Ḫ'  : 'Kh',
    'ḫ'  : 'kh',
    'Ġ'  : 'Gh',
    'ġ'  : 'gh',
    'Ǧ'  : 'J',
    'ǧ'  : 'j',
    'Ḏ'  : 'Dh',
    'ḏ'  : 'dh',
    'ŧ'  : 't',
    }


translitSimple = {
    # quick codes
    ''   : '*`',
    ''  : '*\'',
    'a'  : '~a',
    'a'  : ':a',
    'a'  : '_a',
    'h'  : '*h',
    's'  : '*s',
    'd'  : '*d',
    't'  : '*t',
    'z'  : '*z',
    'u'  : '_u',
    'i'  : '_i',
    'A'  : '_A',
    'H'  : '*H',
    'S'  : '*S',
    'D'  : '*D',
    'T'  : '*T',
    'Z'  : '*Z',
    'U'  : '_U',
    'I'  : '_I',
    # one-letter transcription
    'Sh'  : '^S',
    'sh'  : '^s',
    'ch'  : '\\^C',
    'ch'  : '^c',
    'Th'  : '_T',
    'th'  : '_t',
    'Kh'  : '_H',
    'kh'  : '_h',
    'Gh'  : '*G',
    'gh'  : '*g',
    'J'  : '^G',
    'j'  : '^g',
    'Dh'  : '_D',
    'dh'  : '_d',
    ''  : ':t',
    }
