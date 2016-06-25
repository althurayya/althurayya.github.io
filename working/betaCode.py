import re

# import conversion tables
import betaCodeTables

# conversionFlow: betaCode > translit > Arabic
# conversionFlow: Arabic > betaCode :: fixing Arabic via betaCode > cleaned Arabic

# Needed:
#   - table of conversion (betacode > translit; translit > Arabic)
#   - tagging Arabic words
#   - tagging Arabic text

def deNoise(text):
    noise = re.compile(""" ّ    | # Tashdid
                             َ    | # Fatha
                             ً    | # Tanwin Fath
                             ُ    | # Damma
                             ٌ    | # Tanwin Damm
                             ِ    | # Kasra
                             ٍ    | # Tanwin Kasr
                             ْ    | # Sukun
                             ٰ    | # Dagger Alif
                             ـ     # Tatwil/Kashida
                         """, re.VERBOSE)
    text = re.sub(noise, '', text)
    return(text)

# define replacement with dictionaries
def dictReplace(text, dic):
    for k, v in dic.items():
        k = k.strip()
        v = v.strip()
        text = text.replace(k, v)
        if len(v) > 1:
            vUpper = v[0].upper()+v[1:]
        else:
            vUpper = v.upper()
        text = text.replace(k.upper(), vUpper)
    return(text)

# conversion functions
def betacodeToTranslit(text):
    #print("betacodeToTranslit()")
    text = dictReplace(text, betaCodeTables.betacodeTranslit)
    text = re.sub("\+|_", "", text)
    
    return(text)

def betacodeToSearch(text):
    #print("betacodeToSearch()")
    text = dictReplace(text, betaCodeTables.betacodeTranslit)
    # fixing tāʾ marbūṭaŧs
    text = re.sub(r"ŧ\+", r"t", text)
    text = re.sub(r"ŧ", r"", text)
    text = dictReplace(text, betaCodeTables.translitSearch)
    text = re.sub("\w_", "", text)
    return(text)

def betacodeToLOC(text):
    #print("betacodeToLOC()")
    text = dictReplace(text, betaCodeTables.betacodeTranslit)
    # fixing tāʾ marbūṭaŧs
    text = re.sub(r"ŧ\+", r"t", text)
    text = re.sub(r"ŧ", r"", text)
    text = dictReplace(text, betaCodeTables.translitLOC)
    text = re.sub(r"\w_", r"", text)
    return(text)

def arabicToBetaCode(text):
    #print("arabicToBetaCode()")

    # convert optative phrases    
    text = re.sub(r"صلى الله عليه وسلم", r".sl`m", text)
    text = re.sub(r"radiyallahuanhu", r"r.dh", text)

    text = dictReplace(text, betaCodeTables.arabicBetaCode)
    
    # converting tashdids and removing Arabic residue
    text = re.sub(r"(\w)%s" % " ّ ".strip(), r"\1\1", text)
    text = re.sub(" ْ ".strip(), r"", text)
    text = re.sub(r"،", r",", text)

    # fixing artifacts
    text = re.sub(r"\b_a", r"a", text)
    text = re.sub(r"aa", r"a", text)
    text = re.sub(r"ii", r"i", text)
    text = re.sub(r"uu", r"u", text)
    text = re.sub(r"a_a", r"_a", text)
    text = re.sub(r"a/a", r"/a", text)
    text = re.sub(r"iy", r"_i", text)
    text = re.sub(r"uw", r"_u", text)
    text = re.sub(r"lll", r"ll", text)
    
    return(text)


def betacodeToArabic(text):
    cnsnnts = "btṯǧčḥḥḫdḏrzsšṣḍṭẓʿġfḳkglmnhwy"
    cnsnnts = "%s%s" % (cnsnnts, cnsnnts.upper())

    #print("betacodeToArabic()")
    text = dictReplace(text, betaCodeTables.betacodeTranslit)
    text = re.sub('\+' , '', text)

    # fix irrelevant variables for Arabic script
    text = text.lower()
    text = re.sub("ủ", "u", text)
    text = re.sub("ỉ", "i", text)
    text = re.sub("ả", "a", text)
    
    # complex combinations
    sun = "tṯdḏrzsšṣḍṭẓln"
    text = re.sub(r"\b[aA]l-([%s])" % sun, r"ﭐل-\1\1", text) # converts articles w/ sun letters
    text = re.sub(r"\b[aA]l-", r"ﭐلْ-", text) # converts articles
    text = re.sub(r"\bwa-a?l-", "وَﭐل-", text) # converts articles
    #text   = re.sub(r"n-", "", text) # converts articles

    text = re.sub("allãh", " ﭐلـلّٰـه ".strip(), text) # Convert God's Name
    # need to add "bi-Ll~ah?i"
    text = re.sub(r"li-llãhi", " لِـلّٰـهِ ".strip(), text) # Convert God's Name
    text = re.sub(r"\bb\.", "بن", text) # Convert b. into ar bn

    text  = re.sub(",", "،", text) # Convert commas

    # initial HAMZAs
    text = re.sub("\\bʾ?a", "أَ", text)
    text = re.sub("\\bʾ?i", "إِ", text)
    text = re.sub("\\bʾ?u", "أُ", text)
    text = re.sub("\\bʾ?ā", "آ", text)
    text = re.sub("\\bʾ?ī", "إِي", text)
    text = re.sub("\\bʾ?ū", "أُو", text)

    text = re.sub("-|_", "", text)    

    # final HAMZAs
    text = re.sub(r'yʾaȵ', r"يْئًا", text)
    
    text = re.sub(r'([%s])ʾuȵ' % cnsnnts, r"\1%s" % "ْءٌ", text)
    text = re.sub(r'([%s])ʾiȵ' % cnsnnts, r"\1%s" % "ْءٍ", text)
    text = re.sub(r'([%s])ʾaȵ' % cnsnnts, r"\1%s" % "ْءًا", text)

    # short, hamza, tanwin
    text = re.sub(r'uʾuȵ', r"ُؤٌ", text)
    text = re.sub(r'uʾiȵ', r"ُؤٍ", text)
    text = re.sub(r'uʾaȵ', r"ُؤًا", text)

    text = re.sub(r'iʾuȵ', r"ِئٌ", text)
    text = re.sub(r'iʾiȵ', r"ِئٍ", text)
    text = re.sub(r'iʾaȵ', r"ِئًا", text)

    text = re.sub(r'aʾuȵ', r"َأٌ", text)
    text = re.sub(r'aʾiȵ', r"َأٍ", text)
    text = re.sub(r'aʾaȵ', r"َأً", text)

    # long, hamza, tanwin
    text = re.sub(r'ūʾuȵ', r"وءٌ", text)
    text = re.sub(r'ūʾiȵ', r"وءٍ", text)
    text = re.sub(r'ūʾaȵ', r"وءً", text)

    text = re.sub(r'īʾuȵ', r"يءٌ", text)
    text = re.sub(r'īʾiȵ', r"يءٍ", text)
    text = re.sub(r'īʾaȵ', r"يءً", text)

    text = re.sub(r'āʾuȵ', r"اءٌ", text)
    text = re.sub(r'āʾiȵ', r"اءٍ", text)
    text = re.sub(r'āʾaȵ', r"اءً", text)

    # long, hamza, diptote
    text = re.sub(r'āʾu\b', r"اءُ", text)
    text = re.sub(r'āʾi\b', r"اءِ", text)
    text = re.sub(r'āʾa\b', r"اءَ", text)
    
    # medial HAMZAs
    text = re.sub(r"aʾū", r"َؤُو", text)
    text = re.sub(r"uʾa", r"ُؤَ", text)
    text = re.sub(r"uʾi", r"ُئِ", text)

    text = re.sub(r"ūʾu", r"ُوؤُ", text)
    text = re.sub(r"ūʾi", r"ُوئِ", text)
    text = re.sub(r"awʾa", r"َوْءَ", text)
    text = re.sub(r"awʾu", r"َوْءُ", text)
    
    text = re.sub(r"āʾi", r"ائِ", text)
    text = re.sub(r"aʾī", r"َئِي", text)
    text = re.sub(r"āʾī", r"ائِي", text)
    text = re.sub(r"āʾu", r"اؤُ", text)
    text = re.sub(r"uʾā", r"ُؤَا", text)

    text = re.sub(r"aʾa", r"َأَ", text)
    text = re.sub(r"aʾi", r"َئِ", text)
    text = re.sub(r"aʾu", r"َؤُ", text)

    text = re.sub(r"iʾu", r"ِئُ", text)
    text = re.sub(r"iʾi", r"ِئِ", text)
    text = re.sub(r"iʾa", r"ِئَ", text)
    text = re.sub(r"īʾa", r"ِيئَ", text)
    text = re.sub(r"īʾu", r"ِيؤُ", text)
    text = re.sub(r"iʾā", r"ِئَا", text)

    text = re.sub(r"([%s])ʾa" % cnsnnts, r"\1%s" % "ْأَ", text)
    text = re.sub(r"([%s])ʾu" % cnsnnts, r"\1%s" % "ْؤُ", text)
    text = re.sub(r"([%s])ʾū" % cnsnnts, r"\1%s" % "ْؤُو", text)
    text = re.sub(r"([%s])ʾi" % cnsnnts, r"\1%s" % "ْئِ", text)

    text = re.sub(r"uʾu", r"ُؤُ", text)
    text = re.sub(r"uʾū", r"ُؤُو", text)

    text = re.sub(r"aʾʾā", r"َأَّا", text) # geminnated hamza # dagger alif "َأّٰ", ordinary alif ""
    text = re.sub(r"aʾī", r"َئِي", text)
    text = re.sub(r"āʾī", r"ائِي", text)
    text = re.sub(r"uʾā", r"ُؤَا", text)

    text = re.sub(r"uʾ([%s])" % cnsnnts, r"%s\1" % "ُؤْ", text)
    text = re.sub(r"iʾ([%s])" % cnsnnts, r"%s\1" % "ِئْ", text)
    text = re.sub(r"aʾ([%s])" % cnsnnts, r"%s\1" % "َأْ", text)

    text = re.sub(r"aʾā", r"َآ", text) # madda: hamza, long a
    text = re.sub(r"([%s])ʾā" % cnsnnts, r"\1%s" % "ْآ", text) # madda: sukun, hamza, long a

    # pronominal suffixes
    #text = re.sub(r"-(h[ui]|hā|k[ai]|h[ui]mā?|kumā|h[ui]nna|)\b", r"\1", text)

    # consonant combinations
    text = re.sub(r"([%s])\1" % cnsnnts, r"\1" + " ّ ".strip(), text)
    # two consonants into C-sukun-C
    text = re.sub(r"([%s])([%s])" % (cnsnnts,cnsnnts), r"\1%s\2" % " ْ ".strip(), text)
    text = re.sub(r"([%s])([%s])" % (cnsnnts,cnsnnts), r"\1%s\2" % " ْ ".strip(), text)
    # final consonant into C-sukun
    text = re.sub(r"([%s])(\s|$)" % (cnsnnts), r"\1%s\2" % " ْ ".strip(), text)
    # consonant + long vowel into C-shortV-longV
    text = re.sub(r"([%s])(ā)" % (cnsnnts), r"\1%s\2" % " َ ".strip(), text)
    text = re.sub(r"([%s])(ī)" % (cnsnnts), r"\1%s\2" % " ِ ".strip(), text)
    text = re.sub(r"([%s])(ū)" % (cnsnnts), r"\1%s\2" % " ُ ".strip(), text)

    # tanwins
    text = re.sub(r'([%s])aȵ' % "btṯǧḥḥḫdḏrzsšṣḍṭẓʿġfḳklmnhwy", r"\1%s" % 'اً', text)
    text = re.sub('aȵ' , ' ً '.strip(), text)
    text = re.sub('uȵ' , ' ٌ '.strip(), text)
    text = re.sub('iȵ' , ' ٍ '.strip(), text)

    # silent letters
    text = re.sub('ů' , "و", text)
    text = re.sub('å' , "ا", text)


    text = dictReplace(text, betaCodeTables.translitArabic)
    text = re.sub("-|_", "", text)
    #text = re.sub("-", "ـ ـ", text)
    return(text)

def betaCodeToArSimple(text):
    text = betacodeToArabic(text)
    text = deNoise(text)
    return(text)
    

###########################################################
# BELOW : TESTING ZONE ####################################
###########################################################
##
##testString = """
##.kul huwa all~ahu_ a.hadu.n all~ahu_ al-.samadu_ lam yalid wa-lam y_ulad wa-lam yakun lahu kufu'a.n a.hadu.n
##
##wa-.k_amat `_amma:t+u_ Ba.gd_ada_ li-yusallima al-_hal_ifa:ta_ al-Man.s_ura_ `al/a ruj_u`i-hi min al-K_ufa:ti_
##
##al-.hamdu li-Ll~ahi rabbi al-`_alam_ina_
##"""
##
##
####print("betacode")
####print(testString)
##print(betacodeToTranslit(testString))
##print(betacodeToSearch(testString))
##print(betacodeToLOC(testString))
##print(betacodeToArabic(testString))
##
##testBetaCode = """
##'amru.n 'unsu.n 'insu.n '_im_anu.n
##'_aya:tu.n '_amana mas'ala:tu.n sa'ala ra'su.n qur'_anu.n ta'_amara
##_di'bu.n as'ila:tu.n q_ari'i-hi su'lu.n mas'_ulu.n
##tak_afu'u-hu su'ila q_ari'i-hi _di'_abu.n ra'_isu.n
##bu'isa ru'_ufu.n ra'_ufu.n su'_alu.n mu'arri_hu.n
##abn_a'a-hu abn_a'u-hu abn_a'i-hi ^say'a.n _ha.t_i'a:tu.n
##.daw'u-hu .d_u'u-hu .daw'a-hu .daw'i-hi mur_u'a:tu.n
##'abn_a'i-hi bar_i'u-hu s_u'ila f_ilu.n f_annu.n f_unnu.n
##s_a'ala fu'_adu.n ^surak_a'u-hu ri'_asa:tu.n tahni'a:tu.n
##daf_a'a:tu.n .taff_a'a:tu.n ta'r_i_hu.n fa'ru.n
##^say'u.n ^say'i.n ^say'a.n  
##.daw'u.n .daw'i.n .daw'a.n
##juz'u.n  juz'i.n  juz'a.n
##mabda'u.n mabda'i.n mabda'a.n
##naba'a q_ari'u.n tak_afu'u.n tak_afu'i.n tak_afu'a.n
##abn_a'u abn_a'i abn_a'a jar_i'u.n maqr_u'u.n .daw'u.n ^say'u.n juz'u.n
##`ulam_a'u al-`ulam_a'i al-`ulam_a'a
##`Amru.n.w wa-fa`al_u.a
##"""
##
###print(arabicToBetaCode(testStringArabic))
##print(betacodeToArabic(testBetaCode))
##print(betacodeToTranslit(testBetaCode))
