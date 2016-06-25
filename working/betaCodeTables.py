# The file includes three conversion tables.
# - betacodeTranslit: one-to-one unconventional
# - translitLOC:      Library of Congress Romanization of Arabic
# - translitSearch:   simplified transliteration for search and alphabetization purposes
#### To add
# - translitArabic:   conversion to Arabic script (also requires a different function with Arabic orthography rules)
# - possibly other transliteration flavors: Brill, French, German and Spanish tranliteration system differ from LOC

# One-to-one transliteration for computational research
# - main principle: one Arabic character = one Latin character
# - understandable for Arabists, but has some unconventional symbols

buckwalter = {
	"ء" : "c",
	"ا" : "A",
	"إ" : "A",
	"أ" : "A",
	"آ" : "A",
	"ب" : "b",
	"ة" : "o",
	"ت" : "t",
	"ث" : "v",
	"ج" : "j",
	"ح" : "H",
	"خ" : "x",
	"د" : "d",
	"ذ" : "V",
	"ر" : "r",
	"ز" : "z",
	"س" : "s",
	"ش" : "E",
	"ص" : "S",
	"ض" : "D",
	"ط" : "T",
	"ظ" : "Z",
	"ع" : "C",
	"غ" : "g",
	"ف" : "f",
	"ق" : "q",
	"ك" : "k",
	"ل" : "l",
	"م" : "m",
	"ن" : "n",
	"ه" : "h",
	"ؤ" : "c",
	"و" : "w",
	"ى" : "y",
	"ئ" : "c",
	"ي" : "y",
    }


betacodeTranslit = {
# Alphabet letters
    '_a' : 'ā', # alif
    'b'  : 'b', # bā’
    't'  : 't', # tā’
    '_t' : 'ṯ', # thā’
    '^g' : 'ǧ', # jīm
    'j'  : 'ǧ', # jīm
    '^c' : 'č', # chīm / Persian
    '*h' : 'ḥ', # ḥā’
    #'.h' : 'ḥ', # ḥā’
    '_h' : 'ḫ', # khā’
    'd'  : 'd', # dāl
    '_d' : 'ḏ', # dhāl
    'r'  : 'r', # rā’
    'z'  : 'z', # zayn
    's'  : 's', # sīn
    '^s' : 'š', # shīn
    '*s' : 'ṣ', # ṣād
    #'.s' : 'ṣ', # ṣād
    '*d' : 'ḍ', # ḍād
    #'.d' : 'ḍ', # ḍād
    '*t' : 'ṭ', # ṭā’
    #'.t' : 'ṭ', # ṭā’
    '*z' : 'ẓ', # ẓā’
    #'.z' : 'ẓ', # ẓā’
    '`'  : 'ʿ', # ‘ayn
    '*g' : 'ġ', # ghayn
    #'.g' : 'ġ', # ghayn
    'f'  : 'f', # fā’
    '*k' : 'ḳ', # qāf
    #'.k' : 'ḳ', # qāf
    'q'  : 'ḳ', # qāf
    'k'  : 'k', # kāf
    'g'  : 'g', # gāf / Persian
    'l'  : 'l', # lām
    'm'  : 'm', # mīm
    'n'  : 'n', # nūn
    'h'  : 'h', # hā’
    'w'  : 'w', # wāw
    '_u' : 'ū', # wāw
    'y'  : 'y', # yā’
    '_i' : 'ī', # yā’
# Non-alphabetic letters
    '\'' : 'ʾ', # hamzaŧ
    '/a' : 'á', # alif maqṣūraŧ
    #':t' : 'ŧ', # tā’ marbūṭaŧ, add +, it in idafa (`_amma:t+ ba*gd_ad)
    '=t' : 'ŧ', # tā’ marbūṭaŧ, this is preferable for Alpheios
# Vowels
    '~a' : 'ã', # dagger alif
    'u'  : 'u', # ḍammaŧ    
    'i'  : 'i', # kasraŧ
    'a'  : 'a', # fatḥaŧ
    '?u'  : 'ủ', # ḍammaŧ    
    '?i'  : 'ỉ', # kasraŧ
    '?a'  : 'ả', # fatḥaŧ    
    #'.n' : 'ȵ',  # n of tanwīn
    #'^n' : 'ȵ',  # n of tanwīn
    #'_n' : 'ȵ',  # n of tanwīn
    '*n' : 'ȵ',   # n of tanwīn
    '*w' : 'ů',  # silent w, like in `Amru.n.w
    '*a' : 'å'  # silent alif, like in fa`al_u.a    
    }

# conventional US/LOC transliteration
translitLOC = {
# Alphabet letters
    'ā' : 'ā',  # alif
    'b' : 'b',  # bā’
    't' : 't',  # tā’
    'ṯ' : 'th', # thā’
    'ǧ' : 'j',  # jīm
    'č' : 'ch', # chīm / Persian
    'ḥ' : 'ḥ',  # ḥā’
    'ḫ' : 'kh', # khā’
    'd' : 'd',  # dāl
    'ḏ' : 'dh', # dhāl
    'r' : 'r',  # rā’
    'z' : 'z',  # zayn
    's' : 's',  # sīn
    'š' : 'sh', # shīn
    'ṣ' : 'ṣ',  # ṣād
    'ḍ' : 'ḍ',  # ḍād
    'ṭ' : 'ṭ',  # ṭā’
    'ẓ' : 'ẓ',  # ẓā’
    'ʿ' : 'ʿ',   # ‘ayn
    'ġ' : 'gh', # ghayn
    'f' : 'f',  # fā’
    'ḳ' : 'q',  # qāf
    'k' : 'k',  # kāf
    'g' : 'g',  # gāf / Persian
    'l' : 'l',  # lām
    'm' : 'm',  # mīm
    'n' : 'n',  # nūn
    'h' : 'h',  # hā’
    'w' : 'w',  # wāw
    'ū' : 'ū',  # wāw
    'y' : 'y',  # yā’
    'ī' : 'ī',  # yā’
# Non-alphabetic letters
    'ʾ' : 'ʾ',   # hamzaŧ
    'á' : 'ā',  # alif maqṣūraŧ
    'ŧ' : 'h',  # tā’ marbūṭaŧ
# Vowels
    'ã' : 'ā',  # dagger alif
    'a' : 'a',  # fatḥaŧ
    'u' : 'u',  # ḍammaŧ
    'i' : 'i',  # kasraŧ
    'aȵ' : 'an',  # tanwīn fatḥ
    'uȵ' : '',  # tanwīn ḍamm
    'iȵ' : '',  # tanwīn kasr
    'ů' : '',  # silent w, like in `Amru.n.w
    'å' : '',  # silent alif, like in fa`al_u.a
    'ả' : '',  # final fatḥaŧ
    'ỉ' : '',  # final ḍammaŧ
    'ủ' : '',  # final kasraŧ    
    }

# necessary for rendering searcheable lines
translitSearch = {
# Alphabet letters
    'ā' : 'a',  # alif
    'b' : 'b',  # bā’
    't' : 't',  # tā’
    'ṯ' : 'th', # thā’
    'ǧ' : 'j',  # jīm
    'č' : 'ch', # chīm / Persian
    'ḥ' : 'h',  # ḥā’
    'ḫ' : 'kh', # khā’
    'd' : 'd',  # dāl
    'ḏ' : 'dh', # dhāl
    'r' : 'r',  # rā’
    'z' : 'z',  # zayn
    's' : 's',  # sīn
    'š' : 'sh', # shīn
    'ṣ' : 's',  # ṣād
    'ḍ' : 'd',  # ḍād
    'ṭ' : 't',  # ṭā’
    'ẓ' : 'z',  # ẓā’
    'ʿ' : '',   # ‘ayn
    'ġ' : 'gh', # ghayn
    'f' : 'f',  # fā’
    'ḳ' : 'q',  # qāf
    'k' : 'k',  # kāf
    'g' : 'g',  # gāf / Persian
    'l' : 'l',  # lām
    'm' : 'm',  # mīm
    'n' : 'n',  # nūn
    'h' : 'h',  # hā’
    'w' : 'w',  # wāw
    'ū' : 'u',  # wāw
    'y' : 'y',  # yā’
    'ī' : 'i',  # yā’
# Non-alphabetic letters
    'ʾ' : '',   # hamzaŧ
    'á' : 'a',  # alif maqṣūraŧ
    'ŧ' : 'h',  # tā’ marbūṭaŧ
# Vowels
    'ã' : 'a',  # dagger alif
    'a' : 'a',  # fatḥaŧ
    'u' : 'u',  # ḍammaŧ
    'i' : 'i',  # kasraŧ
    'aȵ' : 'an',  # tanwīn fatḥ
    'uȵ' : '',  # tanwīn ḍamm
    'iȵ' : '',  # tanwīn kasr
    'ů' : '',  # silent w, like in `Amru.n.w
    'å' : '',  # silent alif, like in fa`al_u.a
    'ả' : '',  # final fatḥaŧ
    'ỉ' : '',  # final ḍammaŧ
    'ủ' : '',  # final kasraŧ 
    }

translitArabic = {
# Alphabet letters
    'ā' : ' ا ',  # alif
    'b' : ' ب ',  # bāʾ
    't' : ' ت ',  # tāʾ
    'ṯ' : ' ث ', # thāʾ
    'ǧ' : ' ج ',  # jīm
    'č' : ' چ ', # chīm / Persian
    'ḥ' : ' ح ',  # ḥāʾ
    'ḫ' : ' خ ', # khāʾ
    'd' : ' د ',  # dāl
    'ḏ' : ' ذ ', # dhāl
    'r' : ' ر ',  # rāʾ
    'z' : ' ز ',  # zayn
    's' : ' س ',  # sīn
    'š' : ' ش ', # shīn
    'ṣ' : ' ص ',  # ṣād
    'ḍ' : ' ض ',  # ḍād
    'ṭ' : ' ط ',  # ṭāʾ
    'ẓ' : ' ظ ',  # ẓāʾ
    'ʿ' : ' ع ',  # ʿayn
    'ġ' : ' غ ', # ghayn
    'f' : ' ف ',  # fā’
    'ḳ' : ' ق ',  # qāf
    'k' : ' ك ',  # kāf
    'g' : ' گ ',  # gāf / Persian
    'l' : ' ل ',  # lām
    'm' : ' م ',  # mīm
    'n' : ' ن ',  # nūn
    'h' : ' ه ',  # hāʾ
    'w' : ' و ',  # wāw
    'ū' : ' و ',  # wāw
    'y' : ' ي ',  # yāʾ
    'ī' : ' ي ',  # yāʾ
# Non-alphabetic letters
    'ʾ' : ' ء ',  # hamza
    'á' : ' ٰى ',  # alif maqṣūraŧ
    'ŧ' : ' ة ',  # tāʾ marbūṭaŧ
# Vowels
    'ã'  : ' ٰ ',  # dagger alif
    'a'  : ' َ ',  # fatḥaŧ
    'u'  : ' ُ ',  # ḍammaŧ
    'i'  : ' ِ ',  # kasraŧ
    'aȵ' : ' ً ',  # tanwīn fatḥ
    'uȵ' : ' ٌ ',  # tanwīn ḍamm
    'iȵ' : ' ٍ ',  # tanwīn kasr
    'ů' : ' و ',  # silent w, like in `Amru.n.w
    'å' : ' ا ',  # silent alif, like in fa`al_u.a
    'ả' : ' َ ',  # final fatḥaŧ
    'ỉ' : ' ِ ',  # final ḍammaŧ
    'ủ' : ' ُ ',  # final kasraŧ 
    }

arabicBetaCode = {
# Alphabet letters
    " ا " :  "_a",   # alif
    " أ " :  "'a",   # alif
    " إ " :  "'i",   # alif
    " آ " :  "'_a",  # alif
    " ب " :  "b",   # bāʾ
    " ت " :  "t",   # tāʾ
    " ث " :  "_t",  # thāʾ
    " ج " :  "^g",  # jīm
    " ح " :  "*h",  # ḥāʾ
    " خ " :  "_h",  # khāʾ
    " د " :  "d",   # dāl
    " ذ " :  "_d",  # dhāl
    " ر " :  "r",   # rāʾ
    " ز " :  "z",   # zayn
    " س " :  "s",   # sīn
    " ش " :  "^s",  # shīn
    " ص " :  "*s",  # ṣād
    " ض " :  "*d",  # ḍād
    " ط " :  "*t",  # ṭāʾ
    " ظ " :  "*z",  # ẓāʾ
    " ع " :  "`",   # ʿayn
    " غ " :  "*g",  # ghayn
    " ف " :  "f",   # fā’
    " ق " :  "q",   # qāf
    " ك " :  "k",   # kāf
    " ل " :  "l",   # lām
    " م " :  "m",   # mīm
    " ن " :  "n",   # nūn
    " ه " :  "h",   # hāʾ
    " و " :  "w",   # wāw
    " ي " :  "y",   # yāʾ
# Non-alphabetic letters
    " ء " :  "'",   # hamza
    " ئ " :  "'i",   # hamza
    " ؤ " :  "'u",  # hamza
    " ى " :  "/a",  # alif maqṣūraŧ
    " ة " :  "=t",  # tāʾ marbūṭaŧ
    " ـ " :  "",    # kashīdaŧ
# Vowels
    " ٰ " :  "~a",  # dagger alif
    " َ " :  "a",   # fatḥaŧ
    " ُ " :  "u",   # ḍammaŧ
    " ِ " :  "i",   # kasraŧ
    " ً " :  "a*n", # tanwīn fatḥ
    " ٌ " :  "u*n", # tanwīn ḍamm
    " ٍ " :  "i*n", # tanwīn kasr
    }
